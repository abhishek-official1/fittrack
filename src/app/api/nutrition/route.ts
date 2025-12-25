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
    const daysParam = searchParams.get('days') // Get last N days
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    let where: any = {
      userId: session.userId
    }

    // Single date query
    if (dateParam) {
      const date = new Date(dateParam)
      where.date = {
        gte: startOfDay(date),
        lte: endOfDay(date)
      }
    }
    // Last N days query
    else if (daysParam) {
      const days = parseInt(daysParam)
      const startDate = subDays(new Date(), days)
      where.date = {
        gte: startOfDay(startDate),
        lte: endOfDay(new Date())
      }
    }
    // Date range query
    else if (startDateParam && endDateParam) {
      const startDate = new Date(startDateParam)
      const endDate = new Date(endDateParam)
      where.date = {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate)
      }
    }
    // Default: last 7 days
    else {
      const startDate = subDays(new Date(), 7)
      where.date = {
        gte: startOfDay(startDate),
        lte: endOfDay(new Date())
      }
    }

    const nutritionLogs = await prisma.nutritionLog.findMany({
      where,
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // Group by date and calculate daily totals
    const dailyTotals = nutritionLogs.reduce((acc: any, log) => {
      const dateKey = log.date.toISOString().split('T')[0]
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: log.date,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFats: 0,
          meals: []
        }
      }
      acc[dateKey].totalCalories += log.calories
      acc[dateKey].totalProtein += log.protein
      acc[dateKey].totalCarbs += log.carbs || 0
      acc[dateKey].totalFats += log.fats || 0
      acc[dateKey].meals.push(log)
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data: {
        logs: nutritionLogs,
        dailyTotals: Object.values(dailyTotals)
      }
    })
  } catch (error) {
    console.error('Get nutrition logs error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get nutrition logs' },
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

    // Validate required fields
    if (!body.calories || !body.protein) {
      return NextResponse.json(
        { success: false, error: 'Calories and protein are required' },
        { status: 400 }
      )
    }

    const nutritionLog = await prisma.nutritionLog.create({
      data: {
        userId: session.userId,
        date: body.date ? new Date(body.date) : new Date(),
        mealName: body.mealName,
        mealTime: body.mealTime,
        calories: body.calories,
        protein: body.protein,
        carbs: body.carbs,
        fats: body.fats,
        notes: body.notes
      }
    })

    return NextResponse.json({ success: true, data: nutritionLog }, { status: 201 })
  } catch (error) {
    console.error('Create nutrition log error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create nutrition log' },
      { status: 500 }
    )
  }
}
