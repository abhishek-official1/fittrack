import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  fitnessGoal: z.enum(['strength', 'hypertrophy', 'endurance', 'fat_loss', 'general']),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  weight: z.number().positive().optional().nullable(),
  height: z.number().positive().optional().nullable(),
  birthDate: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  preferredUnits: z.enum(['metric', 'imperial']),
  weeklyGoal: z.number().int().min(1).max(7),
})

export const exerciseSchema = z.object({
  name: z.string().min(2, 'Exercise name must be at least 2 characters'),
  description: z.string().optional(),
  muscleGroup: z.string().min(1, 'Muscle group is required'),
  category: z.string().min(1, 'Category is required'),
  equipment: z.string().optional(),
  instructions: z.string().optional(),
})

export const exerciseSetSchema = z.object({
  setNumber: z.number().int().positive(),
  setType: z.enum(['warmup', 'working', 'dropset', 'failure', 'rest_pause']),
  targetReps: z.number().int().positive().optional(),
  actualReps: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  duration: z.number().int().min(0).optional(),
  restTime: z.number().int().min(0).optional(),
  rpe: z.number().int().min(1).max(10).optional(),
  notes: z.string().optional(),
})

export const workoutExerciseSchema = z.object({
  exerciseId: z.string().uuid(),
  order: z.number().int().min(0),
  notes: z.string().optional(),
  sets: z.array(exerciseSetSchema),
})

export const workoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  date: z.string(),
  notes: z.string().optional(),
  templateId: z.string().optional(),
  exercises: z.array(workoutExerciseSchema).optional(),
})

export const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  category: z.enum(['push_pull_legs', 'upper_lower', 'full_body', 'bro_split', 'custom']),
  targetMuscles: z.string().optional(),
  estimatedDuration: z.number().int().positive().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type ExerciseInput = z.infer<typeof exerciseSchema>
export type WorkoutInput = z.infer<typeof workoutSchema>
export type ExerciseSetInput = z.infer<typeof exerciseSetSchema>
export type WorkoutExerciseInput = z.infer<typeof workoutExerciseSchema>
export type TemplateInput = z.infer<typeof templateSchema>
