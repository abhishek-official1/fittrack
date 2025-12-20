import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Weekly guild tier updates
export async function GET(request: NextRequest) {
  // Verify cron secret in production
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all guilds sorted by XP
    const guilds = await prisma.guild.findMany({
      orderBy: { totalXP: 'desc' },
      select: { id: true, totalXP: true, seasonXP: true }
    })

    const total = guilds.length
    if (total === 0) {
      return NextResponse.json({ message: 'No guilds to process' })
    }

    // Update tiers based on percentile
    for (let i = 0; i < guilds.length; i++) {
      const percentile = (i / total) * 100
      let tier = 'bronze'
      
      if (percentile < 1) tier = 'diamond'       // Top 1%
      else if (percentile < 5) tier = 'platinum' // Top 5%
      else if (percentile < 15) tier = 'gold'    // Top 15%
      else if (percentile < 35) tier = 'silver'  // Top 35%
      // else bronze

      await prisma.guild.update({
        where: { id: guilds[i].id },
        data: { tier, seasonXP: 0 } // Reset season XP
      })
    }

    return NextResponse.json({ 
      success: true, 
      guildsProcessed: total,
      distribution: {
        diamond: Math.ceil(total * 0.01),
        platinum: Math.ceil(total * 0.04),
        gold: Math.ceil(total * 0.10),
        silver: Math.ceil(total * 0.20),
        bronze: total - Math.ceil(total * 0.35)
      }
    })
  } catch (error) {
    console.error('Error updating guild rankings:', error)
    return NextResponse.json({ error: 'Failed to update rankings' }, { status: 500 })
  }
}
