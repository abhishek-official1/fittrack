'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Dumbbell, Filter, Trash2, Edit } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/useToast'
import { muscleGroups, exerciseCategories, equipmentTypes } from '@/lib/utils'
import type { Exercise, User } from '@/types'

export default function ExercisesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterMuscle, setFilterMuscle] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [newExercise, setNewExercise] = useState({
    name: '',
    description: '',
    muscleGroup: '',
    category: '',
    equipment: '',
    instructions: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, exercisesRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/exercises')
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
      } catch (error) {
        console.error('Failed to fetch data:', error)
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleCreate = async () => {
    if (!newExercise.name || !newExercise.muscleGroup || !newExercise.category) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' })
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExercise)
      })

      const data = await res.json()

      if (data.success) {
        setExercises([...exercises, data.data])
        setShowCreateDialog(false)
        setNewExercise({
          name: '',
          description: '',
          muscleGroup: '',
          category: '',
          equipment: '',
          instructions: '',
        })
        toast({ title: 'Exercise created!', variant: 'success' })
      } else {
        toast({ title: data.error || 'Failed to create exercise', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Failed to create exercise', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exercise?')) return

    try {
      const res = await fetch(`/api/exercises/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        setExercises(exercises.filter(e => e.id !== id))
        toast({ title: 'Exercise deleted', variant: 'success' })
      } else {
        toast({ title: data.error || 'Failed to delete', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Failed to delete exercise', variant: 'destructive' })
    }
  }

  const filteredExercises = exercises.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase())
    const matchesMuscle = filterMuscle === 'all' || e.muscleGroup === filterMuscle
    const matchesCategory = filterCategory === 'all' || e.category === filterCategory
    return matchesSearch && matchesMuscle && matchesCategory
  })

  const groupedExercises = filteredExercises.reduce((acc, exercise) => {
    const group = exercise.muscleGroup
    if (!acc[group]) acc[group] = []
    acc[group].push(exercise)
    return acc
  }, {} as Record<string, Exercise[]>)

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 py-8">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Exercise Library</h1>
            <p className="text-muted-foreground mt-1">
              Browse and manage your exercises
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Custom Exercise</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  label="Exercise Name *"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  placeholder="e.g., Barbell Squat"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={newExercise.muscleGroup}
                    onValueChange={(v) => setNewExercise({ ...newExercise, muscleGroup: v })}
                  >
                    <SelectTrigger label="Muscle Group *">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {muscleGroups.map((mg) => (
                        <SelectItem key={mg} value={mg} className="capitalize">
                          {mg.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={newExercise.category}
                    onValueChange={(v) => setNewExercise({ ...newExercise, category: v })}
                  >
                    <SelectTrigger label="Category *">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {exerciseCategories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="capitalize">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Select
                  value={newExercise.equipment}
                  onValueChange={(v) => setNewExercise({ ...newExercise, equipment: v })}
                >
                  <SelectTrigger label="Equipment">
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentTypes.map((eq) => (
                      <SelectItem key={eq} value={eq} className="capitalize">
                        {eq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  label="Description"
                  value={newExercise.description}
                  onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                  placeholder="Brief description of the exercise"
                />
                <Textarea
                  label="Instructions"
                  value={newExercise.instructions}
                  onChange={(e) => setNewExercise({ ...newExercise, instructions: e.target.value })}
                  placeholder="Step-by-step instructions..."
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} loading={isSaving}>
                  Create Exercise
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exercises..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterMuscle} onValueChange={setFilterMuscle}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Muscles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Muscles</SelectItem>
                  {muscleGroups.map((mg) => (
                    <SelectItem key={mg} value={mg} className="capitalize">
                      {mg.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {exerciseCategories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Exercise List */}
        {filteredExercises.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Dumbbell className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No exercises found</h3>
              <p className="text-muted-foreground mb-6 text-center">
                {search || filterMuscle !== 'all' || filterCategory !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first custom exercise'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedExercises).map(([muscleGroup, groupExercises]) => (
              <div key={muscleGroup}>
                <h2 className="text-lg font-semibold mb-4 capitalize">
                  {muscleGroup.replace('_', ' ')}
                  <span className="text-muted-foreground ml-2 text-sm font-normal">
                    ({groupExercises.length})
                  </span>
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {groupExercises.map((exercise) => (
                    <Card key={exercise.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Dumbbell className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{exercise.name}</h3>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="capitalize text-xs">
                                  {exercise.category}
                                </Badge>
                                {exercise.equipment && (
                                  <Badge variant="secondary" className="capitalize text-xs">
                                    {exercise.equipment}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          {exercise.isCustom && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(exercise.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        {exercise.description && (
                          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                            {exercise.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
