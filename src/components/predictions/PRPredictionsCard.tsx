'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Target, 
  TrendingUp, 
  TrendingDown,
  Minus,
  ChevronRight,
  Zap,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { formatWeight } from '@/lib/utils'

interface Prediction {
  exerciseId: string
  exerciseName: string
  muscleGroup: string
  currentMax: number
  predictedMax: number
  suggestedWeight: number
  confidence: number
  trend: 'improving' | 'plateau' | 'declining'
  readyForPR: boolean
  currentPR: number | null
  dataPoints: number
}

const trendIcons = {
  improving: TrendingUp,
  plateau: Minus,
  declining: TrendingDown
}

const trendColors = {
  improving: 'text-green-500',
  plateau: 'text-yellow-500',
  declining: 'text-red-500'
}

export function PRPredictionsCard() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await fetch('/api/pr-predictions')
        const data = await res.json()
        if (data.predictions) {
          setPredictions(data.predictions)
        }
      } catch (error) {
        console.error('Failed to fetch predictions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPredictions()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const readyForPR = predictions.filter(p => p.readyForPR)
  const improving = predictions.filter(p => p.trend === 'improving' && !p.readyForPR)

  if (predictions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            PR Predictions
          </CardTitle>
          <CardDescription>Track your progress towards new PRs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Not enough data yet</p>
            <p className="text-sm mt-2">Complete more workouts to see predictions</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              PR Predictions
            </CardTitle>
            <CardDescription>AI-powered progress analysis</CardDescription>
          </div>
          {readyForPR.length > 0 && (
            <Badge variant="success" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {readyForPR.length} Ready!
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Ready for PR Section */}
        {readyForPR.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Ready for PR Today
            </h4>
            <div className="space-y-3">
              {readyForPR.slice(0, 3).map(pred => {
                const TrendIcon = trendIcons[pred.trend]
                return (
                  <div 
                    key={pred.exerciseId}
                    className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">{pred.exerciseName}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {pred.muscleGroup}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-500">
                          {formatWeight(pred.suggestedWeight, 'metric')}
                        </p>
                        <p className="text-xs text-muted-foreground">Suggested attempt</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Current: {formatWeight(pred.currentMax, 'metric')} → Predicted: {formatWeight(pred.predictedMax, 'metric')}
                      </span>
                      <span className="flex items-center gap-1 text-green-500">
                        <TrendIcon className="h-4 w-4" />
                        {Math.round(pred.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Improving Lifts */}
        {improving.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3">Progressing Well</h4>
            <div className="space-y-3">
              {improving.slice(0, 3).map(pred => {
                const TrendIcon = trendIcons[pred.trend]
                return (
                  <div key={pred.exerciseId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendIcon className={`h-5 w-5 ${trendColors[pred.trend]}`} />
                      <div>
                        <p className="font-medium">{pred.exerciseName}</p>
                        <p className="text-xs text-muted-foreground">
                          Est. 1RM: {formatWeight(pred.currentMax, 'metric')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Progress value={pred.confidence * 100} className="w-16 h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {pred.dataPoints} sessions
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Plateau/Declining */}
        {predictions.filter(p => p.trend !== 'improving').length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Needs Attention</h4>
            <div className="flex flex-wrap gap-2">
              {predictions
                .filter(p => p.trend !== 'improving')
                .slice(0, 4)
                .map(pred => {
                  const TrendIcon = trendIcons[pred.trend]
                  return (
                    <Badge 
                      key={pred.exerciseId} 
                      variant="outline" 
                      className="flex items-center gap-1"
                    >
                      <TrendIcon className={`h-3 w-3 ${trendColors[pred.trend]}`} />
                      {pred.exerciseName}
                    </Badge>
                  )
                })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
