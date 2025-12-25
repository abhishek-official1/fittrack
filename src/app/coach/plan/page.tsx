'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Dumbbell, Settings, Calendar, ChevronRight, Info, AlertCircle } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ReminderSystem } from '@/components/reminders/ReminderSystem'
import { cn } from '@/lib/utils'

interface CoachPlan {
  id: string
  currentDay: number
  deloadMode: boolean
  rotationMode: string
  caloriesMin: number
  caloriesMax: number
  proteinMin: number
  proteinMax: number
  stepsTarget: number
  waterTarget: number
  sleepTarget: number
  mobilityTarget: number
  reminderEnabled: boolean
  reminderTime: string
  days: Array<{
    dayNumber: number
    dayName: string
    muscleGroups: string[]
    estimatedDuration: number
    exercises: any[]
    warmup: any
  }>
}

export default function CoachPlanPage() {
  const router = useRouter()
  const [plan, setPlan] = useState<CoachPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [settings, setSettings] = useState({
    caloriesMin: 2300,
    caloriesMax: 2400,
    proteinMin: 160,
    proteinMax: 190,
    stepsTarget: 9000,
    waterTarget: 3.0,
    sleepTarget: 7.5,
    mobilityTarget: 10,
    reminderEnabled: true,
    reminderTime: '19:00',
    deloadMode: false
  })

  useEffect(() => {
    fetchPlan()
  }, [])

  const fetchPlan = async () => {
    try {
      const res = await fetch('/api/coach-plan')
      const result = await res.json()
      if (result.success && result.data) {
        setPlan(result.data)
        setSettings({
          caloriesMin: result.data.caloriesMin,
          caloriesMax: result.data.caloriesMax,
          proteinMin: result.data.proteinMin,
          proteinMax: result.data.proteinMax,
          stepsTarget: result.data.stepsTarget,
          waterTarget: result.data.waterTarget,
          sleepTarget: result.data.sleepTarget,
          mobilityTarget: result.data.mobilityTarget,
          reminderEnabled: result.data.reminderEnabled,
          reminderTime: result.data.reminderTime,
          deloadMode: result.data.deloadMode
        })
      } else {
        router.push('/coach/setup')
      }
    } catch (err) {
      console.error('Error fetching plan:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/coach-plan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        await fetchPlan()
        setIsSettingsOpen(false)
      }
    } catch (err) {
      console.error('Error saving settings:', err)
    }
  }

  const handleAdvanceDay = async () => {
    if (!plan) return
    const nextDay = plan.currentDay >= 6 ? 1 : plan.currentDay + 1
    
    try {
      const res = await fetch('/api/coach-plan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentDay: nextDay })
      })
      if (res.ok) {
        await fetchPlan()
      }
    } catch (err) {
      console.error('Error advancing day:', err)
    }
  }

  const handleScheduleWorkouts = async () => {
    setIsScheduling(true)
    // TODO: Implement scheduling logic
    // This would create planned workouts for the next 4-8 weeks
    alert('Scheduling feature coming soon! For now, workouts are created on-demand via the "Start Workout" button on the Today page.')
    setIsScheduling(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 py-8 max-w-6xl">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 py-8 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>No Coach Plan Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">You don't have an active coach plan yet.</p>
              <Button asChild>
                <Link href="/coach/setup">Set Up Coach Plan</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 py-8 max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">6-Day PPL Coach Plan</h1>
            <p className="text-muted-foreground mt-1">
              Your personalized push/pull/legs training program
            </p>
          </div>
          <div className="flex gap-3">
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Coach Plan Settings</DialogTitle>
                  <DialogDescription>
                    Adjust your targets and preferences
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div>
                    <h4 className="font-medium mb-3">Nutrition Targets</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Calories Min</Label>
                        <Input
                          type="number"
                          value={settings.caloriesMin}
                          onChange={(e) => setSettings({ ...settings, caloriesMin: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Calories Max</Label>
                        <Input
                          type="number"
                          value={settings.caloriesMax}
                          onChange={(e) => setSettings({ ...settings, caloriesMax: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Protein Min (g)</Label>
                        <Input
                          type="number"
                          value={settings.proteinMin}
                          onChange={(e) => setSettings({ ...settings, proteinMin: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Protein Max (g)</Label>
                        <Input
                          type="number"
                          value={settings.proteinMax}
                          onChange={(e) => setSettings({ ...settings, proteinMax: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Daily Checklist Targets</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Steps</Label>
                        <Input
                          type="number"
                          value={settings.stepsTarget}
                          onChange={(e) => setSettings({ ...settings, stepsTarget: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Water (L)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={settings.waterTarget}
                          onChange={(e) => setSettings({ ...settings, waterTarget: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Sleep (hours)</Label>
                        <Input
                          type="number"
                          step="0.5"
                          value={settings.sleepTarget}
                          onChange={(e) => setSettings({ ...settings, sleepTarget: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Mobility (min)</Label>
                        <Input
                          type="number"
                          value={settings.mobilityTarget}
                          onChange={(e) => setSettings({ ...settings, mobilityTarget: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Reminders</h4>
                    <div className="flex items-center justify-between mb-3">
                      <Label>Enable Evening Reminders</Label>
                      <Switch
                        checked={settings.reminderEnabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, reminderEnabled: checked })}
                      />
                    </div>
                    {settings.reminderEnabled && (
                      <div>
                        <Label>Reminder Time</Label>
                        <Input
                          type="time"
                          value={settings.reminderTime}
                          onChange={(e) => setSettings({ ...settings, reminderTime: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Training Mode</h4>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label>Deload Mode</Label>
                        <p className="text-sm text-muted-foreground">Reduce volume by ~50% and RPE to 6-7</p>
                      </div>
                      <Switch
                        checked={settings.deloadMode}
                        onCheckedChange={(checked) => setSettings({ ...settings, deloadMode: checked })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsSettingsOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleSaveSettings} className="flex-1">
                      Save Settings
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button asChild>
              <Link href="/coach/today">Today's Plan</Link>
            </Button>
          </div>
        </div>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Day</p>
                <p className="text-2xl font-bold">Day {plan.currentDay}: {plan.days.find(d => d.dayNumber === plan.currentDay)?.dayName}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleAdvanceDay}>
                  Advance to Next Day
                </Button>
                <Button variant="outline" onClick={handleScheduleWorkouts} disabled={isScheduling}>
                  <Calendar className="h-4 w-4 mr-2" />
                  {isScheduling ? 'Scheduling...' : 'Schedule 8 Weeks'}
                </Button>
              </div>
            </div>
            {plan.deloadMode && (
              <div className="flex items-center gap-2 mt-4 p-3 bg-blue-500/10 rounded-lg text-sm">
                <Info className="h-5 w-5 text-blue-500" />
                <span className="text-blue-500 font-medium">Deload mode active - reduce volume and intensity this week</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 6-Day Plan */}
        <Tabs defaultValue="1" className="space-y-4">
          <TabsList className="grid grid-cols-6 w-full">
            {plan.days.map((day) => (
              <TabsTrigger
                key={day.dayNumber}
                value={day.dayNumber.toString()}
                className={cn(day.dayNumber === plan.currentDay && 'bg-primary text-primary-foreground')}
              >
                Day {day.dayNumber}
              </TabsTrigger>
            ))}
          </TabsList>

          {plan.days.map((day) => (
            <TabsContent key={day.dayNumber} value={day.dayNumber.toString()} className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{day.dayName}</CardTitle>
                      <CardDescription>
                        {day.muscleGroups.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ')} • {day.estimatedDuration} min
                      </CardDescription>
                    </div>
                    {day.dayNumber === plan.currentDay && (
                      <Badge>Active</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Warmup */}
                  <div>
                    <h4 className="font-medium mb-3">Warm-up Protocol</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Cardio:</span> {day.warmup.cardio}
                      </div>
                      <div>
                        <span className="font-medium">Dynamic Stretches:</span>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          {day.warmup.dynamic.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium">Ramp-up Sets:</span> {day.warmup.rampSets}
                      </div>
                    </div>
                  </div>

                  {/* Exercises */}
                  <div>
                    <h4 className="font-medium mb-3">Exercises ({day.exercises.length})</h4>
                    <div className="space-y-3">
                      {day.exercises.map((exercise: any, index: number) => (
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
                          </div>
                          {exercise.notes && (
                            <p className="text-sm text-muted-foreground">{exercise.notes}</p>
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
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Reminder System */}
        <ReminderSystem />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/coach/today">
                  <Dumbbell className="h-4 w-4 mr-2" />
                  View Today's Plan
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/nutrition">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Track Nutrition
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/analytics">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  View Progress
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
