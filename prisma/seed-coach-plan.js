const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Coach Plan data following the 6-day PPL split
const coachPlanDays = [
  {
    dayNumber: 1,
    dayName: 'Push A',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    estimatedDuration: 90,
    warmup: {
      cardio: '5 min brisk walk or cycling',
      dynamic: ['Arm circles 2x15 each direction', 'Band pull-aparts 2x20 or cable external rotations 2x15'],
      rampSets: 'Main lift: 2-3 warm-up sets (empty bar → 50% → 75% working weight)'
    },
    exercises: [
      {
        name: 'Barbell Bench Press',
        exerciseId: null, // Will be filled from database
        sets: 4,
        repsRange: '5-8',
        rest: '2-3 min',
        targetRPE: '7-8',
        notes: 'Primary strength movement. Focus on progressive overload.',
        substitutions: ['Dumbbell Bench Press', 'Machine Press']
      },
      {
        name: 'Incline Dumbbell Press',
        exerciseId: null,
        sets: 3,
        repsRange: '8-12',
        rest: '90-120s',
        targetRPE: '7-8',
        notes: 'Upper chest emphasis. Control the eccentric.',
        substitutions: ['Incline Machine Press', 'Incline Barbell Press']
      },
      {
        name: 'Seated Dumbbell Shoulder Press',
        exerciseId: null,
        sets: 3,
        repsRange: '6-10',
        rest: '2 min',
        targetRPE: '7-8',
        notes: 'Maintain neutral spine. Don\'t arch excessively.',
        substitutions: ['Machine Shoulder Press', 'Barbell Overhead Press']
      },
      {
        name: 'Lateral Raise',
        exerciseId: null,
        sets: 3,
        repsRange: '12-15',
        rest: '60-90s',
        targetRPE: '7-8',
        notes: 'Lateral delts. Control tempo, avoid swinging.',
        substitutions: ['Cable Lateral Raise', 'Machine Lateral Raise']
      },
      {
        name: 'Cable Triceps Pushdown',
        exerciseId: null,
        sets: 3,
        repsRange: '10-15',
        rest: '60-90s',
        targetRPE: '6-8',
        notes: 'Keep elbows tucked. Full extension.',
        substitutions: ['Overhead Triceps Extension', 'Close-Grip Bench']
      }
    ]
  },
  {
    dayNumber: 2,
    dayName: 'Pull A',
    muscleGroups: ['back', 'biceps'],
    estimatedDuration: 90,
    warmup: {
      cardio: '5 min brisk walk or rowing',
      dynamic: ['Cat-cow stretches 2x10', 'Band pull-aparts 2x20', 'Arm circles 2x15'],
      rampSets: 'Deadlift: 3 warm-up sets (bar only → 40% → 60% → 80% working weight)'
    },
    exercises: [
      {
        name: 'Deadlift',
        exerciseId: null,
        sets: 3,
        repsRange: '3-5',
        rest: '3 min',
        targetRPE: '7-8',
        notes: 'Technique priority. Brace core, neutral spine.',
        substitutions: ['Trap Bar Deadlift', 'Rack Pull']
      },
      {
        name: 'Lat Pulldown',
        exerciseId: null,
        sets: 3,
        repsRange: '8-12',
        rest: '90-120s',
        targetRPE: '7-8',
        notes: 'Pull to upper chest. Full stretch at top.',
        substitutions: ['Pull-ups', 'Assisted Pull-ups']
      },
      {
        name: 'Chest Supported Row',
        exerciseId: null,
        sets: 3,
        repsRange: '8-12',
        rest: '90-120s',
        targetRPE: '7-8',
        notes: 'Minimize momentum. Squeeze scapulae.',
        substitutions: ['Cable Row', 'Machine Row', 'Barbell Bent Over Row']
      },
      {
        name: 'Face Pulls',
        exerciseId: null,
        sets: 3,
        repsRange: '12-15',
        rest: '60-90s',
        targetRPE: '6-7',
        notes: 'Rear delts and upper back. External rotation.',
        substitutions: ['Rear Delt Fly', 'Band Pull-Aparts']
      },
      {
        name: 'EZ Bar Curl',
        exerciseId: null,
        sets: 3,
        repsRange: '10-12',
        rest: '60-90s',
        targetRPE: '7-8',
        notes: 'Controlled tempo. No swinging.',
        substitutions: ['Barbell Curl', 'Dumbbell Curl']
      }
    ]
  },
  {
    dayNumber: 3,
    dayName: 'Legs A',
    muscleGroups: ['legs', 'core'],
    estimatedDuration: 90,
    warmup: {
      cardio: '5 min brisk walk or cycling',
      dynamic: ['Hip circles 2x10 each direction', 'Bodyweight squats 2x15', 'Walking lunges 2x10 each leg'],
      rampSets: 'Squat: 3-4 warm-up sets (bar only → 40% → 60% → 80% working weight)'
    },
    exercises: [
      {
        name: 'Back Squat',
        exerciseId: null,
        sets: 4,
        repsRange: '5-8',
        rest: '2-3 min',
        targetRPE: '7-8',
        notes: 'Primary leg strength. Full depth, knees tracking toes.',
        substitutions: ['Front Squat', 'Leg Press']
      },
      {
        name: 'Leg Press',
        exerciseId: null,
        sets: 3,
        repsRange: '10-15',
        rest: '90-120s',
        targetRPE: '7-8',
        notes: 'Full range of motion. Don\'t round lower back.',
        substitutions: ['Hack Squat', 'Bulgarian Split Squat']
      },
      {
        name: 'Romanian Deadlift',
        exerciseId: null,
        sets: 3,
        repsRange: '8-12',
        rest: '90-120s',
        targetRPE: '7-8',
        notes: 'Hamstring focus. Feel the stretch.',
        substitutions: ['Dumbbell RDL', 'Good Mornings']
      },
      {
        name: 'Leg Curl',
        exerciseId: null,
        sets: 3,
        repsRange: '10-15',
        rest: '60-90s',
        targetRPE: '7-8',
        notes: 'Hamstring isolation. Control the eccentric.',
        substitutions: ['Lying Leg Curl', 'Seated Leg Curl']
      },
      {
        name: 'Standing Calf Raise',
        exerciseId: null,
        sets: 3,
        repsRange: '12-20',
        rest: '60s',
        targetRPE: '7-8',
        notes: 'Full range. Pause at top.',
        substitutions: ['Seated Calf Raise', 'Leg Press Calf Raise']
      },
      {
        name: 'Plank',
        exerciseId: null,
        sets: 3,
        repsRange: '30-60s hold',
        rest: '60s',
        targetRPE: '6-7',
        notes: 'Core stability. Neutral spine.',
        substitutions: ['Cable Crunch', 'Ab Wheel']
      }
    ]
  },
  {
    dayNumber: 4,
    dayName: 'Push B',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    estimatedDuration: 90,
    warmup: {
      cardio: '5 min brisk walk or cycling',
      dynamic: ['Arm circles 2x15 each direction', 'Band pull-aparts 2x20'],
      rampSets: 'Incline press: 2-3 warm-up sets'
    },
    exercises: [
      {
        name: 'Incline Barbell Bench Press',
        exerciseId: null,
        sets: 4,
        repsRange: '6-10',
        rest: '2-3 min',
        targetRPE: '7-8',
        notes: 'Upper chest emphasis as primary movement.',
        substitutions: ['Incline Machine Press', 'Incline Dumbbell Press']
      },
      {
        name: 'Dumbbell Bench Press',
        exerciseId: null,
        sets: 3,
        repsRange: '8-12',
        rest: '90-120s',
        targetRPE: '7-8',
        notes: 'Greater range of motion than barbell.',
        substitutions: ['Machine Press', 'Barbell Bench']
      },
      {
        name: 'Cable Fly',
        exerciseId: null,
        sets: 2,
        repsRange: '12-15',
        rest: '60-90s',
        targetRPE: '6-7',
        notes: 'Chest isolation. Constant tension.',
        substitutions: ['Pec Deck', 'Dumbbell Fly']
      },
      {
        name: 'Lateral Raise',
        exerciseId: null,
        sets: 3,
        repsRange: '12-15',
        rest: '60-90s',
        targetRPE: '7-8',
        notes: 'Lateral delt volume. Controlled reps.',
        substitutions: ['Cable Lateral Raise', 'Machine Lateral Raise']
      },
      {
        name: 'Overhead Cable Triceps Extension',
        exerciseId: null,
        sets: 3,
        repsRange: '10-15',
        rest: '60-90s',
        targetRPE: '6-8',
        notes: 'Long head triceps emphasis.',
        substitutions: ['Skull Crusher', 'Triceps Pushdown']
      }
    ]
  },
  {
    dayNumber: 5,
    dayName: 'Pull B',
    muscleGroups: ['back', 'biceps'],
    estimatedDuration: 90,
    warmup: {
      cardio: '5 min brisk walk or rowing',
      dynamic: ['Cat-cow stretches 2x10', 'Band pull-aparts 2x20', 'Arm circles 2x15'],
      rampSets: 'RDL: 2-3 warm-up sets'
    },
    exercises: [
      {
        name: 'Romanian Deadlift',
        exerciseId: null,
        sets: 3,
        repsRange: '6-10',
        rest: '2-3 min',
        targetRPE: '7-8',
        notes: 'Hamstring and posterior chain emphasis.',
        substitutions: ['Conventional Deadlift', 'Trap Bar Deadlift']
      },
      {
        name: 'Lat Pulldown',
        exerciseId: null,
        sets: 3,
        repsRange: '8-12',
        rest: '90-120s',
        targetRPE: '7-8',
        notes: 'Alt grip variation (underhand or neutral).',
        substitutions: ['Pull-ups', 'Assisted Pull-ups']
      },
      {
        name: 'One-Arm Dumbbell Row',
        exerciseId: null,
        sets: 3,
        repsRange: '8-12 each',
        rest: '90-120s',
        targetRPE: '7-8',
        notes: 'Unilateral back work. Full stretch and contraction.',
        substitutions: ['Cable Row', 'T-Bar Row']
      },
      {
        name: 'Rear Delt Fly',
        exerciseId: null,
        sets: 2,
        repsRange: '12-15',
        rest: '60-90s',
        targetRPE: '6-7',
        notes: 'Rear delt isolation. Light weight, control.',
        substitutions: ['Face Pulls', 'Reverse Pec Deck']
      },
      {
        name: 'Hammer Curl',
        exerciseId: null,
        sets: 3,
        repsRange: '10-12',
        rest: '60-90s',
        targetRPE: '7-8',
        notes: 'Brachialis and forearm emphasis.',
        substitutions: ['Dumbbell Curl', 'Cable Curl']
      }
    ]
  },
  {
    dayNumber: 6,
    dayName: 'Legs B + Zone 2',
    muscleGroups: ['legs', 'cardio'],
    estimatedDuration: 90,
    warmup: {
      cardio: '5 min brisk walk',
      dynamic: ['Hip circles 2x10 each direction', 'Bodyweight squats 2x15', 'Walking lunges 2x10 each leg'],
      rampSets: 'Front squat/hack squat: 2-3 warm-up sets'
    },
    exercises: [
      {
        name: 'Front Squat',
        exerciseId: null,
        sets: 4,
        repsRange: '6-10',
        rest: '2-3 min',
        targetRPE: '7-8',
        notes: 'Quad emphasis, upright torso.',
        substitutions: ['Hack Squat', 'Leg Press']
      },
      {
        name: 'Bulgarian Split Squat',
        exerciseId: null,
        sets: 3,
        repsRange: '8-12 each leg',
        rest: '90-120s',
        targetRPE: '7-8',
        notes: 'Unilateral leg work. Balance and stability.',
        substitutions: ['Walking Lunges', 'Step-Ups']
      },
      {
        name: 'Leg Curl',
        exerciseId: null,
        sets: 3,
        repsRange: '10-15',
        rest: '60-90s',
        targetRPE: '7-8',
        notes: 'Hamstring volume. Controlled tempo.',
        substitutions: ['Lying Leg Curl', 'Seated Leg Curl']
      },
      {
        name: 'Standing Calf Raise',
        exerciseId: null,
        sets: 3,
        repsRange: '12-20',
        rest: '60s',
        targetRPE: '7-8',
        notes: 'Calf volume. Full stretch and contraction.',
        substitutions: ['Seated Calf Raise']
      },
      {
        name: 'Running',
        exerciseId: null,
        sets: 1,
        repsRange: '12-20 min',
        rest: 'N/A',
        targetRPE: '4-5',
        notes: 'Zone 2 cardio. Conversational pace, incline walk on treadmill preferred. Can substitute with cycling or rowing.',
        substitutions: ['Cycling', 'Rowing Machine', 'Jump Rope']
      }
    ]
  }
]

async function seedCoachPlan() {
  console.log('🌱 Seeding Coach Plan data...')

  try {
    // Get all exercises for mapping
    const exercises = await prisma.exercise.findMany()
    
    // Create exercise name mapping (case-insensitive)
    const exerciseMap = new Map()
    exercises.forEach(ex => {
      exerciseMap.set(ex.name.toLowerCase(), ex.id)
    })

    // Helper function to find exercise ID by name (with fuzzy matching)
    function findExerciseId(name) {
      const normalizedName = name.toLowerCase()
      
      // Direct match
      if (exerciseMap.has(normalizedName)) {
        return exerciseMap.get(normalizedName)
      }
      
      // Try to find partial match
      for (const [exName, exId] of exerciseMap.entries()) {
        if (exName.includes(normalizedName) || normalizedName.includes(exName)) {
          return exId
        }
      }
      
      console.warn(`⚠️  Could not find exercise: ${name}`)
      return null
    }

    // Update exercises with exercise IDs
    coachPlanDays.forEach(day => {
      day.exercises.forEach(ex => {
        ex.exerciseId = findExerciseId(ex.name)
      })
    })

    console.log('✅ Coach Plan seed data prepared')
    console.log(`   ${coachPlanDays.length} days configured`)
    console.log(`   ${coachPlanDays.reduce((sum, d) => sum + d.exercises.length, 0)} total exercises`)

    // Note: Coach Plan will be created when user enables it via API
    // This seed script just prepares the data structure
    
    return coachPlanDays
  } catch (error) {
    console.error('❌ Error seeding Coach Plan:', error)
    throw error
  }
}

// Export for use in main seed script
module.exports = { seedCoachPlan, coachPlanDays }

// Allow running standalone
if (require.main === module) {
  seedCoachPlan()
    .then(() => {
      console.log('✅ Coach Plan seed completed')
      prisma.$disconnect()
    })
    .catch((error) => {
      console.error(error)
      prisma.$disconnect()
      process.exit(1)
    })
}
