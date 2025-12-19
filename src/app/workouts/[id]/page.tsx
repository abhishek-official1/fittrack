'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Play, 
  Pause, 
  Square, 
  Check, 
  ChevronLeft,
  Clock,
  Trophy,
  Dumbbell,
  Edit,
  Save
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/hooks/useToast'
import { useTimer } from '@/hooks/useTimer'
import { formatDate, formatWeight, formatDuration } from '@/lib/utils'
import type { Workout, User } from '@/types'

export default function WorkoutDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [restTime, setRestTime] = useState(90)
  const [activeRestExercise, setActiveRestExercise] = useState<string | null>(null)

  const workoutTimer = useTimer({ autoStart: false })
  const restTimer = useTimer({ 
    initialTime: restTime, 
    countdown: true,
    onComplete: () => {
      toast({ title: 'Rest complete!', description: 'Time for your next set' })
      setActiveRestExercise(null)
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, workoutRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch(`/api/workouts/${id}`)
        ])

        const userData = await userRes.json()
        if (!userData.success) {
          router.push('/auth/login')
          return
        }
        setUser(userData.data)

        const workoutData = await workoutRes.json()
        if (workoutData.success) {
          setWorkout(workoutData.data)
          if (workoutData.data.status === 'in_progress' && workoutData.data.startTime) {
            const elapsed = Math.floor((Date.now() - new Date(workoutData.data.startTime).getTime()) / 1000)
            workoutTimer.setTime(elapsed)
            workoutTimer.start()
          }
        } else {
          router.push('/workouts')
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        router.push('/workouts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, router])

  const startWorkout = async () => {
    try {
      const res = await fetch(`/api/workouts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in_progress' })
      })
      const data = await res.json()
      if (data.success) {
        setWorkout(data.data)
        workoutTimer.start()
        toast({ title: 'Workout started!', variant: 'success' })
      }
    } catch (error) {
      toast({ title: 'Failed to start workout', variant: 'destructive' })
    }
  }

  const completeWorkout = async () => {
    if (!workout) return

    try {
      const res = await fetch(`/api/workouts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'completed',
          exercises: workout.exercises
        })
      })
      const data = await res.json()
      if (data.success) {
        setWorkout(data.data)
        workoutTimer.pause()
        toast({ title: 'Workout completed! Great job!', variant: 'success' })
      }
    } catch (error) {
      toast({ title: 'Failed to complete workout', variant: 'destructive' })
    }
  }

  const updateSet = async (exerciseIndex: number, setIndex: number, field: string, value: number | boolean) => {
    if (!workout || !workout.exercises) return

    const updatedExercises = [...workout.exercises]
    const exercise = updatedExercises[exerciseIndex]
    if (!exercise || !exercise.sets) return
    
    const set = exercise.sets[setIndex]
    if (!set) return
    
    if (field === 'isCompleted' && value === true && !set.isCompleted) {
      setActiveRestExercise(exercise.id)
      restTimer.reset(restTime)
      restTimer.start()
    }

    (set as unknown as Record<string, unknown>)[field] = value
    setWorkout({ ...workout, exercises: updatedExercises })
  }

  const saveProgress = async () => {
    if (!workout) return
    setIsSaving(true)

    try {
      const res = await fetch(`/api/workouts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          exercises: (workout.exercises || []).map(e => ({
            id: e.id,
            order: e.order,
            notes: e.notes,
            sets: (e.sets || []).map(s => ({
              id: s.id,
              actualReps: s.actualReps,
              weight: s.weight,
              rpe: s.rpe,
              isCompleted: s.isCompleted,
              notes: s.notes
            }))
          }))
        })
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: 'Progress saved', variant: 'success' })
      }
    } catch (error) {
      toast({ title: 'Failed to save progress', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const totalSets = workout?.exercises?.reduce((acc, e) => acc + (e.sets?.length || 0), 0) || 0
  const completedSets = workout?.exercises?.reduce(
    (acc, e) => acc + (e.sets?.filter(s => s.isCompleted)?.length || 0), 0
  ) || 0
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header user={user} />
        <main className="container px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64" />
        </main>
      </div>
    )
  }

  if (!workout) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Header user={user} />
      
      <main className="container px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/workouts">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{workout.name}</h1>
            <p className="text-muted-foreground">
              {formatDate(workout.date, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <Badge variant={
            workout.status === 'completed' ? 'success' :
            workout.status === 'in_progress' ? 'warning' : 'secondary'
          }>
            {workout.status.replace('_', ' ')}
          </Badge>
        </div>

        {/* Timer and Progress */}
        {workout.status !== 'completed' && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-3xl font-mono font-bold">{workoutTimer.formattedTime}</p>
                  </div>
                  {activeRestExercise && (
                    <div className="text-center border-l pl-4">
                      <p className="text-sm text-muted-foreground">Rest</p>
                      <p className="text-3xl font-mono font-bold text-primary">
                        {restTimer.formattedTime}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-2 sm:items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {completedSets}/{totalSets} sets
                    </span>
                    <span className="text-sm font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-32" />
                </div>

                <div className="flex gap-2">
                  {workout.status === 'planned' && (
                    <Button onClick={startWorkout}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Workout
                    </Button>
                  )}
                  {workout.status === 'in_progress' && (
                    <>
                      <Button variant="outline" onClick={saveProgress} loading={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={completeWorkout} variant="success">
                        <Check className="h-4 w-4 mr-2" />
                        Complete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workout Summary for completed */}
        {workout.status === 'completed' && (
          <Card className="mb-6 bg-success/5 border-success/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Workout Complete!</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {workout.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(workout.duration)}
                      </span>
                    )}
                    <span>{workout.exercises.length} exercises</span>
                    <span>{totalSets} sets</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exercises */}
        <div className="space-y-4">
          {(workout.exercises || []).map((we, exerciseIndex) => (
            <Card key={we.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{we.exercise.name}</CardTitle>
                      <p className="text-sm text-muted-foreground capitalize">
                        {we.exercise.muscleGroup}
                      </p>
                    </div>
                  </div>
                  {activeRestExercise === we.id && (
                    <Badge variant="warning" className="rest-timer-active">
                      Rest: {restTimer.formattedTime}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-6 gap-2 text-sm font-medium text-muted-foreground px-2">
                    <span>Set</span>
                    <span>Target</span>
                    <span>Reps</span>
                    <span>Weight</span>
                    <span>RPE</span>
                    <span></span>
                  </div>
                  {(we.sets || []).map((set, setIndex) => (
                    <div 
                      key={set.id} 
                      className={`grid grid-cols-6 gap-2 items-center p-2 rounded ${
                        set.isCompleted ? 'bg-success/10' : ''
                      } ${set.isPR ? 'ring-2 ring-success' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{set.setNumber}</span>
                        {set.isPR && <Trophy className="h-4 w-4 text-success" />}
                      </div>
                      <span className="text-muted-foreground">{set.targetReps || '-'}</span>
                      <Input
                        type="number"
                        value={set.actualReps || ''}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'actualReps', parseInt(e.target.value) || 0)}
                        className="h-8"
                        disabled={workout.status === 'completed'}
                      />
                      <Input
                        type="number"
                        value={set.weight || ''}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                        className="h-8"
                        disabled={workout.status === 'completed'}
                      />
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={set.rpe || ''}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'rpe', parseInt(e.target.value) || 0)}
                        className="h-8"
                        disabled={workout.status === 'completed'}
                      />
                      <Button
                        variant={set.isCompleted ? 'success' : 'outline'}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateSet(exerciseIndex, setIndex, 'isCompleted', !set.isCompleted)}
                        disabled={workout.status === 'completed'}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {workout.notes && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{workout.notes}</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
