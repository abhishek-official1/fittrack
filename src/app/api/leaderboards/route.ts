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
    const type = searchParams.get('type') || 'volume' // volume, streak, workouts, prs, xp
    const scope = searchParams.get('scope') || 'global' // global, following
    const period = searchParams.get('period') || 'all' // all, month, week

    let userIds: string[] | undefined

    if (scope === 'following') {
      const following = await prisma.follow.findMany({
        where: { followerId: session.userId },
        select: { followingId: true }
      })
      userIds = [...following.map(f => f.followingId), session.userId]
    }

    // Build date filter
    let dateFilter = {}
    if (period === 'week') {
      dateFilter = { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    } else if (period === 'month') {
      dateFilter = { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }

    let leaderboard: Array<{
      rank: number
      userId: string
      userName: string
      avatarUrl: string | null
      value: number
      isCurrentUser: boolean
    }> = []

    if (type === 'volume' || type === 'workouts') {
      // Aggregate from workouts
      const workouts = await prisma.workout.findMany({
        where: {
          status: 'completed',
          ...(userIds && { userId: { in: userIds } }),
          ...(period !== 'all' && { date: dateFilter })
        },
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true }
          },
          exercises: {
            include: {
              sets: {
                where: { isCompleted: true },
                select: { weight: true, actualReps: true }
              }
            }
          }
        }
      })

      // Group by user
      const userStats: Record<string, { 
        userId: string
        userName: string
        avatarUrl: string | null
        volume: number
        workoutCount: number 
      }> = {}

      for (const workout of workouts) {
        if (!userStats[workout.userId]) {
          userStats[workout.userId] = {
            userId: workout.userId,
            userName: workout.user.name,
            avatarUrl: workout.user.avatarUrl,
            volume: 0,
            workoutCount: 0
          }
        }
        
        userStats[workout.userId].workoutCount++
        
        for (const ex of workout.exercises) {
          for (const set of ex.sets) {
            userStats[workout.userId].volume += (set.weight || 0) * (set.actualReps || 0)
          }
        }
      }

      const sorted = Object.values(userStats).sort((a, b) => 
        type === 'volume' ? b.volume - a.volume : b.workoutCount - a.workoutCount
      )

      leaderboard = sorted.slice(0, 50).map((u, i) => ({
        rank: i + 1,
        userId: u.userId,
        userName: u.userName,
        avatarUrl: u.avatarUrl,
        value: type === 'volume' ? Math.round(u.volume) : u.workoutCount,
        isCurrentUser: u.userId === session.userId
      }))
    } else if (type === 'streak' || type === 'xp' || type === 'prs') {
      // Get from UserStats
      const stats = await prisma.userStats.findMany({
        where: userIds ? { userId: { in: userIds } } : {},
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true }
          }
        },
        orderBy: type === 'streak' 
          ? { currentStreak: 'desc' }
          : type === 'xp' 
            ? { totalXP: 'desc' }
            : { totalPRs: 'desc' },
        take: 50
      })

      leaderboard = stats.map((s, i) => ({
        rank: i + 1,
        userId: s.userId,
        userName: s.user.name,
        avatarUrl: s.user.avatarUrl,
        value: type === 'streak' ? s.currentStreak : type === 'xp' ? s.totalXP : s.totalPRs,
        isCurrentUser: s.userId === session.userId
      }))
    }

    // Find current user's rank if not in top 50
    const currentUserRank = leaderboard.find(l => l.isCurrentUser)

    return NextResponse.json({
      success: true,
      data: {
        type,
        scope,
        period,
        leaderboard,
        currentUserRank: currentUserRank?.rank || null
      }
    })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get leaderboard' },
      { status: 500 }
    )
  }
}
