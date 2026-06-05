'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

interface Props {
  onOpenHistory?: () => void
  historyCount?: number
}

export default function Navbar({ onOpenHistory, historyCount = 0 }: Props) {
  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()
  const isHome   = pathname === '/'
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 26, letterSpacing: 2, color: 'var(--white)',
          }}>
            ARGUE<span style={{ color: 'var(--red)' }}>BOSS</span>
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

        {loading ? (
          <li>
            <div style={{
              width: 20, height: 20,
              border: '2px solid rgba(255,255,255,0.15)',
              borderTopColor: 'var(--white)',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
            }} />
          </li>
        ) : user ? (
          <li style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--charcoal-2)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 100,
                padding: '6px 14px 6px 6px',
                cursor: 'pointer', color: 'var(--white)',
                fontSize: 13, fontWeight: 500,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(232,37,26,0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: user.user_metadata?.avatar_url
                  ? `url(${user.user_metadata.avatar_url}) center/cover`
                  : 'var(--red)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: 'white',
                flexShrink: 0,
                overflow: 'hidden',
              }}>
                {!user.user_metadata?.avatar_url && (
                  (user.email?.[0] ?? '?').toUpperCase()
                )}
              </div>
              <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User'}
              </span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{
                transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none',
              }}>
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: 6,
                background: 'var(--charcoal-2)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: 6,
                minWidth: 180,
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                zIndex: 100,
              }}>
                <div style={{
                  padding: '8px 14px', fontSize: 12,
                  color: 'var(--muted)', borderBottom: '1px solid rgba(255,255,255,0.06)',
                  marginBottom: 4,
                }}>
                  {user.email}
                </div>
                <button
                  onClick={() => { signOut(); setDropdownOpen(false) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', padding: '8px 14px',
                    background: 'transparent', border: 'none',
                    borderRadius: 10, color: 'var(--muted)',
                    fontSize: 13, cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--charcoal-3)'
                    e.currentTarget.style.color = 'var(--red-light)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--muted)'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 13H3a1 1 0 01-1-1V2a1 1 0 011-1h2M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </li>
        ) : (
          <>
            <li>
              <Link
                href="/login"
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
              >Log In</Link>
            </li>
            <li>
              <Link
                href="/signup"
                style={{
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
              >Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}
