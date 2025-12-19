export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
  createdAt: Date
  updatedAt: Date
  profile?: UserProfile | null
}

export interface UserProfile {
  id: string
  userId: string
  fitnessGoal: string
  experienceLevel: string
  weight?: number | null
  height?: number | null
  birthDate?: Date | null
  gender?: string | null
  preferredUnits: string
  weeklyGoal: number
  restDayReminder: boolean
  workoutReminder: boolean
  reminderTime?: string | null
  timezone: string
}

export interface Exercise {
  id: string
  name: string
  description?: string | null
  muscleGroup: string
  category: string
  equipment?: string | null
  instructions?: string | null
  isCustom: boolean
  isPublic: boolean
  userId?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Workout {
  id: string
  userId: string
  name: string
  date: Date
  startTime?: Date | null
  endTime?: Date | null
  duration?: number | null
  notes?: string | null
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  rating?: number | null
  perceivedEffort?: number | null
  templateId?: string | null
  exercises: WorkoutExercise[]
  createdAt: Date
  updatedAt: Date
}

export interface WorkoutExercise {
  id: string
  workoutId: string
  exerciseId: string
  exercise: Exercise
  order: number
  notes?: string | null
  sets: ExerciseSet[]
}

export interface ExerciseSet {
  id: string
  workoutExerciseId: string
  setNumber: number
  setType: 'warmup' | 'working' | 'dropset' | 'failure' | 'rest_pause'
  targetReps?: number | null
  actualReps?: number | null
  weight?: number | null
  duration?: number | null
  distance?: number | null
  restTime?: number | null
  rpe?: number | null
  isCompleted: boolean
  isPR: boolean
  notes?: string | null
}

export interface WorkoutTemplate {
  id: string
  userId?: string | null
  name: string
  description?: string | null
  category: string
  targetMuscles?: string | null
  estimatedDuration?: number | null
  difficulty: string
  isPublic: boolean
  exercises: TemplateExercise[]
}

export interface TemplateExercise {
  id: string
  templateId: string
  exerciseId: string
  exercise: Exercise
  order: number
  sets: number
  targetReps?: string | null
  targetWeight?: number | null
  restTime?: number | null
  notes?: string | null
}

export interface PersonalRecord {
  id: string
  userId: string
  exerciseId: string
  exercise: Exercise
  recordType: 'max_weight' | 'max_reps' | 'max_volume' | 'best_time'
  value: number
  reps?: number | null
  weight?: number | null
  date: Date
  notes?: string | null
}

export interface NutritionLog {
  id: string
  userId: string
  date: Date
  mealType?: string | null
  calories?: number | null
  protein?: number | null
  carbs?: number | null
  fat?: number | null
  fiber?: number | null
  notes?: string | null
}

export interface WorkoutStats {
  totalWorkouts: number
  totalVolume: number
  totalDuration: number
  currentStreak: number
  longestStreak: number
  averageWorkoutsPerWeek: number
  favoriteExercise?: string
  mostTrainedMuscle?: string
}

export interface WeeklyStats {
  week: string
  workouts: number
  volume: number
  duration: number
}

export interface ExerciseProgress {
  date: string
  weight: number
  reps: number
  volume: number
  estimated1RM: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
