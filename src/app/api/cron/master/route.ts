import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const results: Record<string, any> = {}

  try {
    // 1. Cleanup Parties (Every 2 hours - or just run every hour since it's cheap)
    // Run every time (Hourly)
    await cleanupParties(results)

    // 2. Challenge Check (Hourly)
    // Run every time
    await checkChallenges(results)

    // 3. Leaderboard Refresh (Every 6 hours)
    // Run if hour is 0, 6, 12, 18
    if (now.getHours() % 6 === 0) {
      await refreshLeaderboards(results)
    }

    // 4. Guild Rankings (Every Sunday at 00:00)
    // Run if Sunday (0) and hour is 0
    if (now.getDay() === 0 && now.getHours() === 0) {
      await updateGuildRankings(results)
    }

    return NextResponse.json({ success: true, timestamp: now.toISOString(), results })
  } catch (error) {
    console.error('Master Cron Error:', error)
    return NextResponse.json({ error: 'Cron execution failed', details: String(error) }, { status: 500 })
  }
}

async function cleanupParties(results: any) {
  try {
    const expired = await prisma.workoutParty.updateMany({
      where: {
        status: { in: ['waiting', 'active'] },
        expiresAt: { lt: new Date() }
      },
      data: { status: 'completed', endedAt: new Date() }
    })

    const oldDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const deleted = await prisma.workoutParty.deleteMany({
      where: {
        status: 'completed',
        endedAt: { lt: oldDate }
      }
    })
    results.cleanupParties = { expired: expired.count, deleted: deleted.count }
  } catch (e) {
    results.cleanupParties = { error: String(e) }
  }
}

async function checkChallenges(results: any) {
  try {
    const endedChallenges = await prisma.guildChallenge.findMany({
      where: {
        status: 'active',
        endsAt: { lte: new Date() }
      },
      include: {
        challengerGuild: { include: { members: { select: { userId: true } } } },
        defenderGuild: { include: { members: { select: { userId: true } } } }
      }
    })

    let completedCount = 0

    for (const challenge of endedChallenges) {
      // Simplification: We need to replicate the scoring logic here
      // For brevity in master cron, we'll keep the logic but it might be better in a service
      // ... (Reusing logic from original file)
      
      const challengerUserIds = challenge.challengerGuild.members.map(m => m.userId)
      const defenderUserIds = challenge.defenderGuild.members.map(m => m.userId)
      const startDate = challenge.startsAt
      const endDate = challenge.endsAt

      let challengerScore = 0
      let defenderScore = 0

      if (challenge.challengeType === 'workout_count') {
        challengerScore = await prisma.workout.count({ where: { userId: { in: challengerUserIds }, status: 'completed', date: { gte: startDate, lte: endDate } } })
        defenderScore = await prisma.workout.count({ where: { userId: { in: defenderUserIds }, status: 'completed', date: { gte: startDate, lte: endDate } } })
      } else if (challenge.challengeType === 'total_volume') {
        const cVol = await prisma.$queryRaw<[{ total: number }]>`SELECT COALESCE(SUM(es.weight * es."actualReps"), 0) as total FROM exercise_sets es JOIN workout_exercises we ON we.id = es."workoutExerciseId" JOIN workouts w ON w.id = we."workoutId" WHERE w."userId" = ANY(${challengerUserIds}) AND w.status = 'completed' AND w.date >= ${startDate} AND w.date <= ${endDate} AND es."isCompleted" = true`
        challengerScore = Number(cVol[0]?.total || 0)
        const dVol = await prisma.$queryRaw<[{ total: number }]>`SELECT COALESCE(SUM(es.weight * es."actualReps"), 0) as total FROM exercise_sets es JOIN workout_exercises we ON we.id = es."workoutExerciseId" JOIN workouts w ON w.id = we."workoutId" WHERE w."userId" = ANY(${defenderUserIds}) AND w.status = 'completed' AND w.date >= ${startDate} AND w.date <= ${endDate} AND es."isCompleted" = true`
        defenderScore = Number(dVol[0]?.total || 0)
      } else if (challenge.challengeType === 'total_xp') {
         challengerScore = await prisma.workout.count({ where: { userId: { in: challengerUserIds }, status: 'completed', date: { gte: startDate, lte: endDate } } }) * 50
         defenderScore = await prisma.workout.count({ where: { userId: { in: defenderUserIds }, status: 'completed', date: { gte: startDate, lte: endDate } } }) * 50
      }

      const winnerId = challengerScore > defenderScore ? challenge.challengerGuildId : challengerScore < defenderScore ? challenge.defenderGuildId : null

      await prisma.guildChallenge.update({
        where: { id: challenge.id },
        data: { status: 'completed', challengerScore, defenderScore, winnerGuildId: winnerId }
      })

      if (winnerId) {
        await prisma.guild.update({
          where: { id: winnerId },
          data: { totalXP: { increment: challenge.xpStake }, seasonXP: { increment: challenge.xpStake } }
        })
      }
      completedCount++
    }
    
    // Auto-decline old pending
    const declined = await prisma.guildChallenge.updateMany({
      where: { status: 'pending', createdAt: { lt: new Date(Date.now() - 48 * 60 * 60 * 1000) } },
      data: { status: 'declined' }
    })

    results.challengeCheck = { completed: completedCount, declined: declined.count }

  } catch (e) {
    results.challengeCheck = { error: String(e) }
  }
}

async function refreshLeaderboards(results: any) {
  try {
    const exercises = await prisma.exerciseLeaderboard.findMany({ select: { exerciseId: true }, distinct: ['exerciseId'] })
    let entriesUpdated = 0
    for (const { exerciseId } of exercises) {
      const entries = await prisma.exerciseLeaderboard.findMany({ where: { exerciseId }, orderBy: { estimated1RM: 'desc' }, select: { id: true, weightClass: true } })
      const classRanks: Record<string, number> = {}
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        const wc = entry.weightClass || 'unknown'
        if (!classRanks[wc]) classRanks[wc] = 0
        classRanks[wc]++
        await prisma.exerciseLeaderboard.update({
          where: { id: entry.id },
          data: { globalRank: i + 1, classRank: classRanks[wc] }
        })
        entriesUpdated++
      }
    }
    results.leaderboardRefresh = { exercises: exercises.length, entriesUpdated }
  } catch (e) {
    results.leaderboardRefresh = { error: String(e) }
  }
}

async function updateGuildRankings(results: any) {
  try {
    const guilds = await prisma.guild.findMany({ orderBy: { totalXP: 'desc' }, select: { id: true } })
    const total = guilds.length
    if (total > 0) {
      for (let i = 0; i < total; i++) {
        const percentile = (i / total) * 100
        let tier = 'bronze'
        if (percentile < 1) tier = 'diamond'
        else if (percentile < 5) tier = 'platinum'
        else if (percentile < 15) tier = 'gold'
        else if (percentile < 35) tier = 'silver'
        
        await prisma.guild.update({
          where: { id: guilds[i].id },
          data: { tier, seasonXP: 0 }
        })
      }
    }
    results.guildRankings = { processed: total }
  } catch (e) {
    results.guildRankings = { error: String(e) }
  }
}
