import prisma from '@/lib/prisma'

interface ExerciseHistory {
  date: Date
  sets: Array<{
    weight: number
    reps: number
    isCompleted: boolean
  }>
}

interface ProgressionSuggestion {
  exerciseId: string
  exerciseName: string
  currentWeight: number
  suggestedWeight: number
  reason: string
  confidence: 'high' | 'medium' | 'low'
  lastPerformed: Date
  trend: 'improving' | 'plateau' | 'declining'
}

export async function getExerciseHistory(
  userId: string,
  exerciseId: string,
  limit: number = 5
): Promise<ExerciseHistory[]> {
  const workoutExercises = await prisma.workoutExercise.findMany({
    where: {
      workout: {
        userId,
        status: 'completed'
      },
      exerciseId
    },
    include: {
      workout: {
        select: { date: true }
      },
      sets: {
        where: { isCompleted: true },
        select: {
          weight: true,
          actualReps: true,
          isCompleted: true
        }
      }
    },
    orderBy: {
      workout: { date: 'desc' }
    },
    take: limit
  })

  return workoutExercises.map(we => ({
    date: we.workout.date,
    sets: we.sets.map(s => ({
      weight: s.weight || 0,
      reps: s.actualReps || 0,
      isCompleted: s.isCompleted
    }))
  }))
}

export async function analyzeProgression(
  userId: string,
  exerciseId: string
): Promise<ProgressionSuggestion | null> {
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId }
  })

  if (!exercise) return null

  const history = await getExerciseHistory(userId, exerciseId, 5)
  
  if (history.length < 2) return null

  // Calculate average weight and reps for each session
  const sessionStats = history.map(h => {
    const completedSets = h.sets.filter(s => s.isCompleted && s.weight > 0)
    if (completedSets.length === 0) return null
    
    const avgWeight = completedSets.reduce((acc, s) => acc + s.weight, 0) / completedSets.length
    const avgReps = completedSets.reduce((acc, s) => acc + s.reps, 0) / completedSets.length
    const maxWeight = Math.max(...completedSets.map(s => s.weight))
    
    return {
      date: h.date,
      avgWeight,
      avgReps,
      maxWeight,
      totalVolume: completedSets.reduce((acc, s) => acc + s.weight * s.reps, 0)
    }
  }).filter(Boolean) as Array<{
    date: Date
    avgWeight: number
    avgReps: number
    maxWeight: number
    totalVolume: number
  }>

  if (sessionStats.length < 2) return null

  const latest = sessionStats[0]
  const previous = sessionStats[1]

  // Determine trend
  let trend: 'improving' | 'plateau' | 'declining'
  const volumeChange = ((latest.totalVolume - previous.totalVolume) / previous.totalVolume) * 100

  if (volumeChange > 5) {
    trend = 'improving'
  } else if (volumeChange < -5) {
    trend = 'declining'
  } else {
    trend = 'plateau'
  }

  // Check if user hit all target reps consistently (ready to progress)
  const recentSessions = sessionStats.slice(0, 3)
  const avgRepsRecent = recentSessions.reduce((acc, s) => acc + s.avgReps, 0) / recentSessions.length
  
  let suggestion: ProgressionSuggestion | null = null

  // If averaging 10+ reps for last 3 sessions at same weight, suggest increase
  if (avgRepsRecent >= 10 && trend !== 'declining') {
    const weightIncrease = latest.maxWeight <= 20 ? 2.5 : latest.maxWeight <= 50 ? 5 : 5
    
    suggestion = {
      exerciseId,
      exerciseName: exercise.name,
      currentWeight: latest.maxWeight,
      suggestedWeight: latest.maxWeight + weightIncrease,
      reason: `Averaging ${Math.round(avgRepsRecent)} reps - ready to increase weight`,
      confidence: avgRepsRecent >= 12 ? 'high' : 'medium',
      lastPerformed: latest.date,
      trend
    }
  }
  // If struggling (low reps), suggest same weight or deload
  else if (avgRepsRecent < 6 && trend === 'declining') {
    const suggestedWeight = Math.max(latest.maxWeight - 5, latest.maxWeight * 0.9)
    
    suggestion = {
      exerciseId,
      exerciseName: exercise.name,
      currentWeight: latest.maxWeight,
      suggestedWeight: Math.round(suggestedWeight / 2.5) * 2.5, // Round to nearest 2.5
      reason: 'Consider a slight deload to improve form and reps',
      confidence: 'medium',
      lastPerformed: latest.date,
      trend
    }
  }
  // Plateau - suggest same weight, focus on reps
  else if (trend === 'plateau') {
    suggestion = {
      exerciseId,
      exerciseName: exercise.name,
      currentWeight: latest.maxWeight,
      suggestedWeight: latest.maxWeight,
      reason: 'Focus on adding reps before increasing weight',
      confidence: 'medium',
      lastPerformed: latest.date,
      trend
    }
  }

  return suggestion
}

export async function getAllProgressionSuggestions(
  userId: string
): Promise<ProgressionSuggestion[]> {
  // Get exercises user has done recently
  const recentExercises = await prisma.workoutExercise.findMany({
    where: {
      workout: {
        userId,
        status: 'completed',
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    },
    select: {
      exerciseId: true
    },
    distinct: ['exerciseId']
  })

  const suggestions: ProgressionSuggestion[] = []

  for (const { exerciseId } of recentExercises) {
    const suggestion = await analyzeProgression(userId, exerciseId)
    if (suggestion) {
      suggestions.push(suggestion)
    }
  }

  // Sort by confidence and readiness to progress
  return suggestions.sort((a, b) => {
    const confidenceOrder = { high: 0, medium: 1, low: 2 }
    if (a.suggestedWeight > a.currentWeight && b.suggestedWeight <= b.currentWeight) return -1
    if (b.suggestedWeight > b.currentWeight && a.suggestedWeight <= a.currentWeight) return 1
    return confidenceOrder[a.confidence] - confidenceOrder[b.confidence]
  })
}
