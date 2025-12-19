import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { profileSchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { profile: true }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const { passwordHash, ...userWithoutPassword } = user

    return NextResponse.json({ success: true, data: userWithoutPassword })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validation = profileSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { name, ...profileData } = validation.data

    const user = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name,
        profile: {
          update: {
            fitnessGoal: profileData.fitnessGoal,
            experienceLevel: profileData.experienceLevel,
            weight: profileData.weight,
            height: profileData.height,
            birthDate: profileData.birthDate ? new Date(profileData.birthDate) : null,
            gender: profileData.gender,
            preferredUnits: profileData.preferredUnits,
            weeklyGoal: profileData.weeklyGoal,
          }
        }
      },
      include: { profile: true }
    })

    const { passwordHash, ...userWithoutPassword } = user

    return NextResponse.json({ success: true, data: userWithoutPassword })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
