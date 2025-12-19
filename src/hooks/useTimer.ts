'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseTimerProps {
  initialTime?: number
  autoStart?: boolean
  countdown?: boolean
  onComplete?: () => void
}

export function useTimer({
  initialTime = 0,
  autoStart = false,
  countdown = false,
  onComplete,
}: UseTimerProps = {}) {
  const [time, setTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const start = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - (countdown ? (initialTime - time) * 1000 : time * 1000)
      setIsRunning(true)
    }
  }, [isRunning, countdown, initialTime, time])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback((newTime?: number) => {
    setIsRunning(false)
    setTime(newTime ?? initialTime)
    startTimeRef.current = null
  }, [initialTime])

  const toggle = useCallback(() => {
    if (isRunning) {
      pause()
    } else {
      start()
    }
  }, [isRunning, pause, start])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (countdown) {
          setTime((prev) => {
            if (prev <= 1) {
              setIsRunning(false)
              onComplete?.()
              return 0
            }
            return prev - 1
          })
        } else {
          setTime((prev) => prev + 1)
        }
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, countdown, onComplete])

  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  return {
    time,
    isRunning,
    start,
    pause,
    reset,
    toggle,
    formattedTime: formatTime(time),
    setTime,
  }
}
