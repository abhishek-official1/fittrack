'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { X, Plus, SkipForward } from 'lucide-react'

interface RestTimerOverlayProps {
  duration: number
  onComplete: () => void
  onSkip: () => void
}

export function RestTimerOverlay({ duration, onComplete, onSkip }: RestTimerOverlayProps) {
  const [remaining, setRemaining] = useState(duration)
  const [isPaused, setIsPaused] = useState(false)

  const handleComplete = useCallback(() => {
    // Vibrate to notify if available
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200])
    }
    onComplete()
  }, [onComplete])

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(interval)
          handleComplete()
          return 0
        }
        return r - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, handleComplete])

  const addTime = (seconds: number) => {
    setRemaining((r) => r + seconds)
  }

  const progress = ((duration - remaining) / duration) * 100
  const circumference = 2 * Math.PI * 88

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}`
  }

  return (
    <div className="fixed inset-0 bg-background/98 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-in fade-in duration-200">
      {/* Close button */}
      <button
        onClick={onSkip}
        className="absolute top-4 right-4 p-3 hover:bg-muted rounded-full transition-colors"
        aria-label="Close timer"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Circular progress */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress / 100)}
            className="text-primary transition-all duration-1000 ease-linear"
          />
        </svg>
        
        {/* Timer display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl sm:text-7xl font-bold font-mono tabular-nums">
            {formatTime(remaining)}
          </span>
          <span className="text-muted-foreground mt-1">
            {remaining === 1 ? 'second' : 'seconds'}
          </span>
        </div>
      </div>

      <p className="mt-6 text-xl font-medium text-muted-foreground">Rest Time</p>

      {/* Action buttons */}
      <div className="flex gap-4 mt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => addTime(15)}
          className="h-14 px-6 text-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          15s
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => addTime(30)}
          className="h-14 px-6 text-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          30s
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={onSkip}
          className="h-14 px-6 text-lg"
        >
          <SkipForward className="h-5 w-5 mr-2" />
          Skip
        </Button>
      </div>

      {/* Tap to pause hint */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {isPaused ? 'Tap to resume' : 'Tap to pause'}
      </button>
    </div>
  )
}
