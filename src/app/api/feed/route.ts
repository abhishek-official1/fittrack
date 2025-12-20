import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

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
    const type = searchParams.get('type') || 'following' // following, discover
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let userIds: string[] = []

    if (type === 'following') {
      // Get users that the current user follows
      const following = await prisma.follow.findMany({
        where: { followerId: session.userId },
        select: { followingId: true }
      })
      userIds = following.map(f => f.followingId)
      
      // Include own workouts
      userIds.push(session.userId)
    }

    // Get workouts for feed
    const whereClause = type === 'following' 
      ? { userId: { in: userIds }, status: 'completed' }
      : { status: 'completed', visibility: 'public' }

    const workouts = await prisma.workout.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        exercises: {
          include: {
            exercise: {
              select: {
                name: true,
                muscleGroup: true
              }
            }
          },
          take: 3
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset
    })

    // Check which workouts current user has liked
    const likedWorkoutIds = await prisma.workoutLike.findMany({
      where: {
        userId: session.userId,
        workoutId: { in: workouts.map(w => w.id) }
      },
      select: { workoutId: true }
    })
    const likedSet = new Set(likedWorkoutIds.map(l => l.workoutId))

    const feedItems = workouts.map(workout => ({
      ...workout,
      isLiked: likedSet.has(workout.id),
      likeCount: workout._count.likes,
      commentCount: workout._count.comments,
      muscleGroups: Array.from(new Set(workout.exercises.map(e => e.exercise.muscleGroup)))
    }))

    return NextResponse.json({
      success: true,
      data: feedItems
    })
  } catch (error) {
    console.error('Get feed error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get feed' },
      { status: 500 }
    )
  }
}
