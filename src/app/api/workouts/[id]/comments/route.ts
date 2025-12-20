import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: workoutId } = params

    const comments = await prisma.workoutComment.findMany({
      where: { workoutId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: comments
    })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get comments' },
      { status: 500 }
    )
  }
}

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

    const { content } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Comment cannot be empty' },
        { status: 400 }
      )
    }

    if (content.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Comment too long (max 500 characters)' },
        { status: 400 }
      )
    }

    const comment = await prisma.workoutComment.create({
      data: {
        userId: session.userId,
        workoutId,
        content: content.trim()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: comment
    })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
