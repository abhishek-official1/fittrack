'use client'

import Link from 'next/link'
import { Trophy, ChevronRight, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Achievement {
  id: string
  name: string
  description: string
  rarity: string
  xpReward: number
  unlockedAt: string
}

interface RecentAchievementsProps {
  achievements: Achievement[]
}

const RARITY_COLORS: Record<string, string> = {
  common: 'text-gray-500',
  uncommon: 'text-green-500',
  rare: 'text-blue-500',
  epic: 'text-purple-500',
  legendary: 'text-yellow-500'
}

export function RecentAchievements({ achievements }: RecentAchievementsProps) {
  if (achievements.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Complete workouts to unlock achievements!
          </p>
          <Link 
            href="/achievements" 
            className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
          >
            View all achievements
            <ChevronRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Recent Achievements
          </CardTitle>
          <Link 
            href="/achievements" 
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {achievements.slice(0, 3).map(achievement => (
          <div 
            key={achievement.id} 
            className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-background ${RARITY_COLORS[achievement.rarity]}`}>
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-sm">{achievement.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              {achievement.xpReward}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
