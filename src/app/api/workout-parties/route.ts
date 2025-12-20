import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

function generatePartyCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Avoid confusing characters
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// GET /api/workout-parties - List active parties or get by code
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
      // Get specific party by code
      const party = await prisma.workoutParty.findUnique({
        where: { code: code.toUpperCase() },
        include: {
          host: { select: { id: true, name: true, avatarUrl: true } },
          participants: {
            include: {
              user: { select: { id: true, name: true, avatarUrl: true } }
            }
          },
          _count: { select: { participants: true } }
        }
      })

      if (!party) {
        return NextResponse.json({ error: 'Party not found' }, { status: 404 })
      }

      if (party.expiresAt < new Date() && party.status !== 'completed') {
        return NextResponse.json({ error: 'Party has expired' }, { status: 410 })
      }

      return NextResponse.json({ party })
    }

    // List public active parties
    const parties = await prisma.workoutParty.findMany({
      where: {
        status: { in: ['waiting', 'active'] },
        expiresAt: { gt: new Date() }
      },
      include: {
        host: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { participants: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return NextResponse.json({ parties })
  } catch (error) {
    console.error('Error fetching parties:', error)
    return NextResponse.json({ error: 'Failed to fetch parties' }, { status: 500 })
  }
}

// POST /api/workout-parties - Create a new party
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, maxParticipants = 10 } = await request.json()

    // Check if user already has an active party
    const existingParty = await prisma.workoutParty.findFirst({
      where: {
        hostId: session.userId,
        status: { in: ['waiting', 'active'] },
        expiresAt: { gt: new Date() }
      }
    })

    if (existingParty) {
      return NextResponse.json({ 
        error: 'You already have an active party',
        existingCode: existingParty.code 
      }, { status: 400 })
    }

    // Generate unique code
    let code = generatePartyCode()
    let attempts = 0
    while (attempts < 10) {
      const existing = await prisma.workoutParty.findUnique({ where: { code } })
      if (!existing) break
      code = generatePartyCode()
      attempts++
    }

    const party = await prisma.workoutParty.create({
      data: {
        hostId: session.userId,
        code,
        name: name || `${session.userId}'s Workout Party`,
        maxParticipants: Math.min(50, Math.max(2, maxParticipants)),
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
        participants: {
          create: {
            userId: session.userId
          }
        }
      },
      include: {
        host: { select: { id: true, name: true, avatarUrl: true } },
        participants: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } }
        }
      }
    })

    // Create join event
    await prisma.partyEvent.create({
      data: {
        partyId: party.id,
        userId: session.userId,
        eventType: 'joined',
        eventData: { isHost: true }
      }
    })

    return NextResponse.json({ party }, { status: 201 })
  } catch (error) {
    console.error('Error creating party:', error)
    return NextResponse.json({ error: 'Failed to create party' }, { status: 500 })
  }
}
