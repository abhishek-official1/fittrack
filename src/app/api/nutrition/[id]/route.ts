import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const id = params.id

    // Verify ownership
    const existing = await prisma.nutritionLog.findUnique({
      where: { id }
    })

    if (!existing || existing.userId !== session.userId) {
      return NextResponse.json(
        { success: false, error: 'Nutrition log not found' },
        { status: 404 }
      )
    }

    const nutritionLog = await prisma.nutritionLog.update({
      where: { id },
      data: {
        mealName: body.mealName,
        mealTime: body.mealTime,
        calories: body.calories,
        protein: body.protein,
        carbs: body.carbs,
        fats: body.fats,
        notes: body.notes
      }
    })

    return NextResponse.json({ success: true, data: nutritionLog })
  } catch (error) {
    console.error('Update nutrition log error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update nutrition log' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const id = params.id

    // Verify ownership
    const existing = await prisma.nutritionLog.findUnique({
      where: { id }
    })

    if (!existing || existing.userId !== session.userId) {
      return NextResponse.json(
        { success: false, error: 'Nutrition log not found' },
        { status: 404 }
      )
    }

    await prisma.nutritionLog.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Nutrition log deleted' })
  } catch (error) {
    console.error('Delete nutrition log error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete nutrition log' },
      { status: 500 }
    )
  }
}
