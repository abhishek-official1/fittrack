'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Dumbbell,
  Clock
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday
} from 'date-fns'
import { cn, formatDuration } from '@/lib/utils'
import type { Workout, User } from '@/types'

export default function CalendarPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const monthStart = startOfMonth(currentMonth)
        const monthEnd = endOfMonth(currentMonth)

        const [userRes, workoutsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch(`/api/workouts?startDate=${monthStart.toISOString()}&endDate=${monthEnd.toISOString()}`)
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
  }, [router, currentMonth])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getWorkoutsForDate = (date: Date) => {
    return workouts.filter(w => isSameDay(new Date(w.date), date))
  }

  const selectedDateWorkouts = selectedDate ? getWorkoutsForDate(selectedDate) : []

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header user={user} />
        <main className="container px-4 py-8">
          <Skeleton className="h-96" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header user={user} />
      
      <main className="container px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Calendar</h1>
            <p className="text-muted-foreground mt-1">
              View your workout schedule
            </p>
          </div>
          <Link href="/workouts/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Workout
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {/* Week day headers */}
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((day) => {
                  const dayWorkouts = getWorkoutsForDate(day)
                  const hasWorkouts = dayWorkouts.length > 0
                  const isSelected = selectedDate && isSameDay(day, selectedDate)
                  const isCurrentMonth = isSameMonth(day, currentMonth)
                  const isCurrentDay = isToday(day)

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        'h-14 md:h-20 p-1 rounded-lg transition-colors relative',
                        isCurrentMonth ? 'bg-background' : 'bg-muted/30',
                        isSelected && 'ring-2 ring-primary',
                        !isSelected && 'hover:bg-muted',
                        isCurrentDay && 'bg-primary/10'
                      )}
                    >
                      <span
                        className={cn(
                          'text-sm',
                          !isCurrentMonth && 'text-muted-foreground',
                          isCurrentDay && 'font-bold text-primary'
                        )}
                      >
                        {format(day, 'd')}
                      </span>
                      {hasWorkouts && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {dayWorkouts.slice(0, 3).map((w, i) => (
                            <div
                              key={i}
                              className={cn(
                                'w-2 h-2 rounded-full',
                                w.status === 'completed' ? 'bg-success' :
                                w.status === 'in_progress' ? 'bg-warning' :
                                'bg-primary'
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate
                  ? format(selectedDate, 'EEEE, MMMM d')
                  : 'Select a date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                selectedDateWorkouts.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateWorkouts.map((workout) => (
                      <Link key={workout.id} href={`/workouts/${workout.id}`}>
                        <div className="p-4 rounded-lg border hover:bg-muted transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{workout.name}</h3>
                            <Badge
                              variant={
                                workout.status === 'completed' ? 'success' :
                                workout.status === 'in_progress' ? 'warning' :
                                'secondary'
                              }
                            >
                              {workout.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Dumbbell className="h-4 w-4" />
                              {workout.exercises?.length || 0} exercises
                            </span>
                            {workout.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDuration(workout.duration)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No workouts on this day</p>
                    <Link href={`/workouts/new?date=${format(selectedDate, 'yyyy-MM-dd')}`}>
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Workout
                      </Button>
                    </Link>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Click on a date to see workouts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Planned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span>Completed</span>
          </div>
        </div>
      </main>
    </div>
  )
}
