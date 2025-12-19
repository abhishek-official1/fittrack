'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Save, Target, Ruler, Scale, Calendar as CalendarIcon } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/useToast'
import { fitnessGoals, experienceLevels } from '@/lib/utils'
import type { User as UserType } from '@/types'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    fitnessGoal: 'general',
    experienceLevel: 'beginner',
    weight: '',
    height: '',
    birthDate: '',
    gender: '',
    preferredUnits: 'metric',
    weeklyGoal: 3,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/profile')
        const data = await res.json()

        if (!data.success) {
          router.push('/auth/login')
          return
        }

        setUser(data.data)
        setFormData({
          name: data.data.name || '',
          fitnessGoal: data.data.profile?.fitnessGoal || 'general',
          experienceLevel: data.data.profile?.experienceLevel || 'beginner',
          weight: data.data.profile?.weight?.toString() || '',
          height: data.data.profile?.height?.toString() || '',
          birthDate: data.data.profile?.birthDate ? new Date(data.data.profile.birthDate).toISOString().split('T')[0] : '',
          gender: data.data.profile?.gender || '',
          preferredUnits: data.data.profile?.preferredUnits || 'metric',
          weeklyGoal: data.data.profile?.weeklyGoal || 3,
        })
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          height: formData.height ? parseFloat(formData.height) : null,
        })
      })

      const data = await res.json()

      if (data.success) {
        setUser(data.data)
        toast({ title: 'Profile updated!', variant: 'success' })
      } else {
        toast({ title: data.error || 'Failed to update profile', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Failed to update profile', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header user={user} />
        <main className="container px-4 py-8 max-w-2xl">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header user={user} />
      
      <main className="container px-4 py-8 max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings
            </p>
          </div>
          <Button onClick={handleSave} loading={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="space-y-6">
          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your basic account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Email"
                value={user?.email || ''}
                disabled
                helperText="Email cannot be changed"
              />
            </CardContent>
          </Card>

          {/* Fitness Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Fitness Goals
              </CardTitle>
              <CardDescription>
                Set your training objectives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={formData.fitnessGoal}
                onValueChange={(v) => setFormData({ ...formData, fitnessGoal: v })}
              >
                <SelectTrigger label="Primary Goal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fitnessGoals.map((goal) => (
                    <SelectItem key={goal.value} value={goal.value}>
                      {goal.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={formData.experienceLevel}
                onValueChange={(v) => setFormData({ ...formData, experienceLevel: v })}
              >
                <SelectTrigger label="Experience Level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Weekly Workout Goal
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1}
                    max={7}
                    value={formData.weeklyGoal}
                    onChange={(e) => setFormData({ ...formData, weeklyGoal: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold w-20 text-center">
                    {formData.weeklyGoal} days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Body Measurements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Body Measurements
              </CardTitle>
              <CardDescription>
                Track your physical stats (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={formData.preferredUnits}
                onValueChange={(v) => setFormData({ ...formData, preferredUnits: v })}
              >
                <SelectTrigger label="Preferred Units">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                  <SelectItem value="imperial">Imperial (lbs, in)</SelectItem>
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={`Weight (${formData.preferredUnits === 'metric' ? 'kg' : 'lbs'})`}
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="0"
                />
                <Input
                  label={`Height (${formData.preferredUnits === 'metric' ? 'cm' : 'in'})`}
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Birth Date"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
                <Select
                  value={formData.gender}
                  onValueChange={(v) => setFormData({ ...formData, gender: v })}
                >
                  <SelectTrigger label="Gender">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
              <Button variant="outline" className="text-destructive border-destructive">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
