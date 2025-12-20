'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown, Minus, ArrowUp, Dumbbell } from 'lucide-react'

interface ProgressionSuggestion {
  exerciseId: string
  exerciseName: string
  currentWeight: number
  suggestedWeight: number
  reason: string
  confidence: 'high' | 'medium' | 'low'
  lastPerformed: string
  trend: 'improving' | 'plateau' | 'declining'
}

const TREND_ICONS = {
  improving: TrendingUp,
  plateau: Minus,
  declining: TrendingDown
}

const TREND_COLORS = {
  improving: 'text-green-500',
  plateau: 'text-yellow-500',
  declining: 'text-red-500'
}

const CONFIDENCE_STYLES = {
  high: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
}

function SuggestionItem({ suggestion }: { suggestion: ProgressionSuggestion }) {
  const TrendIcon = TREND_ICONS[suggestion.trend]
  const isProgressing = suggestion.suggestedWeight > suggestion.currentWeight
  
  return (
    <div className={`p-3 rounded-lg border ${isProgressing ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' : 'border-muted'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendIcon className={`h-4 w-4 ${TREND_COLORS[suggestion.trend]}`} />
          <div>
            <p className="font-medium">{suggestion.exerciseName}</p>
            <p className="text-xs text-muted-foreground">
              Last: {new Date(suggestion.lastPerformed).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Badge className={CONFIDENCE_STYLES[suggestion.confidence]}>
          {suggestion.confidence}
        </Badge>
      </div>
      
      <div className="mt-3 flex items-center gap-2">
        <span className="text-lg font-bold">{suggestion.currentWeight} kg</span>
        {isProgressing && (
          <>
            <ArrowUp className="h-4 w-4 text-green-500" />
            <span className="text-lg font-bold text-green-600">{suggestion.suggestedWeight} kg</span>
          </>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground mt-2">{suggestion.reason}</p>
    </div>
  )
}

export function ProgressionCard() {
  const [data, setData] = useState<{
    readyToProgress: ProgressionSuggestion[]
    needsWork: ProgressionSuggestion[]
    summary: { total: number; readyCount: number }
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProgression() {
      try {
        const res = await fetch('/api/progression')
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch progression:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgression()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progressive Overload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!data || data.summary.total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Progressive Overload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Dumbbell className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>Complete more workouts to get progression suggestions</p>
            <p className="text-sm mt-1">We need at least 2 sessions per exercise</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Progressive Overload
          </CardTitle>
          {data.summary.readyCount > 0 && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              {data.summary.readyCount} ready to progress
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.readyToProgress.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-green-600 mb-2 flex items-center gap-1">
              <ArrowUp className="h-4 w-4" />
              Ready to Increase
            </h4>
            <div className="space-y-2">
              {data.readyToProgress.slice(0, 3).map(s => (
                <SuggestionItem key={s.exerciseId} suggestion={s} />
              ))}
            </div>
          </div>
        )}

        {data.needsWork.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Keep Working
            </h4>
            <div className="space-y-2">
              {data.needsWork.slice(0, 2).map(s => (
                <SuggestionItem key={s.exerciseId} suggestion={s} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
