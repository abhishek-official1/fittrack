'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Search, Dumbbell, ChevronDown, Save } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/useToast'
import { format } from 'date-fns'
import type { Exercise, User, WorkoutTemplate } from '@/types'

interface WorkoutExercise {
  id: string
  exerciseId: string
  exercise: Exercise
  order: number
  notes?: string
  sets: Array<{
    id: string
    setNumber: number
    setType: string
    targetReps?: number
    weight?: number
    restTime?: number
  }>
}

export default function NewWorkoutPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [exerciseSearch, setExerciseSearch] = useState('')
  const [showExerciseDialog, setShowExerciseDialog] = useState(false)

  const [workoutData, setWorkoutData] = useState({
    name: `Workout - ${format(new Date(), 'MMM d')}`,
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    templateId: '',
  })

  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, exercisesRes, templatesRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/exercises'),
          fetch('/api/templates')
        ])

        const userData = await userRes.json()
        if (!userData.success) {
          router.push('/auth/login')
          return
        }
        setUser(userData.data)

        const exercisesData = await exercisesRes.json()
        if (exercisesData.success) {
          setExercises(exercisesData.data)
        }

        const templatesData = await templatesRes.json()
        if (templatesData.success) {
          setTemplates(templatesData.data)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const loadTemplate = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (!template) return

    setWorkoutData(prev => ({
      ...prev,
      name: template.name,
      templateId
    }))

    const newExercises: WorkoutExercise[] = template.exercises.map((te, index) => ({
      id: crypto.randomUUID(),
      exerciseId: te.exerciseId,
      exercise: te.exercise,
      order: index,
      notes: te.notes || '',
      sets: Array.from({ length: te.sets }, (_, i) => ({
        id: crypto.randomUUID(),
        setNumber: i + 1,
        setType: 'working',
        targetReps: te.targetReps ? parseInt(te.targetReps.split('-')[0]) : undefined,
        weight: te.targetWeight || undefined,
        restTime: te.restTime || 90
      }))
    }))

    setWorkoutExercises(newExercises)
  }

  const addExercise = (exercise: Exercise) => {
    const newExercise: WorkoutExercise = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      exercise,
      order: workoutExercises.length,
      notes: '',
      sets: [
        { id: crypto.randomUUID(), setNumber: 1, setType: 'working', targetReps: 10, restTime: 90 }
      ]
    }
    setWorkoutExercises([...workoutExercises, newExercise])
    setShowExerciseDialog(false)
    setExerciseSearch('')
  }

  const removeExercise = (id: string) => {
    setWorkoutExercises(workoutExercises.filter(e => e.id !== id))
  }

  const addSet = (exerciseId: string) => {
    setWorkoutExercises(workoutExercises.map(e => {
      if (e.id === exerciseId) {
        const lastSet = e.sets[e.sets.length - 1]
        return {
          ...e,
          sets: [
            ...e.sets,
            {
              id: crypto.randomUUID(),
              setNumber: e.sets.length + 1,
              setType: 'working',
              targetReps: lastSet?.targetReps || 10,
              weight: lastSet?.weight,
              restTime: lastSet?.restTime || 90
            }
          ]
        }
      }
      return e
    }))
  }

  const removeSet = (exerciseId: string, setId: string) => {
    setWorkoutExercises(workoutExercises.map(e => {
      if (e.id === exerciseId) {
        const newSets = e.sets.filter(s => s.id !== setId)
          .map((s, i) => ({ ...s, setNumber: i + 1 }))
        return { ...e, sets: newSets }
      }
      return e
    }))
  }

  const updateSet = (exerciseId: string, setId: string, field: string, value: number | string) => {
    setWorkoutExercises(workoutExercises.map(e => {
      if (e.id === exerciseId) {
        return {
          ...e,
          sets: e.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
        }
      }
      return e
    }))
  }

  const handleSave = async () => {
    if (workoutExercises.length === 0) {
      toast({ title: 'Add at least one exercise', variant: 'destructive' })
      return
    }

    setIsSaving(true)

    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...workoutData,
          exercises: workoutExercises.map(e => ({
            exerciseId: e.exerciseId,
            order: e.order,
            notes: e.notes,
            sets: e.sets
          }))
        })
      })

      const data = await res.json()

      if (data.success) {
        toast({ title: 'Workout created!', variant: 'success' })
        router.push(`/workouts/${data.data.id}`)
      } else {
        toast({ title: data.error || 'Failed to create workout', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Failed to create workout', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const filteredExercises = exercises.filter(e =>
    e.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
    e.muscleGroup.toLowerCase().includes(exerciseSearch.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header user={user} />
        <main className="container px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header user={user} />
      
      <main className="container px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">New Workout</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              Save Workout
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Workout Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Workout Name"
                  value={workoutData.name}
                  onChange={(e) => setWorkoutData({ ...workoutData, name: e.target.value })}
                />
                <Input
                  label="Date"
                  type="date"
                  value={workoutData.date}
                  onChange={(e) => setWorkoutData({ ...workoutData, date: e.target.value })}
                />
              </div>

              {templates.length > 0 && (
                <Select onValueChange={loadTemplate}>
                  <SelectTrigger label="Load from Template">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Textarea
                label="Notes (optional)"
                placeholder="Add notes about this workout..."
                value={workoutData.notes}
                onChange={(e) => setWorkoutData({ ...workoutData, notes: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* Exercises */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Exercises</CardTitle>
              <Dialog open={showExerciseDialog} onOpenChange={setShowExerciseDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exercise
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add Exercise</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search exercises..."
                        value={exerciseSearch}
                        onChange={(e) => setExerciseSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="max-h-[400px] overflow-y-auto space-y-2">
                      {filteredExercises.map((exercise) => (
                        <button
                          key={exercise.id}
                          onClick={() => addExercise(exercise)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted text-left transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Dumbbell className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{exercise.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {exercise.muscleGroup} • {exercise.category}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {workoutExercises.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No exercises added yet</p>
                  <p className="text-sm">Click &quot;Add Exercise&quot; to get started</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {workoutExercises.map((we, index) => (
                    <div key={we.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-muted-foreground">
                            {index + 1}
                          </span>
                          <div>
                            <h3 className="font-semibold">{we.exercise.name}</h3>
                            <p className="text-sm text-muted-foreground capitalize">
                              {we.exercise.muscleGroup}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExercise(we.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-5 gap-2 text-sm font-medium text-muted-foreground px-2">
                          <span>Set</span>
                          <span>Type</span>
                          <span>Reps</span>
                          <span>Weight</span>
                          <span></span>
                        </div>
                        {we.sets.map((set) => (
                          <div key={set.id} className="grid grid-cols-5 gap-2 items-center">
                            <span className="text-center font-medium">{set.setNumber}</span>
                            <Select
                              value={set.setType}
                              onValueChange={(v) => updateSet(we.id, set.id, 'setType', v)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="warmup">Warmup</SelectItem>
                                <SelectItem value="working">Working</SelectItem>
                                <SelectItem value="dropset">Drop Set</SelectItem>
                                <SelectItem value="failure">To Failure</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              value={set.targetReps || ''}
                              onChange={(e) => updateSet(we.id, set.id, 'targetReps', parseInt(e.target.value) || 0)}
                              className="h-9"
                              placeholder="Reps"
                            />
                            <Input
                              type="number"
                              value={set.weight || ''}
                              onChange={(e) => updateSet(we.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                              className="h-9"
                              placeholder="kg"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSet(we.id, set.id)}
                              disabled={we.sets.length === 1}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addSet(we.id)}
                          className="w-full mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Set
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
