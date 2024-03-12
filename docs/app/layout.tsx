import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'MetaRoute - API framework',
  description: 'API framework',
  manifest: '/site.webmanifest'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-mono">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
