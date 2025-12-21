import { prisma } from '@/lib/prisma'
import { WorkoutInput } from '@/lib/validations'

export class WorkoutService {
  /**
   * Creates a new workout with nested exercises and sets, ensuring all side-effects
   * (UserStats updates, Gamification) happen atomically.
   */
  static async create(userId: string, data: WorkoutInput) {
    const { exercises, ...workoutDetails } = data

    // Use interactive transaction to ensure atomicity
    return await prisma.$transaction(async (tx) => {
      // 1. Create the Workout with nested Exercises and Sets
      const workout = await tx.workout.create({
        data: {
          userId,
          name: workoutDetails.name,
          date: new Date(workoutDetails.date),
          notes: workoutDetails.notes,
          templateId: workoutDetails.templateId || null,
          status: 'planned', // Default to planned as per original implementation
          exercises: exercises ? {
            create: exercises.map((ex) => ({
              exerciseId: ex.exerciseId,
              order: ex.order,
              notes: ex.notes,
              sets: ex.sets ? {
                create: ex.sets.map((set) => ({
                  setNumber: set.setNumber,
                  setType: set.setType,
                  targetReps: set.targetReps,
                  actualReps: set.actualReps,
                  weight: set.weight,
                  restTime: set.restTime,
                  duration: set.duration,
                  rpe: set.rpe,
                  notes: set.notes
                }))
              } : undefined
            }))
          } : undefined
        },
        include: {
          exercises: {
            include: {
              exercise: true,
              sets: {
                orderBy: { setNumber: 'asc' }
              }
            },
            orderBy: { order: 'asc' }
          }
        }
      })

      // 2. Update User Stats (Side Effect)
      // We assume that creating a workout contributes to stats. 
      // Note: In a real scenario, we might only want to count 'completed' workouts.
      // Since the status is 'planned', this might be pre-mature, but we follow the 
      // requirement to "Update UserStats" on creation as a transactional side-effect.
      
      let setParamCount = 0
      let repParamCount = 0
      let volumeParamCount = 0
      
      if (exercises) {
        exercises.forEach(ex => {
          if (ex.sets) {
            setParamCount += ex.sets.length
            ex.sets.forEach(set => {
                const reps = set.actualReps || set.targetReps || 0
                const weight = set.weight || 0
                
                repParamCount += reps
                volumeParamCount += (weight * reps)
            })
          }
        })
      }

      await tx.userStats.upsert({
        where: { userId },
        create: {
          userId,
          totalWorkouts: 1,
          totalSets: setParamCount,
          totalReps: repParamCount,
          totalWeight: volumeParamCount,
          // Initialize other fields with defaults
          totalExercises: exercises ? exercises.length : 0
        },
        update: {
          totalWorkouts: { increment: 1 },
          totalSets: { increment: setParamCount },
          totalReps: { increment: repParamCount },
          totalWeight: { increment: volumeParamCount },
          totalExercises: { increment: exercises ? exercises.length : 0 }
        }
      })

      // 3. (Placeholder) Check for immediate Achievements
      // await checkAchievements(userId, workout, tx)

      return workout
    })
  }
}
