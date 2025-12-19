import Link from 'next/link'
import { Dumbbell, BarChart3, Calendar, Target, Zap, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/Header'

const features = [
  {
    icon: Dumbbell,
    title: 'Workout Logging',
    description: 'Log exercises, sets, reps, and weights with ease. Support for all exercise types.',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description: 'Visualize your progress with interactive charts and detailed statistics.',
  },
  {
    icon: Calendar,
    title: 'Calendar View',
    description: 'View your workout history and plan future sessions with the calendar.',
  },
  {
    icon: Target,
    title: 'Goal Tracking',
    description: 'Set and track fitness goals for strength, hypertrophy, or endurance.',
  },
  {
    icon: Zap,
    title: 'Rest Timer',
    description: 'Built-in rest timer to keep your workouts efficient and on track.',
  },
  {
    icon: Trophy,
    title: 'Personal Records',
    description: 'Automatic PR detection celebrates your achievements and progress.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="container relative px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Track Your Fitness Journey with{' '}
                <span className="text-primary">FitTrack</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                The ultimate workout tracking app for athletes and fitness enthusiasts. 
                Log workouts, analyze progress, and achieve your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="xl" className="w-full sm:w-auto">
                    Start Free Today
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="xl" variant="outline" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                FitTrack provides all the tools you need to track, analyze, and improve your workouts.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {features.map((feature) => (
                <Card key={feature.title} className="border-0 shadow-sm">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Training?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of athletes who use FitTrack to reach their fitness goals.
              </p>
              <Link href="/auth/signup">
                <Button size="xl">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              <span className="font-semibold">FitTrack</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for athletes, by athletes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
