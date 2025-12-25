import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { exerciseId } = await params

    // Fetch exercise details
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      select: {
        id: true,
        name: true,
        muscleGroup: true,
        category: true,
        equipment: true,
      },
    })

    if (!exercise) {
      return NextResponse.json(
        { success: false, error: 'Exercise not found' },
        { status: 404 }
      )
    }

    // Fetch all workouts containing this exercise for the current user
    const workoutExercises = await prisma.workoutExercise.findMany({
      where: {
        exerciseId,
        workout: {
          userId: session.userId,
          status: 'completed',
        },
      },
      include: {
        workout: {
          select: {
            id: true,
            name: true,
            date: true,
          },
        },
        sets: {
          where: {
            isCompleted: true,
            setType: 'working', // Only count working sets for progression
          },
          orderBy: {
            setNumber: 'asc',
          },
        },
      },
      orderBy: {
        workout: {
          date: 'asc',
        },
      },
    })

    if (workoutExercises.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          exercise,
          hasData: false,
          progressionData: [],
          volumeData: [],
          recentSets: [],
          personalBests: {
            maxWeight: null,
            maxReps: null,
            maxVolume: null,
            max1RM: null,
          },
          stats: {
            totalWorkouts: 0,
            totalSets: 0,
            totalReps: 0,
            totalVolume: 0,
            averageWeight: 0,
            averageReps: 0,
            averageVolume: 0,
          },
        },
      })
    }

    // Calculate progression data for charts
    const progressionData = workoutExercises.map((we) => {
      const workingSets = we.sets.filter((s) => s.weight && s.actualReps)
      
      if (workingSets.length === 0) {
        return null
      }

      // Best set of the workout
      const bestSet = workingSets.reduce((best, current) => {
        const currentVolume = (current.weight || 0) * (current.actualReps || 0)
        const bestVolume = (best.weight || 0) * (best.actualReps || 0)
        return currentVolume > bestVolume ? current : best
      })

      // Calculate estimated 1RM using Brzycki formula
      const estimated1RM = bestSet.weight && bestSet.actualReps
        ? bestSet.actualReps === 1
          ? bestSet.weight
          : bestSet.weight * (36 / (37 - bestSet.actualReps))
        : 0

      // Total volume for the workout
      const totalVolume = workingSets.reduce(
        (sum, set) => sum + (set.weight || 0) * (set.actualReps || 0),
        0
      )

      return {
        date: we.workout.date.toISOString().split('T')[0],
        workoutId: we.workout.id,
        workoutName: we.workout.name,
        maxWeight: bestSet.weight || 0,
        maxReps: bestSet.actualReps || 0,
        totalVolume,
        estimated1RM: Math.round(estimated1RM * 10) / 10,
        sets: workingSets.length,
      }
    }).filter(Boolean)

    // Get recent sets (last 10 workouts)
    const recentSets = workoutExercises
      .slice(-10)
      .reverse()
      .map((we) => ({
        workoutId: we.workout.id,
        workoutName: we.workout.name,
        date: we.workout.date,
        sets: we.sets.map((s) => ({
          setNumber: s.setNumber,
          weight: s.weight,
          reps: s.actualReps,
          rpe: s.rpe,
          isPR: s.isPR,
        })),
      }))

    // Calculate personal bests
    const allSets = workoutExercises.flatMap((we) => we.sets)
    const maxWeight = Math.max(...allSets.map((s) => s.weight || 0))
    const maxReps = Math.max(...allSets.map((s) => s.actualReps || 0))
    const maxVolumeWorkout = progressionData.reduce((max, current) => {
      return (current?.totalVolume || 0) > (max?.totalVolume || 0) ? current : max
    }, progressionData[0])
    const max1RM = Math.max(...progressionData.map((p) => p?.estimated1RM || 0))

    // Find the dates when PRs were achieved
    const maxWeightDate = allSets.find((s) => s.weight === maxWeight)
    const maxRepsDate = allSets.find((s) => s.actualReps === maxReps)

    const personalBests = {
      maxWeight: maxWeight > 0 ? {
        value: maxWeight,
        reps: maxWeightDate?.actualReps || null,
        date: workoutExercises.find((we) => 
          we.sets.some((s) => s.id === maxWeightDate?.id)
        )?.workout.date || null,
      } : null,
      maxReps: maxReps > 0 ? {
        value: maxReps,
        weight: maxRepsDate?.weight || null,
        date: workoutExercises.find((we) => 
          we.sets.some((s) => s.id === maxRepsDate?.id)
        )?.workout.date || null,
      } : null,
      maxVolume: maxVolumeWorkout ? {
        value: maxVolumeWorkout.totalVolume,
        date: maxVolumeWorkout.date,
      } : null,
      max1RM: max1RM > 0 ? {
        value: max1RM,
        date: progressionData.find((p) => p?.estimated1RM === max1RM)?.date || null,
      } : null,
    }

    // Calculate overall stats
    const totalSets = allSets.length
    const totalReps = allSets.reduce((sum, s) => sum + (s.actualReps || 0), 0)
    const totalVolume = allSets.reduce(
      (sum, s) => sum + (s.weight || 0) * (s.actualReps || 0),
      0
    )
    const setsWithWeight = allSets.filter((s) => s.weight)
    const averageWeight = setsWithWeight.length > 0
      ? setsWithWeight.reduce((sum, s) => sum + (s.weight || 0), 0) / setsWithWeight.length
      : 0
    const setsWithReps = allSets.filter((s) => s.actualReps)
    const averageReps = setsWithReps.length > 0
      ? setsWithReps.reduce((sum, s) => sum + (s.actualReps || 0), 0) / setsWithReps.length
      : 0

    const stats = {
      totalWorkouts: workoutExercises.length,
      totalSets,
      totalReps,
      totalVolume: Math.round(totalVolume),
      averageWeight: Math.round(averageWeight * 10) / 10,
      averageReps: Math.round(averageReps * 10) / 10,
      averageVolume: workoutExercises.length > 0
        ? Math.round(totalVolume / workoutExercises.length)
        : 0,
    }

    return NextResponse.json({
      success: true,
      data: {
        exercise,
        hasData: true,
        progressionData,
        recentSets,
        personalBests,
        stats,
      },
    })
  } catch (error) {
    console.error('GET /api/progression/[exerciseId] error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch progression data',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      },
      { status: 500 }
    )
  }
}
