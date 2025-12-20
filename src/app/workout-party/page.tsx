'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  Users, 
  PartyPopper,
  Copy,
  Check,
  Play,
  Trophy,
  Dumbbell,
  MessageCircle,
  Heart,
  Flame,
  ThumbsUp,
  Sparkles
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { formatWeight, formatTime } from '@/lib/utils'

interface Participant {
  id: string
  totalSets: number
  totalVolume: number
  prsAchieved: number
  user: { id: string; name: string; avatarUrl: string | null }
}

interface PartyEvent {
  id: string
  eventType: string
  eventData: any
  createdAt: string
  user: { id: string; name: string; avatarUrl: string | null }
}

interface Party {
  id: string
  code: string
  name: string
  status: 'waiting' | 'active' | 'completed'
  maxParticipants: number
  startedAt: string | null
  host: { id: string; name: string; avatarUrl: string | null }
  participants: Participant[]
}

const eventIcons: Record<string, any> = {
  set_completed: Dumbbell,
  pr_achieved: Trophy,
  exercise_started: Play,
  joined: Users,
  left: Users,
  reaction: Heart
}

const reactionEmojis = ['💪', '🔥', '👏', '⚡', '🎯', '💯']

function WorkoutPartyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const codeParam = searchParams.get('code')
  
  const [party, setParty] = useState<Party | null>(null)
  const [events, setEvents] = useState<PartyEvent[]>([])
  const [stats, setStats] = useState<Participant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [joinCode, setJoinCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  
  const eventsEndRef = useRef<HTMLDivElement>(null)
  const pollInterval = useRef<NodeJS.Timeout | null>(null)

  // Get current user
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCurrentUserId(data.data.id)
      })
  }, [])

  // Fetch party if code provided
  useEffect(() => {
    if (codeParam) {
      fetchParty(codeParam)
    } else {
      setIsLoading(false)
    }
  }, [codeParam])

  // Poll for updates when in party
  useEffect(() => {
    if (party && party.status !== 'completed') {
      pollInterval.current = setInterval(() => {
        fetchEvents()
      }, 2000) // Poll every 2 seconds
    }

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current)
    }
  }, [party?.id, party?.status])

  // Auto-scroll to new events
  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [events])

  const fetchParty = async (code: string) => {
    try {
      const res = await fetch(`/api/workout-parties/${code}`)
      const data = await res.json()
      if (data.party) {
        setParty(data.party)
        setEvents(data.party.events || [])
      }
    } catch (error) {
      console.error('Failed to fetch party:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEvents = async () => {
    if (!party) return
    try {
      const since = events.length > 0 ? events[events.length - 1].createdAt : undefined
      const params = new URLSearchParams()
      if (since) params.set('since', since)
      
      const res = await fetch(`/api/workout-parties/${party.code}/events?${params}`)
      const data = await res.json()
      if (data.events?.length > 0) {
        setEvents(prev => [...prev, ...data.events])
      }
      if (data.stats) setStats(data.stats)
      if (data.partyStatus && data.partyStatus !== party.status) {
        setParty(prev => prev ? { ...prev, status: data.partyStatus } : null)
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    }
  }

  const createParty = async () => {
    setIsCreating(true)
    try {
      const res = await fetch('/api/workout-parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Workout Party' })
      })
      const data = await res.json()
      if (data.party) {
        router.push(`/workout-party?code=${data.party.code}`)
      }
    } catch (error) {
      console.error('Failed to create party:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const joinParty = async () => {
    if (!joinCode.trim()) return
    setIsJoining(true)
    try {
      const res = await fetch(`/api/workout-parties/${joinCode}/join`, { method: 'POST' })
      if (res.ok) {
        router.push(`/workout-party?code=${joinCode.toUpperCase()}`)
      }
    } catch (error) {
      console.error('Failed to join party:', error)
    } finally {
      setIsJoining(false)
    }
  }

  const leaveParty = async () => {
    if (!party) return
    try {
      await fetch(`/api/workout-parties/${party.code}/join`, { method: 'DELETE' })
      router.push('/workout-party')
      setParty(null)
    } catch (error) {
      console.error('Failed to leave party:', error)
    }
  }

  const startParty = async () => {
    if (!party) return
    try {
      await fetch(`/api/workout-parties/${party.code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      })
      setParty(prev => prev ? { ...prev, status: 'active', startedAt: new Date().toISOString() } : null)
    } catch (error) {
      console.error('Failed to start party:', error)
    }
  }

  const endParty = async () => {
    if (!party) return
    try {
      await fetch(`/api/workout-parties/${party.code}`, { method: 'DELETE' })
      setParty(prev => prev ? { ...prev, status: 'completed' } : null)
    } catch (error) {
      console.error('Failed to end party:', error)
    }
  }

  const sendReaction = async (emoji: string) => {
    if (!party) return
    try {
      await fetch(`/api/workout-parties/${party.code}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'reaction', eventData: { emoji } })
      })
    } catch (error) {
      console.error('Failed to send reaction:', error)
    }
  }

  const copyCode = () => {
    if (!party) return
    navigator.clipboard.writeText(party.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isHost = party?.host.id === currentUserId
  const isParticipant = party?.participants.some(p => p.user.id === currentUserId)

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-96" />
        </main>
      </div>
    )
  }

  // No party - show create/join
  if (!party) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 py-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <PartyPopper className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-3xl font-bold">Workout Party</h1>
            <p className="text-muted-foreground mt-2">
              Work out together with friends in real-time
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Create a Party</CardTitle>
                <CardDescription>Start a new workout session and invite friends</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={createParty} disabled={isCreating} className="w-full" size="lg">
                  {isCreating ? 'Creating...' : 'Start Party'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Join a Party</CardTitle>
                <CardDescription>Enter a 6-character party code</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    maxLength={6}
                    className="font-mono text-center text-lg tracking-widest"
                  />
                  <Button onClick={joinParty} disabled={isJoining || joinCode.length !== 6}>
                    {isJoining ? '...' : 'Join'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  // In party view
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container px-4 py-8">
        {/* Party Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <PartyPopper className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{party.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={party.status === 'active' ? 'success' : party.status === 'completed' ? 'secondary' : 'outline'}>
                      {party.status}
                    </Badge>
                    <span className="text-muted-foreground">
                      {party.participants.length}/{party.maxParticipants} participants
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                  <span className="font-mono text-xl tracking-widest">{party.code}</span>
                  <Button variant="ghost" size="icon" onClick={copyCode}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                {isHost && party.status === 'waiting' && (
                  <Button onClick={startParty}>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                )}
                {isHost && party.status === 'active' && (
                  <Button variant="destructive" onClick={endParty}>
                    End Party
                  </Button>
                )}
                {!isHost && isParticipant && (
                  <Button variant="outline" onClick={leaveParty}>
                    Leave
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Participants & Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {party.participants.map((p, i) => {
                  const stat = stats.find((s: any) => s.userId === p.user.id) || p
                  return (
                    <div key={p.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-muted-foreground w-6">
                          {i === 0 && stat.totalVolume > 0 ? '🥇' : `#${i + 1}`}
                        </span>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{p.user.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            {p.user.name}
                            {party.host.id === p.user.id && (
                              <Badge variant="outline" className="text-xs">Host</Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {stat.totalSets} sets • {formatWeight(stat.totalVolume, 'metric')}
                          </p>
                        </div>
                      </div>
                      {stat.prsAchieved > 0 && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          {stat.prsAchieved}
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Live Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-y-auto space-y-3 pr-2">
                {events.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No activity yet</p>
                    <p className="text-sm mt-2">Start your workout to see updates!</p>
                  </div>
                ) : (
                  events.map(event => {
                    const Icon = eventIcons[event.eventType] || MessageCircle
                    return (
                      <div key={event.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback>{event.user.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{event.user.name}</span>
                            {event.eventType === 'pr_achieved' && (
                              <Badge variant="success" className="text-xs">PR!</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {event.eventType === 'set_completed' && event.eventData && (
                              <>Completed a set: {formatWeight(event.eventData.weight, 'metric')} x {event.eventData.reps} reps</>
                            )}
                            {event.eventType === 'pr_achieved' && 'Just hit a new PR! 🎉'}
                            {event.eventType === 'exercise_started' && event.eventData && (
                              <>Started {event.eventData.exerciseName}</>
                            )}
                            {event.eventType === 'joined' && 'Joined the party'}
                            {event.eventType === 'left' && 'Left the party'}
                            {event.eventType === 'reaction' && event.eventData && (
                              <span className="text-2xl">{event.eventData.emoji}</span>
                            )}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatTime(new Date(event.createdAt))}
                        </span>
                      </div>
                    )
                  })
                )}
                <div ref={eventsEndRef} />
              </div>

              {/* Quick Reactions */}
              {party.status === 'active' && isParticipant && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <span className="text-sm text-muted-foreground mr-2">React:</span>
                  {reactionEmojis.map(emoji => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="text-xl p-2 h-auto"
                      onClick={() => sendReaction(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function WorkoutPartyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 py-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <PartyPopper className="h-16 w-16 mx-auto mb-4 text-primary" />
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </main>
      </div>
    }>
      <WorkoutPartyContent />
    </Suspense>
  )
}
