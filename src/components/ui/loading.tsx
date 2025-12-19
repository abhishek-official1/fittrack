'use client'

import { cn } from '@/lib/utils'
import { Loader2, Dumbbell } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <Loader2 className={cn('animate-spin text-primary', sizeClasses[size], className)} />
  )
}

interface LoadingOverlayProps {
  message?: string
  fullScreen?: boolean
}

export function LoadingOverlay({ message = 'Loading...', fullScreen = false }: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm',
        fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10'
      )}
    >
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  )
}

export function LoadingPage({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="relative">
        <Dumbbell className="h-16 w-16 text-primary animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
      </div>
      <p className="mt-6 text-lg text-muted-foreground">{message}</p>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  )
}

export function LoadingButton({ className }: { className?: string }) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <LoadingSpinner size="sm" />
      <span>Loading...</span>
    </div>
  )
}

interface LoadingStateProps {
  isLoading: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
  delay?: number
}

export function LoadingState({ 
  isLoading, 
  children, 
  fallback,
  delay = 0 
}: LoadingStateProps) {
  // Optional: Add delay to prevent flash of loading state
  // This would require useState and useEffect to implement properly
  
  if (isLoading) {
    return fallback || <LoadingSpinner />
  }
  
  return <>{children}</>
}
