'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Dumbbell, Clock, Trash2, Play, Copy } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/hooks/useToast'
import { formatDuration } from '@/lib/utils'
import type { WorkoutTemplate, User } from '@/types'

export default function TemplatesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, templatesRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/templates')
        ])

        const userData = await userRes.json()
        if (!userData.success) {
          router.push('/auth/login')
          return
        }
        setUser(userData.data)

        const templatesData = await templatesRes.json()
        if (templatesData.success) {
          setTemplates(templatesData.data)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        setTemplates(templates.filter(t => t.id !== id))
        toast({ title: 'Template deleted', variant: 'success' })
      } else {
        toast({ title: data.error || 'Failed to delete', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Failed to delete template', variant: 'destructive' })
    }
  }

  const startWorkoutFromTemplate = (templateId: string) => {
    router.push(`/workouts/new?template=${templateId}`)
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      push_pull_legs: 'Push/Pull/Legs',
      upper_lower: 'Upper/Lower',
      full_body: 'Full Body',
      bro_split: 'Bro Split',
      custom: 'Custom'
    }
    return labels[category] || category
  }

  const systemTemplates = templates.filter(t => !t.userId)
  const userTemplates = templates.filter(t => t.userId)

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header user={user} />
        <main className="container px-4 py-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header user={user} />
      
      <main className="container px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Workout Templates</h1>
            <p className="text-muted-foreground mt-1">
              Pre-built workout routines to get you started
            </p>
          </div>
          <Link href="/workouts/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </Link>
        </div>

        {/* User Templates */}
        {userTemplates.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">My Templates</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {template.description || `${template.exercises?.length || 0} exercises`}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{getCategoryLabel(template.category)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Dumbbell className="h-4 w-4" />
                        {template.exercises?.length || 0} exercises
                      </span>
                      {template.estimatedDuration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDuration(template.estimatedDuration)}
                        </span>
                      )}
                    </div>
                    {template.exercises && template.exercises.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.exercises.slice(0, 4).map((te) => (
                          <Badge key={te.id} variant="outline" className="text-xs">
                            {te.exercise.name}
                          </Badge>
                        ))}
                        {template.exercises.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.exercises.length - 4} more
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={() => startWorkoutFromTemplate(template.id)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* System Templates */}
        {systemTemplates.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Pre-built Templates</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {systemTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {template.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge>{getCategoryLabel(template.category)}</Badge>
                        <Badge variant="outline">{template.difficulty}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Dumbbell className="h-4 w-4" />
                        {template.exercises?.length || 0} exercises
                      </span>
                      {template.estimatedDuration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDuration(template.estimatedDuration)}
                        </span>
                      )}
                    </div>
                    {template.targetMuscles && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.targetMuscles.split(',').map((muscle) => (
                          <Badge key={muscle} variant="secondary" className="text-xs capitalize">
                            {muscle.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Button 
                      className="w-full"
                      onClick={() => startWorkoutFromTemplate(template.id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {templates.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Dumbbell className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No templates yet</h3>
              <p className="text-muted-foreground mb-6 text-center">
                Create your first workout template to save time
              </p>
              <Link href="/workouts/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
