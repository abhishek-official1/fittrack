import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/guilds/my-guild - Get current user's guild
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const membership = await prisma.guildMember.findUnique({
      where: { userId: session.userId },
      include: {
        guild: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                    stats: { select: { totalXP: true, currentLevel: true } }
                  }
                }
              },
              orderBy: [{ role: 'asc' }, { xpContributed: 'desc' }],
              take: 10
            },
            _count: { select: { members: true } },
            challengesSent: {
              where: { status: 'active' },
              include: { defenderGuild: { select: { id: true, name: true } } }
            },
            challengesReceived: {
              where: { status: 'active' },
              include: { challengerGuild: { select: { id: true, name: true } } }
            }
          }
        }
      }
    })

    if (!membership) {
      return NextResponse.json({ guild: null })
    }

    const guild = membership.guild
    const rank = await getGuildRank(guild.id)

    return NextResponse.json({
      guild: {
        ...guild,
        memberCount: guild._count.members,
        userRole: membership.role,
        userXPContributed: membership.xpContributed,
        globalRank: rank,
        activeChallenges: [...guild.challengesSent, ...guild.challengesReceived]
      }
    })
  } catch (error) {
    console.error('Error fetching user guild:', error)
    return NextResponse.json({ error: 'Failed to fetch guild' }, { status: 500 })
  }
}

async function getGuildRank(guildId: string): Promise<number> {
  const result = await prisma.$queryRaw<{ rank: bigint }[]>`
    SELECT COUNT(*) + 1 as rank
    FROM guilds g2
    WHERE g2."totalXP" > (SELECT "totalXP" FROM guilds WHERE id = ${guildId})
  `
  return Number(result[0]?.rank || 1)
}
