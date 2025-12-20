import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: workoutId } = params
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if workout exists and is visible
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId }
    })

    if (!workout) {
      return NextResponse.json(
        { success: false, error: 'Workout not found' },
        { status: 404 }
      )
    }

    // Check if already liked
    const existingLike = await prisma.workoutLike.findUnique({
      where: {
        userId_workoutId: {
          userId: session.userId,
          workoutId
        }
      }
    })

    if (existingLike) {
      return NextResponse.json(
        { success: false, error: 'Already liked this workout' },
        { status: 400 }
      )
    }

    await prisma.workoutLike.create({
      data: {
        userId: session.userId,
        workoutId
      }
    })

    const likeCount = await prisma.workoutLike.count({
      where: { workoutId }
    })

    return NextResponse.json({
      success: true,
      data: { liked: true, likeCount }
    })
  } catch (error) {
    console.error('Like workout error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to like workout' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: workoutId } = params
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    await prisma.workoutLike.delete({
      where: {
        userId_workoutId: {
          userId: session.userId,
          workoutId
        }
      }
    })

    const likeCount = await prisma.workoutLike.count({
      where: { workoutId }
    })

    return NextResponse.json({
      success: true,
      data: { liked: false, likeCount }
    })
  } catch (error) {
    console.error('Unlike workout error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to unlike workout' },
      { status: 500 }
    )
  }
}
