'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  Trophy, 
  Medal,
  Crown,
  Search,
  Users,
  TrendingUp,
  Filter
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatNumber, formatWeight } from '@/lib/utils'

interface LeaderboardEntry {
  id: string
  estimated1RM: number
  bestWeight: number
  bestReps: number
  weightClass: string
  globalRank: number | null
  rank: number
  user: {
    id: string
    name: string
    avatarUrl: string | null
    stats?: { currentLevel: number }
  }
}

interface TopExercise {
  id: string
  name: string
  muscleGroup: string
  participantCount: number
  topLifter: {
    name: string
    avatarUrl: string | null
    estimated1RM: number
  } | null
  userRank: number | null
}

function ExerciseRankingsContent() {
  const searchParams = useSearchParams()
  const [topExercises, setTopExercises] = useState<TopExercise[]>([])
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userEntry, setUserEntry] = useState<LeaderboardEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false)
  const [scope, setScope] = useState<'global' | 'class'>('global')
  const [weightClass, setWeightClass] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchTopExercises = async () => {
      try {
        const res = await fetch('/api/exercise-leaderboards/top-exercises?limit=20')
        const data = await res.json()
        if (data.exercises) {
          setTopExercises(data.exercises)
          // Auto-select first exercise or from URL
          const urlExercise = searchParams.get('exercise')
          if (urlExercise) {
            setSelectedExercise(urlExercise)
          } else if (data.exercises.length > 0) {
            setSelectedExercise(data.exercises[0].id)
          }
        }
      } catch (error) {
        console.error('Failed to fetch exercises:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTopExercises()
  }, [searchParams])

  useEffect(() => {
    if (!selectedExercise) return

    const fetchLeaderboard = async () => {
      setIsLoadingLeaderboard(true)
      try {
        const params = new URLSearchParams({
          exerciseId: selectedExercise,
          scope,
          limit: '50'
        })
        if (scope === 'class' && weightClass !== 'all') {
          params.set('weightClass', weightClass)
        }

        const res = await fetch(`/api/exercise-leaderboards?${params}`)
        const data = await res.json()
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard)
          setUserEntry(data.userEntry)
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
      } finally {
        setIsLoadingLeaderboard(false)
      }
    }
    fetchLeaderboard()
  }, [selectedExercise, scope, weightClass])

  const selectedExerciseData = topExercises.find(e => e.id === selectedExercise)
  const filteredExercises = topExercises.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-400" />
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
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
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="h-8 w-8" />
              Exercise Rankings
            </h1>
            <p className="text-muted-foreground mt-1">
              Compete for the top spot on every lift
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Exercise List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Exercises</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              <div className="space-y-1">
                {filteredExercises.map(exercise => (
                  <button
                    key={exercise.id}
                    onClick={() => setSelectedExercise(exercise.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedExercise === exercise.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <p className="font-medium truncate">{exercise.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant="outline" className={`text-xs ${
                        selectedExercise === exercise.id ? 'border-primary-foreground/30' : ''
                      }`}>
                        {exercise.muscleGroup}
                      </Badge>
                      <span className={`text-xs flex items-center gap-1 ${
                        selectedExercise === exercise.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        <Users className="h-3 w-3" />
                        {exercise.participantCount}
                      </span>
                    </div>
                    {exercise.userRank && (
                      <p className={`text-xs mt-1 ${
                        selectedExercise === exercise.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        Your rank: #{exercise.userRank}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedExerciseData?.name || 'Select an Exercise'}
                    {selectedExerciseData && (
                      <Badge variant="secondary">{selectedExerciseData.muscleGroup}</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {selectedExerciseData?.participantCount || 0} lifters competing
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={scope} onValueChange={(v: 'global' | 'class') => setScope(v)}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global</SelectItem>
                      <SelectItem value="class">Weight Class</SelectItem>
                    </SelectContent>
                  </Select>
                  {scope === 'class' && (
                    <Select value={weightClass} onValueChange={setWeightClass}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        <SelectItem value="lightweight">&lt;70kg</SelectItem>
                        <SelectItem value="middleweight">70-85kg</SelectItem>
                        <SelectItem value="heavyweight">&gt;85kg</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingLeaderboard ? (
                <div className="space-y-2">
                  {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No rankings yet for this exercise</p>
                  <p className="text-sm mt-2">Be the first to set a record!</p>
                </div>
              ) : (
                <>
                  {/* User's position if not in top 50 */}
                  {userEntry && userEntry.rank > 50 && (
                    <div className="mb-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Your Position</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg">#{userEntry.rank}</span>
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{userEntry.user.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{userEntry.user.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatWeight(userEntry.estimated1RM, 'metric')}</p>
                          <p className="text-sm text-muted-foreground">Est. 1RM</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {leaderboard.map((entry) => (
                      <div 
                        key={entry.id}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          userEntry?.id === entry.id 
                            ? 'bg-primary/10 border border-primary/30' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 text-center">
                            {getRankIcon(entry.rank) || (
                              <span className={`font-bold ${
                                entry.rank <= 10 ? 'text-primary' : 'text-muted-foreground'
                              }`}>
                                #{entry.rank}
                              </span>
                            )}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{entry.user.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              {entry.user.name}
                              {entry.user.stats?.currentLevel && (
                                <Badge variant="outline" className="text-xs">
                                  Lvl {entry.user.stats.currentLevel}
                                </Badge>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatWeight(entry.bestWeight, 'metric')} x {entry.bestReps} reps
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{formatWeight(entry.estimated1RM, 'metric')}</p>
                          <p className="text-sm text-muted-foreground">Est. 1RM</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function ExerciseRankingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </main>
      </div>
    }>
      <ExerciseRankingsContent />
    </Suspense>
  )
}
