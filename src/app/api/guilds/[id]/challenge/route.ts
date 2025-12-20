import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// POST /api/guilds/[id]/challenge - Challenge another guild
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: defenderGuildId } = await params
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { challengeType, xpStake = 500, durationDays = 7 } = await request.json()

    if (!['total_volume', 'workout_count', 'total_xp'].includes(challengeType)) {
      return NextResponse.json({ error: 'Invalid challenge type' }, { status: 400 })
    }

    // Get user's guild
    const membership = await prisma.guildMember.findUnique({
      where: { userId: session.userId },
      include: { guild: true }
    })

    if (!membership) {
      return NextResponse.json({ error: 'You must be in a guild to challenge' }, { status: 400 })
    }

    if (!['leader', 'officer'].includes(membership.role)) {
      return NextResponse.json({ error: 'Only leaders and officers can issue challenges' }, { status: 403 })
    }

    const challengerGuildId = membership.guildId

    if (challengerGuildId === defenderGuildId) {
      return NextResponse.json({ error: 'Cannot challenge your own guild' }, { status: 400 })
    }

    // Check if there's already an active challenge between these guilds
    const existingChallenge = await prisma.guildChallenge.findFirst({
      where: {
        OR: [
          { challengerGuildId, defenderGuildId, status: { in: ['pending', 'active'] } },
          { challengerGuildId: defenderGuildId, defenderGuildId: challengerGuildId, status: { in: ['pending', 'active'] } }
        ]
      }
    })

    if (existingChallenge) {
      return NextResponse.json({ error: 'There is already an active challenge between these guilds' }, { status: 400 })
    }

    const startsAt = new Date()
    const endsAt = new Date(startsAt.getTime() + durationDays * 24 * 60 * 60 * 1000)

    const challenge = await prisma.guildChallenge.create({
      data: {
        challengerGuildId,
        defenderGuildId,
        challengeType,
        xpStake: Math.min(2000, Math.max(100, xpStake)),
        status: 'pending',
        startsAt,
        endsAt
      },
      include: {
        challengerGuild: { select: { name: true } },
        defenderGuild: { select: { name: true } }
      }
    })

    return NextResponse.json({ challenge }, { status: 201 })
  } catch (error) {
    console.error('Error creating challenge:', error)
    return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 })
  }
}

// PATCH /api/guilds/[id]/challenge - Accept/decline a challenge
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: guildId } = await params
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { challengeId, action } = await request.json()

    if (!['accept', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Verify user is leader/officer of defender guild
    const membership = await prisma.guildMember.findFirst({
      where: { guildId, userId: session.userId, role: { in: ['leader', 'officer'] } }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Only leaders and officers can respond to challenges' }, { status: 403 })
    }

    const challenge = await prisma.guildChallenge.findFirst({
      where: { id: challengeId, defenderGuildId: guildId, status: 'pending' }
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found or already responded' }, { status: 404 })
    }

    const updated = await prisma.guildChallenge.update({
      where: { id: challengeId },
      data: { status: action === 'accept' ? 'active' : 'declined' },
      include: {
        challengerGuild: { select: { name: true } },
        defenderGuild: { select: { name: true } }
      }
    })

    return NextResponse.json({ challenge: updated })
  } catch (error) {
    console.error('Error responding to challenge:', error)
    return NextResponse.json({ error: 'Failed to respond to challenge' }, { status: 500 })
  }
}
