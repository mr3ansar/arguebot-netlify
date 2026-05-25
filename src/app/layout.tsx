import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ArgueBot — Are You Actually Right?',
  description: 'Drop your argument. We search the web, weigh the facts, and deliver the verdict with zero mercy and maximum personality.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
