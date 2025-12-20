import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/exercise-leaderboards/top-exercises - Get top exercises with most competition
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const session = await getSession()

    // Get exercises with most leaderboard entries
    const topExercises = await prisma.exercise.findMany({
      where: {
        isCustom: false,
        leaderboardEntries: { some: {} }
      },
      select: {
        id: true,
        name: true,
        muscleGroup: true,
        _count: { select: { leaderboardEntries: true } },
        leaderboardEntries: {
          orderBy: { estimated1RM: 'desc' },
          take: 1,
          select: {
            estimated1RM: true,
            user: { select: { name: true, avatarUrl: true } }
          }
        }
      },
      orderBy: {
        leaderboardEntries: { _count: 'desc' }
      },
      take: limit
    })

    // If user is logged in, get their ranks
    let userRanks: Record<string, number> = {}
    if (session) {
      const userEntries = await prisma.exerciseLeaderboard.findMany({
        where: { userId: session.userId },
        select: { exerciseId: true, estimated1RM: true }
      })

      for (const entry of userEntries) {
        const betterCount = await prisma.exerciseLeaderboard.count({
          where: { exerciseId: entry.exerciseId, estimated1RM: { gt: entry.estimated1RM } }
        })
        userRanks[entry.exerciseId] = betterCount + 1
      }
    }

    const formatted = topExercises.map(ex => ({
      id: ex.id,
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      participantCount: ex._count.leaderboardEntries,
      topLifter: ex.leaderboardEntries[0] ? {
        name: ex.leaderboardEntries[0].user.name,
        avatarUrl: ex.leaderboardEntries[0].user.avatarUrl,
        estimated1RM: ex.leaderboardEntries[0].estimated1RM
      } : null,
      userRank: userRanks[ex.id] || null
    }))

    return NextResponse.json({ exercises: formatted })
  } catch (error) {
    console.error('Error fetching top exercises:', error)
    return NextResponse.json({ error: 'Failed to fetch top exercises' }, { status: 500 })
  }
}
