import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { checkAndUnlockAchievements } from '@/lib/achievements'

export async function POST() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const unlockedAchievements = await checkAndUnlockAchievements(session.userId)

    return NextResponse.json({
      success: true,
      data: {
        newlyUnlocked: unlockedAchievements,
        count: unlockedAchievements.length
      }
    })
  } catch (error) {
    console.error('Check achievements error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check achievements' },
      { status: 500 }
    )
  }
}
