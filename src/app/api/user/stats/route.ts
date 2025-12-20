import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { calculateLevel, getLevelTitle, getXPProgress } from '@/lib/achievements'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get or create user stats
    let stats = await prisma.userStats.findUnique({
      where: { userId: session.userId }
    })

    if (!stats) {
      stats = await prisma.userStats.create({
        data: { userId: session.userId }
      })
    }

    // Get achievement counts
    const totalAchievements = await prisma.achievement.count()
    const unlockedAchievements = await prisma.userAchievement.count({
      where: { userId: session.userId }
    })

    // Get recent achievements
    const recentAchievements = await prisma.userAchievement.findMany({
      where: { userId: session.userId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
      take: 5
    })

    const level = calculateLevel(stats.totalXP)
    const levelTitle = getLevelTitle(level)
    const xpProgress = getXPProgress(stats.totalXP, level)

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        level,
        levelTitle,
        xpProgress,
        achievementStats: {
          total: totalAchievements,
          unlocked: unlockedAchievements,
          percentage: Math.round((unlockedAchievements / totalAchievements) * 100)
        },
        recentAchievements: recentAchievements.map(ra => ({
          ...ra.achievement,
          unlockedAt: ra.unlockedAt
        }))
      }
    })
  } catch (error) {
    console.error('Get user stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get user stats' },
      { status: 500 }
    )
  }
}
