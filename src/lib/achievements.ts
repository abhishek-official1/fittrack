import prisma from '@/lib/prisma'

interface AchievementRequirement {
  type: string
  value: number
}

interface UserStatsData {
  totalWorkouts: number
  totalSets: number
  totalReps: number
  totalWeight: number
  totalPRs: number
  currentStreak: number
  longestStreak: number
}

export async function checkAndUnlockAchievements(userId: string): Promise<string[]> {
  const unlockedAchievements: string[] = []

  // Get or create user stats
  let stats = await prisma.userStats.findUnique({ where: { userId } })
  
  if (!stats) {
    stats = await prisma.userStats.create({
      data: { userId }
    })
  }

  // Get all achievements user hasn't unlocked yet
  const unlockedIds = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true }
  })
  const unlockedIdSet = new Set(unlockedIds.map(a => a.achievementId))

  const allAchievements = await prisma.achievement.findMany()
  const lockedAchievements = allAchievements.filter(a => !unlockedIdSet.has(a.id))

  // Check each locked achievement
  for (const achievement of lockedAchievements) {
    const requirement = achievement.requirement as unknown as AchievementRequirement
    let isUnlocked = false

    switch (requirement.type) {
      case 'workout_count':
        isUnlocked = stats.totalWorkouts >= requirement.value
        break
      case 'pr_count':
        isUnlocked = stats.totalPRs >= requirement.value
        break
      case 'streak':
        isUnlocked = stats.currentStreak >= requirement.value || stats.longestStreak >= requirement.value
        break
      case 'total_weight':
        isUnlocked = stats.totalWeight >= requirement.value
        break
      case 'total_reps':
        isUnlocked = stats.totalReps >= requirement.value
        break
      case 'total_sets':
        isUnlocked = stats.totalSets >= requirement.value
        break
    }

    if (isUnlocked) {
      // Unlock the achievement
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
          progress: 100
        }
      })

      // Award XP
      await prisma.userStats.update({
        where: { userId },
        data: {
          totalXP: { increment: achievement.xpReward },
          currentLevel: calculateLevel(stats.totalXP + achievement.xpReward)
        }
      })

      unlockedAchievements.push(achievement.name)
    }
  }

  return unlockedAchievements
}

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export function getLevelTitle(level: number): string {
  if (level <= 10) return 'Beginner'
  if (level <= 25) return 'Intermediate'
  if (level <= 50) return 'Advanced'
  if (level <= 75) return 'Elite'
  return 'Legend'
}

export function getXPForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100
}

export function getXPProgress(totalXP: number, currentLevel: number): number {
  const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100
  const xpForNextLevel = Math.pow(currentLevel, 2) * 100
  const xpInCurrentLevel = totalXP - xpForCurrentLevel
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel
  return Math.min(100, (xpInCurrentLevel / xpNeededForLevel) * 100)
}

export async function updateUserStats(
  userId: string,
  workoutData: {
    sets: number
    reps: number
    weight: number
    prs: number
    duration?: number
  }
): Promise<void> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const stats = await prisma.userStats.findUnique({ where: { userId } })
  
  if (!stats) {
    await prisma.userStats.create({
      data: {
        userId,
        totalWorkouts: 1,
        totalSets: workoutData.sets,
        totalReps: workoutData.reps,
        totalWeight: workoutData.weight,
        totalPRs: workoutData.prs,
        totalDuration: workoutData.duration || 0,
        currentStreak: 1,
        longestStreak: 1,
        lastWorkoutDate: today
      }
    })
    return
  }

  // Calculate streak
  let newStreak = stats.currentStreak
  const lastWorkout = stats.lastWorkoutDate
  
  if (lastWorkout) {
    const lastDate = new Date(lastWorkout)
    lastDate.setHours(0, 0, 0, 0)
    const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === 0) {
      // Same day, no streak change
    } else if (daysDiff === 1) {
      // Consecutive day, increment streak
      newStreak = stats.currentStreak + 1
    } else {
      // Streak broken, reset to 1
      newStreak = 1
    }
  } else {
    newStreak = 1
  }

  const newLongestStreak = Math.max(stats.longestStreak, newStreak)

  await prisma.userStats.update({
    where: { userId },
    data: {
      totalWorkouts: { increment: 1 },
      totalSets: { increment: workoutData.sets },
      totalReps: { increment: workoutData.reps },
      totalWeight: { increment: workoutData.weight },
      totalPRs: { increment: workoutData.prs },
      totalDuration: { increment: workoutData.duration || 0 },
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastWorkoutDate: today
    }
  })
}

export const RARITY_COLORS = {
  common: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
  uncommon: 'text-green-500 bg-green-100 dark:bg-green-900',
  rare: 'text-blue-500 bg-blue-100 dark:bg-blue-900',
  epic: 'text-purple-500 bg-purple-100 dark:bg-purple-900',
  legendary: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900'
}

export const RARITY_BORDER = {
  common: 'border-gray-300 dark:border-gray-600',
  uncommon: 'border-green-400 dark:border-green-600',
  rare: 'border-blue-400 dark:border-blue-600',
  epic: 'border-purple-400 dark:border-purple-600',
  legendary: 'border-yellow-400 dark:border-yellow-600 shadow-lg shadow-yellow-500/20'
}
