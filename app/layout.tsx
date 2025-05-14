import './globals.css'
import type { Metadata } from 'next'
import Navigation from './components/Navigation'

export const metadata: Metadata = {
  title: 'LSAT Prep Notebook',
  description: 'Your digital notebook for LSAT preparation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
} 