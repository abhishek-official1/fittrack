import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { workoutSchema } from '@/lib/validations'

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
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: Record<string, unknown> = {
      userId: session.userId
    }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) (where.date as Record<string, unknown>).gte = new Date(startDate)
      if (endDate) (where.date as Record<string, unknown>).lte = new Date(endDate)
    }

    if (status) {
      where.status = status
    }

    const workouts = await prisma.workout.findMany({
      where,
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
      },
      orderBy: { date: 'desc' },
      take: limit
    })

    return NextResponse.json({ success: true, data: workouts })
  } catch (error) {
    console.error('Get workouts error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get workouts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validation = workoutSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { exercises, ...workoutData } = body

    const workout = await prisma.workout.create({
      data: {
        userId: session.userId,
        name: workoutData.name,
        date: new Date(workoutData.date),
        notes: workoutData.notes,
        templateId: workoutData.templateId || null,
        status: 'planned',
        exercises: exercises ? {
          create: exercises.map((ex: { exerciseId: string; order: number; notes?: string; sets?: Array<{ setNumber: number; setType: string; targetReps?: number; weight?: number; restTime?: number }> }) => ({
            exerciseId: ex.exerciseId,
            order: ex.order,
            notes: ex.notes,
            sets: ex.sets ? {
              create: ex.sets.map((set: { setNumber: number; setType: string; targetReps?: number; weight?: number; restTime?: number }) => ({
                setNumber: set.setNumber,
                setType: set.setType || 'working',
                targetReps: set.targetReps,
                weight: set.weight,
                restTime: set.restTime,
              }))
            } : undefined
          }))
        } : undefined
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

    return NextResponse.json({ success: true, data: workout }, { status: 201 })
  } catch (error) {
    console.error('Create workout error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create workout' },
      { status: 500 }
    )
  }
}
