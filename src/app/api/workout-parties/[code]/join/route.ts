import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// POST /api/workout-parties/[code]/join - Join a party
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const party = await prisma.workoutParty.findUnique({
      where: { code: code.toUpperCase() },
      include: { _count: { select: { participants: true } } }
    })

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 })
    }

    if (party.status === 'completed') {
      return NextResponse.json({ error: 'Party has ended' }, { status: 400 })
    }

    if (party.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Party has expired' }, { status: 400 })
    }

    if (party._count.participants >= party.maxParticipants) {
      return NextResponse.json({ error: 'Party is full' }, { status: 400 })
    }

    // Check if already a participant
    const existing = await prisma.partyParticipant.findUnique({
      where: { partyId_userId: { partyId: party.id, userId: session.userId } }
    })

    if (existing) {
      if (existing.leftAt) {
        // Rejoin
        await prisma.partyParticipant.update({
          where: { id: existing.id },
          data: { leftAt: null, joinedAt: new Date() }
        })
      } else {
        return NextResponse.json({ error: 'Already in this party' }, { status: 400 })
      }
    } else {
      await prisma.partyParticipant.create({
        data: {
          partyId: party.id,
          userId: session.userId
        }
      })
    }

    // Create join event
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true }
    })

    await prisma.partyEvent.create({
      data: {
        partyId: party.id,
        userId: session.userId,
        eventType: 'joined',
        eventData: { userName: user?.name }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error joining party:', error)
    return NextResponse.json({ error: 'Failed to join party' }, { status: 500 })
  }
}

// DELETE /api/workout-parties/[code]/join - Leave a party
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const party = await prisma.workoutParty.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 })
    }

    const participant = await prisma.partyParticipant.findUnique({
      where: { partyId_userId: { partyId: party.id, userId: session.userId } }
    })

    if (!participant || participant.leftAt) {
      return NextResponse.json({ error: 'Not in this party' }, { status: 400 })
    }

    // Mark as left (don't delete to preserve stats)
    await prisma.partyParticipant.update({
      where: { id: participant.id },
      data: { leftAt: new Date() }
    })

    // Create leave event
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true }
    })

    await prisma.partyEvent.create({
      data: {
        partyId: party.id,
        userId: session.userId,
        eventType: 'left',
        eventData: { userName: user?.name }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error leaving party:', error)
    return NextResponse.json({ error: 'Failed to leave party' }, { status: 500 })
  }
}
