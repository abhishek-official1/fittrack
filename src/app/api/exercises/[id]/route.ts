import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { exerciseSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const session = await getSession()

    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: {
        personalRecords: session ? {
          where: { userId: session.userId },
          orderBy: { date: 'desc' },
          take: 5
        } : false
      }
    })

    if (!exercise) {
      return NextResponse.json(
        { success: false, error: 'Exercise not found' },
        { status: 404 }
      )
    }

    if (!exercise.isPublic && exercise.userId !== session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized' },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: true, data: exercise })
  } catch (error) {
    console.error('Get exercise error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get exercise' },
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

    const exercise = await prisma.exercise.findUnique({ where: { id } })

    if (!exercise) {
      return NextResponse.json(
        { success: false, error: 'Exercise not found' },
        { status: 404 }
      )
    }

    if (exercise.userId !== session.userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to edit this exercise' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validation = exerciseSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const updated = await prisma.exercise.update({
      where: { id },
      data: validation.data
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Update exercise error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update exercise' },
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

    const exercise = await prisma.exercise.findUnique({ where: { id } })

    if (!exercise) {
      return NextResponse.json(
        { success: false, error: 'Exercise not found' },
        { status: 404 }
      )
    }

    if (exercise.userId !== session.userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this exercise' },
        { status: 403 }
      )
    }

    await prisma.exercise.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Exercise deleted' })
  } catch (error) {
    console.error('Delete exercise error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete exercise' },
      { status: 500 }
    )
  }
}
