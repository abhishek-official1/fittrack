import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, formatStr: string = 'PPP'): string {
  return format(new Date(date), formatStr)
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toLocaleString()
}

export function formatTime(date: Date | string): string {
  return format(new Date(date), 'HH:mm')
}

export function formatWeight(weight: number, units: 'metric' | 'imperial' = 'metric'): string {
  if (units === 'imperial') {
    return `${(weight * 2.20462).toFixed(1)} lbs`
  }
  return `${weight.toFixed(1)} kg`
}

export function convertWeight(weight: number, from: 'kg' | 'lbs', to: 'kg' | 'lbs'): number {
  if (from === to) return weight
  if (from === 'kg' && to === 'lbs') return weight * 2.20462
  return weight / 2.20462
}

export function calculateVolume(sets: { reps?: number | null; weight?: number | null }[]): number {
  return sets.reduce((total, set) => {
    if (set.reps && set.weight) {
      return total + set.reps * set.weight
    }
    return total
  }, 0)
}

export function calculateOneRepMax(weight: number, reps: number): number {
  // Brzycki formula
  if (reps === 1) return weight
  return weight * (36 / (37 - reps))
}

export function getWeekDays(date: Date = new Date()): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 }) // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end })
}

export function isToday(date: Date | string): boolean {
  return isSameDay(new Date(date), new Date())
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const value = String(item[key])
    return {
      ...groups,
      [value]: [...(groups[value] || []), item],
    }
  }, {} as Record<string, T[]>)
}

export const muscleGroups = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'legs',
  'core',
  'cardio',
  'full_body',
] as const

export const exerciseCategories = [
  'compound',
  'isolation',
  'bodyweight',
  'cardio',
  'stretching',
] as const

export const equipmentTypes = [
  'barbell',
  'dumbbell',
  'cable',
  'machine',
  'bodyweight',
  'kettlebell',
  'bands',
  'other',
] as const

export const fitnessGoals = [
  { value: 'strength', label: 'Build Strength' },
  { value: 'hypertrophy', label: 'Build Muscle' },
  { value: 'endurance', label: 'Improve Endurance' },
  { value: 'fat_loss', label: 'Lose Fat' },
  { value: 'general', label: 'General Fitness' },
] as const

export const experienceLevels = [
  { value: 'beginner', label: 'Beginner (0-1 years)' },
  { value: 'intermediate', label: 'Intermediate (1-3 years)' },
  { value: 'advanced', label: 'Advanced (3+ years)' },
] as const
