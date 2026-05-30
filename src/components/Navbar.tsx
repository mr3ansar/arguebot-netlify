'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  onOpenHistory?: () => void
  historyCount?: number
}

export default function Navbar({ onOpenHistory, historyCount = 0 }: Props) {
  const pathname = usePathname()
  const isHome   = pathname === '/'

  return (
    <nav style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 40px',
      position: 'relative', zIndex: 10,
    }}>
      {/* Left — history icon + logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

        {/* History icon button — only on home */}
        {isHome && (
          <button
            onClick={onOpenHistory}
            title="Verdict History"
            style={{
              width: 42, height: 42,
              background: 'var(--charcoal-2)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s',
              position: 'relative', flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background   = 'var(--red)'
              e.currentTarget.style.borderColor  = 'var(--red)'
              e.currentTarget.style.boxShadow    = '0 4px 14px var(--red-glow)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background   = 'var(--charcoal-2)'
              e.currentTarget.style.borderColor  = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.boxShadow    = 'none'
            }}
          >
            {/* Hamburger / history icon */}
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
              <rect x="0" y="0"  width="16" height="2" rx="1" fill="currentColor" />
              <rect x="0" y="6"  width="11" height="2" rx="1" fill="currentColor" />
              <rect x="0" y="12" width="7"  height="2" rx="1" fill="currentColor" />
            </svg>

            {/* Badge */}
            {historyCount > 0 && (
              <div style={{
                position: 'absolute', top: -6, right: -6,
                width: 18, height: 18,
                background: 'var(--red)',
                border: '2px solid var(--charcoal)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: 'white',
                fontFamily: "'DM Mono', monospace",
              }}>
                {historyCount > 99 ? '99+' : historyCount}
              </div>
            )}
          </button>
        )}

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, background: 'var(--red)',
            borderRadius: 10, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 20, color: 'white',
            boxShadow: '0 4px 16px var(--red-glow)',
          }}>A</div>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 26, letterSpacing: 2, color: 'var(--white)',
          }}>
            ARGUE<span style={{ color: 'var(--red)' }}>BOT</span>
          </span>
        </Link>
      </div>

      {/* Right — nav links */}
      <ul style={{ display: 'flex', alignItems: 'center', gap: 8, listStyle: 'none' }}>
        {[
          { label: 'About', href: '/about' },
        ].map(link => (
          <li key={link.label}>
            <Link
              href={link.href}
              style={{
                color: 'var(--muted)', textDecoration: 'none',
                fontSize: 14, fontWeight: 500,
                padding: '8px 16px', borderRadius: 12,
                transition: 'all 0.2s', display: 'block',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color      = 'var(--white)'
                el.style.background = 'var(--charcoal-3)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color      = 'var(--muted)'
                el.style.background = 'transparent'
              }}
            >{link.label}</Link>
          </li>
        ))}

        <li>
          <Link href="/" style={{
            color: 'white', textDecoration: 'none',
            fontSize: 14, fontWeight: 500,
            padding: '8px 16px', borderRadius: 12,
            background: 'var(--red)',
            boxShadow: '0 4px 14px var(--red-glow)',
            transition: 'all 0.2s', display: 'block',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'var(--red-light)'
            el.style.transform  = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'var(--red)'
            el.style.transform  = 'none'
          }}
          >Try Free</Link>
        </li>
      </ul>
    </nav>
  )
}
