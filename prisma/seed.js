const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const defaultExercises = [
  // Chest
  { name: 'Barbell Bench Press', muscleGroup: 'chest', category: 'compound', equipment: 'barbell', description: 'Classic chest exercise for building strength and mass' },
  { name: 'Incline Dumbbell Press', muscleGroup: 'chest', category: 'compound', equipment: 'dumbbell', description: 'Upper chest focused pressing movement' },
  { name: 'Dumbbell Flyes', muscleGroup: 'chest', category: 'isolation', equipment: 'dumbbell', description: 'Isolation movement for chest stretch and contraction' },
  { name: 'Cable Crossover', muscleGroup: 'chest', category: 'isolation', equipment: 'cable', description: 'Cable movement for chest definition' },
  { name: 'Push-ups', muscleGroup: 'chest', category: 'bodyweight', equipment: 'bodyweight', description: 'Fundamental bodyweight chest exercise' },
  { name: 'Dips', muscleGroup: 'chest', category: 'compound', equipment: 'bodyweight', description: 'Bodyweight exercise targeting chest and triceps' },

  // Back
  { name: 'Deadlift', muscleGroup: 'back', category: 'compound', equipment: 'barbell', description: 'Full body compound movement, primarily targeting back' },
  { name: 'Barbell Row', muscleGroup: 'back', category: 'compound', equipment: 'barbell', description: 'Horizontal pulling movement for back thickness' },
  { name: 'Pull-ups', muscleGroup: 'back', category: 'compound', equipment: 'bodyweight', description: 'Vertical pulling movement for back width' },
  { name: 'Lat Pulldown', muscleGroup: 'back', category: 'compound', equipment: 'cable', description: 'Machine version of pull-up for lat development' },
  { name: 'Seated Cable Row', muscleGroup: 'back', category: 'compound', equipment: 'cable', description: 'Horizontal pulling for middle back' },
  { name: 'Dumbbell Row', muscleGroup: 'back', category: 'compound', equipment: 'dumbbell', description: 'Unilateral back exercise for balanced development' },

  // Shoulders
  { name: 'Overhead Press', muscleGroup: 'shoulders', category: 'compound', equipment: 'barbell', description: 'Primary shoulder pressing movement' },
  { name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', category: 'compound', equipment: 'dumbbell', description: 'Dumbbell variation of overhead press' },
  { name: 'Lateral Raises', muscleGroup: 'shoulders', category: 'isolation', equipment: 'dumbbell', description: 'Isolation for lateral deltoid' },
  { name: 'Front Raises', muscleGroup: 'shoulders', category: 'isolation', equipment: 'dumbbell', description: 'Isolation for front deltoid' },
  { name: 'Rear Delt Flyes', muscleGroup: 'shoulders', category: 'isolation', equipment: 'dumbbell', description: 'Isolation for rear deltoid' },
  { name: 'Face Pulls', muscleGroup: 'shoulders', category: 'isolation', equipment: 'cable', description: 'Rear delt and upper back exercise' },

  // Biceps
  { name: 'Barbell Curl', muscleGroup: 'biceps', category: 'isolation', equipment: 'barbell', description: 'Classic bicep builder' },
  { name: 'Dumbbell Curl', muscleGroup: 'biceps', category: 'isolation', equipment: 'dumbbell', description: 'Dumbbell bicep curl for arm development' },
  { name: 'Hammer Curls', muscleGroup: 'biceps', category: 'isolation', equipment: 'dumbbell', description: 'Neutral grip curl for brachialis' },
  { name: 'Preacher Curl', muscleGroup: 'biceps', category: 'isolation', equipment: 'dumbbell', description: 'Isolated bicep curl with arm support' },
  { name: 'Cable Curl', muscleGroup: 'biceps', category: 'isolation', equipment: 'cable', description: 'Constant tension bicep curl' },

  // Triceps
  { name: 'Close Grip Bench Press', muscleGroup: 'triceps', category: 'compound', equipment: 'barbell', description: 'Compound tricep movement' },
  { name: 'Tricep Pushdown', muscleGroup: 'triceps', category: 'isolation', equipment: 'cable', description: 'Cable isolation for triceps' },
  { name: 'Overhead Tricep Extension', muscleGroup: 'triceps', category: 'isolation', equipment: 'dumbbell', description: 'Overhead tricep stretch and contraction' },
  { name: 'Skull Crushers', muscleGroup: 'triceps', category: 'isolation', equipment: 'barbell', description: 'Lying tricep extension' },
  { name: 'Diamond Push-ups', muscleGroup: 'triceps', category: 'bodyweight', equipment: 'bodyweight', description: 'Bodyweight tricep exercise' },

  // Legs
  { name: 'Barbell Squat', muscleGroup: 'legs', category: 'compound', equipment: 'barbell', description: 'King of leg exercises' },
  { name: 'Leg Press', muscleGroup: 'legs', category: 'compound', equipment: 'machine', description: 'Machine leg pressing movement' },
  { name: 'Romanian Deadlift', muscleGroup: 'legs', category: 'compound', equipment: 'barbell', description: 'Hamstring focused hip hinge' },
  { name: 'Leg Curl', muscleGroup: 'legs', category: 'isolation', equipment: 'machine', description: 'Isolation for hamstrings' },
  { name: 'Leg Extension', muscleGroup: 'legs', category: 'isolation', equipment: 'machine', description: 'Isolation for quadriceps' },
  { name: 'Walking Lunges', muscleGroup: 'legs', category: 'compound', equipment: 'dumbbell', description: 'Unilateral leg exercise' },
  { name: 'Calf Raises', muscleGroup: 'legs', category: 'isolation', equipment: 'machine', description: 'Isolation for calf muscles' },
  { name: 'Bulgarian Split Squat', muscleGroup: 'legs', category: 'compound', equipment: 'dumbbell', description: 'Single leg squat variation' },

  // Core
  { name: 'Plank', muscleGroup: 'core', category: 'bodyweight', equipment: 'bodyweight', description: 'Isometric core stability exercise' },
  { name: 'Crunches', muscleGroup: 'core', category: 'bodyweight', equipment: 'bodyweight', description: 'Basic abdominal exercise' },
  { name: 'Hanging Leg Raises', muscleGroup: 'core', category: 'bodyweight', equipment: 'bodyweight', description: 'Advanced lower ab exercise' },
  { name: 'Russian Twists', muscleGroup: 'core', category: 'bodyweight', equipment: 'bodyweight', description: 'Rotational core exercise' },
  { name: 'Ab Wheel Rollout', muscleGroup: 'core', category: 'bodyweight', equipment: 'other', description: 'Anti-extension core exercise' },
  { name: 'Cable Woodchop', muscleGroup: 'core', category: 'isolation', equipment: 'cable', description: 'Rotational core movement' },

  // Cardio
  { name: 'Running', muscleGroup: 'cardio', category: 'cardio', equipment: 'bodyweight', description: 'Classic cardio exercise' },
  { name: 'Cycling', muscleGroup: 'cardio', category: 'cardio', equipment: 'machine', description: 'Low impact cardio' },
  { name: 'Rowing Machine', muscleGroup: 'cardio', category: 'cardio', equipment: 'machine', description: 'Full body cardio' },
  { name: 'Jump Rope', muscleGroup: 'cardio', category: 'cardio', equipment: 'other', description: 'High intensity cardio' },
  { name: 'Burpees', muscleGroup: 'cardio', category: 'cardio', equipment: 'bodyweight', description: 'Full body conditioning exercise' },
]

const defaultTemplates = [
  {
    name: 'Push Day',
    description: 'Chest, shoulders, and triceps focused workout',
    category: 'push_pull_legs',
    targetMuscles: 'chest,shoulders,triceps',
    estimatedDuration: 60,
    difficulty: 'intermediate',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, targetReps: '8-10' },
      { name: 'Incline Dumbbell Press', sets: 3, targetReps: '10-12' },
      { name: 'Overhead Press', sets: 3, targetReps: '8-10' },
      { name: 'Lateral Raises', sets: 3, targetReps: '12-15' },
      { name: 'Tricep Pushdown', sets: 3, targetReps: '12-15' },
      { name: 'Overhead Tricep Extension', sets: 3, targetReps: '12-15' },
    ]
  },
  {
    name: 'Pull Day',
    description: 'Back and biceps focused workout',
    category: 'push_pull_legs',
    targetMuscles: 'back,biceps',
    estimatedDuration: 60,
    difficulty: 'intermediate',
    exercises: [
      { name: 'Deadlift', sets: 4, targetReps: '5-6' },
      { name: 'Pull-ups', sets: 3, targetReps: '8-12' },
      { name: 'Barbell Row', sets: 3, targetReps: '8-10' },
      { name: 'Face Pulls', sets: 3, targetReps: '15-20' },
      { name: 'Barbell Curl', sets: 3, targetReps: '10-12' },
      { name: 'Hammer Curls', sets: 3, targetReps: '12-15' },
    ]
  },
  {
    name: 'Leg Day',
    description: 'Complete lower body workout',
    category: 'push_pull_legs',
    targetMuscles: 'legs',
    estimatedDuration: 60,
    difficulty: 'intermediate',
    exercises: [
      { name: 'Barbell Squat', sets: 4, targetReps: '6-8' },
      { name: 'Romanian Deadlift', sets: 3, targetReps: '10-12' },
      { name: 'Leg Press', sets: 3, targetReps: '12-15' },
      { name: 'Walking Lunges', sets: 3, targetReps: '12 each' },
      { name: 'Leg Curl', sets: 3, targetReps: '12-15' },
      { name: 'Calf Raises', sets: 4, targetReps: '15-20' },
    ]
  },
  {
    name: 'Upper Body',
    description: 'Full upper body workout',
    category: 'upper_lower',
    targetMuscles: 'chest,back,shoulders,biceps,triceps',
    estimatedDuration: 75,
    difficulty: 'intermediate',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, targetReps: '8-10' },
      { name: 'Barbell Row', sets: 4, targetReps: '8-10' },
      { name: 'Overhead Press', sets: 3, targetReps: '8-10' },
      { name: 'Lat Pulldown', sets: 3, targetReps: '10-12' },
      { name: 'Dumbbell Curl', sets: 3, targetReps: '12-15' },
      { name: 'Tricep Pushdown', sets: 3, targetReps: '12-15' },
    ]
  },
  {
    name: 'Lower Body',
    description: 'Complete leg and glute workout',
    category: 'upper_lower',
    targetMuscles: 'legs',
    estimatedDuration: 60,
    difficulty: 'intermediate',
    exercises: [
      { name: 'Barbell Squat', sets: 4, targetReps: '6-8' },
      { name: 'Romanian Deadlift', sets: 4, targetReps: '8-10' },
      { name: 'Bulgarian Split Squat', sets: 3, targetReps: '10-12' },
      { name: 'Leg Extension', sets: 3, targetReps: '12-15' },
      { name: 'Leg Curl', sets: 3, targetReps: '12-15' },
      { name: 'Calf Raises', sets: 4, targetReps: '15-20' },
    ]
  },
  {
    name: 'Full Body Workout',
    description: 'Complete full body training session',
    category: 'full_body',
    targetMuscles: 'full_body',
    estimatedDuration: 60,
    difficulty: 'beginner',
    exercises: [
      { name: 'Barbell Squat', sets: 3, targetReps: '8-10' },
      { name: 'Barbell Bench Press', sets: 3, targetReps: '8-10' },
      { name: 'Barbell Row', sets: 3, targetReps: '8-10' },
      { name: 'Overhead Press', sets: 3, targetReps: '8-10' },
      { name: 'Romanian Deadlift', sets: 3, targetReps: '10-12' },
      { name: 'Plank', sets: 3, targetReps: '60 sec' },
    ]
  },
]

async function main() {
  console.log('Seeding database...')

  // Create exercises
  console.log('Creating exercises...')
  for (const exercise of defaultExercises) {
    const existing = await prisma.exercise.findFirst({
      where: {
        name: exercise.name,
        userId: null
      }
    })
    
    if (!existing) {
      await prisma.exercise.create({
        data: {
          ...exercise,
          isCustom: false,
          isPublic: true,
        }
      })
    }
  }
  console.log(`Created ${defaultExercises.length} exercises`)

  // Create templates
  console.log('Creating templates...')
  for (const template of defaultTemplates) {
    const { exercises: templateExercises, ...templateData } = template
    const templateId = template.name.toLowerCase().replace(/\s+/g, '-')

    const existingTemplate = await prisma.workoutTemplate.findUnique({
      where: { id: templateId }
    })

    if (!existingTemplate) {
      // Get exercise IDs
      const exerciseRecords = await Promise.all(
        templateExercises.map(async (e) => {
          const exercise = await prisma.exercise.findFirst({
            where: { name: e.name }
          })
          return { ...e, exerciseId: exercise?.id }
        })
      )

      await prisma.workoutTemplate.create({
        data: {
          id: templateId,
          ...templateData,
          isPublic: true,
          exercises: {
            create: exerciseRecords
              .filter(e => e.exerciseId)
              .map((e, index) => ({
                exerciseId: e.exerciseId,
                order: index,
                sets: e.sets,
                targetReps: e.targetReps,
                restTime: 90,
              }))
          }
        }
      })
    }
  }
  console.log(`Created ${defaultTemplates.length} templates`)

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
