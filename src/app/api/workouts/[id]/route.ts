import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { calculateOneRepMax } from '@/lib/utils'
import { updateMuscleRecovery } from '@/lib/recovery'
import { updateUserStats, checkAndUnlockAchievements } from '@/lib/achievements'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const workout = await prisma.workout.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: {
              orderBy: { setNumber: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        },
        template: true
      }
    })

    if (!workout) {
      return NextResponse.json(
        { success: false, error: 'Workout not found' },
        { status: 404 }
      )
    }

    if (workout.userId !== session.userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized' },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: true, data: workout })
  } catch (error) {
    console.error('Get workout error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get workout' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const workout = await prisma.workout.findUnique({ where: { id } })

    if (!workout) {
      return NextResponse.json(
        { success: false, error: 'Workout not found' },
        { status: 404 }
      )
    }

    if (workout.userId !== session.userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { exercises, ...workoutData } = body

    // Start workout session
    if (workoutData.status === 'in_progress' && workout.status !== 'in_progress') {
      workoutData.startTime = new Date()
    }

    // Complete workout
    if (workoutData.status === 'completed' && workout.status !== 'completed') {
      workoutData.endTime = new Date()
      if (workout.startTime) {
        workoutData.duration = Math.round(
          (new Date().getTime() - new Date(workout.startTime).getTime()) / 60000
        )
      }

      // Check for PRs
      if (exercises) {
        for (const ex of exercises) {
          for (const set of ex.sets || []) {
            if (set.actualReps && set.weight && set.isCompleted) {
              const estimated1RM = calculateOneRepMax(set.weight, set.actualReps)
              
              const existingPR = await prisma.personalRecord.findFirst({
                where: {
                  userId: session.userId,
                  exerciseId: ex.exerciseId,
                  recordType: 'max_weight'
                },
                orderBy: { value: 'desc' }
              })

              if (!existingPR || estimated1RM > existingPR.value) {
                await prisma.personalRecord.create({
                  data: {
                    userId: session.userId,
                    exerciseId: ex.exerciseId,
                    recordType: 'max_weight',
                    value: estimated1RM,
                    reps: set.actualReps,
                    weight: set.weight,
                    date: new Date()
                  }
                })

                // Mark set as PR
                if (set.id) {
                  await prisma.exerciseSet.update({
                    where: { id: set.id },
                    data: { isPR: true }
                  })
                }
              }
            }
          }
        }
      }

      // Update muscle recovery after workout completion
      await updateMuscleRecovery(session.userId, id)

      // Calculate workout stats for achievements
      let totalSets = 0
      let totalReps = 0
      let totalWeight = 0
      let totalPRs = 0

      if (exercises) {
        for (const ex of exercises) {
          for (const set of ex.sets || []) {
            if (set.isCompleted) {
              totalSets++
              totalReps += set.actualReps || 0
              totalWeight += (set.weight || 0) * (set.actualReps || 0)
              if (set.isPR) totalPRs++
            }
          }
        }
      }

      // Update user stats and check for new achievements
      await updateUserStats(session.userId, {
        sets: totalSets,
        reps: totalReps,
        weight: totalWeight,
        prs: totalPRs,
        duration: workoutData.duration
      })

      await checkAndUnlockAchievements(session.userId)
    }

    // Update workout
    const updated = await prisma.workout.update({
      where: { id },
      data: {
        name: workoutData.name,
        date: workoutData.date ? new Date(workoutData.date) : undefined,
        notes: workoutData.notes,
        status: workoutData.status,
        startTime: workoutData.startTime,
        endTime: workoutData.endTime,
        duration: workoutData.duration,
        rating: workoutData.rating,
        perceivedEffort: workoutData.perceivedEffort,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: {
              orderBy: { setNumber: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    // Update exercises and sets if provided
    if (exercises) {
      for (const ex of exercises) {
        if (ex.id) {
          await prisma.workoutExercise.update({
            where: { id: ex.id },
            data: {
              order: ex.order,
              notes: ex.notes,
            }
          })

          // Update sets
          for (const set of ex.sets || []) {
            if (set.id) {
              await prisma.exerciseSet.update({
                where: { id: set.id },
                data: {
                  actualReps: set.actualReps,
                  weight: set.weight,
                  duration: set.duration,
                  rpe: set.rpe,
                  isCompleted: set.isCompleted,
                  notes: set.notes,
                }
              })
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Update workout error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update workout' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const workout = await prisma.workout.findUnique({ where: { id } })

    if (!workout) {
      return NextResponse.json(
        { success: false, error: 'Workout not found' },
        { status: 404 }
      )
    }

    if (workout.userId !== session.userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized' },
        { status: 403 }
      )
    }

    await prisma.workout.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Workout deleted' })
  } catch (error) {
    console.error('Delete workout error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete workout' },
      { status: 500 }
    )
  }
}
