import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/workout-parties/[code]/events - Get party events (for polling)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const { searchParams } = new URL(request.url)
    const since = searchParams.get('since') // ISO timestamp
    const limit = parseInt(searchParams.get('limit') || '50')

    const party = await prisma.workoutParty.findUnique({
      where: { code: code.toUpperCase() },
      select: { id: true, status: true }
    })

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 })
    }

    const where: any = { partyId: party.id }
    if (since) {
      where.createdAt = { gt: new Date(since) }
    }

    const events = await prisma.partyEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } }
      }
    })

    // Get current participants
    const participants = await prisma.partyParticipant.findMany({
      where: { partyId: party.id, leftAt: null },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } }
      }
    })

    // Get participant stats
    const stats = await prisma.partyParticipant.findMany({
      where: { partyId: party.id },
      select: {
        userId: true,
        totalSets: true,
        totalVolume: true,
        prsAchieved: true,
        user: { select: { name: true } }
      },
      orderBy: { totalVolume: 'desc' }
    })

    return NextResponse.json({
      events: events.reverse(), // Oldest first for display
      participants,
      stats,
      partyStatus: party.status
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST /api/workout-parties/[code]/events - Create a new event
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

    const { eventType, eventData } = await request.json()

    const validTypes = ['set_completed', 'pr_achieved', 'exercise_started', 'reaction', 'message']
    if (!validTypes.includes(eventType)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    const party = await prisma.workoutParty.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 })
    }

    if (party.status === 'completed') {
      return NextResponse.json({ error: 'Party has ended' }, { status: 400 })
    }

    // Verify user is a participant
    const participant = await prisma.partyParticipant.findUnique({
      where: { partyId_userId: { partyId: party.id, userId: session.userId } }
    })

    if (!participant || participant.leftAt) {
      return NextResponse.json({ error: 'Not a participant' }, { status: 403 })
    }

    // Create event
    const event = await prisma.partyEvent.create({
      data: {
        partyId: party.id,
        userId: session.userId,
        eventType,
        eventData
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } }
      }
    })

    // Update participant stats if relevant
    if (eventType === 'set_completed' && eventData) {
      const volume = (eventData.weight || 0) * (eventData.reps || 0)
      await prisma.partyParticipant.update({
        where: { id: participant.id },
        data: {
          totalSets: { increment: 1 },
          totalVolume: { increment: volume }
        }
      })
    }

    if (eventType === 'pr_achieved') {
      await prisma.partyParticipant.update({
        where: { id: participant.id },
        data: { prsAchieved: { increment: 1 } }
      })
    }

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
