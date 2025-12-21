'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Dumbbell, Clock, Calendar, MoreVertical, Trash2, Edit, FileText } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate, formatDuration } from '@/lib/utils'
import { toast } from '@/hooks/useToast'
import type { Workout, User } from '@/types'

export default function WorkoutsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, workoutsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/workouts')
        ])

        const userData = await userRes.json()
        if (!userData.success) {
          router.push('/auth/login')
          return
        }
        setUser(userData.data)

        const workoutsData = await workoutsRes.json()
        if (workoutsData.success) {
          setWorkouts(workoutsData.data)
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workout?')) return

    try {
      const res = await fetch(`/api/workouts/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        setWorkouts(workouts.filter(w => w.id !== id))
        toast({ title: 'Workout deleted', variant: 'success' })
      } else {
        toast({ title: 'Failed to delete workout', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Failed to delete workout', variant: 'destructive' })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in_progress': return 'warning'
      case 'cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 py-8">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Workouts</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your training sessions
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/templates">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Templates
              </Button>
            </Link>
            <Link href="/workouts/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Workout
              </Button>
            </Link>
          </div>
        </div>

        {workouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Dumbbell className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No workouts yet</h3>
              <p className="text-muted-foreground mb-6 text-center">
                Start logging your workouts to track your progress
              </p>
              <Link href="/workouts/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Workout
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <Card key={workout.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-4">
                    <Link href={`/workouts/${workout.id}`} className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Dumbbell className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{workout.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(workout.date, 'EEEE, MMM d, yyyy')}
                            </span>
                            {workout.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDuration(workout.duration)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusColor(workout.status)}>
                        {workout.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {workout.exercises?.length || 0} exercises
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/workouts/${workout.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(workout.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {workout.exercises && workout.exercises.length > 0 && (
                    <div className="px-4 pb-4">
                      <div className="flex flex-wrap gap-2">
                        {workout.exercises.slice(0, 5).map((we) => (
                          <Badge key={we.id} variant="outline">
                            {we.exercise.name}
                          </Badge>
                        ))}
                        {workout.exercises.length > 5 && (
                          <Badge variant="outline">
                            +{workout.exercises.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
