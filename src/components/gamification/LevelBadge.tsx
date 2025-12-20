'use client'

import { Star } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface LevelBadgeProps {
  level: number
  levelTitle: string
  xpProgress: number
  totalXP: number
  compact?: boolean
}

export function LevelBadge({ level, levelTitle, xpProgress, totalXP, compact = false }: LevelBadgeProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10">
        <Star className="h-3.5 w-3.5 text-primary fill-primary" />
        <span className="text-xs font-semibold">{level}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
          <span className="text-lg font-bold text-primary-foreground">{level}</span>
        </div>
        <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 fill-yellow-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{levelTitle}</p>
        <Progress value={xpProgress} className="h-2 mt-1" />
        <p className="text-xs text-muted-foreground mt-0.5">{totalXP.toLocaleString()} XP</p>
      </div>
    </div>
  )
}
