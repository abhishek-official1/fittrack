import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getAllProgressionSuggestions } from '@/lib/progressive-overload'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const suggestions = await getAllProgressionSuggestions(session.userId)

    // Separate into categories
    const readyToProgress = suggestions.filter(s => s.suggestedWeight > s.currentWeight)
    const needsWork = suggestions.filter(s => s.suggestedWeight <= s.currentWeight)

    return NextResponse.json({
      success: true,
      data: {
        suggestions,
        readyToProgress,
        needsWork,
        summary: {
          total: suggestions.length,
          readyCount: readyToProgress.length,
          plateauCount: needsWork.filter(s => s.trend === 'plateau').length
        }
      }
    })
  } catch (error) {
    console.error('Get progression suggestions error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get progression suggestions' },
      { status: 500 }
    )
  }
}
