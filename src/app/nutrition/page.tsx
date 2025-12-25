'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Apple, Plus, Trash2, Edit2, TrendingUp } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface NutritionLog {
  id: string
  date: string
  mealName: string | null
  mealTime: string | null
  calories: number
  protein: number
  carbs: number | null
  fats: number | null
  notes: string | null
}

interface DailyTotal {
  date: Date
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFats: number
  meals: NutritionLog[]
}

export default function NutritionPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<NutritionLog[]>([])
  const [dailyTotals, setDailyTotals] = useState<DailyTotal[]>([])
  const [targets, setTargets] = useState({ caloriesMin: 2300, caloriesMax: 2400, proteinMin: 160, proteinMax: 190 })
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLog, setEditingLog] = useState<NutritionLog | null>(null)
  const [formData, setFormData] = useState({
    mealName: '',
    mealTime: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  })

  useEffect(() => {
    fetchNutritionData()
    fetchCoachPlanTargets()
  }, [])

  const fetchCoachPlanTargets = async () => {
    try {
      const res = await fetch('/api/coach-plan')
      const result = await res.json()
      if (result.success && result.data) {
        setTargets({
          caloriesMin: result.data.caloriesMin,
          caloriesMax: result.data.caloriesMax,
          proteinMin: result.data.proteinMin,
          proteinMax: result.data.proteinMax
        })
      }
    } catch (err) {
      console.error('Error fetching targets:', err)
    }
  }

  const fetchNutritionData = async () => {
    try {
      const res = await fetch('/api/nutrition?days=30')
      const result = await res.json()
      if (result.success) {
        setLogs(result.data.logs)
        setDailyTotals(result.data.dailyTotals)
      }
    } catch (err) {
      console.error('Error fetching nutrition:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const data = {
      date: new Date().toISOString(),
      mealName: formData.mealName || null,
      mealTime: formData.mealTime || null,
      calories: parseInt(formData.calories),
      protein: parseFloat(formData.protein),
      carbs: formData.carbs ? parseFloat(formData.carbs) : null,
      fats: formData.fats ? parseFloat(formData.fats) : null
    }

    try {
      if (editingLog) {
        const res = await fetch(`/api/nutrition/${editingLog.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        if (res.ok) {
          await fetchNutritionData()
          setIsDialogOpen(false)
          resetForm()
        }
      } else {
        const res = await fetch('/api/nutrition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        if (res.ok) {
          await fetchNutritionData()
          setIsDialogOpen(false)
          resetForm()
        }
      }
    } catch (err) {
      console.error('Error saving nutrition log:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this nutrition log?')) return
    
    try {
      const res = await fetch(`/api/nutrition/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchNutritionData()
      }
    } catch (err) {
      console.error('Error deleting log:', err)
    }
  }

  const handleEdit = (log: NutritionLog) => {
    setEditingLog(log)
    setFormData({
      mealName: log.mealName || '',
      mealTime: log.mealTime || '',
      calories: log.calories.toString(),
      protein: log.protein.toString(),
      carbs: log.carbs?.toString() || '',
      fats: log.fats?.toString() || ''
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingLog(null)
    setFormData({
      mealName: '',
      mealTime: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: ''
    })
  }

  const todayTotal = dailyTotals[0] || {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
    meals: []
  }

  const last7Days = dailyTotals.slice(0, 7).reverse()
  const chartData = last7Days.map(day => ({
    date: format(new Date(day.date), 'MM/dd'),
    calories: day.totalCalories,
    protein: day.totalProtein,
    caloriesTarget: targets.caloriesMin,
    proteinTarget: targets.proteinMin
  }))

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 py-8 max-w-6xl">
          <Skeleton className="h-12 w-48 mb-6" />
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
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
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Apple className="h-8 w-8 text-primary" />
              Nutrition Tracking
            </h1>
            <p className="text-muted-foreground mt-1">
              Log your meals and track your macros
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Log Meal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingLog ? 'Edit Meal' : 'Log Meal'}</DialogTitle>
                <DialogDescription>
                  Track your calories and macros
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mealName">Meal Name</Label>
                    <Input
                      id="mealName"
                      placeholder="Breakfast"
                      value={formData.mealName}
                      onChange={(e) => setFormData({ ...formData, mealName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mealTime">Time</Label>
                    <Input
                      id="mealTime"
                      type="time"
                      value={formData.mealTime}
                      onChange={(e) => setFormData({ ...formData, mealTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="calories">Calories *</Label>
                    <Input
                      id="calories"
                      type="number"
                      placeholder="500"
                      value={formData.calories}
                      onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="protein">Protein (g) *</Label>
                    <Input
                      id="protein"
                      type="number"
                      step="0.1"
                      placeholder="30"
                      value={formData.protein}
                      onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      step="0.1"
                      placeholder="50"
                      value={formData.carbs}
                      onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fats">Fats (g)</Label>
                    <Input
                      id="fats"
                      type="number"
                      step="0.1"
                      placeholder="15"
                      value={formData.fats}
                      onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingLog ? 'Update' : 'Log Meal'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            {/* Today's Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
                <CardDescription>{format(new Date(), 'EEEE, MMMM d, yyyy')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Calories</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(todayTotal.totalCalories)} / {targets.caloriesMin}-{targets.caloriesMax}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(100, (todayTotal.totalCalories / targets.caloriesMin) * 100)} 
                    className="h-2" 
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Protein</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(todayTotal.totalProtein)}g / {targets.proteinMin}-{targets.proteinMax}g
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(100, (todayTotal.totalProtein / targets.proteinMin) * 100)} 
                    className="h-2" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <span className="text-2xl font-bold">{Math.round(todayTotal.totalCarbs)}g</span>
                    <span className="text-sm text-muted-foreground">Carbs</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <span className="text-2xl font-bold">{Math.round(todayTotal.totalFats)}g</span>
                    <span className="text-sm text-muted-foreground">Fats</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Meals */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Meals</CardTitle>
                <CardDescription>{todayTotal.meals.length} meals logged</CardDescription>
              </CardHeader>
              <CardContent>
                {todayTotal.meals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Apple className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No meals logged today</p>
                    <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="mt-4">
                      Log Your First Meal
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayTotal.meals.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{log.mealName || 'Meal'}</p>
                            {log.mealTime && (
                              <Badge variant="secondary">{log.mealTime}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {log.calories} cal • {log.protein}g protein
                            {log.carbs && ` • ${log.carbs}g carbs`}
                            {log.fats && ` • ${log.fats}g fats`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(log)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(log.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {/* 7-Day Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  7-Day Trends
                </CardTitle>
                <CardDescription>Your nutrition over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Not enough data to show trends</p>
                    <p className="text-sm mt-1">Start logging meals to see your progress</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Calories</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="calories" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            name="Actual"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="caloriesTarget" 
                            stroke="hsl(var(--muted-foreground))" 
                            strokeDasharray="5 5"
                            name="Target"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-3">Protein (g)</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="protein" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            name="Actual"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="proteinTarget" 
                            stroke="hsl(var(--muted-foreground))" 
                            strokeDasharray="5 5"
                            name="Target"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <span className="font-medium">Average Calories</span>
                    <span className="text-2xl font-bold">
                      {Math.round(chartData.reduce((sum, d) => sum + d.calories, 0) / Math.max(chartData.length, 1))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <span className="font-medium">Average Protein</span>
                    <span className="text-2xl font-bold">
                      {Math.round(chartData.reduce((sum, d) => sum + d.protein, 0) / Math.max(chartData.length, 1))}g
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <span className="font-medium">Days Logged</span>
                    <span className="text-2xl font-bold">{dailyTotals.slice(0, 7).length} / 7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
