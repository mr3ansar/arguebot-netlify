'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await resetPassword(email)
    if (error) {
      setError(error)
      setLoading(false)
    } else {
      setSent(true)
    }
  }

  if (sent) {
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
            We sent a password reset link to <strong style={{ color: 'var(--white)' }}>{email}</strong>.
            Click it to choose a new password.
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
          >BACK TO SIGN IN</Link>
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
              ARGUE<span style={{ color: 'var(--red)' }}>BOT</span>
            </Link>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 36, letterSpacing: 2, color: 'var(--white)',
              marginTop: 20, marginBottom: 8,
            }}>RESET PASSWORD</h1>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>
              Enter your email and we&apos;ll send you a reset link
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
            <div style={{ marginBottom: 24 }}>
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
              {loading ? 'SENDING...' : 'SEND RESET LINK'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link
              href="/login"
              style={{ color: 'var(--muted)', fontSize: 13, textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--white)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)' }}
            >Back to sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
