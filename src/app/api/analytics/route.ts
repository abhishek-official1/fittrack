import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { startOfWeek, endOfWeek, subWeeks, format, eachDayOfInterval, subDays } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30'
    const days = parseInt(period)

    const startDate = subDays(new Date(), days)
    const endDate = new Date()

    // Get completed workouts in period
    const workouts = await prisma.workout.findMany({
      where: {
        userId: session.userId,
        status: 'completed',
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true
          }
        }
      },
      orderBy: { date: 'asc' }
    })

    // Calculate total stats
    const totalWorkouts = workouts.length
    let totalVolume = 0
    let totalDuration = 0
    const muscleGroupCounts: Record<string, number> = {}
    const exerciseCounts: Record<string, number> = {}

    for (const workout of workouts) {
      totalDuration += workout.duration || 0
      
      for (const we of workout.exercises) {
        const muscleGroup = we.exercise.muscleGroup
        muscleGroupCounts[muscleGroup] = (muscleGroupCounts[muscleGroup] || 0) + 1
        exerciseCounts[we.exercise.name] = (exerciseCounts[we.exercise.name] || 0) + 1

        for (const set of we.sets) {
          if (set.actualReps && set.weight) {
            totalVolume += set.actualReps * set.weight
          }
        }
      }
    }

    // Find most trained muscle and favorite exercise
    const mostTrainedMuscle = Object.entries(muscleGroupCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0]
    
    const favoriteExercise = Object.entries(exerciseCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0]

    // Calculate streak
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    
    const workoutDates = new Set(
      workouts.map(w => format(new Date(w.date), 'yyyy-MM-dd'))
    )
    
    const allDays = eachDayOfInterval({ start: startDate, end: endDate })
    
    for (let i = allDays.length - 1; i >= 0; i--) {
      const dayStr = format(allDays[i], 'yyyy-MM-dd')
      if (workoutDates.has(dayStr)) {
        tempStreak++
        if (currentStreak === 0 || currentStreak === tempStreak - 1) {
          currentStreak = tempStreak
        }
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak
        }
      } else {
        if (currentStreak > 0 && tempStreak === currentStreak) {
          // First gap after current streak - stop counting current
        }
        tempStreak = 0
      }
    }

    // Weekly stats for chart
    const weeklyStats = []
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 })
      const weekEnd = endOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 })
      
      const weekWorkouts = workouts.filter(w => {
        const date = new Date(w.date)
        return date >= weekStart && date <= weekEnd
      })

      let weekVolume = 0
      let weekDuration = 0
      
      for (const workout of weekWorkouts) {
        weekDuration += workout.duration || 0
        for (const we of workout.exercises) {
          for (const set of we.sets) {
            if (set.actualReps && set.weight) {
              weekVolume += set.actualReps * set.weight
            }
          }
        }
      }

      weeklyStats.push({
        week: format(weekStart, 'MMM d'),
        workouts: weekWorkouts.length,
        volume: Math.round(weekVolume),
        duration: weekDuration
      })
    }

    // Get recent PRs
    const recentPRs = await prisma.personalRecord.findMany({
      where: {
        userId: session.userId,
        date: {
          gte: startDate
        }
      },
      include: {
        exercise: true
      },
      orderBy: { date: 'desc' },
      take: 5
    })

    // Average workouts per week
    const weeksInPeriod = Math.ceil(days / 7)
    const averageWorkoutsPerWeek = totalWorkouts / weeksInPeriod

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalWorkouts,
          totalVolume: Math.round(totalVolume),
          totalDuration,
          currentStreak,
          longestStreak,
          averageWorkoutsPerWeek: Math.round(averageWorkoutsPerWeek * 10) / 10,
          favoriteExercise,
          mostTrainedMuscle
        },
        weeklyStats,
        recentPRs,
        muscleGroupDistribution: Object.entries(muscleGroupCounts).map(([name, count]) => ({
          name,
          count
        }))
      }
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get analytics' },
      { status: 500 }
    )
  }
}
