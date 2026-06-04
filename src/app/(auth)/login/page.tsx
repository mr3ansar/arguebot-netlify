'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn(email, password)
    if (error) {
      setError(error)
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20,
    }}>
      <div className="bg-blob-top" style={{
        position: 'fixed', width: 400, height: 400,
        background: 'rgba(232,37,26,0.07)', borderRadius: '50%',
        filter: 'blur(80px)', top: -100, right: -100,
        pointerEvents: 'none', zIndex: 1,
      }} />

      <div style={{
        position: 'relative', zIndex: 5,
        width: '100%', maxWidth: 420,
      }}>
        <div style={{
          background: 'var(--charcoal-2)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 40, padding: '40px 32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Link href="/" style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 28, letterSpacing: 2, color: 'var(--white)',
              textDecoration: 'none',
            }}>
              ARGUE<span style={{ color: 'var(--red)' }}>BOT</span>
            </Link>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 36, letterSpacing: 2, color: 'var(--white)',
              marginTop: 20, marginBottom: 8,
            }}>WELCOME BACK</h1>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>
              Sign in to access your verdict history
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(232,37,26,0.1)',
              border: '1px solid rgba(232,37,26,0.3)',
              borderRadius: 16, padding: '12px 16px',
              color: 'var(--red-light)', fontSize: 13,
              marginBottom: 20, textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600,
                color: 'var(--muted)', marginBottom: 6,
                letterSpacing: '1px', textTransform: 'uppercase',
              }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%', background: 'var(--charcoal-3)',
                  border: '1.5px solid rgba(255,255,255,0.06)',
                  borderRadius: 16, padding: '12px 16px',
                  color: 'var(--white)', fontSize: 15, outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(232,37,26,0.4)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.06)' }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600,
                color: 'var(--muted)', marginBottom: 6,
                letterSpacing: '1px', textTransform: 'uppercase',
              }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                style={{
                  width: '100%', background: 'var(--charcoal-3)',
                  border: '1.5px solid rgba(255,255,255,0.06)',
                  borderRadius: 16, padding: '12px 16px',
                  color: 'var(--white)', fontSize: 15, outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(232,37,26,0.4)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.06)' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? 'var(--charcoal-3)' : 'var(--red)',
                color: 'white', border: 'none', borderRadius: 20,
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 20, letterSpacing: 2,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 6px 24px var(--red-glow)',
              }}
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            margin: '24px 0',
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <button
            onClick={signInWithGoogle}
            style={{
              width: '100%', padding: '12px',
              background: 'var(--charcoal-3)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, color: 'var(--white)',
              fontSize: 14, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 10,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(232,37,26,0.4)'
              e.currentTarget.style.background = '#333'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.background = 'var(--charcoal-3)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link
              href="/forgot-password"
              style={{ color: 'var(--muted)', fontSize: 13, textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--white)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)' }}
            >Forgot password?</Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>
              Don&apos;t have an account?{' '}
            </span>
            <Link
              href="/signup"
              style={{ color: 'var(--red)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--red-light)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--red)' }}
            >Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
