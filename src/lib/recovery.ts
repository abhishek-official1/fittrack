import prisma from '@/lib/prisma'

// Muscle groups and their typical recovery times (hours)
const MUSCLE_RECOVERY_TIMES: Record<string, number> = {
  chest: 48,
  back: 72,
  shoulders: 48,
  biceps: 48,
  triceps: 48,
  legs: 72,
  core: 24,
  cardio: 24,
  full_body: 48
}

// Recovery time adjustments based on volume
function getRecoveryHours(muscleGroup: string, totalSets: number): number {
  const baseRecovery = MUSCLE_RECOVERY_TIMES[muscleGroup] || 48
  
  // High volume = longer recovery
  if (totalSets >= 20) return baseRecovery + 24
  if (totalSets >= 15) return baseRecovery + 12
  if (totalSets >= 10) return baseRecovery
  return baseRecovery - 12 // Light session = faster recovery
}

export interface MuscleStatus {
  muscleGroup: string
  lastTrained: Date | null
  totalSets: number
  totalVolume: number
  recoveryHours: number
  hoursRemaining: number
  recoveryPercent: number
  status: 'recovered' | 'recovering' | 'fatigued'
  readyToTrain: boolean
}

export async function getMuscleRecoveryStatus(userId: string): Promise<MuscleStatus[]> {
  const recoveryRecords = await prisma.muscleRecovery.findMany({
    where: { userId }
  })

  const now = new Date()
  const allMuscles = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'core']
  
  return allMuscles.map(muscleGroup => {
    const record = recoveryRecords.find(r => r.muscleGroup === muscleGroup)
    
    if (!record) {
      // Never trained this muscle
      return {
        muscleGroup,
        lastTrained: null,
        totalSets: 0,
        totalVolume: 0,
        recoveryHours: 0,
        hoursRemaining: 0,
        recoveryPercent: 100,
        status: 'recovered' as const,
        readyToTrain: true
      }
    }

    const hoursSinceTraining = (now.getTime() - new Date(record.lastTrained).getTime()) / (1000 * 60 * 60)
    const hoursRemaining = Math.max(0, record.recoveryHours - hoursSinceTraining)
    const recoveryPercent = Math.min(100, (hoursSinceTraining / record.recoveryHours) * 100)
    
    let status: 'recovered' | 'recovering' | 'fatigued'
    if (recoveryPercent >= 100) {
      status = 'recovered'
    } else if (recoveryPercent >= 50) {
      status = 'recovering'
    } else {
      status = 'fatigued'
    }

    return {
      muscleGroup,
      lastTrained: record.lastTrained,
      totalSets: record.totalSets,
      totalVolume: record.totalVolume,
      recoveryHours: record.recoveryHours,
      hoursRemaining: Math.round(hoursRemaining),
      recoveryPercent: Math.round(recoveryPercent),
      status,
      readyToTrain: recoveryPercent >= 80
    }
  })
}

export async function updateMuscleRecovery(
  userId: string, 
  workoutId: string
): Promise<void> {
  // Get the workout with exercises and sets
  const workout = await prisma.workout.findUnique({
    where: { id: workoutId },
    include: {
      exercises: {
        include: {
          exercise: true,
          sets: true
        }
      }
    }
  })

  if (!workout || workout.status !== 'completed') return

  // Group exercises by muscle group
  const muscleData: Record<string, { sets: number; volume: number }> = {}

  for (const we of workout.exercises) {
    const muscleGroup = we.exercise.muscleGroup
    
    if (!muscleData[muscleGroup]) {
      muscleData[muscleGroup] = { sets: 0, volume: 0 }
    }

    for (const set of we.sets) {
      if (set.isCompleted) {
        muscleData[muscleGroup].sets += 1
        muscleData[muscleGroup].volume += (set.weight || 0) * (set.actualReps || 0)
      }
    }
  }

  // Update or create muscle recovery records
  const now = new Date()
  
  for (const [muscleGroup, data] of Object.entries(muscleData)) {
    const recoveryHours = getRecoveryHours(muscleGroup, data.sets)

    await prisma.muscleRecovery.upsert({
      where: {
        userId_muscleGroup: { userId, muscleGroup }
      },
      create: {
        userId,
        muscleGroup,
        lastTrained: now,
        totalSets: data.sets,
        totalVolume: data.volume,
        recoveryHours
      },
      update: {
        lastTrained: now,
        totalSets: data.sets,
        totalVolume: data.volume,
        recoveryHours
      }
    })
  }
}

export function getSuggestedMuscles(statuses: MuscleStatus[]): string[] {
  return statuses
    .filter(s => s.readyToTrain)
    .sort((a, b) => {
      // Prioritize fully recovered, then by hours since training
      if (a.recoveryPercent === 100 && b.recoveryPercent < 100) return -1
      if (b.recoveryPercent === 100 && a.recoveryPercent < 100) return 1
      return b.recoveryPercent - a.recoveryPercent
    })
    .map(s => s.muscleGroup)
}

export const MUSCLE_COLORS = {
  recovered: 'text-green-500 bg-green-500',
  recovering: 'text-yellow-500 bg-yellow-500',
  fatigued: 'text-red-500 bg-red-500'
}
