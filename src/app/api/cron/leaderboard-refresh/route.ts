import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Refresh leaderboard ranks every 6 hours
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all unique exercises with leaderboard entries
    const exercises = await prisma.exerciseLeaderboard.findMany({
      select: { exerciseId: true },
      distinct: ['exerciseId']
    })

    let totalUpdated = 0

    for (const { exerciseId } of exercises) {
      // Get all entries for this exercise, sorted by 1RM
      const entries = await prisma.exerciseLeaderboard.findMany({
        where: { exerciseId },
        orderBy: { estimated1RM: 'desc' },
        select: { id: true, weightClass: true }
      })

      // Group by weight class for class ranks
      const classRanks: Record<string, number> = {}

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        const wc = entry.weightClass || 'unknown'
        
        if (!classRanks[wc]) classRanks[wc] = 0
        classRanks[wc]++

        await prisma.exerciseLeaderboard.update({
          where: { id: entry.id },
          data: {
            globalRank: i + 1,
            classRank: classRanks[wc]
          }
        })
        totalUpdated++
      }
    }

    return NextResponse.json({ 
      success: true, 
      exercisesProcessed: exercises.length,
      entriesUpdated: totalUpdated
    })
  } catch (error) {
    console.error('Error refreshing leaderboards:', error)
    return NextResponse.json({ error: 'Failed to refresh leaderboards' }, { status: 500 })
  }
}
