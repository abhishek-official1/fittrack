'use client'

import { Flame } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StreakWidgetProps {
  currentStreak: number
  longestStreak: number
}

export function StreakWidget({ currentStreak, longestStreak }: StreakWidgetProps) {
  const isOnFire = currentStreak >= 7
  
  return (
    <Card className={`${isOnFire ? 'border-orange-400 dark:border-orange-600' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${
              isOnFire 
                ? 'bg-gradient-to-br from-orange-400 to-red-500 animate-pulse' 
                : 'bg-orange-100 dark:bg-orange-900'
            }`}>
              <Flame className={`h-6 w-6 ${isOnFire ? 'text-white' : 'text-orange-500'}`} />
            </div>
            <div>
              <p className="text-3xl font-bold">{currentStreak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{longestStreak}</p>
            <p className="text-xs text-muted-foreground">Best</p>
          </div>
        </div>
        
        {currentStreak > 0 && currentStreak < 7 && (
          <p className="text-xs text-muted-foreground mt-3">
            {7 - currentStreak} more days to unlock Week Warrior!
          </p>
        )}
        
        {isOnFire && (
          <p className="text-xs text-orange-500 font-medium mt-3">
            You&apos;re on fire! Keep it up!
          </p>
        )}
      </CardContent>
    </Card>
  )
}
