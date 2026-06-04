'use client'

import { useState, FormEvent, useEffect } from 'react'
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

export default function ResetPasswordPage() {
  const { user, loading: authLoading, updatePassword } = useAuth()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

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
    const { error } = await updatePassword(password)
    if (error) {
      setError(error)
      setLoading(false)
    } else {
      setDone(true)
    }
  }

  if (done) {
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
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 32, letterSpacing: 2, color: 'var(--white)',
            marginBottom: 12,
          }}>PASSWORD UPDATED</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            Your password has been successfully changed.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block', padding: '12px 28px',
              background: 'var(--red)', color: 'white',
              border: 'none', borderRadius: 20,
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 18, letterSpacing: 2,
              textDecoration: 'none',
              boxShadow: '0 6px 24px var(--red-glow)',
            }}
          >GO HOME</Link>
        </div>
      </div>
    )
  }

  if (authLoading || !user) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 30, height: 30,
          border: '3px solid rgba(255,255,255,0.15)',
          borderTopColor: 'var(--red)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
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
              ARGUE<span style={{ color: 'var(--red)' }}>BOT</span>
            </Link>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 36, letterSpacing: 2, color: 'var(--white)',
              marginTop: 20, marginBottom: 8,
            }}>NEW PASSWORD</h1>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>
              Enter your new password
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
              }}>New Password</label>
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
              }}>Confirm New Password</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="Repeat new password"
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
              {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
