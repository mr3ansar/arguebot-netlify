'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const CONSENT_KEY = 'arguebot_cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consented = localStorage.getItem(CONSENT_KEY)
    if (!consented) {
      const timer = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: 'var(--charcoal-2)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      flexWrap: 'wrap',
      boxShadow: '0 -8px 30px rgba(0,0,0,0.4)',
      animation: 'fadeInUp 0.4s ease both',
    }}>
      <p style={{
        margin: 0,
        fontSize: 13,
        color: 'var(--muted)',
        lineHeight: 1.5,
        textAlign: 'center',
      }}>
        ArgueBot uses Supabase auth cookies for login functionality only.{' '}
        No tracking or advertising cookies are used.{' '}
        <Link href="/privacy" style={{ color: 'var(--red-light)', textDecoration: 'underline' }}>
          Learn more
        </Link>
      </p>
      <button
        onClick={accept}
        style={{
          padding: '8px 24px',
          borderRadius: 12,
          border: 'none',
          background: 'var(--red)',
          color: 'white',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          boxShadow: '0 4px 14px var(--red-glow)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--red-light)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'var(--red)'
        }}
      >
        Got it
      </button>
    </div>
  )
}
