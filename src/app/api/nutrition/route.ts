import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { nutritionLogSchema } from '@/lib/validations'
import { format, startOfDay, endOfDay, subDays } from 'date-fns'

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
    const date = searchParams.get('date')
    const period = searchParams.get('period') || '7'

    let where: Record<string, unknown> = {
      userId: session.userId
    }

    if (date) {
      const targetDate = new Date(date)
      where.date = {
        gte: startOfDay(targetDate),
        lte: endOfDay(targetDate)
      }
    } else {
      const days = parseInt(period)
      where.date = {
        gte: subDays(new Date(), days),
        lte: new Date()
      }
    }

    const logs = await prisma.nutritionLog.findMany({
      where,
      orderBy: { date: 'desc' }
    })

    // Group by date
    const byDate = logs.reduce((acc, log) => {
      const dateKey = format(new Date(log.date), 'yyyy-MM-dd')
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          meals: []
        }
      }
      acc[dateKey].totalCalories += log.calories || 0
      acc[dateKey].totalProtein += log.protein || 0
      acc[dateKey].totalCarbs += log.carbs || 0
      acc[dateKey].totalFat += log.fat || 0
      acc[dateKey].meals.push(log)
      return acc
    }, {} as Record<string, { date: string; totalCalories: number; totalProtein: number; totalCarbs: number; totalFat: number; meals: typeof logs }>)

    return NextResponse.json({ 
      success: true, 
      data: {
        logs,
        dailyTotals: Object.values(byDate)
      }
    })
  } catch (error) {
    console.error('Get nutrition error:', error)
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
    const validation = nutritionLogSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const log = await prisma.nutritionLog.create({
      data: {
        userId: session.userId,
        date: new Date(validation.data.date),
        mealType: validation.data.mealType,
        calories: validation.data.calories,
        protein: validation.data.protein,
        carbs: validation.data.carbs,
        fat: validation.data.fat,
        fiber: validation.data.fiber,
        notes: validation.data.notes,
      }
    })

    return NextResponse.json({ success: true, data: log }, { status: 201 })
  } catch (error) {
    console.error('Create nutrition log error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create nutrition log' },
      { status: 500 }
    )
  }
}
