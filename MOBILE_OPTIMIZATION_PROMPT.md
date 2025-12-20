# FitTrack Mobile Optimization - Comprehensive Implementation Guide

## Overview

Transform FitTrack into a fully mobile-optimized Progressive Web App (PWA) that provides a native app-like experience on all devices. This guide covers every aspect of mobile optimization based on industry best practices from Apple HIG, Material Design, and leading fitness apps like Strong, Hevy, and MyFitnessPal.

---

## Table of Contents

1. [Touch Target Optimization](#1-touch-target-optimization)
2. [Responsive Layout System](#2-responsive-layout-system)
3. [Mobile Navigation Patterns](#3-mobile-navigation-patterns)
4. [Typography & Readability](#4-typography--readability)
5. [Form & Input Optimization](#5-form--input-optimization)
6. [Performance Optimization](#6-performance-optimization)
7. [PWA Implementation](#7-pwa-implementation)
8. [Gesture Support](#8-gesture-support)
9. [Workout-Specific Mobile UX](#9-workout-specific-mobile-ux)
10. [Accessibility](#10-accessibility)
11. [Testing Requirements](#11-testing-requirements)

---

## 1. Touch Target Optimization

### Requirements

All interactive elements must meet minimum touch target sizes:
- **iOS**: Minimum 44×44 points (Apple HIG)
- **Android**: Minimum 48×48 dp (Material Design)
- **WCAG 2.1**: Minimum 44×44 CSS pixels

### Implementation Tasks

#### 1.1 Button Size Audit
```
Files to modify:
- src/components/ui/button.tsx
- All page components using buttons
```

**Changes needed:**
- Default button height: minimum `h-11` (44px) on mobile
- Icon buttons: minimum `w-11 h-11` (44×44px)
- Floating action buttons: `w-14 h-14` (56×56px)

```tsx
// Example button variants for mobile
const buttonVariants = cva(
  "... min-h-[44px] md:min-h-[36px] ...",
  {
    variants: {
      size: {
        default: "h-11 md:h-10 px-4 py-2",
        sm: "h-10 md:h-9 px-3",
        lg: "h-12 md:h-11 px-8",
        icon: "h-11 w-11 md:h-10 md:w-10",
      },
    },
  }
)
```

#### 1.2 Spacing Between Touch Targets
- Minimum 8px spacing between clickable elements
- For frequently used buttons: 16px spacing recommended
- Edge buttons: 16px padding from screen edges

#### 1.3 Hit Area Extension
For small visual elements, extend the clickable area:
```tsx
// Checkbox with extended hit area
<label className="relative flex items-center p-3 -m-3 cursor-pointer">
  <input type="checkbox" className="..." />
  <span className="ml-3">Label</span>
</label>
```

#### 1.4 Specific Components to Update

| Component | Current Issue | Required Change |
|-----------|--------------|-----------------|
| Exercise set row buttons (+/-) | Too small | Min 44×44px |
| Navigation links | Text only | Add padding for touch |
| Card action buttons | 36px height | Increase to 44px on mobile |
| Dropdown triggers | Small tap area | Extend hit area |
| Modal close buttons | 24×24px | Increase to 44×44px |
| Calendar day cells | Variable | Min 44×44px |
| Progress chart data points | Tiny | Add touch overlay |

---

## 2. Responsive Layout System

### 2.1 Breakpoint Strategy (Mobile-First)

```css
/* globals.css - Mobile-first breakpoints */
/* Base styles = Mobile (< 640px) */
/* sm: 640px - Large phones / Small tablets */
/* md: 768px - Tablets */
/* lg: 1024px - Small laptops */
/* xl: 1280px - Desktops */
/* 2xl: 1536px - Large screens */
```

### 2.2 Container & Padding

```tsx
// Mobile-optimized container
<main className="container px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
  {/* Content */}
</main>
```

### 2.3 Grid System Updates

**Dashboard Page:**
```tsx
// Current (may not be mobile-optimized)
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

// Mobile-first approach
<div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
```

**Stat Cards:**
```tsx
// 2 columns on mobile for compact stats
<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
  <StatCard />
</div>
```

### 2.4 Page-Specific Layouts

#### Dashboard
- Stack all cards vertically on mobile
- Stat cards: 2×2 grid on mobile
- Quick actions: Fixed bottom bar on mobile
- Recent workouts: Full-width cards

#### Workout Session (Active)
- Full-screen mode option
- Exercise info: Collapsible on mobile
- Set input: Large, thumb-friendly buttons
- Rest timer: Prominent, centered display
- Navigation: Minimal, swipe between exercises

#### Analytics/Charts
- Horizontal scroll for wide charts
- Touch-friendly zoom/pan
- Simplified legends on mobile
- Full-screen chart option

#### Calendar
- Week view default on mobile (not month)
- Swipe to change weeks
- Bottom sheet for day details
- Large day touch targets

### 2.5 Card Component Updates

```tsx
// Mobile-optimized card
<Card className="p-4 sm:p-6">
  <CardHeader className="p-0 pb-3 sm:pb-4">
    <CardTitle className="text-lg sm:text-xl">...</CardTitle>
  </CardHeader>
  <CardContent className="p-0">
    {/* Tighter spacing on mobile */}
  </CardContent>
</Card>
```

---

## 3. Mobile Navigation Patterns

### 3.1 Bottom Navigation Bar (Primary)

Replace hamburger menu with fixed bottom navigation on mobile:

```tsx
// src/components/layout/BottomNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Dumbbell, Plus, Trophy, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { href: '/workouts/new', icon: Plus, label: 'Start', primary: true },
  { href: '/achievements', icon: Trophy, label: 'Achieve' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const pathname = usePathname()
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center w-14 h-14 -mt-6 rounded-full bg-primary text-primary-foreground shadow-lg"
              >
                <Icon className="h-6 w-6" />
              </Link>
            )
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full min-w-[64px] py-2",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

### 3.2 Header Simplification for Mobile

```tsx
// Simplified mobile header
<header className="sticky top-0 z-50 ...">
  <div className="flex items-center justify-between h-14 sm:h-16 px-4">
    {/* Logo only on mobile */}
    <Link href="/dashboard" className="flex items-center gap-2">
      <Dumbbell className="h-6 w-6 text-primary" />
      <span className="font-bold hidden sm:inline">FitTrack</span>
    </Link>
    
    {/* Desktop nav hidden on mobile */}
    <nav className="hidden md:flex ...">
      {/* Full navigation */}
    </nav>
    
    {/* Mobile: only essential actions */}
    <div className="flex items-center gap-1 md:hidden">
      <Button variant="ghost" size="icon" className="h-10 w-10">
        <Bell className="h-5 w-5" />
      </Button>
      <ThemeToggle />
    </div>
  </div>
</header>
```

### 3.3 Page Content Padding for Bottom Nav

```tsx
// Add bottom padding when bottom nav is present
<main className="pb-20 md:pb-6">
  {/* Page content */}
</main>
```

### 3.4 Secondary Navigation (Tabs)

For pages with multiple sections (Analytics, Achievements):

```tsx
// Scrollable horizontal tabs on mobile
<div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
  <Tabs className="w-max sm:w-full">
    <TabsList className="h-11">
      <TabsTrigger className="min-w-[80px] h-10">Tab 1</TabsTrigger>
      {/* ... */}
    </TabsList>
  </Tabs>
</div>
```

---

## 4. Typography & Readability

### 4.1 Font Size Scale (Mobile-First)

```css
/* globals.css */
:root {
  /* Mobile base: 16px */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
}

/* Prevent iOS zoom on input focus */
input, select, textarea {
  font-size: 16px !important;
}

@media (min-width: 640px) {
  input, select, textarea {
    font-size: 14px !important;
  }
}
```

### 4.2 Line Height & Spacing

```css
/* Optimal line heights for mobile reading */
body {
  line-height: 1.6;
}

h1, h2, h3 {
  line-height: 1.2;
}
```

### 4.3 Text Truncation

```tsx
// Prevent text overflow on mobile
<p className="truncate sm:whitespace-normal">
  Long exercise name that might overflow
</p>

// Multi-line truncation
<p className="line-clamp-2 sm:line-clamp-none">
  Description text...
</p>
```

### 4.4 Responsive Headings

```tsx
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  Page Title
</h1>

<h2 className="text-xl sm:text-2xl font-semibold">
  Section Title
</h2>
```

---

## 5. Form & Input Optimization

### 5.1 Input Field Sizing

```tsx
// Mobile-optimized input
<Input 
  className="h-12 sm:h-10 text-base sm:text-sm"
  inputMode="numeric" // Shows numeric keyboard
  pattern="[0-9]*"
/>
```

### 5.2 Number Input for Workout Sets

```tsx
// Weight/Reps input with increment buttons
<div className="flex items-center gap-2">
  <Button 
    variant="outline" 
    size="icon"
    className="h-12 w-12 text-lg font-bold"
    onClick={() => decrement()}
  >
    −
  </Button>
  
  <Input
    type="number"
    inputMode="decimal"
    className="h-12 w-20 text-center text-xl font-bold"
    value={weight}
    onChange={handleChange}
  />
  
  <Button 
    variant="outline" 
    size="icon"
    className="h-12 w-12 text-lg font-bold"
    onClick={() => increment()}
  >
    +
  </Button>
</div>
```

### 5.3 Input Keyboard Types

```tsx
// Appropriate keyboard for each input type
<Input inputMode="numeric" pattern="[0-9]*" /> {/* Weight, reps */}
<Input inputMode="decimal" /> {/* Body weight with decimals */}
<Input inputMode="email" type="email" /> {/* Email */}
<Input inputMode="tel" type="tel" /> {/* Phone */}
<Input inputMode="search" type="search" /> {/* Search */}
```

### 5.4 Select/Dropdown Optimization

```tsx
// Use native select on mobile for better UX
<Select>
  <SelectTrigger className="h-12 sm:h-10">
    <SelectValue />
  </SelectTrigger>
  <SelectContent className="max-h-[50vh]">
    {/* Items with adequate touch targets */}
    <SelectItem className="h-11 sm:h-9">
      Option
    </SelectItem>
  </SelectContent>
</Select>
```

### 5.5 Form Layout

```tsx
// Stack form fields vertically on mobile
<form className="space-y-4">
  <div className="grid gap-4 sm:grid-cols-2">
    <div className="space-y-2">
      <Label>Weight (kg)</Label>
      <Input className="h-12 sm:h-10" />
    </div>
    <div className="space-y-2">
      <Label>Reps</Label>
      <Input className="h-12 sm:h-10" />
    </div>
  </div>
</form>
```

---

## 6. Performance Optimization

### 6.1 Image Optimization

```tsx
// Always use next/image with proper sizing
import Image from 'next/image'

<Image
  src={exercise.imageUrl}
  alt={exercise.name}
  width={400}
  height={300}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 6.2 Code Splitting

```tsx
// Lazy load heavy components
import dynamic from 'next/dynamic'

const AnalyticsChart = dynamic(
  () => import('@/components/charts/AnalyticsChart'),
  { 
    loading: () => <Skeleton className="h-64" />,
    ssr: false 
  }
)

const BodyDiagram = dynamic(
  () => import('@/components/recovery/BodyDiagram'),
  { loading: () => <Skeleton className="h-48" /> }
)
```

### 6.3 Reduce Initial Bundle

```tsx
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
  },
}
```

### 6.4 API Response Optimization

```tsx
// Paginate lists on mobile
const limit = isMobile ? 10 : 20

// Return only needed fields
const workouts = await prisma.workout.findMany({
  select: {
    id: true,
    name: true,
    date: true,
    duration: true,
    _count: { select: { exercises: true } }
  },
  take: limit
})
```

### 6.5 Skeleton Loading States

```tsx
// Mobile-optimized skeletons
function WorkoutCardSkeleton() {
  return (
    <Card className="p-4">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </Card>
  )
}
```

---

## 7. PWA Implementation

### 7.1 Web App Manifest

```json
// public/manifest.json
{
  "name": "FitTrack - Workout Tracker",
  "short_name": "FitTrack",
  "description": "Track your workouts, build strength, achieve goals",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#6366f1",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/dashboard.png",
      "sizes": "1080x1920",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "categories": ["fitness", "health", "lifestyle"],
  "shortcuts": [
    {
      "name": "Start Workout",
      "url": "/workouts/new",
      "icon": "/icons/workout.png"
    },
    {
      "name": "Quick Log",
      "url": "/workouts/quick",
      "icon": "/icons/log.png"
    }
  ]
}
```

### 7.2 Service Worker Setup

```tsx
// src/app/layout.tsx
<head>
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#6366f1" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <link rel="apple-touch-icon" href="/icons/icon-192.png" />
</head>
```

### 7.3 Service Worker with next-pwa

```bash
npm install next-pwa
```

```js
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 // 1 hour
        }
      }
    },
    {
      urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
        }
      }
    }
  ]
})

module.exports = withPWA({
  // existing config
})
```

### 7.4 Offline Support

```tsx
// src/hooks/useOnlineStatus.ts
'use client'

import { useState, useEffect } from 'react'

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
```

```tsx
// Offline indicator component
export function OfflineIndicator() {
  const isOnline = useOnlineStatus()
  
  if (isOnline) return null
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-destructive text-destructive-foreground text-center py-2 text-sm z-[100]">
      You're offline. Changes will sync when connected.
    </div>
  )
}
```

### 7.5 Offline Data Storage

```tsx
// src/lib/offline-storage.ts
import { openDB } from 'idb'

const DB_NAME = 'fittrack-offline'
const STORE_NAME = 'pending-workouts'

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' })
    }
  })
}

export async function savePendingWorkout(workout: any) {
  const db = await initDB()
  await db.put(STORE_NAME, { ...workout, pending: true, savedAt: Date.now() })
}

export async function getPendingWorkouts() {
  const db = await initDB()
  return db.getAll(STORE_NAME)
}

export async function syncPendingWorkouts() {
  const pending = await getPendingWorkouts()
  for (const workout of pending) {
    try {
      await fetch('/api/workouts', {
        method: 'POST',
        body: JSON.stringify(workout)
      })
      const db = await initDB()
      await db.delete(STORE_NAME, workout.id)
    } catch (e) {
      console.error('Sync failed:', e)
    }
  }
}
```

### 7.6 Install Prompt

```tsx
// src/components/InstallPrompt.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, X } from 'lucide-react'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }
    
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card border rounded-lg shadow-lg p-4 z-50">
      <button 
        onClick={() => setShowPrompt(false)}
        className="absolute top-2 right-2 p-1"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3">
        <Download className="h-8 w-8 text-primary flex-shrink-0" />
        <div>
          <h3 className="font-semibold">Install FitTrack</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Add to your home screen for quick access and offline support.
          </p>
          <Button onClick={handleInstall} size="sm">
            Install App
          </Button>
        </div>
      </div>
    </div>
  )
}
```

---

## 8. Gesture Support

### 8.1 Swipe Actions

```bash
npm install @use-gesture/react
```

```tsx
// Swipe to delete workout/exercise
import { useSwipeable } from 'react-swipeable'

function SwipeableCard({ children, onDelete }) {
  const [offset, setOffset] = useState(0)
  
  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (e.dir === 'Left') {
        setOffset(Math.min(0, e.deltaX))
      }
    },
    onSwipedLeft: () => {
      if (offset < -100) onDelete()
      setOffset(0)
    },
    onSwipedRight: () => setOffset(0),
    trackMouse: false
  })

  return (
    <div className="relative overflow-hidden">
      <div 
        className="absolute right-0 top-0 bottom-0 w-24 bg-destructive flex items-center justify-center"
      >
        <Trash className="h-5 w-5 text-white" />
      </div>
      <div 
        {...handlers}
        style={{ transform: `translateX(${offset}px)` }}
        className="relative bg-card transition-transform"
      >
        {children}
      </div>
    </div>
  )
}
```

### 8.2 Pull to Refresh

```tsx
// Pull to refresh for workout list
import { usePullToRefresh } from '@/hooks/usePullToRefresh'

function WorkoutList() {
  const { isRefreshing, pullDistance, handlers } = usePullToRefresh({
    onRefresh: async () => {
      await refetchWorkouts()
    }
  })

  return (
    <div {...handlers} className="min-h-screen">
      {pullDistance > 0 && (
        <div 
          className="flex justify-center py-4"
          style={{ height: Math.min(pullDistance, 60) }}
        >
          <RefreshCw className={cn(
            "h-6 w-6 text-muted-foreground transition-transform",
            isRefreshing && "animate-spin"
          )} />
        </div>
      )}
      {/* List content */}
    </div>
  )
}
```

### 8.3 Swipe Between Exercises

```tsx
// During active workout - swipe between exercises
function ExerciseSwiper({ exercises, currentIndex, onIndexChange }) {
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < exercises.length - 1) {
        onIndexChange(currentIndex + 1)
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        onIndexChange(currentIndex - 1)
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: false
  })

  return (
    <div {...handlers} className="overflow-hidden">
      <div 
        className="flex transition-transform duration-300"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {exercises.map((exercise, i) => (
          <div key={i} className="w-full flex-shrink-0">
            <ExerciseCard exercise={exercise} />
          </div>
        ))}
      </div>
      
      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-4">
        {exercises.map((_, i) => (
          <div 
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              i === currentIndex ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  )
}
```

### 8.4 Long Press Actions

```tsx
// Long press for context menu
function ExerciseItem({ exercise }) {
  const [showMenu, setShowMenu] = useState(false)
  const longPressTimer = useRef<NodeJS.Timeout>()

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setShowMenu(true)
      // Haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
    }, 500)
  }

  const handleTouchEnd = () => {
    clearTimeout(longPressTimer.current)
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Exercise content */}
      
      {showMenu && (
        <ContextMenu onClose={() => setShowMenu(false)}>
          <ContextMenuItem onClick={handleEdit}>Edit</ContextMenuItem>
          <ContextMenuItem onClick={handleDelete}>Delete</ContextMenuItem>
          <ContextMenuItem onClick={handleDuplicate}>Duplicate</ContextMenuItem>
        </ContextMenu>
      )}
    </div>
  )
}
```

---

## 9. Workout-Specific Mobile UX

### 9.1 Active Workout Screen

The most critical screen for mobile optimization:

```tsx
// src/app/workouts/[id]/active/page.tsx

export default function ActiveWorkoutPage() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Minimal header */}
      <header className="flex items-center justify-between px-4 h-14 border-b">
        <Button variant="ghost" size="sm" onClick={handleEnd}>
          End
        </Button>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Workout Timer</p>
          <p className="text-lg font-mono font-bold">{formatTime(elapsed)}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handlePause}>
          {isPaused ? <Play /> : <Pause />}
        </Button>
      </header>

      {/* Exercise content - swipeable */}
      <main className="flex-1 overflow-hidden">
        <ExerciseSwiper 
          exercises={exercises}
          currentIndex={currentExerciseIndex}
          onIndexChange={setCurrentExerciseIndex}
        />
      </main>

      {/* Set logging - large touch targets */}
      <div className="border-t p-4 space-y-4">
        <div className="flex items-center justify-center gap-6">
          <NumberInput
            label="Weight"
            value={weight}
            onChange={setWeight}
            step={2.5}
            unit="kg"
          />
          <NumberInput
            label="Reps"
            value={reps}
            onChange={setReps}
            step={1}
          />
        </div>
        
        <Button 
          onClick={handleLogSet}
          className="w-full h-14 text-lg font-semibold"
          disabled={!weight || !reps}
        >
          Log Set ({currentSetNumber})
        </Button>
      </div>

      {/* Rest timer overlay */}
      {showRestTimer && (
        <RestTimerOverlay 
          duration={restDuration}
          onSkip={() => setShowRestTimer(false)}
          onComplete={() => setShowRestTimer(false)}
        />
      )}
    </div>
  )
}
```

### 9.2 Large Number Input Component

```tsx
// src/components/workout/NumberInput.tsx
function NumberInput({ label, value, onChange, step, unit }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm text-muted-foreground mb-2">{label}</span>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 text-2xl font-bold rounded-full"
          onClick={() => onChange(Math.max(0, value - step))}
        >
          −
        </Button>
        <div className="w-24 text-center">
          <input
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="w-full text-center text-3xl font-bold bg-transparent border-none outline-none"
          />
          {unit && (
            <span className="text-sm text-muted-foreground">{unit}</span>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 text-2xl font-bold rounded-full"
          onClick={() => onChange(value + step)}
        >
          +
        </Button>
      </div>
    </div>
  )
}
```

### 9.3 Rest Timer Overlay

```tsx
// Full-screen rest timer
function RestTimerOverlay({ duration, onSkip, onComplete }) {
  const [remaining, setRemaining] = useState(duration)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          onComplete()
          // Vibrate to notify
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200])
          }
          return 0
        }
        return r - 1
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const progress = ((duration - remaining) / duration) * 100

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur flex flex-col items-center justify-center z-50">
      {/* Circular progress */}
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={553}
            strokeDashoffset={553 * (1 - progress / 100)}
            className="text-primary transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-bold font-mono">{remaining}</span>
          <span className="text-muted-foreground">seconds</span>
        </div>
      </div>

      <p className="mt-8 text-lg text-muted-foreground">Rest Time</p>
      
      <div className="flex gap-4 mt-8">
        <Button variant="outline" size="lg" onClick={() => setRemaining(r => r + 30)}>
          +30s
        </Button>
        <Button variant="default" size="lg" onClick={onSkip}>
          Skip
        </Button>
      </div>
    </div>
  )
}
```

### 9.4 Exercise Selection Bottom Sheet

```tsx
// Mobile-friendly exercise picker
function ExercisePickerSheet({ open, onOpenChange, onSelect }) {
  const [search, setSearch] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState('all')
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] flex flex-col">
        <SheetHeader>
          <SheetTitle>Add Exercise</SheetTitle>
        </SheetHeader>
        
        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        
        {/* Muscle filter - horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto py-3 -mx-4 px-4 no-scrollbar">
          {muscleGroups.map((muscle) => (
            <Button
              key={muscle}
              variant={selectedMuscle === muscle ? 'default' : 'outline'}
              size="sm"
              className="flex-shrink-0"
              onClick={() => setSelectedMuscle(muscle)}
            >
              {muscle}
            </Button>
          ))}
        </div>
        
        {/* Exercise list */}
        <div className="flex-1 overflow-y-auto -mx-4">
          {filteredExercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => {
                onSelect(exercise)
                onOpenChange(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <Dumbbell className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">{exercise.name}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {exercise.muscleGroup}
                </p>
              </div>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

---

## 10. Accessibility

### 10.1 Focus Management

```tsx
// Trap focus in modals
import { FocusTrap } from '@radix-ui/react-focus-trap'

<FocusTrap>
  <div role="dialog" aria-modal="true">
    {/* Modal content */}
  </div>
</FocusTrap>
```

### 10.2 Screen Reader Support

```tsx
// Announce dynamic changes
function AchievementUnlock({ achievement }) {
  return (
    <div role="alert" aria-live="polite">
      <p className="sr-only">
        Achievement unlocked: {achievement.name}. {achievement.description}
      </p>
      {/* Visual presentation */}
    </div>
  )
}
```

### 10.3 Reduced Motion

```css
/* globals.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 10.4 Color Contrast

Ensure all text meets WCAG AA standards:
- Normal text: 4.5:1 contrast ratio minimum
- Large text (18px+): 3:1 contrast ratio minimum
- UI components: 3:1 contrast ratio minimum

### 10.5 Touch Accessibility

```tsx
// Ensure touch targets are accessible
<Button
  aria-label="Add exercise"
  className="min-h-[44px] min-w-[44px]"
>
  <Plus className="h-5 w-5" />
</Button>
```

---

## 11. Testing Requirements

### 11.1 Device Testing Matrix

Test on these devices/viewports minimum:

| Device | Width | Pixel Ratio |
|--------|-------|-------------|
| iPhone SE | 375px | 2x |
| iPhone 14 | 390px | 3x |
| iPhone 14 Pro Max | 430px | 3x |
| Samsung Galaxy S21 | 360px | 3x |
| iPad Mini | 768px | 2x |
| iPad Pro | 1024px | 2x |

### 11.2 Automated Tests

```tsx
// Mobile viewport tests
describe('Mobile Responsive', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
  })

  it('shows bottom navigation on mobile', () => {
    cy.visit('/dashboard')
    cy.get('[data-testid="bottom-nav"]').should('be.visible')
    cy.get('[data-testid="desktop-nav"]').should('not.be.visible')
  })

  it('has touch-friendly buttons', () => {
    cy.visit('/workouts/new')
    cy.get('button').each(($btn) => {
      const rect = $btn[0].getBoundingClientRect()
      expect(rect.height).to.be.at.least(44)
      expect(rect.width).to.be.at.least(44)
    })
  })
})
```

### 11.3 Performance Budget

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| Total Blocking Time | < 200ms |
| Cumulative Layout Shift | < 0.1 |
| Bundle Size (JS) | < 200KB gzipped |

### 11.4 Lighthouse Scores

Target scores for mobile:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90
- PWA: Pass all audits

### 11.5 Manual Testing Checklist

- [ ] Test with one hand (thumb reach zones)
- [ ] Test in portrait and landscape
- [ ] Test with system font size increased
- [ ] Test with screen reader (VoiceOver/TalkBack)
- [ ] Test offline functionality
- [ ] Test install flow (Add to Home Screen)
- [ ] Test push notifications
- [ ] Test on slow 3G network
- [ ] Test pull-to-refresh
- [ ] Test all swipe gestures
- [ ] Test keyboard navigation
- [ ] Test form submission on mobile keyboard

---

## Implementation Priority

### Phase 1: Critical (Week 1)
1. Touch target optimization (all interactive elements ≥ 44px)
2. Bottom navigation implementation
3. Responsive grid/layout fixes
4. Input field mobile optimization

### Phase 2: Important (Week 2)
1. PWA manifest and service worker
2. Active workout screen optimization
3. Number input components
4. Rest timer improvements

### Phase 3: Enhancement (Week 3)
1. Gesture support (swipe, pull-to-refresh)
2. Offline data storage
3. Install prompt
4. Performance optimizations

### Phase 4: Polish (Week 4)
1. Animations and transitions
2. Accessibility audit and fixes
3. Cross-device testing
4. Performance testing and optimization

---

## Files to Create/Modify

### New Files
- `src/components/layout/BottomNav.tsx`
- `src/components/workout/NumberInput.tsx`
- `src/components/workout/RestTimerOverlay.tsx`
- `src/components/workout/ExerciseSwiper.tsx`
- `src/components/InstallPrompt.tsx`
- `src/components/OfflineIndicator.tsx`
- `src/hooks/useOnlineStatus.ts`
- `src/hooks/usePullToRefresh.ts`
- `src/lib/offline-storage.ts`
- `public/manifest.json`
- `public/icons/` (PWA icons)

### Files to Modify
- `src/components/ui/button.tsx` (touch targets)
- `src/components/ui/input.tsx` (mobile input)
- `src/components/layout/Header.tsx` (simplify mobile)
- `src/app/layout.tsx` (PWA meta, bottom nav)
- `src/styles/globals.css` (mobile-first styles)
- `next.config.js` (PWA config)
- All page components (responsive layouts)

---

## Success Metrics

After implementation, measure:

1. **User Engagement**
   - Mobile session duration increase
   - Mobile bounce rate decrease
   - PWA install rate

2. **Performance**
   - Lighthouse mobile score > 90
   - FCP < 1.5s on 3G
   - TTI < 3.5s on 3G

3. **Usability**
   - Task completion rate on mobile
   - Error rate decrease
   - User satisfaction surveys

---

*This prompt provides a comprehensive guide for implementing mobile optimization in FitTrack. Each section can be tackled independently, with clear requirements and code examples.*
