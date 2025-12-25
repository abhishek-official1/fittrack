'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, TrendingUp, Dumbbell, Award, Calendar, BarChart3 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/useToast'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'

interface ProgressionData {
  date: string
  workoutId: string
  workoutName: string
  maxWeight: number
  maxReps: number
  totalVolume: number
  estimated1RM: number
  sets: number
}

interface PersonalBest {
  value: number
  date?: string | null
  reps?: number | null
  weight?: number | null
}

interface ExerciseData {
  exercise: {
    id: string
    name: string
    muscleGroup: string
    category: string
    equipment?: string | null
  }
  hasData: boolean
  progressionData: ProgressionData[]
  recentSets: {
    workoutId: string
    workoutName: string
    date: Date
    sets: {
      setNumber: number
      weight: number | null
      reps: number | null
      rpe: number | null
      isPR: boolean
    }[]
  }[]
  personalBests: {
    maxWeight: PersonalBest | null
    maxReps: PersonalBest | null
    maxVolume: PersonalBest | null
    max1RM: PersonalBest | null
  }
  stats: {
    totalWorkouts: number
    totalSets: number
    totalReps: number
    totalVolume: number
    averageWeight: number
    averageReps: number
    averageVolume: number
  }
}

export default function ExerciseProgressionPage() {
  const router = useRouter()
  const params = useParams()
  const exerciseId = params?.exerciseId as string

  const [data, setData] = useState<ExerciseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch(`/api/progression/${exerciseId}`)
        const result = await res.json()

        if (!result.success) {
          if (res.status === 401) {
            router.push('/auth/login')
            return
          }
          throw new Error(result.error || 'Failed to fetch progression data')
        }

        setData(result.data)
      } catch (err) {
        console.error('Failed to fetch progression data:', err)
        const message = err instanceof Error ? err.message : 'Failed to load data'
        setError(message)
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (exerciseId) {
      fetchData()
    }
  }, [exerciseId, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-64 mb-6" />
          <Skeleton className="h-64" />
        </main>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error || 'No data available'}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (!data.hasData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{data.exercise.name}</h1>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="capitalize">
                {data.exercise.muscleGroup?.replace('_', ' ')}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {data.exercise.category}
              </Badge>
            </div>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Data Yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Complete some workouts with this exercise to see your progression
              </p>
              <Button onClick={() => router.push('/workouts/new')}>
                Start a Workout
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const { exercise, progressionData, recentSets, personalBests, stats } = data

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{exercise.name}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">
              {exercise.muscleGroup?.replace('_', ' ')}
            </Badge>
            <Badge variant="secondary" className="capitalize">
              {exercise.category}
            </Badge>
            {exercise.equipment && (
              <Badge variant="secondary" className="capitalize">
                {exercise.equipment}
              </Badge>
            )}
          </div>
        </div>

        {/* Personal Bests */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award className="h-4 w-4" />
                Max Weight
              </CardTitle>
            </CardHeader>
            <CardContent>
              {personalBests.maxWeight ? (
                <>
                  <div className="text-2xl font-bold">
                    {personalBests.maxWeight.value} kg
                  </div>
                  {personalBests.maxWeight.reps && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {personalBests.maxWeight.reps} reps
                    </p>
                  )}
                  {personalBests.maxWeight.date && (
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(personalBests.maxWeight.date), 'MMM d, yyyy')}
                    </p>
                  )}
                </>
              ) : (
                <div className="text-2xl font-bold text-muted-foreground">-</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Max Reps
              </CardTitle>
            </CardHeader>
            <CardContent>
              {personalBests.maxReps ? (
                <>
                  <div className="text-2xl font-bold">
                    {personalBests.maxReps.value}
                  </div>
                  {personalBests.maxReps.weight && (
                    <p className="text-xs text-muted-foreground mt-1">
                      @ {personalBests.maxReps.weight} kg
                    </p>
                  )}
                  {personalBests.maxReps.date && (
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(personalBests.maxReps.date), 'MMM d, yyyy')}
                    </p>
                  )}
                </>
              ) : (
                <div className="text-2xl font-bold text-muted-foreground">-</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                Max Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              {personalBests.maxVolume ? (
                <>
                  <div className="text-2xl font-bold">
                    {personalBests.maxVolume.value.toLocaleString()} kg
                  </div>
                  {personalBests.maxVolume.date && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(personalBests.maxVolume.date), 'MMM d, yyyy')}
                    </p>
                  )}
                </>
              ) : (
                <div className="text-2xl font-bold text-muted-foreground">-</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award className="h-4 w-4" />
                Est. 1RM
              </CardTitle>
            </CardHeader>
            <CardContent>
              {personalBests.max1RM ? (
                <>
                  <div className="text-2xl font-bold">
                    {personalBests.max1RM.value} kg
                  </div>
                  {personalBests.max1RM.date && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(personalBests.max1RM.date), 'MMM d, yyyy')}
                    </p>
                  )}
                </>
              ) : (
                <div className="text-2xl font-bold text-muted-foreground">-</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* Weight Progression Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weight Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), 'MMM d')}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip
                    labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="maxWeight"
                    name="Max Weight (kg)"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="estimated1RM"
                    name="Est. 1RM (kg)"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Volume Progression Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Volume Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), 'MMM d')}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip
                    labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="totalVolume"
                    name="Total Volume (kg)"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Overall Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Overall Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Workouts</p>
                <p className="text-2xl font-bold">{stats.totalWorkouts}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sets</p>
                <p className="text-2xl font-bold">{stats.totalSets}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reps</p>
                <p className="text-2xl font-bold">{stats.totalReps}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold">{stats.totalVolume.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Weight</p>
                <p className="text-2xl font-bold">{stats.averageWeight}</p>
                <p className="text-xs text-muted-foreground">kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Reps</p>
                <p className="text-2xl font-bold">{stats.averageReps}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Volume</p>
                <p className="text-2xl font-bold">{stats.averageVolume.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">kg/workout</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Workouts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSets.map((workout) => (
                <div
                  key={workout.workoutId}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/workouts/${workout.workoutId}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{workout.workoutName}</h4>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(workout.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {workout.sets.map((set) => (
                      <div
                        key={set.setNumber}
                        className={`text-center p-2 rounded ${
                          set.isPR ? 'bg-yellow-500/10 border border-yellow-500' : 'bg-muted'
                        }`}
                      >
                        <p className="text-xs text-muted-foreground mb-1">
                          Set {set.setNumber}
                        </p>
                        <p className="font-semibold text-sm">
                          {set.weight ? `${set.weight} kg` : '-'}
                        </p>
                        <p className="text-xs">
                          {set.reps ? `${set.reps} reps` : '-'}
                        </p>
                        {set.rpe && (
                          <p className="text-xs text-muted-foreground">
                            RPE {set.rpe}
                          </p>
                        )}
                        {set.isPR && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            PR
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
