import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getMuscleRecoveryStatus, getSuggestedMuscles } from '@/lib/recovery'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const muscleStatuses = await getMuscleRecoveryStatus(session.userId)
    const suggestedMuscles = getSuggestedMuscles(muscleStatuses)

    // Calculate overall recovery score
    const overallRecovery = Math.round(
      muscleStatuses.reduce((acc, s) => acc + s.recoveryPercent, 0) / muscleStatuses.length
    )

    return NextResponse.json({
      success: true,
      data: {
        muscles: muscleStatuses,
        suggestedMuscles,
        overallRecovery,
        readyCount: muscleStatuses.filter(s => s.readyToTrain).length,
        totalMuscles: muscleStatuses.length
      }
    })
  } catch (error) {
    console.error('Get recovery status error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get recovery status' },
      { status: 500 }
    )
  }
}
