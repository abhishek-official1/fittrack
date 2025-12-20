const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// ==================== ACHIEVEMENTS ====================
const defaultAchievements = [
  // Workout Milestones
  { name: 'First Blood', description: 'Complete your first workout', category: 'workout', icon: 'Dumbbell', rarity: 'common', requirement: { type: 'workout_count', value: 1 }, xpReward: 50 },
  { name: 'Getting Started', description: 'Complete 5 workouts', category: 'workout', icon: 'Flame', rarity: 'common', requirement: { type: 'workout_count', value: 5 }, xpReward: 100 },
  { name: 'Dedicated', description: 'Complete 10 workouts', category: 'workout', icon: 'Target', rarity: 'common', requirement: { type: 'workout_count', value: 10 }, xpReward: 150 },
  { name: 'Committed', description: 'Complete 25 workouts', category: 'workout', icon: 'Award', rarity: 'uncommon', requirement: { type: 'workout_count', value: 25 }, xpReward: 250 },
  { name: 'Warrior', description: 'Complete 50 workouts', category: 'workout', icon: 'Sword', rarity: 'uncommon', requirement: { type: 'workout_count', value: 50 }, xpReward: 500 },
  { name: 'Centurion', description: 'Complete 100 workouts', category: 'workout', icon: 'Shield', rarity: 'rare', requirement: { type: 'workout_count', value: 100 }, xpReward: 1000 },
  { name: 'Iron Veteran', description: 'Complete 250 workouts', category: 'workout', icon: 'Medal', rarity: 'epic', requirement: { type: 'workout_count', value: 250 }, xpReward: 2500 },
  { name: 'Legendary Lifter', description: 'Complete 500 workouts', category: 'workout', icon: 'Crown', rarity: 'legendary', requirement: { type: 'workout_count', value: 500 }, xpReward: 5000 },
  
  // Strength - Personal Records
  { name: 'PR Hunter', description: 'Set your first personal record', category: 'strength', icon: 'TrendingUp', rarity: 'common', requirement: { type: 'pr_count', value: 1 }, xpReward: 100 },
  { name: 'Record Breaker', description: 'Set 10 personal records', category: 'strength', icon: 'Zap', rarity: 'uncommon', requirement: { type: 'pr_count', value: 10 }, xpReward: 300 },
  { name: 'PR Machine', description: 'Set 25 personal records', category: 'strength', icon: 'Rocket', rarity: 'rare', requirement: { type: 'pr_count', value: 25 }, xpReward: 500 },
  { name: 'Unstoppable', description: 'Set 50 personal records', category: 'strength', icon: 'Star', rarity: 'epic', requirement: { type: 'pr_count', value: 50 }, xpReward: 1000 },
  { name: 'World Beater', description: 'Set 100 personal records', category: 'strength', icon: 'Trophy', rarity: 'legendary', requirement: { type: 'pr_count', value: 100 }, xpReward: 2000 },
  
  // Consistency - Streaks
  { name: 'Spark', description: 'Achieve a 3-day workout streak', category: 'consistency', icon: 'Flame', rarity: 'common', requirement: { type: 'streak', value: 3 }, xpReward: 75 },
  { name: 'Week Warrior', description: 'Achieve a 7-day workout streak', category: 'consistency', icon: 'Calendar', rarity: 'uncommon', requirement: { type: 'streak', value: 7 }, xpReward: 200 },
  { name: 'Two Week Terror', description: 'Achieve a 14-day workout streak', category: 'consistency', icon: 'CalendarCheck', rarity: 'rare', requirement: { type: 'streak', value: 14 }, xpReward: 400 },
  { name: 'Monthly Master', description: 'Achieve a 30-day workout streak', category: 'consistency', icon: 'CalendarDays', rarity: 'epic', requirement: { type: 'streak', value: 30 }, xpReward: 1000 },
  { name: 'Iron Will', description: 'Achieve a 100-day workout streak', category: 'consistency', icon: 'Infinity', rarity: 'legendary', requirement: { type: 'streak', value: 100 }, xpReward: 5000 },
  
  // Volume - Total Weight Lifted
  { name: 'Ton Lifter', description: 'Lift 1,000 kg total', category: 'volume', icon: 'Weight', rarity: 'common', requirement: { type: 'total_weight', value: 1000 }, xpReward: 100 },
  { name: '5 Ton Club', description: 'Lift 5,000 kg total', category: 'volume', icon: 'Dumbbell', rarity: 'uncommon', requirement: { type: 'total_weight', value: 5000 }, xpReward: 250 },
  { name: '10 Ton Club', description: 'Lift 10,000 kg total', category: 'volume', icon: 'Mountain', rarity: 'rare', requirement: { type: 'total_weight', value: 10000 }, xpReward: 500 },
  { name: '50 Ton Club', description: 'Lift 50,000 kg total', category: 'volume', icon: 'Building', rarity: 'epic', requirement: { type: 'total_weight', value: 50000 }, xpReward: 1500 },
  { name: '100 Ton Club', description: 'Lift 100,000 kg total', category: 'volume', icon: 'Castle', rarity: 'legendary', requirement: { type: 'total_weight', value: 100000 }, xpReward: 3000 },
  
  // Volume - Sets and Reps
  { name: 'Rep Counter', description: 'Complete 500 total reps', category: 'volume', icon: 'Hash', rarity: 'common', requirement: { type: 'total_reps', value: 500 }, xpReward: 75 },
  { name: 'Rep Machine', description: 'Complete 2,500 total reps', category: 'volume', icon: 'Repeat', rarity: 'uncommon', requirement: { type: 'total_reps', value: 2500 }, xpReward: 200 },
  { name: 'Rep Legend', description: 'Complete 10,000 total reps', category: 'volume', icon: 'RotateCcw', rarity: 'rare', requirement: { type: 'total_reps', value: 10000 }, xpReward: 500 },
  { name: 'Set Crusher', description: 'Complete 100 total sets', category: 'volume', icon: 'Layers', rarity: 'common', requirement: { type: 'total_sets', value: 100 }, xpReward: 75 },
  { name: 'Set Master', description: 'Complete 500 total sets', category: 'volume', icon: 'LayoutGrid', rarity: 'uncommon', requirement: { type: 'total_sets', value: 500 }, xpReward: 200 },
  { name: 'Set Legend', description: 'Complete 2,000 total sets', category: 'volume', icon: 'Grid3x3', rarity: 'rare', requirement: { type: 'total_sets', value: 2000 }, xpReward: 500 },
  
  // Special Achievements
  { name: 'Early Bird', description: 'Complete a workout before 7 AM', category: 'special', icon: 'Sunrise', rarity: 'uncommon', requirement: { type: 'early_workout', value: 1 }, xpReward: 150 },
  { name: 'Night Owl', description: 'Complete a workout after 10 PM', category: 'special', icon: 'Moon', rarity: 'uncommon', requirement: { type: 'late_workout', value: 1 }, xpReward: 150 },
  { name: 'Weekend Warrior', description: 'Complete workouts on both Saturday and Sunday', category: 'special', icon: 'CalendarRange', rarity: 'uncommon', requirement: { type: 'weekend_workouts', value: 1 }, xpReward: 200 },
  { name: 'Perfectionist', description: 'Complete all sets in a workout', category: 'special', icon: 'CheckCircle', rarity: 'common', requirement: { type: 'perfect_workout', value: 1 }, xpReward: 100 },
  { name: 'Variety Pack', description: 'Use 10 different exercises in a single week', category: 'special', icon: 'Shuffle', rarity: 'rare', requirement: { type: 'weekly_exercise_variety', value: 10 }, xpReward: 300 },
  { name: 'Full Body Master', description: 'Train all major muscle groups in one week', category: 'special', icon: 'User', rarity: 'rare', requirement: { type: 'all_muscles_week', value: 1 }, xpReward: 400 },
  { name: 'Comeback Kid', description: 'Return after a 14+ day break', category: 'special', icon: 'Undo2', rarity: 'uncommon', requirement: { type: 'comeback', value: 14 }, xpReward: 200, isSecret: true },
  { name: 'Marathon Session', description: 'Complete a workout lasting over 90 minutes', category: 'special', icon: 'Clock', rarity: 'rare', requirement: { type: 'workout_duration', value: 90 }, xpReward: 300 },
  { name: 'Speed Demon', description: 'Complete a workout in under 30 minutes', category: 'special', icon: 'Zap', rarity: 'uncommon', requirement: { type: 'workout_duration_under', value: 30 }, xpReward: 150 },
]

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

  // Create achievements
  console.log('Creating achievements...')
  for (const achievement of defaultAchievements) {
    const existing = await prisma.achievement.findUnique({
      where: { name: achievement.name }
    })
    
    if (!existing) {
      await prisma.achievement.create({
        data: achievement
      })
    }
  }
  console.log(`Created ${defaultAchievements.length} achievements`)

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
