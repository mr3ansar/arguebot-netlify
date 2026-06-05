'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter'
  if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter'
  if (!/[0-9]/.test(password)) return 'Password must include a number'
  return null
}

export default function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    const pwError = validatePassword(password)
    if (pwError) {
      setError(pwError)
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password)
    if (error) {
      setError(error)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
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
          background: 'var(--charcoal-2)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 40, padding: '40px 32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 32, letterSpacing: 2, color: 'var(--white)',
            marginBottom: 12,
          }}>CHECK YOUR EMAIL</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
            We sent a confirmation link to <strong style={{ color: 'var(--white)' }}>{email}</strong>.
            Click it to activate your account, then sign in.
          </p>
          <Link
            href="/login"
            style={{
              display: 'inline-block', marginTop: 24,
              padding: '12px 28px',
              background: 'var(--red)', color: 'white',
              border: 'none', borderRadius: 20,
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 18, letterSpacing: 2,
              textDecoration: 'none',
              boxShadow: '0 6px 24px var(--red-glow)',
            }}
          >GO TO SIGN IN</Link>
        </div>
      </div>
    )
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
               ARGUE<span style={{ color: 'var(--red)' }}>BOSS</span>
            </Link>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 36, letterSpacing: 2, color: 'var(--white)',
              marginTop: 20, marginBottom: 8,
            }}>CREATE ACCOUNT</h1>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>
              Save your verdict history and get higher rate limits
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

            <div style={{ marginBottom: 16 }}>
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
                placeholder="Min 8 chars, uppercase, number"
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

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600,
                color: 'var(--muted)', marginBottom: 6,
                letterSpacing: '1px', textTransform: 'uppercase',
              }}>Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="Repeat password"
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
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
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

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>
              Already have an account?{' '}
            </span>
            <Link
              href="/login"
              style={{ color: 'var(--red)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--red-light)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--red)' }}
            >Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
