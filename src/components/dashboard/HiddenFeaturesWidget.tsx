import Link from 'next/link'
import { Utensils, Users, FileText, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function HiddenFeaturesWidget() {
  return (
    <div className="grid gap-4 md:grid-cols-3 mt-8">
      {/* Nutrition Card */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-900">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Utensils className="h-5 w-5 text-green-600 dark:text-green-400" />
            Nutrition
          </CardTitle>
          <CardDescription>Track your meals & macros</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/nutrition">
            <Button variant="outline" className="w-full bg-white/50 dark:bg-black/20 border-green-200 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-900/50">
              Log Meal
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Social Feed Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-900">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Social Feed
          </CardTitle>
          <CardDescription>See friends' activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/feed">
            <Button variant="outline" className="w-full bg-white/50 dark:bg-black/20 border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/50">
              View Activity
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Templates Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-900">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Templates
          </CardTitle>
          <CardDescription>Manage routine templates</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/templates">
            <Button variant="outline" className="w-full bg-white/50 dark:bg-black/20 border-purple-200 dark:border-purple-900 hover:bg-purple-100 dark:hover:bg-purple-900/50">
              Manage Routines
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
