import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { getMuscleRecoveryStatus, getSuggestedMuscles } from '@/lib/recovery'
import { getAllProgressionSuggestions } from '@/lib/progressive-overload'
import { startOfDay, endOfDay } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get coach plan
    const coachPlan = await prisma.coachPlan.findUnique({
      where: { userId: session.userId },
      include: {
        days: {
          orderBy: { dayNumber: 'asc' }
        }
      }
    })

    if (!coachPlan || !coachPlan.isActive) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No active coach plan'
      })
    }

    // Get current day's plan
    const currentDay = coachPlan.days.find(d => d.dayNumber === coachPlan.currentDay)
    
    if (!currentDay) {
      return NextResponse.json({
        success: false,
        error: 'Current day not found in plan'
      }, { status: 404 })
    }

    // Get muscle recovery status
    const recoveryStatuses = await getMuscleRecoveryStatus(session.userId)
    const suggestedMuscles = getSuggestedMuscles(recoveryStatuses)
    
    // Calculate overall recovery score (average of all muscle groups)
    const overallRecovery = Math.round(
      recoveryStatuses.reduce((sum, s) => sum + s.recoveryPercent, 0) / recoveryStatuses.length
    )
    
    // Determine if ready to train based on target muscles
    const targetMuscles = currentDay.muscleGroups
    const targetRecoveryStatuses = recoveryStatuses.filter(s => 
      targetMuscles.includes(s.muscleGroup)
    )
    const readyToTrain = targetRecoveryStatuses.every(s => s.readyToTrain)
    const musclesNeedingRest = targetRecoveryStatuses
      .filter(s => !s.readyToTrain)
      .map(s => s.muscleGroup)

    // Get progression suggestions for exercises in today's plan
    const allProgressions = await getAllProgressionSuggestions(session.userId)
    const todayExerciseNames = (currentDay.exercises as any[]).map((ex: any) => ex.name.toLowerCase())
    const relevantProgressions = allProgressions.filter(p => 
      todayExerciseNames.some(name => p.exerciseName.toLowerCase().includes(name))
    )

    // Get today's nutrition summary
    const today = new Date()
    const nutritionLogs = await prisma.nutritionLog.findMany({
      where: {
        userId: session.userId,
        date: {
          gte: startOfDay(today),
          lte: endOfDay(today)
        }
      }
    })

    const nutritionSummary = nutritionLogs.reduce(
      (sum, log) => ({
        calories: sum.calories + log.calories,
        protein: sum.protein + log.protein,
        carbs: sum.carbs + (log.carbs || 0),
        fats: sum.fats + (log.fats || 0)
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    )

    // Get today's checklist
    const checklist = await prisma.dailyChecklist.findUnique({
      where: {
        userId_date: {
          userId: session.userId,
          date: startOfDay(today)
        }
      }
    })

    // Check if today's workout is already completed
    const todayWorkout = await prisma.workout.findFirst({
      where: {
        userId: session.userId,
        date: {
          gte: startOfDay(today),
          lte: endOfDay(today)
        },
        status: {
          in: ['completed', 'in_progress']
        }
      }
    })

    // Calculate checklist completion
    const checklistCompletion = checklist ? {
      stepsCompleted: checklist.stepsCompleted,
      waterCompleted: checklist.waterCompleted,
      sleepCompleted: checklist.sleepCompleted,
      mobilityCompleted: checklist.mobilityCompleted,
      workoutCompleted: checklist.workoutCompleted || !!todayWorkout,
      completionScore: [
        checklist.stepsCompleted,
        checklist.waterCompleted,
        checklist.sleepCompleted,
        checklist.mobilityCompleted,
        checklist.workoutCompleted || !!todayWorkout
      ].filter(Boolean).length / 5 * 100
    } : null

    return NextResponse.json({
      success: true,
      data: {
        // Coach Plan Info
        plan: {
          currentDay: coachPlan.currentDay,
          dayName: currentDay.dayName,
          muscleGroups: currentDay.muscleGroups,
          estimatedDuration: currentDay.estimatedDuration,
          exercises: currentDay.exercises,
          warmup: currentDay.warmup,
          deloadMode: coachPlan.deloadMode
        },
        
        // Recovery Status
        recovery: {
          overallRecovery,
          readyToTrain,
          musclesNeedingRest,
          targetMuscleStatuses: targetRecoveryStatuses,
          allMuscleStatuses: recoveryStatuses,
          suggestedMuscles
        },
        
        // Progressive Overload
        progression: {
          suggestions: relevantProgressions,
          readyToProgress: relevantProgressions.filter(p => p.suggestedWeight > p.currentWeight).length,
          needsDeload: relevantProgressions.filter(p => p.trend === 'declining').length
        },
        
        // Nutrition
        nutrition: {
          consumed: nutritionSummary,
          targets: {
            caloriesMin: coachPlan.caloriesMin,
            caloriesMax: coachPlan.caloriesMax,
            proteinMin: coachPlan.proteinMin,
            proteinMax: coachPlan.proteinMax
          },
          remainingCalories: Math.max(0, coachPlan.caloriesMin - nutritionSummary.calories),
          remainingProtein: Math.max(0, coachPlan.proteinMin - nutritionSummary.protein),
          caloriesProgress: Math.min(100, (nutritionSummary.calories / coachPlan.caloriesMin) * 100),
          proteinProgress: Math.min(100, (nutritionSummary.protein / coachPlan.proteinMin) * 100)
        },
        
        // Daily Checklist
        checklist: checklistCompletion ? {
          ...checklistCompletion,
          targets: {
            steps: coachPlan.stepsTarget,
            water: coachPlan.waterTarget,
            sleep: coachPlan.sleepTarget,
            mobility: coachPlan.mobilityTarget
          },
          actual: checklist
        } : null,
        
        // Workout Status
        workout: {
          hasStarted: !!todayWorkout,
          status: todayWorkout?.status,
          workoutId: todayWorkout?.id
        }
      }
    })
  } catch (error) {
    console.error('Get today brief error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get today\'s brief' },
      { status: 500 }
    )
  }
}
