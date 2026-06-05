import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'

export const metadata: Metadata = {
  title: 'ArgueBot — Are You Actually Right?',
  description: 'Drop your argument. AI searches the web, weighs the facts, and delivers the verdict with zero mercy and maximum personality.',
  keywords: ['fact checker', 'argument checker', 'ai debate', 'are you right', 'arguebot'],
  authors: [{ name: 'ArgueBot' }],
  creator: 'ArgueBot',
  metadataBase: new URL('https://arguebot.vercel.app'),
  openGraph: {
    type:        'website',
    url:         'https://arguebot.vercel.app',
    title:       'ArgueBot — Are You Actually Right?',
    description: 'Drop your argument. AI searches the web, weighs the facts, and delivers the verdict with zero mercy and maximum personality.',
    siteName:    'ArgueBot',
    images: [{
      url:    '/api/og',
      width:  1200,
      height: 630,
      alt:    'ArgueBot — AI Fact Checker',
    }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'ArgueBot — Are You Actually Right?',
    description: 'Drop your argument. AI searches the web and delivers the verdict — with zero mercy.',
    images:      ['/api/og'],
    creator:     '@arguebot',
  },
  robots: {
    index:  true,
    follow: true,
  },
  icons: {
    icon:  '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ flex: 1 }}>{children}</div>
            <Footer />
          </div>
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  )
}
