import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/guilds/[id] - Get guild details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSession()

    const guild = await prisma.guild.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                stats: { select: { totalXP: true, currentLevel: true, totalWorkouts: true } }
              }
            }
          },
          orderBy: [{ role: 'asc' }, { xpContributed: 'desc' }]
        },
        challengesSent: {
          where: { status: { in: ['pending', 'active'] } },
          include: { defenderGuild: { select: { id: true, name: true, avatarUrl: true } } },
          take: 5
        },
        challengesReceived: {
          where: { status: { in: ['pending', 'active'] } },
          include: { challengerGuild: { select: { id: true, name: true, avatarUrl: true } } },
          take: 5
        }
      }
    })

    if (!guild) {
      return NextResponse.json({ error: 'Guild not found' }, { status: 404 })
    }

    const isMember = session ? guild.members.some(m => m.userId === session.userId) : false
    const userRole = session ? guild.members.find(m => m.userId === session.userId)?.role : null

    return NextResponse.json({
      guild: {
        ...guild,
        memberCount: guild.members.length,
        isMember,
        userRole,
        activeChallenges: [...guild.challengesSent, ...guild.challengesReceived]
      }
    })
  } catch (error) {
    console.error('Error fetching guild:', error)
    return NextResponse.json({ error: 'Failed to fetch guild' }, { status: 500 })
  }
}

// PATCH /api/guilds/[id] - Update guild (leader only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const guild = await prisma.guild.findUnique({
      where: { id },
      include: { members: { where: { userId: session.userId } } }
    })

    if (!guild) {
      return NextResponse.json({ error: 'Guild not found' }, { status: 404 })
    }

    if (guild.members[0]?.role !== 'leader') {
      return NextResponse.json({ error: 'Only the leader can update guild settings' }, { status: 403 })
    }

    const { description, guildType, maxMembers } = await request.json()

    const updated = await prisma.guild.update({
      where: { id },
      data: {
        ...(description !== undefined && { description }),
        ...(guildType && { guildType }),
        ...(maxMembers && { maxMembers: Math.min(100, Math.max(5, maxMembers)) })
      }
    })

    return NextResponse.json({ guild: updated })
  } catch (error) {
    console.error('Error updating guild:', error)
    return NextResponse.json({ error: 'Failed to update guild' }, { status: 500 })
  }
}

// DELETE /api/guilds/[id] - Delete guild (leader only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const guild = await prisma.guild.findUnique({
      where: { id },
      include: { members: { where: { userId: session.userId } } }
    })

    if (!guild) {
      return NextResponse.json({ error: 'Guild not found' }, { status: 404 })
    }

    if (guild.leaderId !== session.userId) {
      return NextResponse.json({ error: 'Only the leader can delete the guild' }, { status: 403 })
    }

    await prisma.guild.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting guild:', error)
    return NextResponse.json({ error: 'Failed to delete guild' }, { status: 500 })
  }
}
