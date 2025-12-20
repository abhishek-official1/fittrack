'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Sparkles, Calendar, Dumbbell, Trophy, Flame, Clock, 
  TrendingUp, Target, Award, BarChart3 
} from 'lucide-react'
import { Header } from '@/components/layout/Header'

interface YearReviewData {
  year: number
  summary: {
    totalWorkouts: number
    totalSets: number
    totalReps: number
    totalVolume: number
    totalDuration: number
    totalPRs: number
    achievementsEarned: number
    longestStreak: number
  }
  favorites: {
    muscle: string | null
    exercise: string | null
    day: string | null
    month: string | null
  }
  insights: {
    avgWorkoutsPerWeek: number
    avgSetsPerWorkout: number
    avgDurationMinutes: number
    volumePerWorkout: number
  }
  charts: {
    monthlyWorkouts: number[]
    muscleGroupBreakdown: Array<{ name: string; count: number; percentage: number }>
  }
  topPRs: Array<{ exercise: string; weight: number; reps: number; date: string }>
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subtext 
}: { 
  icon: React.ElementType
  label: string
  value: string | number
  subtext?: string 
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MonthlyChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((value, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div 
            className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
            style={{ height: `${(value / max) * 100}%`, minHeight: value > 0 ? '4px' : '0' }}
          />
          <span className="text-xs text-muted-foreground">{MONTHS[i]}</span>
        </div>
      ))}
    </div>
  )
}

export default function YearReviewPage() {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [data, setData] = useState<YearReviewData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchReview() {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/year-review?year=${year}`)
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch year review:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReview()
  }, [year])

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Year in Review</h1>
          </div>
          <Select value={String(year)} onValueChange={(v) => setYear(parseInt(v))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map(y => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <Skeleton className="h-48" />
          </div>
        ) : !data || data.summary.totalWorkouts === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h2 className="text-xl font-semibold mb-2">No workouts in {year}</h2>
              <p className="text-muted-foreground">
                Complete workouts to see your year in review!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Hero Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                icon={Dumbbell} 
                label="Workouts" 
                value={data.summary.totalWorkouts}
                subtext={`${data.insights.avgWorkoutsPerWeek}/week avg`}
              />
              <StatCard 
                icon={TrendingUp} 
                label="Total Volume" 
                value={`${(data.summary.totalVolume / 1000).toFixed(1)}t`}
                subtext={`${data.insights.volumePerWorkout.toLocaleString()} kg/workout`}
              />
              <StatCard 
                icon={Trophy} 
                label="PRs Set" 
                value={data.summary.totalPRs}
              />
              <StatCard 
                icon={Flame} 
                label="Longest Streak" 
                value={data.summary.longestStreak}
                subtext="days"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                icon={Target} 
                label="Total Sets" 
                value={data.summary.totalSets.toLocaleString()}
              />
              <StatCard 
                icon={BarChart3} 
                label="Total Reps" 
                value={data.summary.totalReps.toLocaleString()}
              />
              <StatCard 
                icon={Clock} 
                label="Time Training" 
                value={`${Math.round(data.summary.totalDuration / 60)}h`}
                subtext={`${data.insights.avgDurationMinutes} min/workout`}
              />
              <StatCard 
                icon={Award} 
                label="Achievements" 
                value={data.summary.achievementsEarned}
                subtext="earned"
              />
            </div>

            {/* Monthly Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Monthly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlyChart data={data.charts.monthlyWorkouts} />
              </CardContent>
            </Card>

            {/* Favorites & Insights */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Favorites</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.favorites.exercise && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Favorite Exercise</span>
                      <Badge variant="secondary">{data.favorites.exercise}</Badge>
                    </div>
                  )}
                  {data.favorites.muscle && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Most Trained</span>
                      <Badge variant="secondary" className="capitalize">{data.favorites.muscle}</Badge>
                    </div>
                  )}
                  {data.favorites.day && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Favorite Day</span>
                      <Badge variant="secondary">{data.favorites.day}</Badge>
                    </div>
                  )}
                  {data.favorites.month && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Best Month</span>
                      <Badge variant="secondary">{data.favorites.month}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Muscle Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.charts.muscleGroupBreakdown.slice(0, 5).map(muscle => (
                    <div key={muscle.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{muscle.name}</span>
                        <span className="text-muted-foreground">{muscle.percentage}%</span>
                      </div>
                      <Progress value={muscle.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Top PRs */}
            {data.topPRs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Top Personal Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {data.topPRs.map((pr, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <span className="font-bold text-yellow-600">{i + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{pr.exercise}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(pr.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{pr.weight} kg</p>
                          <p className="text-xs text-muted-foreground">{pr.reps} reps</p>
                        </div>
                      </div>
                    ))}
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
