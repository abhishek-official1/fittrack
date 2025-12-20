import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/workout-parties/[code] - Get party details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    const party = await prisma.workoutParty.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        host: { select: { id: true, name: true, avatarUrl: true } },
        participants: {
          where: { leftAt: null },
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
            workout: { select: { id: true, name: true } }
          }
        },
        events: {
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } }
          }
        }
      }
    })

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 })
    }

    return NextResponse.json({ party })
  } catch (error) {
    console.error('Error fetching party:', error)
    return NextResponse.json({ error: 'Failed to fetch party' }, { status: 500 })
  }
}

// PATCH /api/workout-parties/[code] - Update party status (host only)
export async function PATCH(
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

    if (party.hostId !== session.userId) {
      return NextResponse.json({ error: 'Only the host can update the party' }, { status: 403 })
    }

    const { status } = await request.json()

    if (!['waiting', 'active', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updateData: any = { status }
    if (status === 'active' && !party.startedAt) {
      updateData.startedAt = new Date()
    }
    if (status === 'completed') {
      updateData.endedAt = new Date()
    }

    const updated = await prisma.workoutParty.update({
      where: { code: code.toUpperCase() },
      data: updateData
    })

    return NextResponse.json({ party: updated })
  } catch (error) {
    console.error('Error updating party:', error)
    return NextResponse.json({ error: 'Failed to update party' }, { status: 500 })
  }
}

// DELETE /api/workout-parties/[code] - End party (host only)
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

    if (party.hostId !== session.userId) {
      return NextResponse.json({ error: 'Only the host can end the party' }, { status: 403 })
    }

    await prisma.workoutParty.update({
      where: { code: code.toUpperCase() },
      data: { status: 'completed', endedAt: new Date() }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error ending party:', error)
    return NextResponse.json({ error: 'Failed to end party' }, { status: 500 })
  }
}
