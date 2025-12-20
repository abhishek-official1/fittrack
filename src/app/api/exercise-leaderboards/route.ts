import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/exercise-leaderboards - Get leaderboard for an exercise
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const exerciseId = searchParams.get('exerciseId')
    const scope = searchParams.get('scope') || 'global' // global, class
    const weightClass = searchParams.get('weightClass') // lightweight, middleweight, heavyweight
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!exerciseId) {
      return NextResponse.json({ error: 'exerciseId is required' }, { status: 400 })
    }

    const session = await getSession()

    const where: any = { exerciseId }
    if (scope === 'class' && weightClass) {
      where.weightClass = weightClass
    }

    const leaderboard = await prisma.exerciseLeaderboard.findMany({
      where,
      orderBy: { estimated1RM: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            stats: { select: { currentLevel: true } }
          }
        },
        exercise: { select: { name: true } }
      }
    })

    // Add rank to each entry
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }))

    // Get current user's position if logged in
    let userEntry = null
    let userRank = null
    if (session) {
      userEntry = await prisma.exerciseLeaderboard.findUnique({
        where: { exerciseId_userId: { exerciseId, userId: session.userId } },
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } }
        }
      })

      if (userEntry) {
        const betterCount = await prisma.exerciseLeaderboard.count({
          where: {
            exerciseId,
            estimated1RM: { gt: userEntry.estimated1RM },
            ...(scope === 'class' && weightClass ? { weightClass } : {})
          }
        })
        userRank = betterCount + 1
      }
    }

    // Get exercise details
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      select: { id: true, name: true, muscleGroup: true }
    })

    return NextResponse.json({
      exercise,
      leaderboard: rankedLeaderboard,
      userEntry: userEntry ? { ...userEntry, rank: userRank } : null,
      totalEntries: await prisma.exerciseLeaderboard.count({ where })
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}

// POST /api/exercise-leaderboards - Update user's leaderboard entry
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { exerciseId, weight, reps } = await request.json()

    if (!exerciseId || !weight || !reps) {
      return NextResponse.json({ error: 'exerciseId, weight, and reps are required' }, { status: 400 })
    }

    // Calculate estimated 1RM using Brzycki formula
    const estimated1RM = weight * (36 / (37 - Math.min(reps, 36)))

    // Get user's weight class from profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.userId }
    })

    let weightClass = 'middleweight'
    if (profile?.weight) {
      if (profile.weight < 70) weightClass = 'lightweight'
      else if (profile.weight > 85) weightClass = 'heavyweight'
    }

    // Check if this beats their current entry
    const existing = await prisma.exerciseLeaderboard.findUnique({
      where: { exerciseId_userId: { exerciseId, userId: session.userId } }
    })

    if (existing && existing.estimated1RM >= estimated1RM) {
      return NextResponse.json({
        updated: false,
        message: 'Current record is better',
        current1RM: existing.estimated1RM,
        new1RM: estimated1RM
      })
    }

    const entry = await prisma.exerciseLeaderboard.upsert({
      where: { exerciseId_userId: { exerciseId, userId: session.userId } },
      update: {
        estimated1RM,
        bestWeight: weight,
        bestReps: reps,
        weightClass,
        achievedAt: new Date()
      },
      create: {
        exerciseId,
        userId: session.userId,
        estimated1RM,
        bestWeight: weight,
        bestReps: reps,
        weightClass,
        achievedAt: new Date()
      },
      include: {
        exercise: { select: { name: true } }
      }
    })

    // Calculate new rank
    const betterCount = await prisma.exerciseLeaderboard.count({
      where: { exerciseId, estimated1RM: { gt: estimated1RM } }
    })
    const newRank = betterCount + 1

    return NextResponse.json({
      updated: true,
      entry: { ...entry, rank: newRank },
      improvement: existing ? estimated1RM - existing.estimated1RM : null
    })
  } catch (error) {
    console.error('Error updating leaderboard:', error)
    return NextResponse.json({ error: 'Failed to update leaderboard' }, { status: 500 })
  }
}
