import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { exerciseSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(request.url)
    const muscleGroup = searchParams.get('muscleGroup')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {
      OR: [
        { isPublic: true, isCustom: false },
        ...(session ? [{ userId: session.userId }] : [])
      ]
    }

    if (muscleGroup) {
      where.muscleGroup = muscleGroup
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.name = { contains: search }
    }

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ success: true, data: exercises })
  } catch (error) {
    console.error('Get exercises error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get exercises' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validation = exerciseSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const exercise = await prisma.exercise.create({
      data: {
        ...validation.data,
        userId: session.userId,
        isCustom: true,
        isPublic: false,
      }
    })

    return NextResponse.json({ success: true, data: exercise }, { status: 201 })
  } catch (error) {
    console.error('Create exercise error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create exercise' },
      { status: 500 }
    )
  }
}
