import Link from 'next/link'
import { FileText, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function HiddenFeaturesWidget() {
  return (
    <div className="grid gap-4 md:grid-cols-3 mt-8">
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
