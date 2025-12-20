import { prisma } from './prisma'

export async function updateGuildStatsOnWorkoutComplete(
  userId: string,
  workoutStats: {
    totalVolume: number
    xpEarned: number
  }
) {
  // Check if user is in a guild
  const membership = await prisma.guildMember.findUnique({
    where: { userId },
    include: { guild: true }
  })

  if (!membership) return null

  // Update member contribution
  await prisma.guildMember.update({
    where: { id: membership.id },
    data: {
      xpContributed: { increment: workoutStats.xpEarned },
      workoutsContributed: { increment: 1 }
    }
  })

  // Update guild totals
  const guild = await prisma.guild.update({
    where: { id: membership.guildId },
    data: {
      totalXP: { increment: workoutStats.xpEarned },
      seasonXP: { increment: workoutStats.xpEarned },
      totalWorkouts: { increment: 1 },
      totalVolume: { increment: workoutStats.totalVolume }
    }
  })

  return guild
}

export async function updateExerciseLeaderboard(
  userId: string,
  exerciseId: string,
  weight: number,
  reps: number
) {
  // Calculate estimated 1RM using Brzycki formula
  const estimated1RM = weight * (36 / (37 - Math.min(reps, 36)))

  // Get user's weight class from profile
  const profile = await prisma.userProfile.findUnique({
    where: { userId }
  })

  let weightClass = 'middleweight'
  if (profile?.weight) {
    if (profile.weight < 70) weightClass = 'lightweight'
    else if (profile.weight > 85) weightClass = 'heavyweight'
  }

  // Check if this beats their current entry
  const existing = await prisma.exerciseLeaderboard.findUnique({
    where: { exerciseId_userId: { exerciseId, userId } }
  })

  if (existing && existing.estimated1RM >= estimated1RM) {
    return { updated: false, entry: existing }
  }

  // Upsert the entry
  const entry = await prisma.exerciseLeaderboard.upsert({
    where: { exerciseId_userId: { exerciseId, userId } },
    update: {
      estimated1RM,
      bestWeight: weight,
      bestReps: reps,
      weightClass,
      achievedAt: new Date()
    },
    create: {
      exerciseId,
      userId,
      estimated1RM,
      bestWeight: weight,
      bestReps: reps,
      weightClass,
      achievedAt: new Date()
    }
  })

  return { updated: true, entry, improvement: existing ? estimated1RM - existing.estimated1RM : null }
}
