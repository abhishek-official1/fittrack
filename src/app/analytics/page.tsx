'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BarChart3, 
  TrendingUp, 
  Trophy, 
  Flame,
  Calendar,
  Dumbbell,
  Clock
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate, formatWeight, formatDuration } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import type { User } from '@/types'

interface Analytics {
  overview: {
    totalWorkouts: number
    totalVolume: number
    totalDuration: number
    currentStreak: number
    longestStreak: number
    averageWorkoutsPerWeek: number
    favoriteExercise?: string
    mostTrainedMuscle?: string
  }
  weeklyStats: Array<{
    week: string
    workouts: number
    volume: number
    duration: number
  }>
  recentPRs: Array<{
    id: string
    exercise: { name: string }
    value: number
    reps: number
    weight: number
    date: string
  }>
  muscleGroupDistribution: Array<{
    name: string
    count: number
  }>
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#84cc16']

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, analyticsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch(`/api/analytics?period=${period}`)
        ])

        const userData = await userRes.json()
        if (!userData.success) {
          router.push('/auth/login')
          return
        }
        setUser(userData.data)

        const analyticsData = await analyticsRes.json()
        if (analyticsData.success) {
          setAnalytics(analyticsData.data)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router, period])

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header user={user} />
        <main className="container px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-80" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header user={user} />
      
      <main className="container px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Track your progress and performance
            </p>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.overview.totalWorkouts || 0}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.overview.averageWorkoutsPerWeek.toFixed(1)} per week avg
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatWeight(analytics?.overview.totalVolume || 0, user?.profile?.preferredUnits as 'metric' | 'imperial')}
              </div>
              <p className="text-xs text-muted-foreground">Weight lifted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatDuration(analytics?.overview.totalDuration || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Time training</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.overview.currentStreak || 0} days</div>
              <p className="text-xs text-muted-foreground">
                Best: {analytics?.overview.longestStreak || 0} days
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="volume" className="space-y-6">
          <TabsList>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="records">PRs</TabsTrigger>
          </TabsList>

          <TabsContent value="volume">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Volume</CardTitle>
                <CardDescription>Total weight lifted per week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.weeklyStats || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${Number(value).toLocaleString()} kg`, 'Volume']}
                      />
                      <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Workouts</CardTitle>
                <CardDescription>Number of workouts completed per week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics?.weeklyStats || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="workouts" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution">
            <Card>
              <CardHeader>
                <CardTitle>Muscle Group Distribution</CardTitle>
                <CardDescription>Which muscles you train most</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics?.muscleGroupDistribution || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {(analytics?.muscleGroupDistribution || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records">
            <Card>
              <CardHeader>
                <CardTitle>Personal Records</CardTitle>
                <CardDescription>Your recent achievements</CardDescription>
              </CardHeader>
              <CardContent>
                {!analytics?.recentPRs?.length ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No PRs recorded yet</p>
                    <p className="text-sm mt-2">Complete workouts to track your progress!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analytics.recentPRs.map((pr) => (
                      <div 
                        key={pr.id} 
                        className="flex items-center justify-between p-4 rounded-lg bg-success/10 border border-success/20"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                            <Trophy className="h-6 w-6 text-success" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{pr.exercise.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(pr.date, 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-success">
                            {formatWeight(pr.weight, user?.profile?.preferredUnits as 'metric' | 'imperial')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {pr.reps} reps • Est. 1RM: {formatWeight(pr.value, user?.profile?.preferredUnits as 'metric' | 'imperial')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Facts */}
        {(analytics?.overview.favoriteExercise || analytics?.overview.mostTrainedMuscle) && (
          <div className="grid gap-4 md:grid-cols-2 mt-6">
            {analytics.overview.favoriteExercise && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Dumbbell className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Most Performed Exercise</p>
                      <p className="text-lg font-semibold">{analytics.overview.favoriteExercise}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {analytics.overview.mostTrainedMuscle && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Most Trained Muscle</p>
                      <p className="text-lg font-semibold capitalize">
                        {analytics.overview.mostTrainedMuscle.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
