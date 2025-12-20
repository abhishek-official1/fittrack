import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: followingId } = params
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (session.userId === followingId) {
      return NextResponse.json(
        { success: false, error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    // Check if user exists
    const userToFollow = await prisma.user.findUnique({
      where: { id: followingId }
    })

    if (!userToFollow) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.userId,
          followingId
        }
      }
    })

    if (existingFollow) {
      return NextResponse.json(
        { success: false, error: 'Already following this user' },
        { status: 400 }
      )
    }

    // Create follow
    await prisma.follow.create({
      data: {
        followerId: session.userId,
        followingId
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully followed user'
    })
  } catch (error) {
    console.error('Follow user error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to follow user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: followingId } = params
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: session.userId,
          followingId
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully unfollowed user'
    })
  } catch (error) {
    console.error('Unfollow user error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to unfollow user' },
      { status: 500 }
    )
  }
}
