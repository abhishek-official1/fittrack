'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dumbbell, Sparkles } from 'lucide-react'

export default function CoachSetupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    age: 21,
    weight: 90,
    height: 165,
    gender: 'male',
    caloriesMin: 2300,
    caloriesMax: 2400,
    proteinMin: 160,
    proteinMax: 190,
    stepsTarget: 9000,
    waterTarget: 3.0,
    sleepTarget: 7.5,
    mobilityTarget: 10
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/coach-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await res.json()
      if (result.success) {
        router.push('/coach/today')
      } else {
        alert(result.error || 'Failed to create coach plan')
      }
    } catch (err) {
      console.error('Error creating coach plan:', err)
      alert('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Enable Coach Plan</h1>
          </div>
          <p className="text-muted-foreground">
            Set up your personalized 6-day PPL (Push/Pull/Legs) training program with smart recovery tracking, 
            progressive overload suggestions, and daily nutrition guidance.
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <Dumbbell className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">6-Day PPL Split</p>
                    <p className="text-sm text-muted-foreground">Push A/B, Pull A/B, Legs A/B with 1 rest day</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Smart Training Suggestions</p>
                    <p className="text-sm text-muted-foreground">Recovery tracking + progressive overload recommendations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Daily Nutrition Targets</p>
                    <p className="text-sm text-muted-foreground">Calories, protein, and macro guidance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Daily Checklist</p>
                    <p className="text-sm text-muted-foreground">Steps, water, sleep, and mobility tracking</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Help us personalize your plan</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Daily Nutrition Targets</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="caloriesMin" className="text-sm text-muted-foreground">Calories (min)</Label>
                      <Input
                        id="caloriesMin"
                        type="number"
                        value={formData.caloriesMin}
                        onChange={(e) => setFormData({ ...formData, caloriesMin: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="caloriesMax" className="text-sm text-muted-foreground">Calories (max)</Label>
                      <Input
                        id="caloriesMax"
                        type="number"
                        value={formData.caloriesMax}
                        onChange={(e) => setFormData({ ...formData, caloriesMax: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="proteinMin" className="text-sm text-muted-foreground">Protein (min g)</Label>
                      <Input
                        id="proteinMin"
                        type="number"
                        value={formData.proteinMin}
                        onChange={(e) => setFormData({ ...formData, proteinMin: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="proteinMax" className="text-sm text-muted-foreground">Protein (max g)</Label>
                      <Input
                        id="proteinMax"
                        type="number"
                        value={formData.proteinMax}
                        onChange={(e) => setFormData({ ...formData, proteinMax: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Daily Checklist Targets</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stepsTarget" className="text-sm text-muted-foreground">Steps</Label>
                      <Input
                        id="stepsTarget"
                        type="number"
                        value={formData.stepsTarget}
                        onChange={(e) => setFormData({ ...formData, stepsTarget: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="waterTarget" className="text-sm text-muted-foreground">Water (L)</Label>
                      <Input
                        id="waterTarget"
                        type="number"
                        step="0.1"
                        value={formData.waterTarget}
                        onChange={(e) => setFormData({ ...formData, waterTarget: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sleepTarget" className="text-sm text-muted-foreground">Sleep (hours)</Label>
                      <Input
                        id="sleepTarget"
                        type="number"
                        step="0.5"
                        value={formData.sleepTarget}
                        onChange={(e) => setFormData({ ...formData, sleepTarget: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mobilityTarget" className="text-sm text-muted-foreground">Mobility (min)</Label>
                      <Input
                        id="mobilityTarget"
                        type="number"
                        value={formData.mobilityTarget}
                        onChange={(e) => setFormData({ ...formData, mobilityTarget: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? 'Creating Plan...' : 'Enable Coach Plan'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
