'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy, Medal, Crown, Flame, Dumbbell, Target, Zap } from 'lucide-react'
import { Header } from '@/components/layout/Header'

interface LeaderboardEntry {
  rank: number
  userId: string
  userName: string
  avatarUrl: string | null
  value: number
  isCurrentUser: boolean
}

const TYPE_CONFIG = {
  volume: { label: 'Total Volume', icon: Dumbbell, unit: 'kg' },
  workouts: { label: 'Workouts', icon: Target, unit: '' },
  streak: { label: 'Streak', icon: Flame, unit: 'days' },
  xp: { label: 'XP', icon: Zap, unit: 'XP' },
  prs: { label: 'PRs', icon: Trophy, unit: '' }
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />
  return <span className="w-5 text-center font-bold text-muted-foreground">{rank}</span>
}

function LeaderboardList({ 
  entries, 
  type 
}: { 
  entries: LeaderboardEntry[]
  type: keyof typeof TYPE_CONFIG 
}) {
  const config = TYPE_CONFIG[type]

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No entries yet</p>
        <p className="text-sm mt-2">Complete workouts to appear on the leaderboard!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div
          key={entry.userId}
          className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
            entry.isCurrentUser 
              ? 'bg-primary/10 border-2 border-primary' 
              : 'bg-muted/50 hover:bg-muted'
          }`}
        >
          <div className="w-8 flex justify-center">
            {getRankIcon(entry.rank)}
          </div>
          
          <Avatar className="h-10 w-10">
            <AvatarFallback className={entry.isCurrentUser ? 'bg-primary text-primary-foreground' : ''}>
              {entry.userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <p className="font-medium">
              {entry.userName}
              {entry.isCurrentUser && (
                <Badge variant="secondary" className="ml-2 text-xs">You</Badge>
              )}
            </p>
          </div>

          <div className="text-right">
            <p className="font-bold text-lg">
              {entry.value.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">{config.unit}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function LeaderboardsPage() {
  const [type, setType] = useState<keyof typeof TYPE_CONFIG>('volume')
  const [scope, setScope] = useState('global')
  const [period, setPeriod] = useState('all')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/leaderboards?type=${type}&scope=${scope}&period=${period}`)
        const json = await res.json()
        if (json.success) {
          setEntries(json.data.leaderboard)
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [type, scope, period])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Leaderboards</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <Tabs value={type} onValueChange={(v) => setType(v as keyof typeof TYPE_CONFIG)}>
                <TabsList className="grid grid-cols-5 w-full sm:w-auto">
                  {Object.entries(TYPE_CONFIG).map(([key, config]) => {
                    const Icon = config.icon
                    return (
                      <TabsTrigger key={key} value={key} className="gap-1">
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{config.label}</span>
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </Tabs>

              <div className="flex gap-2">
                <Select value={scope} onValueChange={setScope}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="following">Following</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <LeaderboardList entries={entries} type={type} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
