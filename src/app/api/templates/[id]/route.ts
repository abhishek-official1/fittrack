import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const session = await getSession()

    const template = await prisma.workoutTemplate.findUnique({
      where: { id },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      )
    }

    if (!template.isPublic && template.userId !== session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized' },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: true, data: template })
  } catch (error) {
    console.error('Get template error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get template' },
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

    const template = await prisma.workoutTemplate.findUnique({ where: { id } })

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      )
    }

    if (template.userId !== session.userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { exercises, ...templateData } = body

    // Delete existing exercises and recreate
    if (exercises) {
      await prisma.templateExercise.deleteMany({
        where: { templateId: id }
      })
    }

    const updated = await prisma.workoutTemplate.update({
      where: { id },
      data: {
        ...templateData,
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

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Update template error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update template' },
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

    const template = await prisma.workoutTemplate.findUnique({ where: { id } })

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      )
    }

    if (template.userId !== session.userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized' },
        { status: 403 }
      )
    }

    await prisma.workoutTemplate.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Template deleted' })
  } catch (error) {
    console.error('Delete template error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
