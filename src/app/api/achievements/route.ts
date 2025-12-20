import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()

    // Get all achievements
    const achievements = await prisma.achievement.findMany({
      orderBy: [
        { category: 'asc' },
        { xpReward: 'asc' }
      ]
    })

    // If user is logged in, get their unlocked achievements
    let userAchievements: { achievementId: string; unlockedAt: Date }[] = []
    if (session) {
      userAchievements = await prisma.userAchievement.findMany({
        where: { userId: session.userId },
        select: { achievementId: true, unlockedAt: true }
      })
    }

    const unlockedMap = new Map(
      userAchievements.map(ua => [ua.achievementId, ua.unlockedAt])
    )

    // Combine achievements with unlock status
    const achievementsWithStatus = achievements.map(achievement => ({
      ...achievement,
      isUnlocked: unlockedMap.has(achievement.id),
      unlockedAt: unlockedMap.get(achievement.id) || null
    }))

    // Filter out secret achievements that aren't unlocked
    const visibleAchievements = achievementsWithStatus.filter(
      a => !a.isSecret || a.isUnlocked
    )

    return NextResponse.json({
      success: true,
      data: visibleAchievements
    })
  } catch (error) {
    console.error('Get achievements error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get achievements' },
      { status: 500 }
    )
  }
}
