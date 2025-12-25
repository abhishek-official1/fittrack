'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookTemplate, Plus, Trash2, Dumbbell, ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Template {
  id: string
  name: string
  description: string | null
  category: string
  targetMuscles: string | null
  estimatedDuration: number | null
  difficulty: string
  isPublic: boolean
  userId: string | null
  exercises: Array<{
    order: number
    sets: number
    targetReps: string | null
    exercise: {
      id: string
      name: string
      muscleGroup: string
    }
  }>
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates')
      const result = await res.json()
      if (result.success) {
        setTemplates(result.data)
      }
    } catch (err) {
      console.error('Error fetching templates:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return

    try {
      const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchTemplates()
      }
    } catch (err) {
      console.error('Error deleting template:', err)
    }
  }

  const systemTemplates = templates.filter(t => t.userId === null || t.isPublic)
  const myTemplates = templates.filter(t => t.userId !== null && !t.isPublic)
  const coachTemplates = templates.filter(t => t.name.startsWith('Coach'))

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 py-8 max-w-6xl">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  const TemplateCard = ({ template }: { template: Template }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            {template.description && (
              <CardDescription className="mt-1">{template.description}</CardDescription>
            )}
          </div>
          {template.name.startsWith('Coach') && (
            <Badge variant="secondary">Coach</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-sm">
          {template.estimatedDuration && (
            <Badge variant="outline">{template.estimatedDuration} min</Badge>
          )}
          <Badge variant="outline" className="capitalize">{template.difficulty}</Badge>
          {template.targetMuscles && (
            <Badge variant="outline">{template.targetMuscles.split(',').length} muscles</Badge>
          )}
        </div>

        <div>
          <p className="text-sm font-medium mb-2">{template.exercises.length} Exercises:</p>
          <div className="space-y-1">
            {template.exercises.slice(0, 3).map((ex) => (
              <div key={ex.exercise.id} className="text-sm text-muted-foreground flex items-center gap-2">
                <Dumbbell className="h-3 w-3" />
                <span>{ex.exercise.name}</span>
                <span className="text-xs">({ex.sets} × {ex.targetReps})</span>
              </div>
            ))}
            {template.exercises.length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{template.exercises.length - 3} more exercises
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button asChild className="flex-1">
            <Link href={`/workouts/new?template=${template.id}`}>
              Use Template
            </Link>
          </Button>
          {template.userId !== null && !template.name.startsWith('Coach') && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDelete(template.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 py-8 max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookTemplate className="h-8 w-8 text-primary" />
              Workout Templates
            </h1>
            <p className="text-muted-foreground mt-1">
              Pre-built workout routines for quick starts
            </p>
          </div>
          <Button asChild>
            <Link href="/templates/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="coach" className="space-y-6">
          <TabsList>
            <TabsTrigger value="coach">
              Coach Templates ({coachTemplates.length})
            </TabsTrigger>
            <TabsTrigger value="system">
              Pre-built ({systemTemplates.length})
            </TabsTrigger>
            <TabsTrigger value="custom">
              My Templates ({myTemplates.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coach" className="space-y-6">
            {coachTemplates.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <BookTemplate className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">
                      No coach templates yet. Enable Coach Plan to get personalized PPL templates.
                    </p>
                    <Button asChild>
                      <Link href="/coach/setup">Set Up Coach Plan</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <ChevronRight className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-500">Coach Plan Templates</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        These templates are part of your 6-day PPL Coach Plan. Use them to start today's workout or create custom variations.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {coachTemplates.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            {systemTemplates.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-8">
                  <p className="text-muted-foreground">No system templates available</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {systemTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            {myTemplates.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <BookTemplate className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">
                      You haven't created any custom templates yet
                    </p>
                    <Button asChild>
                      <Link href="/templates/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Template
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>About Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">System Templates:</strong> Pre-built workout routines like Push/Pull/Legs, Upper/Lower, and Full Body splits.
            </p>
            <p>
              <strong className="text-foreground">Coach Templates:</strong> Personalized templates from your Coach Plan, designed specifically for your 6-day PPL program.
            </p>
            <p>
              <strong className="text-foreground">Custom Templates:</strong> Your own workout routines that you can reuse anytime.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
