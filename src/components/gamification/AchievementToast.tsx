'use client'

import { Trophy, Zap, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface AchievementToastProps {
  name: string
  description: string
  rarity: string
  xpReward: number
  onClose: () => void
}

const RARITY_STYLES: Record<string, { bg: string; border: string; glow: string }> = {
  common: { bg: 'bg-gray-100 dark:bg-gray-800', border: 'border-gray-400', glow: '' },
  uncommon: { bg: 'bg-green-100 dark:bg-green-900', border: 'border-green-400', glow: '' },
  rare: { bg: 'bg-blue-100 dark:bg-blue-900', border: 'border-blue-400', glow: 'shadow-blue-500/30' },
  epic: { bg: 'bg-purple-100 dark:bg-purple-900', border: 'border-purple-400', glow: 'shadow-purple-500/30' },
  legendary: { bg: 'bg-yellow-100 dark:bg-yellow-900', border: 'border-yellow-400', glow: 'shadow-yellow-500/50' }
}

export function AchievementToast({ name, description, rarity, xpReward, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const styles = RARITY_STYLES[rarity] || RARITY_STYLES.common

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
    
    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div 
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className={`
        relative overflow-hidden rounded-lg border-2 ${styles.border} ${styles.bg}
        p-4 pr-10 shadow-lg ${styles.glow ? `shadow-xl ${styles.glow}` : ''}
        min-w-[300px] max-w-[400px]
      `}>
        {/* Shine effect for legendary */}
        {rarity === 'legendary' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine" />
        )}
        
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${styles.bg} border ${styles.border}`}>
            <Trophy className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Achievement Unlocked!
            </p>
            <p className="font-bold text-lg">{name}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs font-medium capitalize ${
                rarity === 'legendary' ? 'text-yellow-500' :
                rarity === 'epic' ? 'text-purple-500' :
                rarity === 'rare' ? 'text-blue-500' :
                rarity === 'uncommon' ? 'text-green-500' :
                'text-gray-500'
              }`}>
                {rarity}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Zap className="h-3 w-3 text-yellow-500" />
                +{xpReward} XP
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook to manage achievement toasts
export function useAchievementToasts() {
  const [toasts, setToasts] = useState<Array<{
    id: string
    name: string
    description: string
    rarity: string
    xpReward: number
  }>>([])

  const showAchievement = (achievement: {
    name: string
    description: string
    rarity: string
    xpReward: number
  }) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...achievement, id }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return { toasts, showAchievement, removeToast }
}
