import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { coachPlanDays } from '../../../../prisma/seed-coach-plan.js'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const coachPlan = await prisma.coachPlan.findUnique({
      where: { userId: session.userId },
      include: {
        days: {
          orderBy: { dayNumber: 'asc' }
        }
      }
    })

    if (!coachPlan) {
      return NextResponse.json({ success: true, data: null })
    }

    return NextResponse.json({ success: true, data: coachPlan })
  } catch (error) {
    console.error('Get coach plan error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get coach plan' },
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

    // Check if user already has a coach plan
    const existingPlan = await prisma.coachPlan.findUnique({
      where: { userId: session.userId }
    })

    if (existingPlan) {
      return NextResponse.json(
        { success: false, error: 'Coach plan already exists' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Get user profile for prefilling
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.userId }
    })

    // Create coach plan with user-specific defaults
    const coachPlan = await prisma.coachPlan.create({
      data: {
        userId: session.userId,
        isActive: true,
        startDate: new Date(),
        currentDay: 1,
        rotationMode: body.rotationMode || 'next_workout',
        deloadMode: false,
        
        // User context (from body or profile)
        age: body.age || 21,
        weight: body.weight || userProfile?.weight || 90,
        height: body.height || userProfile?.height || 165,
        gender: body.gender || 'male',
        experienceLevel: body.experienceLevel || userProfile?.experienceLevel || 'intermediate',
        fitnessGoal: body.fitnessGoal || 'recomposition',
        
        // Nutrition targets
        caloriesMin: body.caloriesMin || 2300,
        caloriesMax: body.caloriesMax || 2400,
        proteinMin: body.proteinMin || 160,
        proteinMax: body.proteinMax || 190,
        carbsGuidance: body.carbsGuidance || 'Moderate: 200-250g on training days',
        fatsGuidance: body.fatsGuidance || 'Moderate: 60-80g daily',
        
        // Daily checklist targets
        stepsTarget: body.stepsTarget || 9000,
        waterTarget: body.waterTarget || 3.0,
        sleepTarget: body.sleepTarget || 7.5,
        mobilityTarget: body.mobilityTarget || 10,
        
        // Reminders
        reminderEnabled: body.reminderEnabled !== undefined ? body.reminderEnabled : true,
        reminderTime: body.reminderTime || '19:00',
        
        // Create the 6 days of the plan
        days: {
          create: coachPlanDays.map(day => ({
            dayNumber: day.dayNumber,
            dayName: day.dayName,
            muscleGroups: day.muscleGroups,
            estimatedDuration: day.estimatedDuration,
            exercises: day.exercises,
            warmup: day.warmup
          }))
        }
      },
      include: {
        days: {
          orderBy: { dayNumber: 'asc' }
        }
      }
    })

    // TODO: Create 6 workout templates for the coach plan
    // This will be done in a follow-up step

    return NextResponse.json({ success: true, data: coachPlan }, { status: 201 })
  } catch (error) {
    console.error('Create coach plan error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create coach plan' },
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

    const coachPlan = await prisma.coachPlan.update({
      where: { userId: session.userId },
      data: {
        isActive: body.isActive,
        currentDay: body.currentDay,
        rotationMode: body.rotationMode,
        deloadMode: body.deloadMode,
        
        // Allow updating targets
        caloriesMin: body.caloriesMin,
        caloriesMax: body.caloriesMax,
        proteinMin: body.proteinMin,
        proteinMax: body.proteinMax,
        carbsGuidance: body.carbsGuidance,
        fatsGuidance: body.fatsGuidance,
        
        stepsTarget: body.stepsTarget,
        waterTarget: body.waterTarget,
        sleepTarget: body.sleepTarget,
        mobilityTarget: body.mobilityTarget,
        
        reminderEnabled: body.reminderEnabled,
        reminderTime: body.reminderTime,
      },
      include: {
        days: {
          orderBy: { dayNumber: 'asc' }
        }
      }
    })

    return NextResponse.json({ success: true, data: coachPlan })
  } catch (error) {
    console.error('Update coach plan error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update coach plan' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    await prisma.coachPlan.delete({
      where: { userId: session.userId }
    })

    return NextResponse.json({ success: true, message: 'Coach plan deleted' })
  } catch (error) {
    console.error('Delete coach plan error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete coach plan' },
      { status: 500 }
    )
  }
}
