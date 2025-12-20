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

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
        profile: {
          select: {
            fitnessGoal: true,
            experienceLevel: true
          }
        },
        stats: {
          select: {
            totalXP: true,
            currentLevel: true,
            totalWorkouts: true,
            totalPRs: true,
            currentStreak: true,
            longestStreak: true
          }
        },
        _count: {
          select: {
            followers: true,
            following: true,
            workouts: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if current user follows this user
    let isFollowing = false
    if (session && session.userId !== id) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: session.userId,
            followingId: id
          }
        }
      })
      isFollowing = !!follow
    }

    // Get recent public workouts
    const recentWorkouts = await prisma.workout.findMany({
      where: {
        userId: id,
        status: 'completed',
        visibility: 'public'
      },
      select: {
        id: true,
        name: true,
        date: true,
        duration: true,
        _count: {
          select: {
            exercises: true,
            likes: true,
            comments: true
          }
        }
      },
      orderBy: { date: 'desc' },
      take: 5
    })

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        isFollowing,
        isOwnProfile: session?.userId === id,
        recentWorkouts
      }
    })
  } catch (error) {
    console.error('Get user profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get user profile' },
      { status: 500 }
    )
  }
}
