import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

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
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()))

    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31, 23, 59, 59)

    // Get all completed workouts for the year
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
            sets: {
              where: { isCompleted: true }
            }
          }
        }
      },
      orderBy: { date: 'asc' }
    })

    // Calculate stats
    const totalWorkouts = workouts.length
    let totalSets = 0
    let totalReps = 0
    let totalVolume = 0
    let totalDuration = 0
    const muscleGroupCounts: Record<string, number> = {}
    const exerciseCounts: Record<string, { count: number; name: string }> = {}
    const monthlyWorkouts: number[] = Array(12).fill(0)
    const weekdayCounts: number[] = Array(7).fill(0)

    for (const workout of workouts) {
      totalDuration += workout.duration || 0
      monthlyWorkouts[new Date(workout.date).getMonth()]++
      weekdayCounts[new Date(workout.date).getDay()]++

      for (const we of workout.exercises) {
        const muscleGroup = we.exercise.muscleGroup
        muscleGroupCounts[muscleGroup] = (muscleGroupCounts[muscleGroup] || 0) + 1

        exerciseCounts[we.exerciseId] = exerciseCounts[we.exerciseId] || { count: 0, name: we.exercise.name }
        exerciseCounts[we.exerciseId].count++

        for (const set of we.sets) {
          totalSets++
          totalReps += set.actualReps || 0
          totalVolume += (set.weight || 0) * (set.actualReps || 0)
        }
      }
    }

    // Find favorites
    const sortedMuscles = Object.entries(muscleGroupCounts)
      .sort(([, a], [, b]) => b - a)
    const favoriteMuscle = sortedMuscles[0]?.[0] || null
    const leastTrainedMuscle = sortedMuscles[sortedMuscles.length - 1]?.[0] || null

    const sortedExercises = Object.entries(exerciseCounts)
      .sort(([, a], [, b]) => b.count - a.count)
    const favoriteExercise = sortedExercises[0]?.[1]?.name || null

    // Calculate streaks
    let longestStreak = 0
    let currentStreak = 0
    let lastDate: Date | null = null

    for (const workout of workouts) {
      const workoutDate = new Date(workout.date)
      if (lastDate) {
        const daysDiff = Math.floor((workoutDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysDiff <= 2) { // Allow 1 rest day
          currentStreak++
        } else {
          currentStreak = 1
        }
      } else {
        currentStreak = 1
      }
      longestStreak = Math.max(longestStreak, currentStreak)
      lastDate = workoutDate
    }

    // Get PRs from this year
    const prs = await prisma.personalRecord.findMany({
      where: {
        userId: session.userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        exercise: {
          select: { name: true }
        }
      }
    })

    // Best month
    const bestMonthIndex = monthlyWorkouts.indexOf(Math.max(...monthlyWorkouts))
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December']
    const bestMonth = months[bestMonthIndex]

    // Favorite day
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const favoriteDayIndex = weekdayCounts.indexOf(Math.max(...weekdayCounts))
    const favoriteDay = days[favoriteDayIndex]

    // Calculate achievements earned this year
    const achievementsEarned = await prisma.userAchievement.count({
      where: {
        userId: session.userId,
        unlockedAt: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        year,
        summary: {
          totalWorkouts,
          totalSets,
          totalReps,
          totalVolume: Math.round(totalVolume),
          totalDuration,
          totalPRs: prs.length,
          achievementsEarned,
          longestStreak
        },
        favorites: {
          muscle: favoriteMuscle,
          exercise: favoriteExercise,
          day: favoriteDay,
          month: bestMonth
        },
        insights: {
          avgWorkoutsPerWeek: Math.round((totalWorkouts / 52) * 10) / 10,
          avgSetsPerWorkout: totalWorkouts ? Math.round(totalSets / totalWorkouts) : 0,
          avgDurationMinutes: totalWorkouts ? Math.round(totalDuration / totalWorkouts) : 0,
          volumePerWorkout: totalWorkouts ? Math.round(totalVolume / totalWorkouts) : 0
        },
        charts: {
          monthlyWorkouts,
          weekdayDistribution: weekdayCounts,
          muscleGroupBreakdown: Object.entries(muscleGroupCounts).map(([name, count]) => ({
            name,
            count,
            percentage: totalWorkouts ? Math.round((count / totalWorkouts) * 100) : 0
          }))
        },
        topPRs: prs.slice(0, 5).map(pr => ({
          exercise: pr.exercise.name,
          weight: pr.weight,
          reps: pr.reps,
          date: pr.date
        })),
        leastTrainedMuscle,
        improvementAreas: leastTrainedMuscle ? [`Consider adding more ${leastTrainedMuscle} exercises`] : []
      }
    })
  } catch (error) {
    console.error('Year review error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate year review' },
      { status: 500 }
    )
  }
}
