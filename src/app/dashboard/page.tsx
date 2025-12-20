'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  Flame, 
  Trophy, 
  Plus,
  ChevronRight,
  Clock
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatDuration, formatWeight } from '@/lib/utils'
import { StreakWidget } from '@/components/gamification/StreakWidget'
import { RecentAchievements } from '@/components/gamification/RecentAchievements'
import { LevelBadge } from '@/components/gamification/LevelBadge'
import { MuscleRecoveryCard } from '@/components/recovery/MuscleRecoveryCard'
import type { Workout, User } from '@/types'

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
}

interface UserStats {
  totalXP: number
  level: number
  levelTitle: string
  xpProgress: number
  currentStreak: number
  longestStreak: number
  totalWorkouts: number
  totalPRs: number
  recentAchievements: Array<{
    id: string
    name: string
    description: string
    rarity: string
    xpReward: number
    unlockedAt: string
  }>
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, workoutsRes, analyticsRes, statsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/workouts?limit=5'),
          fetch('/api/analytics?period=30'),
          fetch('/api/user/stats')
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

        const analyticsData = await analyticsRes.json()
        if (analyticsData.success) {
          setAnalytics(analyticsData.data)
        }

        const statsData = await statsRes.json()
        if (statsData.success) {
          setUserStats(statsData.data)
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

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  const weeklyGoal = user?.profile?.weeklyGoal || 3
  const thisWeekWorkouts = analytics?.overview.averageWorkoutsPerWeek || 0
  const weeklyProgress = Math.min((thisWeekWorkouts / weeklyGoal) * 100, 100)

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s your fitness overview
            </p>
          </div>
          <Link href="/workouts/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Workout
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.overview.totalWorkouts || 0}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(thisWeekWorkouts)}/{weeklyGoal}
              </div>
              <Progress value={weeklyProgress} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Gamification Section */}
        {userStats && (
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {/* Level Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Your Level</CardTitle>
              </CardHeader>
              <CardContent>
                <LevelBadge
                  level={userStats.level}
                  levelTitle={userStats.levelTitle}
                  xpProgress={userStats.xpProgress}
                  totalXP={userStats.totalXP}
                />
              </CardContent>
            </Card>

            {/* Streak Widget */}
            <StreakWidget
              currentStreak={userStats.currentStreak}
              longestStreak={userStats.longestStreak}
            />

            {/* Recent Achievements */}
            <RecentAchievements achievements={userStats.recentAchievements} />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Workouts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Workouts</CardTitle>
                <CardDescription>Your latest training sessions</CardDescription>
              </div>
              <Link href="/workouts">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {workouts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No workouts yet</p>
                  <Link href="/workouts/new">
                    <Button variant="outline" className="mt-4">
                      Start Your First Workout
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {workouts.slice(0, 5).map((workout) => (
                    <Link key={workout.id} href={`/workouts/${workout.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Dumbbell className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{workout.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(workout.date, 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={workout.status === 'completed' ? 'success' : 'secondary'}>
                            {workout.status}
                          </Badge>
                          {workout.duration && (
                            <span className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDuration(workout.duration)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personal Records */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent PRs</CardTitle>
                <CardDescription>Your latest personal records</CardDescription>
              </div>
              <Link href="/analytics">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {!analytics?.recentPRs?.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No PRs recorded yet</p>
                  <p className="text-sm mt-2">Keep training to set new records!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analytics.recentPRs.map((pr) => (
                    <div key={pr.id} className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                          <Trophy className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium">{pr.exercise.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(pr.date, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-success">
                          {formatWeight(pr.weight, user?.profile?.preferredUnits as 'metric' | 'imperial')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {pr.reps} reps
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Muscle Recovery */}
        <div className="mt-6">
          <MuscleRecoveryCard />
        </div>

        {/* Quick Stats */}
        {analytics?.overview.favoriteExercise && (
          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Favorite Exercise</p>
                    <p className="text-lg font-semibold">{analytics.overview.favoriteExercise}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Most Trained</p>
                    <p className="text-lg font-semibold capitalize">
                      {analytics.overview.mostTrainedMuscle?.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
