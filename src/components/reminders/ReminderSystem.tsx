'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ReminderSystem() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
      checkReminderStatus()
    }
  }, [])

  const checkReminderStatus = () => {
    const enabled = localStorage.getItem('reminders_enabled') === 'true'
    setIsEnabled(enabled)
    if (enabled) {
      scheduleReminder()
    }
  }

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      if (permission === 'granted') {
        enableReminders()
      }
    }
  }

  const enableReminders = () => {
    localStorage.setItem('reminders_enabled', 'true')
    setIsEnabled(true)
    scheduleReminder()
    showNotification('Reminders Enabled', 'You\'ll get evening reminders to log your workout and nutrition!')
  }

  const disableReminders = () => {
    localStorage.setItem('reminders_enabled', 'false')
    setIsEnabled(false)
  }

  const scheduleReminder = () => {
    // Check every hour if it's time to remind
    setInterval(() => {
      const now = new Date()
      const hour = now.getHours()
      
      // Reminder at 19:00 (7 PM)
      if (hour === 19 && now.getMinutes() < 5) {
        const lastReminder = localStorage.getItem('last_reminder_date')
        const today = new Date().toDateString()
        
        if (lastReminder !== today) {
          sendEveningReminder()
          localStorage.setItem('last_reminder_date', today)
        }
      }
    }, 60000) // Check every minute
  }

  const sendEveningReminder = async () => {
    // Check today's progress
    try {
      const res = await fetch('/api/coach-plan/today')
      const result = await res.json()
      
      if (result.success && result.data) {
        const { workout, nutrition } = result.data
        
        let message = 'Time to review your day!'
        if (!workout.hasStarted) {
          message = 'Don\'t forget to log your workout!'
        } else if (nutrition.proteinProgress < 80) {
          message = `You need ${Math.round(nutrition.remainingProtein)}g more protein today!`
        }
        
        showNotification('FitTrack Evening Check-in', message)
      }
    } catch (err) {
      console.error('Error fetching reminder data:', err)
    }
  }

  const showNotification = (title: string, body: string) => {
    if (permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icons/icon.svg',
        badge: '/icons/icon.svg',
        tag: 'fittrack-reminder',
        requireInteraction: false
      })
    }
  }

  const testNotification = () => {
    showNotification('Test Notification', 'Your reminders are working! You\'ll get notifications at 7 PM daily.')
  }

  if (!('Notification' in window)) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Evening Reminders
        </CardTitle>
        <CardDescription>
          Get notified to log workouts and track nutrition
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {permission === 'denied' && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm">
            <p className="font-medium text-destructive">Notifications Blocked</p>
            <p className="text-muted-foreground mt-1">
              Please enable notifications in your browser settings to use reminders.
            </p>
          </div>
        )}

        {permission === 'default' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Enable browser notifications to get reminded at 7 PM every day to log your workout and check your nutrition targets.
            </p>
            <Button onClick={requestPermission} className="w-full">
              <Bell className="h-4 w-4 mr-2" />
              Enable Reminders
            </Button>
          </div>
        )}

        {permission === 'granted' && (
          <div className="space-y-3">
            {isEnabled ? (
              <>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm">
                  <p className="font-medium text-green-500">Reminders Active</p>
                  <p className="text-muted-foreground mt-1">
                    You'll get a notification at 7 PM each day
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={testNotification} className="flex-1">
                    Test Notification
                  </Button>
                  <Button variant="outline" onClick={disableReminders} className="flex-1">
                    <BellOff className="h-4 w-4 mr-2" />
                    Disable
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Reminders are currently disabled. Enable them to get daily check-ins.
                </p>
                <Button onClick={enableReminders} className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Enable Reminders
                </Button>
              </>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p><strong>What you'll be reminded about:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Log your workout if you haven't yet</li>
            <li>Track your nutrition if below target</li>
            <li>Complete your daily checklist items</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
