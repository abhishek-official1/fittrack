import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Clean up expired parties every 2 hours
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Mark expired waiting/active parties as completed
    const expired = await prisma.workoutParty.updateMany({
      where: {
        status: { in: ['waiting', 'active'] },
        expiresAt: { lt: new Date() }
      },
      data: { status: 'completed', endedAt: new Date() }
    })

    // Delete very old completed parties (older than 30 days)
    const oldDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const deleted = await prisma.workoutParty.deleteMany({
      where: {
        status: 'completed',
        endedAt: { lt: oldDate }
      }
    })

    return NextResponse.json({ 
      success: true, 
      expiredParties: expired.count,
      deletedParties: deleted.count
    })
  } catch (error) {
    console.error('Error cleaning up parties:', error)
    return NextResponse.json({ error: 'Failed to cleanup parties' }, { status: 500 })
  }
}
