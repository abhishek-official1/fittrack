import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/guilds - List guilds with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') // public, private, corporate
    const sort = searchParams.get('sort') || 'totalXP' // totalXP, members, workouts
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}
    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }
    if (type) {
      where.guildType = type
    }

    const orderBy: any = {}
    if (sort === 'members') {
      orderBy.members = { _count: 'desc' }
    } else if (sort === 'workouts') {
      orderBy.totalWorkouts = 'desc'
    } else {
      orderBy.totalXP = 'desc'
    }

    const guilds = await prisma.guild.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        _count: { select: { members: true } },
        members: {
          where: { role: 'leader' },
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
          take: 1
        }
      }
    })

    const formatted = guilds.map(g => ({
      id: g.id,
      name: g.name,
      description: g.description,
      avatarUrl: g.avatarUrl,
      guildType: g.guildType,
      tier: g.tier,
      totalXP: g.totalXP,
      seasonXP: g.seasonXP,
      totalWorkouts: g.totalWorkouts,
      totalVolume: g.totalVolume,
      memberCount: g._count.members,
      maxMembers: g.maxMembers,
      leader: g.members[0]?.user || null
    }))

    return NextResponse.json({ guilds: formatted })
  } catch (error) {
    console.error('Error fetching guilds:', error)
    return NextResponse.json({ error: 'Failed to fetch guilds' }, { status: 500 })
  }
}

// POST /api/guilds - Create a new guild
export async function POST(request: NextRequest) {
  try {
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

    const { name, description, guildType = 'public' } = await request.json()

    if (!name || name.length < 3 || name.length > 30) {
      return NextResponse.json({ error: 'Guild name must be 3-30 characters' }, { status: 400 })
    }

    // Check if guild name is taken
    const existing = await prisma.guild.findUnique({ where: { name } })
    if (existing) {
      return NextResponse.json({ error: 'Guild name already taken' }, { status: 400 })
    }

    const guild = await prisma.guild.create({
      data: {
        name,
        description,
        guildType,
        leaderId: session.userId,
        members: {
          create: {
            userId: session.userId,
            role: 'leader'
          }
        }
      },
      include: {
        _count: { select: { members: true } }
      }
    })

    return NextResponse.json({ guild }, { status: 201 })
  } catch (error) {
    console.error('Error creating guild:', error)
    return NextResponse.json({ error: 'Failed to create guild' }, { status: 500 })
  }
}
