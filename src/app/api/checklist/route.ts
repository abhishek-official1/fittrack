import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { startOfDay, endOfDay, subDays } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    const daysParam = searchParams.get('days')

    let where: any = {
      userId: session.userId
    }

    if (dateParam) {
      // Get specific date
      const date = new Date(dateParam)
      where.date = startOfDay(date)
    } else if (daysParam) {
      // Get last N days
      const days = parseInt(daysParam)
      const startDate = subDays(new Date(), days)
      where.date = {
        gte: startOfDay(startDate),
        lte: startOfDay(new Date())
      }
    } else {
      // Default: today's checklist
      where.date = startOfDay(new Date())
    }

    const checklists = await prisma.dailyChecklist.findMany({
      where,
      orderBy: { date: 'desc' }
    })

    // If querying for today and no checklist exists, return empty template
    if (dateParam === new Date().toISOString().split('T')[0] && checklists.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No checklist for today yet'
      })
    }

    return NextResponse.json({
      success: true,
      data: daysParam ? checklists : checklists[0] || null
    })
  } catch (error) {
    console.error('Get checklist error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get checklist' },
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
    const date = body.date ? startOfDay(new Date(body.date)) : startOfDay(new Date())

    // Get coach plan for targets
    const coachPlan = await prisma.coachPlan.findUnique({
      where: { userId: session.userId }
    })

    // Create or update checklist
    const checklist = await prisma.dailyChecklist.upsert({
      where: {
        userId_date: {
          userId: session.userId,
          date
        }
      },
      create: {
        userId: session.userId,
        date,
        steps: body.steps,
        stepsCompleted: body.stepsCompleted || false,
        waterLiters: body.waterLiters,
        waterCompleted: body.waterCompleted || false,
        sleepHours: body.sleepHours,
        sleepCompleted: body.sleepCompleted || false,
        mobilityMinutes: body.mobilityMinutes,
        mobilityCompleted: body.mobilityCompleted || false,
        workoutCompleted: body.workoutCompleted || false,
        notes: body.notes
      },
      update: {
        steps: body.steps,
        stepsCompleted: body.stepsCompleted,
        waterLiters: body.waterLiters,
        waterCompleted: body.waterCompleted,
        sleepHours: body.sleepHours,
        sleepCompleted: body.sleepCompleted,
        mobilityMinutes: body.mobilityMinutes,
        mobilityCompleted: body.mobilityCompleted,
        workoutCompleted: body.workoutCompleted,
        notes: body.notes
      }
    })

    // Calculate completion score
    const targets = coachPlan ? {
      steps: coachPlan.stepsTarget,
      water: coachPlan.waterTarget,
      sleep: coachPlan.sleepTarget,
      mobility: coachPlan.mobilityTarget
    } : null

    const completionScore = [
      checklist.stepsCompleted,
      checklist.waterCompleted,
      checklist.sleepCompleted,
      checklist.mobilityCompleted,
      checklist.workoutCompleted
    ].filter(Boolean).length / 5 * 100

    return NextResponse.json({
      success: true,
      data: {
        ...checklist,
        completionScore,
        targets
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Create/update checklist error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save checklist' },
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
    const date = body.date ? startOfDay(new Date(body.date)) : startOfDay(new Date())

    const checklist = await prisma.dailyChecklist.update({
      where: {
        userId_date: {
          userId: session.userId,
          date
        }
      },
      data: {
        steps: body.steps,
        stepsCompleted: body.stepsCompleted,
        waterLiters: body.waterLiters,
        waterCompleted: body.waterCompleted,
        sleepHours: body.sleepHours,
        sleepCompleted: body.sleepCompleted,
        mobilityMinutes: body.mobilityMinutes,
        mobilityCompleted: body.mobilityCompleted,
        workoutCompleted: body.workoutCompleted,
        notes: body.notes
      }
    })

    return NextResponse.json({ success: true, data: checklist })
  } catch (error) {
    console.error('Update checklist error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update checklist' },
      { status: 500 }
    )
  }
}
