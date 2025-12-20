import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Toaster } from '@/components/layout/Toaster'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { BottomNav } from '@/components/layout/BottomNav'
import { OfflineIndicator } from '@/components/OfflineIndicator'
import { InstallPrompt } from '@/components/InstallPrompt'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'FitTrack - Personal Workout Tracker',
  description: 'Track your workouts, monitor progress, and achieve your fitness goals with FitTrack.',
  keywords: ['workout', 'fitness', 'tracker', 'exercise', 'gym', 'training'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FitTrack',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <ErrorBoundary>
            <OfflineIndicator />
            <div className="pb-16 md:pb-0">
              {children}
            </div>
            <BottomNav />
            <InstallPrompt />
          </ErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
