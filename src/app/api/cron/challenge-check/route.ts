import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Check and complete guild challenges every hour
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Find challenges that have ended
    const endedChallenges = await prisma.guildChallenge.findMany({
      where: {
        status: 'active',
        endsAt: { lte: new Date() }
      },
      include: {
        challengerGuild: { 
          include: { 
            members: { select: { userId: true } } 
          } 
        },
        defenderGuild: { 
          include: { 
            members: { select: { userId: true } } 
          } 
        }
      }
    })

    const results = []

    for (const challenge of endedChallenges) {
      // Calculate scores based on challenge type
      let challengerScore = 0
      let defenderScore = 0

      const challengerUserIds = challenge.challengerGuild.members.map(m => m.userId)
      const defenderUserIds = challenge.defenderGuild.members.map(m => m.userId)

      const startDate = challenge.startsAt
      const endDate = challenge.endsAt

      if (challenge.challengeType === 'workout_count') {
        challengerScore = await prisma.workout.count({
          where: {
            userId: { in: challengerUserIds },
            status: 'completed',
            date: { gte: startDate, lte: endDate }
          }
        })
        defenderScore = await prisma.workout.count({
          where: {
            userId: { in: defenderUserIds },
            status: 'completed',
            date: { gte: startDate, lte: endDate }
          }
        })
      } else if (challenge.challengeType === 'total_volume') {
        const challengerVolume = await prisma.$queryRaw<[{ total: number }]>`
          SELECT COALESCE(SUM(es.weight * es."actualReps"), 0) as total
          FROM exercise_sets es
          JOIN workout_exercises we ON we.id = es."workoutExerciseId"
          JOIN workouts w ON w.id = we."workoutId"
          WHERE w."userId" = ANY(${challengerUserIds})
            AND w.status = 'completed'
            AND w.date >= ${startDate}
            AND w.date <= ${endDate}
            AND es."isCompleted" = true
        `
        challengerScore = Number(challengerVolume[0]?.total || 0)

        const defenderVolume = await prisma.$queryRaw<[{ total: number }]>`
          SELECT COALESCE(SUM(es.weight * es."actualReps"), 0) as total
          FROM exercise_sets es
          JOIN workout_exercises we ON we.id = es."workoutExerciseId"
          JOIN workouts w ON w.id = we."workoutId"
          WHERE w."userId" = ANY(${defenderUserIds})
            AND w.status = 'completed'
            AND w.date >= ${startDate}
            AND w.date <= ${endDate}
            AND es."isCompleted" = true
        `
        defenderScore = Number(defenderVolume[0]?.total || 0)
      } else if (challenge.challengeType === 'total_xp') {
        // XP gained during challenge period (approximate from workouts)
        challengerScore = await prisma.workout.count({
          where: {
            userId: { in: challengerUserIds },
            status: 'completed',
            date: { gte: startDate, lte: endDate }
          }
        }) * 50 // Base XP per workout

        defenderScore = await prisma.workout.count({
          where: {
            userId: { in: defenderUserIds },
            status: 'completed',
            date: { gte: startDate, lte: endDate }
          }
        }) * 50
      }

      // Determine winner
      const winnerId = challengerScore > defenderScore 
        ? challenge.challengerGuildId 
        : challengerScore < defenderScore 
          ? challenge.defenderGuildId 
          : null // Tie

      // Update challenge
      await prisma.guildChallenge.update({
        where: { id: challenge.id },
        data: {
          status: 'completed',
          challengerScore,
          defenderScore,
          winnerGuildId: winnerId
        }
      })

      // Award XP to winner
      if (winnerId) {
        await prisma.guild.update({
          where: { id: winnerId },
          data: {
            totalXP: { increment: challenge.xpStake },
            seasonXP: { increment: challenge.xpStake }
          }
        })
      }

      results.push({
        challengeId: challenge.id,
        challengerScore,
        defenderScore,
        winnerId
      })
    }

    // Auto-decline pending challenges older than 48 hours
    await prisma.guildChallenge.updateMany({
      where: {
        status: 'pending',
        createdAt: { lt: new Date(Date.now() - 48 * 60 * 60 * 1000) }
      },
      data: { status: 'declined' }
    })

    return NextResponse.json({ 
      success: true, 
      challengesCompleted: results.length,
      results
    })
  } catch (error) {
    console.error('Error checking challenges:', error)
    return NextResponse.json({ error: 'Failed to check challenges' }, { status: 500 })
  }
}
