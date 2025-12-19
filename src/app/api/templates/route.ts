import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { templateSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where: Record<string, unknown> = {
      OR: [
        { isPublic: true, userId: null },
        ...(session ? [{ userId: session.userId }] : [])
      ]
    }

    if (category) {
      where.category = category
    }

    const templates = await prisma.workoutTemplate.findMany({
      where,
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ success: true, data: templates })
  } catch (error) {
    console.error('Get templates error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get templates' },
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
    const validation = templateSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { exercises, ...templateData } = body

    const template = await prisma.workoutTemplate.create({
      data: {
        userId: session.userId,
        ...templateData,
        isPublic: false,
        exercises: exercises ? {
          create: exercises.map((ex: { exerciseId: string; order: number; sets: number; targetReps?: string; targetWeight?: number; restTime?: number; notes?: string }) => ({
            exerciseId: ex.exerciseId,
            order: ex.order,
            sets: ex.sets || 3,
            targetReps: ex.targetReps,
            targetWeight: ex.targetWeight,
            restTime: ex.restTime,
            notes: ex.notes,
          }))
        } : undefined
      },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json({ success: true, data: template }, { status: 201 })
  } catch (error) {
    console.error('Create template error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create template' },
      { status: 500 }
    )
  }
}
