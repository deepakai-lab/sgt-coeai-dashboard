import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { DemoBanner } from '@/components/demo-banner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'CoE AI — SGT University',
  description: 'Centre of Excellence for AI at SGT University. Practical AI for teaching, research, operations and student development.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <DemoBanner />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
