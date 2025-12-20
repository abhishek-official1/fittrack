import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/pr-predictions - Get PR predictions for current user
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get fresh predictions
    const predictions = await generatePredictions(session.userId)

    return NextResponse.json({ predictions })
  } catch (error) {
    console.error('Error fetching predictions:', error)
    return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 })
  }
}

async function generatePredictions(userId: string) {
  // Get user's exercise history for compound lifts
  const recentSets = await prisma.$queryRaw<Array<{
    exerciseId: string
    exerciseName: string
    muscleGroup: string
    workoutDate: Date
    weight: number
    reps: number
  }>>`
    SELECT 
      e.id as "exerciseId",
      e.name as "exerciseName",
      e."muscleGroup",
      w.date as "workoutDate",
      es.weight,
      es."actualReps" as reps
    FROM exercises e
    JOIN workout_exercises we ON we."exerciseId" = e.id
    JOIN workouts w ON w.id = we."workoutId"
    JOIN exercise_sets es ON es."workoutExerciseId" = we.id
    WHERE w."userId" = ${userId}
      AND w.status = 'completed'
      AND es."isCompleted" = true
      AND es.weight IS NOT NULL
      AND es."actualReps" IS NOT NULL
      AND es.weight > 0
      AND w.date > NOW() - INTERVAL '60 days'
    ORDER BY e.id, w.date DESC
  `

  // Group by exercise
  const exerciseData: Record<string, typeof recentSets> = {}
  for (const set of recentSets) {
    if (!exerciseData[set.exerciseId]) {
      exerciseData[set.exerciseId] = []
    }
    exerciseData[set.exerciseId].push(set)
  }

  const predictions = []

  for (const [exerciseId, sets] of Object.entries(exerciseData)) {
    if (sets.length < 4) continue // Need at least 4 data points

    // Calculate estimated 1RMs for each session
    const sessionMaxes: { date: Date; e1rm: number }[] = []
    const sessionMap: Record<string, { date: Date; maxE1rm: number }> = {}

    for (const set of sets) {
      const e1rm = set.weight * (36 / (37 - Math.min(set.reps, 36)))
      const dateKey = set.workoutDate.toISOString().split('T')[0]
      
      if (!sessionMap[dateKey] || e1rm > sessionMap[dateKey].maxE1rm) {
        sessionMap[dateKey] = { date: set.workoutDate, maxE1rm: e1rm }
      }
    }

    for (const session of Object.values(sessionMap)) {
      sessionMaxes.push({ date: session.date, e1rm: session.maxE1rm })
    }

    if (sessionMaxes.length < 3) continue

    // Sort by date (oldest first)
    sessionMaxes.sort((a, b) => a.date.getTime() - b.date.getTime())

    // Analyze trend using linear regression
    const n = sessionMaxes.length
    const xValues = sessionMaxes.map((_, i) => i)
    const yValues = sessionMaxes.map(s => s.e1rm)

    const sumX = xValues.reduce((a, b) => a + b, 0)
    const sumY = yValues.reduce((a, b) => a + b, 0)
    const sumXY = xValues.reduce((total, x, i) => total + x * yValues[i], 0)
    const sumX2 = xValues.reduce((total, x) => total + x * x, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    // Calculate R-squared for confidence
    const yMean = sumY / n
    const ssTotal = yValues.reduce((total, y) => total + (y - yMean) ** 2, 0)
    const ssResidual = yValues.reduce((total, y, i) => {
      const predicted = slope * i + intercept
      return total + (y - predicted) ** 2
    }, 0)
    const rSquared = ssTotal > 0 ? 1 - ssResidual / ssTotal : 0

    const currentMax = sessionMaxes[sessionMaxes.length - 1].e1rm
    const predictedMax = slope * (n + 1) + intercept

    // Determine trend
    let trend = 'plateau'
    if (slope > 0.5) trend = 'improving'
    else if (slope < -0.5) trend = 'declining'

    // Only include if improving or plateau with high confidence
    const readyForPR = trend === 'improving' && rSquared > 0.5 && predictedMax > currentMax * 1.01

    // Calculate suggested weight (round to nearest 2.5)
    const suggestedWeight = Math.round((currentMax * 1.025) / 2.5) * 2.5

    // Get current PR
    const currentPR = await prisma.personalRecord.findFirst({
      where: { userId, exerciseId, recordType: 'max_weight' },
      orderBy: { value: 'desc' }
    })

    predictions.push({
      exerciseId,
      exerciseName: sets[0].exerciseName,
      muscleGroup: sets[0].muscleGroup,
      currentMax: Math.round(currentMax * 10) / 10,
      predictedMax: Math.round(predictedMax * 10) / 10,
      suggestedWeight,
      confidence: Math.round(Math.max(0, Math.min(1, rSquared)) * 100) / 100,
      trend,
      readyForPR,
      currentPR: currentPR?.value || null,
      dataPoints: n
    })
  }

  // Sort by readyForPR (true first), then by confidence
  predictions.sort((a, b) => {
    if (a.readyForPR !== b.readyForPR) return a.readyForPR ? -1 : 1
    return b.confidence - a.confidence
  })

  // Upsert predictions to database
  for (const pred of predictions) {
    await prisma.pRPrediction.upsert({
      where: { userId_exerciseId: { userId, exerciseId: pred.exerciseId } },
      update: {
        currentMax: pred.currentMax,
        predictedMax: pred.predictedMax,
        suggestedWeight: pred.suggestedWeight,
        confidence: pred.confidence,
        trend: pred.trend,
        readyForPR: pred.readyForPR,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      create: {
        userId,
        exerciseId: pred.exerciseId,
        currentMax: pred.currentMax,
        predictedMax: pred.predictedMax,
        suggestedWeight: pred.suggestedWeight,
        confidence: pred.confidence,
        trend: pred.trend,
        readyForPR: pred.readyForPR,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    })
  }

  return predictions
}
