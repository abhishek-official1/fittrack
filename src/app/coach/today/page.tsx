'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Dumbbell, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Flame,
  Droplet,
  Moon,
  Activity,
  Apple,
  ChevronRight,
  Info
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface TodayData {
  plan: {
    currentDay: number
    dayName: string
    muscleGroups: string[]
    estimatedDuration: number
    exercises: any[]
    warmup: any
    deloadMode: boolean
  }
  recovery: {
    overallRecovery: number
    readyToTrain: boolean
    musclesNeedingRest: string[]
    targetMuscleStatuses: any[]
  }
  progression: {
    suggestions: any[]
    readyToProgress: number
    needsDeload: number
  }
  nutrition: {
    consumed: {
      calories: number
      protein: number
    }
    targets: {
      caloriesMin: number
      caloriesMax: number
      proteinMin: number
      proteinMax: number
    }
    remainingCalories: number
    remainingProtein: number
    caloriesProgress: number
    proteinProgress: number
  }
  checklist: {
    stepsCompleted: boolean
    waterCompleted: boolean
    sleepCompleted: boolean
    mobilityCompleted: boolean
    workoutCompleted: boolean
    completionScore: number
    targets: any
  } | null
  workout: {
    hasStarted: boolean
    status?: string
    workoutId?: string
  }
}

export default function TodayPage() {
  const router = useRouter()
  const [data, setData] = useState<TodayData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTodayData()
  }, [])

  const fetchTodayData = async () => {
    try {
      const res = await fetch('/api/coach-plan/today')
      const result = await res.json()
      
      if (!result.success) {
        if (result.message === 'No active coach plan') {
          router.push('/coach/setup')
          return
        }
        throw new Error(result.error || 'Failed to load today\'s plan')
      }
      
      setData(result.data)
    } catch (err) {
      console.error('Error fetching today data:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartWorkout = async () => {
    if (!data) return

    // Create workout from today's plan
    const exercises = data.plan.exercises.map((ex: any, index: number) => ({
      exerciseId: ex.exerciseId,
      order: index + 1,
      sets: Array.from({ length: ex.sets }, (_, i) => ({
        setNumber: i + 1,
        setType: i === 0 ? 'warmup' : 'working',
        targetReps: parseInt(ex.repsRange.split('-')[1] || ex.repsRange),
        rpe: ex.targetRPE ? parseInt(ex.targetRPE.split('-')[1] || ex.targetRPE) : 7
      }))
    }))

    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${data.plan.dayName} - ${new Date().toLocaleDateString()}`,
          date: new Date().toISOString(),
          status: 'in_progress',
          exercises
        })
      })

      const result = await res.json()
      if (result.success) {
        router.push(`/workouts/${result.data.id}`)
      }
    } catch (err) {
      console.error('Error starting workout:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 py-8 max-w-4xl">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 py-8 max-w-4xl">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error || 'Failed to load today\'s plan'}</p>
              <Button onClick={() => router.push('/coach/plan')} className="mt-4">
                View Coach Plan
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const { plan, recovery, progression, nutrition, checklist, workout } = data

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 py-8 max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Flame className="h-4 w-4" />
            <span>Day {plan.currentDay} of 6</span>
          </div>
          <h1 className="text-4xl font-bold">{plan.dayName}</h1>
          <p className="text-muted-foreground mt-1">
            {plan.muscleGroups.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ')} • {plan.estimatedDuration} min
          </p>
        </div>

        {/* Recovery Status Card */}
        <Card className={cn(
          recovery.readyToTrain ? 'border-green-500/50' : 'border-yellow-500/50'
        )}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recovery Status
              </CardTitle>
              <Badge variant={recovery.readyToTrain ? 'default' : 'secondary'}>
                {recovery.overallRecovery}% Recovered
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={recovery.overallRecovery} className="h-2" />
              
              {recovery.readyToTrain ? (
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-500">Good to go!</p>
                    <p className="text-muted-foreground">All target muscles are recovered and ready to train.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-500">Consider lighter training</p>
                    <p className="text-muted-foreground">
                      The following muscles need more rest: {recovery.musclesNeedingRest.join(', ')}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      You can still train, but consider reducing volume or intensity.
                    </p>
                  </div>
                </div>
              )}
              
              {plan.deloadMode && (
                <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg text-sm">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-500">Deload Week Active</p>
                    <p className="text-muted-foreground">Reduce volume by ~50% and RPE to 6-7 this week.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Start Workout CTA */}
        {!workout.hasStarted ? (
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Ready to train?</h3>
                  <p className="text-sm opacity-90">
                    {plan.exercises.length} exercises • ~{plan.estimatedDuration} minutes
                  </p>
                </div>
                <Button 
                  size="lg"
                  variant="secondary"
                  onClick={handleStartWorkout}
                  className="gap-2"
                >
                  <Play className="h-5 w-5" />
                  Start Workout
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-500/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="text-lg font-semibold">Workout {workout.status === 'completed' ? 'Completed' : 'In Progress'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {workout.status === 'completed' ? 'Great work today!' : 'Keep it up!'}
                    </p>
                  </div>
                </div>
                {workout.status === 'in_progress' && (
                  <Button asChild>
                    <Link href={`/workouts/${workout.workoutId}`}>
                      Continue <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Warm-up Protocol */}
        <Card>
          <CardHeader>
            <CardTitle>Warm-up Protocol</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">Cardio</p>
              <p className="text-sm text-muted-foreground">{plan.warmup.cardio}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Dynamic Stretches</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {plan.warmup.dynamic.map((item: string, i: number) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Ramp-up Sets</p>
              <p className="text-sm text-muted-foreground">{plan.warmup.rampSets}</p>
            </div>
          </CardContent>
        </Card>

        {/* Today's Exercises */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Exercises</CardTitle>
            <CardDescription>
              {plan.exercises.length} exercises planned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plan.exercises.map((exercise: any, index: number) => {
                const matchingProgression = progression.suggestions.find(
                  p => p.exerciseName.toLowerCase().includes(exercise.name.toLowerCase())
                )

                return (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{index + 1}. {exercise.name}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>{exercise.sets} sets</span>
                          <span>•</span>
                          <span>{exercise.repsRange} reps</span>
                          <span>•</span>
                          <span>{exercise.rest} rest</span>
                          <span>•</span>
                          <span>RPE {exercise.targetRPE}</span>
                        </div>
                      </div>
                      {matchingProgression && (
                        <Badge variant="secondary" className="gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {matchingProgression.suggestedWeight > matchingProgression.currentWeight 
                            ? 'Ready to Progress'
                            : matchingProgression.trend === 'declining'
                            ? 'Consider Deload'
                            : 'Maintain'}
                        </Badge>
                      )}
                    </div>
                    
                    {exercise.notes && (
                      <p className="text-sm text-muted-foreground">{exercise.notes}</p>
                    )}
                    
                    {matchingProgression && (
                      <div className="flex items-center gap-2 text-sm p-2 bg-muted rounded">
                        <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          Last: {matchingProgression.currentWeight}kg → Suggested: {matchingProgression.suggestedWeight}kg
                        </span>
                      </div>
                    )}
                    
                    {exercise.substitutions && exercise.substitutions.length > 0 && (
                      <details className="text-sm">
                        <summary className="cursor-pointer text-muted-foreground">
                          Substitutions ({exercise.substitutions.length})
                        </summary>
                        <ul className="mt-2 space-y-1 pl-4">
                          {exercise.substitutions.map((sub: string, i: number) => (
                            <li key={i} className="text-muted-foreground">• {sub}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5" />
                Nutrition Today
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/nutrition">View Details</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Calories</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(nutrition.consumed.calories)} / {nutrition.targets.caloriesMin}-{nutrition.targets.caloriesMax}
                </span>
              </div>
              <Progress value={nutrition.caloriesProgress} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Protein</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(nutrition.consumed.protein)}g / {nutrition.targets.proteinMin}-{nutrition.targets.proteinMax}g
                </span>
              </div>
              <Progress value={nutrition.proteinProgress} className="h-2" />
            </div>

            {nutrition.remainingCalories > 0 && (
              <p className="text-sm text-muted-foreground">
                {Math.round(nutrition.remainingCalories)} calories and {Math.round(nutrition.remainingProtein)}g protein remaining
              </p>
            )}
          </CardContent>
        </Card>

        {/* Daily Checklist */}
        {checklist && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Daily Checklist</CardTitle>
                <Badge variant={checklist.completionScore === 100 ? 'default' : 'secondary'}>
                  {Math.round(checklist.completionScore)}% Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={cn(
                  "flex flex-col items-center p-4 rounded-lg border-2",
                  checklist.stepsCompleted ? "border-green-500 bg-green-500/10" : "border-muted"
                )}>
                  <Activity className={cn("h-6 w-6 mb-2", checklist.stepsCompleted ? "text-green-500" : "text-muted-foreground")} />
                  <p className="text-sm font-medium">Steps</p>
                  <p className="text-xs text-muted-foreground">{checklist.targets.steps}</p>
                </div>
                
                <div className={cn(
                  "flex flex-col items-center p-4 rounded-lg border-2",
                  checklist.waterCompleted ? "border-green-500 bg-green-500/10" : "border-muted"
                )}>
                  <Droplet className={cn("h-6 w-6 mb-2", checklist.waterCompleted ? "text-green-500" : "text-muted-foreground")} />
                  <p className="text-sm font-medium">Water</p>
                  <p className="text-xs text-muted-foreground">{checklist.targets.water}L</p>
                </div>
                
                <div className={cn(
                  "flex flex-col items-center p-4 rounded-lg border-2",
                  checklist.sleepCompleted ? "border-green-500 bg-green-500/10" : "border-muted"
                )}>
                  <Moon className={cn("h-6 w-6 mb-2", checklist.sleepCompleted ? "text-green-500" : "text-muted-foreground")} />
                  <p className="text-sm font-medium">Sleep</p>
                  <p className="text-xs text-muted-foreground">{checklist.targets.sleep}h</p>
                </div>
                
                <div className={cn(
                  "flex flex-col items-center p-4 rounded-lg border-2",
                  checklist.mobilityCompleted ? "border-green-500 bg-green-500/10" : "border-muted"
                )}>
                  <Dumbbell className={cn("h-6 w-6 mb-2", checklist.mobilityCompleted ? "text-green-500" : "text-muted-foreground")} />
                  <p className="text-sm font-medium">Mobility</p>
                  <p className="text-xs text-muted-foreground">{checklist.targets.mobility}min</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/coach/plan">View Full Plan</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/analytics">View Progress</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
