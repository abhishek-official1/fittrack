'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

interface MuscleStatus {
  muscleGroup: string
  lastTrained: string | null
  totalSets: number
  recoveryPercent: number
  hoursRemaining: number
  status: 'recovered' | 'recovering' | 'fatigued'
  readyToTrain: boolean
}

interface RecoveryData {
  muscles: MuscleStatus[]
  suggestedMuscles: string[]
  overallRecovery: number
  readyCount: number
  totalMuscles: number
}

const STATUS_STYLES = {
  recovered: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
    icon: CheckCircle
  },
  recovering: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-600 dark:text-yellow-400',
    icon: Clock
  },
  fatigued: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-600 dark:text-red-400',
    icon: AlertTriangle
  }
}

const MUSCLE_LABELS: Record<string, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  legs: 'Legs',
  core: 'Core'
}

function MuscleBar({ muscle }: { muscle: MuscleStatus }) {
  const style = STATUS_STYLES[muscle.status]
  const Icon = style.icon

  return (
    <div className={`p-3 rounded-lg ${style.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${style.text}`} />
          <span className="font-medium">{MUSCLE_LABELS[muscle.muscleGroup]}</span>
        </div>
        <div className="flex items-center gap-2">
          {muscle.readyToTrain ? (
            <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
              Ready
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">
              {muscle.hoursRemaining}h left
            </span>
          )}
        </div>
      </div>
      <Progress 
        value={muscle.recoveryPercent} 
        className="h-2"
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">
          {muscle.lastTrained 
            ? `${muscle.totalSets} sets` 
            : 'Not trained yet'}
        </span>
        <span className={`text-xs font-medium ${style.text}`}>
          {muscle.recoveryPercent}%
        </span>
      </div>
    </div>
  )
}

export function MuscleRecoveryCard() {
  const [data, setData] = useState<RecoveryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRecovery() {
      try {
        const res = await fetch('/api/recovery')
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch recovery:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecovery()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Muscle Recovery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  // Sort: Fatigued first, then recovering, then recovered
  const sortedMuscles = [...data.muscles].sort((a, b) => a.recoveryPercent - b.recoveryPercent)
  
  // Show only top 3 relevant muscles (fatigued/recovering) or just the first 3 if mostly recovered
  const displayedMuscles = sortedMuscles.slice(0, 3)
  const remainingCount = Math.max(0, data.muscles.length - 3)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Muscle Recovery
          </CardTitle>
          <Badge variant={data.overallRecovery > 80 ? "success" : "secondary"}>
            {data.overallRecovery}% Overall
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
        {/* Suggested Section - Highlight this first */}
        {data.suggestedMuscles.length > 0 ? (
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
            <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">Ready to Train</p>
            <div className="flex flex-wrap gap-2">
              {data.suggestedMuscles.slice(0, 3).map(muscle => (
                <Badge key={muscle} className="capitalize bg-background text-foreground hover:bg-background/80 border-primary/20">
                  {MUSCLE_LABELS[muscle]}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium">All muscles fully recovered!</p>
          </div>
        )}

        {/* Fatigue Status - Only show if there's fatigue */}
        <div className="space-y-2">
          <p className="text-xs font-muted-foreground text-muted-foreground uppercase tracking-wider">Recovery Status</p>
          {displayedMuscles.map(muscle => (
            <MuscleBar key={muscle.muscleGroup} muscle={muscle} />
          ))}
          
          {remainingCount > 0 && (
            <p className="text-xs text-center text-muted-foreground pt-1">
              + {remainingCount} other muscle groups
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
