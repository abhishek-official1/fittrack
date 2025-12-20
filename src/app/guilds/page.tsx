'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Trophy, 
  Shield, 
  Plus, 
  Search,
  Crown,
  Swords,
  ChevronRight
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatNumber } from '@/lib/utils'

interface Guild {
  id: string
  name: string
  description: string | null
  avatarUrl: string | null
  guildType: string
  tier: string
  totalXP: number
  seasonXP: number
  totalWorkouts: number
  memberCount: number
  maxMembers: number
  leader: { id: string; name: string; avatarUrl: string | null } | null
}

interface MyGuild extends Guild {
  userRole: string
  userXPContributed: number
  globalRank: number
  members: Array<{
    id: string
    role: string
    xpContributed: number
    user: { id: string; name: string; avatarUrl: string | null }
  }>
  activeChallenges: Array<any>
}

const tierColors: Record<string, string> = {
  bronze: 'bg-orange-900/20 text-orange-400 border-orange-400/50',
  silver: 'bg-slate-400/20 text-slate-300 border-slate-300/50',
  gold: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/50',
  platinum: 'bg-cyan-400/20 text-cyan-300 border-cyan-300/50',
  diamond: 'bg-purple-400/20 text-purple-300 border-purple-300/50'
}

export default function GuildsPage() {
  const router = useRouter()
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [myGuild, setMyGuild] = useState<MyGuild | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newGuild, setNewGuild] = useState({ name: '', description: '' })
  const [isCreating, setIsCreating] = useState(false)

  const fetchData = async () => {
    try {
      const [guildsRes, myGuildRes] = await Promise.all([
        fetch('/api/guilds'),
        fetch('/api/guilds/my-guild')
      ])

      const guildsData = await guildsRes.json()
      if (guildsData.guilds) setGuilds(guildsData.guilds)

      const myGuildData = await myGuildRes.json()
      if (myGuildData.guild) setMyGuild(myGuildData.guild)
    } catch (error) {
      console.error('Failed to fetch guilds:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateGuild = async () => {
    if (!newGuild.name.trim()) return
    setIsCreating(true)
    try {
      const res = await fetch('/api/guilds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGuild)
      })
      const data = await res.json()
      if (data.guild) {
        setIsCreateOpen(false)
        setNewGuild({ name: '', description: '' })
        fetchData()
      }
    } catch (error) {
      console.error('Failed to create guild:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinGuild = async (guildId: string) => {
    try {
      const res = await fetch(`/api/guilds/${guildId}/join`, { method: 'POST' })
      if (res.ok) fetchData()
    } catch (error) {
      console.error('Failed to join guild:', error)
    }
  }

  const handleLeaveGuild = async () => {
    if (!myGuild) return
    try {
      const res = await fetch(`/api/guilds/${myGuild.id}/join`, { method: 'DELETE' })
      if (res.ok) fetchData()
    } catch (error) {
      console.error('Failed to leave guild:', error)
    }
  }

  const filteredGuilds = guilds.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
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
      <Header />
      
      <main className="container px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Guilds
            </h1>
            <p className="text-muted-foreground mt-1">
              Join a guild to compete as a team
            </p>
          </div>
          {!myGuild && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Guild
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Guild</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Guild Name</Label>
                    <Input
                      value={newGuild.name}
                      onChange={e => setNewGuild({ ...newGuild, name: e.target.value })}
                      placeholder="Enter guild name"
                      maxLength={30}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (optional)</Label>
                    <Textarea
                      value={newGuild.description}
                      onChange={e => setNewGuild({ ...newGuild, description: e.target.value })}
                      placeholder="What's your guild about?"
                      maxLength={200}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateGuild} disabled={isCreating || !newGuild.name.trim()}>
                    {isCreating ? 'Creating...' : 'Create Guild'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Tabs defaultValue={myGuild ? 'my-guild' : 'browse'}>
          <TabsList className="mb-6">
            {myGuild && <TabsTrigger value="my-guild">My Guild</TabsTrigger>}
            <TabsTrigger value="browse">Browse Guilds</TabsTrigger>
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
          </TabsList>

          {myGuild && (
            <TabsContent value="my-guild">
              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="text-2xl">
                            {myGuild.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-2xl flex items-center gap-2">
                            {myGuild.name}
                            <Badge className={tierColors[myGuild.tier]}>
                              {myGuild.tier.toUpperCase()}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{myGuild.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline">#{myGuild.globalRank} Global</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{formatNumber(myGuild.totalXP)}</p>
                        <p className="text-sm text-muted-foreground">Total XP</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{myGuild.totalWorkouts}</p>
                        <p className="text-sm text-muted-foreground">Workouts</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{myGuild.memberCount}/{myGuild.maxMembers}</p>
                        <p className="text-sm text-muted-foreground">Members</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Your contribution: <span className="font-semibold">{formatNumber(myGuild.userXPContributed)} XP</span>
                      </p>
                      <Button variant="outline" size="sm" onClick={handleLeaveGuild}>
                        Leave Guild
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {myGuild.members.slice(0, 8).map((member, i) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {member.role === 'leader' && <Crown className="h-4 w-4 text-yellow-500" />}
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{member.user.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{member.user.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatNumber(member.xpContributed)} XP
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {myGuild.activeChallenges.length > 0 && (
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Swords className="h-5 w-5" />
                        Active Challenges
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        {myGuild.activeChallenges.map((challenge: any) => (
                          <div key={challenge.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <Badge>{challenge.challengeType.replace('_', ' ')}</Badge>
                              <Badge variant="outline">{challenge.status}</Badge>
                            </div>
                            <p className="font-semibold">
                              vs {challenge.defenderGuild?.name || challenge.challengerGuild?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Stake: {challenge.xpStake} XP
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          )}

          <TabsContent value="browse">
            <div className="mb-6">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search guilds..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredGuilds.map(guild => (
                <Card key={guild.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{guild.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate flex items-center gap-2">
                          {guild.name}
                          <Badge className={`${tierColors[guild.tier]} text-xs`}>
                            {guild.tier}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="truncate">
                          {guild.description || 'No description'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                      <div>
                        <p className="font-bold">{formatNumber(guild.totalXP)}</p>
                        <p className="text-xs text-muted-foreground">XP</p>
                      </div>
                      <div>
                        <p className="font-bold">{guild.memberCount}</p>
                        <p className="text-xs text-muted-foreground">Members</p>
                      </div>
                      <div>
                        <p className="font-bold">{guild.totalWorkouts}</p>
                        <p className="text-xs text-muted-foreground">Workouts</p>
                      </div>
                    </div>
                    {!myGuild && guild.memberCount < guild.maxMembers && (
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => handleJoinGuild(guild.id)}
                      >
                        Join Guild
                      </Button>
                    )}
                    {myGuild?.id === guild.id && (
                      <Badge variant="secondary" className="w-full justify-center">
                        Your Guild
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rankings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Guild Rankings
                </CardTitle>
                <CardDescription>Top guilds by total XP</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {guilds.slice(0, 20).map((guild, i) => (
                    <div 
                      key={guild.id} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        myGuild?.id === guild.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`text-lg font-bold w-8 ${
                          i === 0 ? 'text-yellow-500' : 
                          i === 1 ? 'text-slate-400' : 
                          i === 2 ? 'text-orange-400' : 'text-muted-foreground'
                        }`}>
                          #{i + 1}
                        </span>
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{guild.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold flex items-center gap-2">
                            {guild.name}
                            <Badge className={`${tierColors[guild.tier]} text-xs`}>
                              {guild.tier}
                            </Badge>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {guild.memberCount} members
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatNumber(guild.totalXP)} XP</p>
                        <p className="text-sm text-muted-foreground">
                          {guild.totalWorkouts} workouts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
