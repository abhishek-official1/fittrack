import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// POST /api/guilds/[id]/join - Join a guild
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is already in a guild
    const existingMembership = await prisma.guildMember.findUnique({
      where: { userId: session.userId }
    })
    if (existingMembership) {
      return NextResponse.json({ error: 'You are already in a guild. Leave your current guild first.' }, { status: 400 })
    }

    const guild = await prisma.guild.findUnique({
      where: { id },
      include: { _count: { select: { members: true } } }
    })

    if (!guild) {
      return NextResponse.json({ error: 'Guild not found' }, { status: 404 })
    }

    if (guild._count.members >= guild.maxMembers) {
      return NextResponse.json({ error: 'Guild is full' }, { status: 400 })
    }

    if (guild.guildType === 'private') {
      return NextResponse.json({ error: 'This guild requires an invitation' }, { status: 400 })
    }

    const member = await prisma.guildMember.create({
      data: {
        guildId: id,
        userId: session.userId,
        role: 'member'
      },
      include: {
        guild: { select: { name: true } }
      }
    })

    return NextResponse.json({ success: true, guild: member.guild })
  } catch (error) {
    console.error('Error joining guild:', error)
    return NextResponse.json({ error: 'Failed to join guild' }, { status: 500 })
  }
}

// DELETE /api/guilds/[id]/join - Leave a guild
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

    const membership = await prisma.guildMember.findFirst({
      where: { guildId: id, userId: session.userId },
      include: { guild: true }
    })

    if (!membership) {
      return NextResponse.json({ error: 'You are not a member of this guild' }, { status: 400 })
    }

    // If leader is leaving, transfer leadership or delete guild
    if (membership.role === 'leader') {
      const otherMembers = await prisma.guildMember.findMany({
        where: { guildId: id, userId: { not: session.userId } },
        orderBy: { xpContributed: 'desc' },
        take: 1
      })

      if (otherMembers.length > 0) {
        // Transfer leadership
        await prisma.$transaction([
          prisma.guildMember.update({
            where: { id: otherMembers[0].id },
            data: { role: 'leader' }
          }),
          prisma.guild.update({
            where: { id },
            data: { leaderId: otherMembers[0].userId }
          }),
          prisma.guildMember.delete({
            where: { id: membership.id }
          })
        ])
      } else {
        // Delete guild if no other members
        await prisma.guild.delete({ where: { id } })
      }
    } else {
      await prisma.guildMember.delete({
        where: { id: membership.id }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error leaving guild:', error)
    return NextResponse.json({ error: 'Failed to leave guild' }, { status: 500 })
  }
}
