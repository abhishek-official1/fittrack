import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

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
    const format = searchParams.get('format') || 'json' // json, csv
    const dataType = searchParams.get('type') || 'workouts' // workouts, exercises, prs, all

    const data: Record<string, unknown> = {}

    if (dataType === 'workouts' || dataType === 'all') {
      data.workouts = await prisma.workout.findMany({
        where: { userId: session.userId },
        include: {
          exercises: {
            include: {
              exercise: {
                select: { name: true, muscleGroup: true }
              },
              sets: true
            }
          }
        },
        orderBy: { date: 'desc' }
      })
    }

    if (dataType === 'exercises' || dataType === 'all') {
      data.customExercises = await prisma.exercise.findMany({
        where: { userId: session.userId }
      })
    }

    if (dataType === 'prs' || dataType === 'all') {
      data.personalRecords = await prisma.personalRecord.findMany({
        where: { userId: session.userId },
        include: {
          exercise: {
            select: { name: true }
          }
        },
        orderBy: { date: 'desc' }
      })
    }

    if (dataType === 'all') {
      data.profile = await prisma.userProfile.findUnique({
        where: { userId: session.userId }
      })
      data.stats = await prisma.userStats.findUnique({
        where: { userId: session.userId }
      })
      data.achievements = await prisma.userAchievement.findMany({
        where: { userId: session.userId },
        include: {
          achievement: true
        }
      })
    }

    if (format === 'csv' && dataType === 'workouts') {
      // Generate CSV for workouts
      const workouts = data.workouts as Array<{
        name: string
        date: Date
        duration: number | null
        status: string
        exercises: Array<{
          exercise: { name: string; muscleGroup: string }
          sets: Array<{
            setNumber: number
            weight: number | null
            targetReps: number | null
            actualReps: number | null
            isCompleted: boolean
          }>
        }>
      }>

      const csvRows = ['Date,Workout,Exercise,Muscle Group,Set,Weight (kg),Reps,Completed']
      
      for (const workout of workouts) {
        for (const we of workout.exercises) {
          for (const set of we.sets) {
            csvRows.push([
              new Date(workout.date).toISOString().split('T')[0],
              workout.name,
              we.exercise.name,
              we.exercise.muscleGroup,
              set.setNumber,
              set.weight || 0,
              set.actualReps || set.targetReps || 0,
              set.isCompleted ? 'Yes' : 'No'
            ].join(','))
          }
        }
      }

      return new NextResponse(csvRows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="fittrack-workouts-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    return NextResponse.json({
      success: true,
      data,
      exportedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Export data error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
