'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Trophy, Flame, Target, Award, Dumbbell, TrendingUp, 
  Calendar, Star, Lock, CheckCircle, Zap, Crown,
  Medal, Shield, Clock, Sunrise, Moon
} from 'lucide-react'

interface Achievement {
  id: string
  name: string
  description: string
  category: string
  icon: string
  rarity: string
  xpReward: number
  isUnlocked: boolean
  unlockedAt: string | null
}

interface UserStats {
  totalXP: number
  currentLevel: number
  level: number
  levelTitle: string
  xpProgress: number
  totalWorkouts: number
  currentStreak: number
  longestStreak: number
  totalPRs: number
  achievementStats: {
    total: number
    unlocked: number
    percentage: number
  }
}

const ICON_MAP: Record<string, React.ElementType> = {
  Dumbbell, Trophy, Flame, Target, Award, TrendingUp,
  Calendar, Star, Zap, Crown, Medal, Shield, Clock, Sunrise, Moon,
  CheckCircle, Lock
}

const RARITY_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  common: { bg: 'bg-gray-100 dark:bg-gray-800', border: 'border-gray-300 dark:border-gray-600', text: 'text-gray-600 dark:text-gray-400' },
  uncommon: { bg: 'bg-green-50 dark:bg-green-950', border: 'border-green-400 dark:border-green-600', text: 'text-green-600 dark:text-green-400' },
  rare: { bg: 'bg-blue-50 dark:bg-blue-950', border: 'border-blue-400 dark:border-blue-600', text: 'text-blue-600 dark:text-blue-400' },
  epic: { bg: 'bg-purple-50 dark:bg-purple-950', border: 'border-purple-400 dark:border-purple-600', text: 'text-purple-600 dark:text-purple-400' },
  legendary: { bg: 'bg-yellow-50 dark:bg-yellow-950', border: 'border-yellow-400 dark:border-yellow-500', text: 'text-yellow-600 dark:text-yellow-400' }
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const IconComponent = ICON_MAP[achievement.icon] || Trophy
  const styles = RARITY_STYLES[achievement.rarity] || RARITY_STYLES.common
  
  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${
      achievement.isUnlocked 
        ? `${styles.bg} ${styles.border} border-2` 
        : 'bg-muted/50 border-muted opacity-60'
    } ${achievement.rarity === 'legendary' && achievement.isUnlocked ? 'shadow-lg shadow-yellow-500/20' : ''}`}>
      {achievement.isUnlocked && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-full ${achievement.isUnlocked ? styles.bg : 'bg-muted'}`}>
            {achievement.isUnlocked ? (
              <IconComponent className={`h-6 w-6 ${styles.text}`} />
            ) : (
              <Lock className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold truncate ${!achievement.isUnlocked && 'text-muted-foreground'}`}>
              {achievement.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {achievement.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={`text-xs capitalize ${styles.text}`}>
                {achievement.rarity}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {achievement.xpReward} XP
              </span>
            </div>
            {achievement.isUnlocked && achievement.unlockedAt && (
              <p className="text-xs text-muted-foreground mt-1">
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AchievementsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, achievementsRes, statsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/achievements'),
          fetch('/api/user/stats')
        ])

        const userData = await userRes.json()
        if (!userData.success) {
          router.push('/auth/login')
          return
        }
        setUser(userData.data)

        const achievementsData = await achievementsRes.json()
        if (achievementsData.success) {
          setAchievements(achievementsData.data)
        }

        const statsData = await statsRes.json()
        if (statsData.success) {
          setStats(statsData.data)
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

  const categories = ['all', 'workout', 'strength', 'consistency', 'volume', 'special']
  
  const filteredAchievements = activeTab === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === activeTab)

  const unlockedCount = achievements.filter(a => a.isUnlocked).length

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
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
      
      <main className="container px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Achievements
            </h1>
            <p className="text-muted-foreground">
              {unlockedCount} of {achievements.length} unlocked
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">Level {stats.level}</p>
                    <p className="text-xs text-muted-foreground">{stats.levelTitle}</p>
                  </div>
                </div>
                <Progress value={stats.xpProgress} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-1">{stats.totalXP} XP</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-orange-500/10">
                    <Flame className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.currentStreak}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Best: {stats.longestStreak} days</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-500/10">
                    <Dumbbell className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalWorkouts}</p>
                    <p className="text-xs text-muted-foreground">Workouts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-500/10">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalPRs}</p>
                    <p className="text-xs text-muted-foreground">Personal Records</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Achievement Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            {categories.map(cat => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAchievements
                .sort((a, b) => {
                  // Sort: unlocked first, then by rarity
                  if (a.isUnlocked !== b.isUnlocked) return a.isUnlocked ? -1 : 1
                  const rarityOrder = ['legendary', 'epic', 'rare', 'uncommon', 'common']
                  return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
                })
                .map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
            </div>

            {filteredAchievements.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No achievements in this category</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
