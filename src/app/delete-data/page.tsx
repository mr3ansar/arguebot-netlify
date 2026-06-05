'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/components/AuthProvider'
import { fetchHistory, deleteVerdict } from '@/lib/history'
import { createBrowserSupabase } from '@/lib/supabaseBrowser'

export default function DeleteDataPage() {
  const { user, loading } = useAuth()
  const [verdictCount, setVerdictCount] = useState(0)
  const [deleting, setDeleting] = useState<'verdicts' | 'account' | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (user) {
      fetchHistory(1000, user.id).then(items => setVerdictCount(items.length))
    }
  }, [user])

  const handleDeleteVerdicts = async () => {
    if (!user) return
    setDeleting('verdicts')
    setMessage(null)

    const items = await fetchHistory(1000, user.id)
    let success = true
    for (const item of items) {
      const ok = await deleteVerdict(item.id, user.id)
      if (!ok) success = false
    }

    if (success) {
      setMessage({ type: 'success', text: 'All verdicts deleted successfully.' })
      setVerdictCount(0)
    } else {
      setMessage({ type: 'error', text: 'Some verdicts could not be deleted. Try again.' })
    }
    setDeleting(null)
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    setDeleting('account')
    setMessage(null)

    try {
      const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Account deleted. You will be signed out shortly.' })
        setTimeout(() => {
          const supabase = createBrowserSupabase()
          supabase.auth.signOut()
          window.location.href = '/'
        }, 2000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete account.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    }
    setDeleting(null)
  }

  if (loading) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: 80, color: 'var(--muted)' }}>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <div style={{
          position: 'fixed', width: 400, height: 400,
          background: 'rgba(232,37,26,0.07)', borderRadius: '50%',
          filter: 'blur(80px)', top: -100, right: -100,
          pointerEvents: 'none', zIndex: 1,
        }} />
        <div style={{
          position: 'fixed', width: 300, height: 300,
          background: 'rgba(232,37,26,0.04)', borderRadius: '50%',
          filter: 'blur(80px)', bottom: 100, left: -80,
          pointerEvents: 'none', zIndex: 1,
        }} />
        <div style={{ position: 'relative', zIndex: 5 }}>
          <Navbar />
          <div className="about-content" style={{
            maxWidth: 680, margin: '40px auto 80px',
            padding: '0 24px', textAlign: 'center',
            animation: 'fadeInUp 0.6s ease both',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--red-dim)',
              border: '1px solid rgba(232,37,26,0.3)',
              color: 'var(--red-light)',
              fontSize: 12, fontWeight: 600,
              letterSpacing: '1.5px', textTransform: 'uppercase',
              padding: '6px 16px', borderRadius: 100, marginBottom: 20,
            }}>Data Deletion</div>

            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(36px, 6vw, 60px)',
              lineHeight: 0.92, letterSpacing: 3,
              marginBottom: 20,
            }}>
              SIGN IN TO<br />
              <span style={{ color: 'var(--red)' }}>DELETE DATA.</span>
            </h1>

            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 32 }}>
              You need to be signed in to view and delete your data.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link href="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'var(--red)', color: 'white',
                textDecoration: 'none', borderRadius: 20,
                padding: '14px 32px',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 20, letterSpacing: 2,
                boxShadow: '0 6px 24px var(--red-glow)',
              }}>
                SIGN IN
              </Link>
              <Link href="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'var(--charcoal-2)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--muted)', textDecoration: 'none', borderRadius: 20,
                padding: '14px 32px',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 20, letterSpacing: 2,
              }}>
                GO HOME
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{
        position: 'fixed', width: 400, height: 400,
        background: 'rgba(232,37,26,0.07)', borderRadius: '50%',
        filter: 'blur(80px)', top: -100, right: -100,
        pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{
        position: 'fixed', width: 300, height: 300,
        background: 'rgba(232,37,26,0.04)', borderRadius: '50%',
        filter: 'blur(80px)', bottom: 100, left: -80,
        pointerEvents: 'none', zIndex: 1,
      }} />

      <div style={{ position: 'relative', zIndex: 5 }}>
        <Navbar />

        <div className="about-content" style={{
          maxWidth: 680, margin: '40px auto 80px',
          padding: '0 24px',
          animation: 'fadeInUp 0.6s ease both',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--red-dim)',
            border: '1px solid rgba(232,37,26,0.3)',
            color: 'var(--red-light)',
            fontSize: 12, fontWeight: 600,
            letterSpacing: '1.5px', textTransform: 'uppercase',
            padding: '6px 16px', borderRadius: 100, marginBottom: 20,
          }}>Data Deletion</div>

          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(36px, 6vw, 60px)',
            lineHeight: 0.92, letterSpacing: 3,
            marginBottom: 20,
          }}>
            DELETE YOUR<br />
            <span style={{ color: 'var(--red)' }}>DATA.</span>
          </h1>

          {/* Current data summary */}
          <div className="about-card" style={{
            background: 'var(--charcoal-2)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 32, padding: 32, marginBottom: 24,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 20,
            }}>Your Data</div>

            <div style={{
              display: 'flex', gap: 20, flexWrap: 'wrap',
              marginBottom: 24,
            }}>
              <div style={{
                background: 'var(--charcoal-3)',
                borderRadius: 16, padding: '16px 24px',
                flex: 1, minWidth: 140,
              }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--white)' }}>
                  {verdictCount}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                  Verdicts Saved
                </div>
              </div>
              <div style={{
                background: 'var(--charcoal-3)',
                borderRadius: 16, padding: '16px 24px',
                flex: 1, minWidth: 0,
                overflow: 'hidden',
              }}>
                <div style={{
                  fontSize: 16, fontWeight: 600, color: 'var(--white)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {user.email}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  Account Email
                </div>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 12,
                marginBottom: 20,
                fontSize: 13,
                background: message.type === 'success'
                  ? 'rgba(34,197,94,0.1)'
                  : 'rgba(232,37,26,0.1)',
                border: `1px solid ${
                  message.type === 'success'
                    ? 'rgba(34,197,94,0.3)'
                    : 'rgba(232,37,26,0.3)'
                }`,
                color: message.type === 'success' ? '#22c55e' : 'var(--red-light)',
              }}>
                {message.text}
              </div>
            )}

            {/* Delete verdicts */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 18, letterSpacing: 1.5,
                color: 'var(--white)', marginBottom: 6,
              }}>Delete All Verdicts</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
                This removes all your saved verdict history. Your account will remain active.
              </p>
              <button
                onClick={handleDeleteVerdicts}
                disabled={deleting !== null || verdictCount === 0}
                style={{
                  padding: '12px 24px',
                  borderRadius: 14,
                  border: '1px solid rgba(232,37,26,0.3)',
                  background: deleting === 'verdicts' ? 'var(--charcoal-3)' : 'transparent',
                  color: deleting === 'verdicts' ? 'var(--muted)' : 'var(--red-light)',
                  fontSize: 13, fontWeight: 600,
                  cursor: deleting !== null || verdictCount === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (deleting === null && verdictCount > 0) {
                    e.currentTarget.style.background = 'rgba(232,37,26,0.1)'
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {deleting === 'verdicts' ? 'Deleting...' : `Delete ${verdictCount} Verdict${verdictCount !== 1 ? 's' : ''}`}
              </button>
            </div>

            {/* Delete account */}
            <div>
              <h3 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 18, letterSpacing: 1.5,
                color: 'var(--white)', marginBottom: 6,
              }}>Delete Account</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
                Permanently deletes your account and all associated data. This cannot be undone.
              </p>

              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  disabled={deleting !== null}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 14,
                    border: '1px solid rgba(232,37,26,0.3)',
                    background: 'transparent',
                    color: 'var(--red-light)',
                    fontSize: 13, fontWeight: 600,
                    cursor: deleting !== null ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    if (deleting === null) {
                      e.currentTarget.style.background = 'rgba(232,37,26,0.1)'
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  Delete Account
                </button>
              ) : (
                <div style={{
                  background: 'rgba(232,37,26,0.08)',
                  borderRadius: 14, padding: 16,
                  border: '1px solid rgba(232,37,26,0.2)',
                }}>
                  <p style={{ fontSize: 13, color: 'var(--red-light)', marginBottom: 12, lineHeight: 1.5 }}>
                    Are you sure? This will delete your account, all verdicts, and you will lose access permanently.
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting !== null}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 12,
                        border: 'none',
                        background: 'var(--red)',
                        color: 'white',
                        fontSize: 13, fontWeight: 600,
                        cursor: deleting !== null ? 'not-allowed' : 'pointer',
                        opacity: deleting !== null ? 0.5 : 1,
                      }}
                    >
                      {deleting === 'account' ? 'Deleting...' : 'Yes, Delete Everything'}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      disabled={deleting !== null}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 12,
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'transparent',
                        color: 'var(--muted)',
                        fontSize: 13, fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'var(--charcoal-2)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--muted)', textDecoration: 'none', borderRadius: 20,
              padding: '14px 32px',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 20, letterSpacing: 2,
              transition: 'all 0.2s',
            }}>
              GO HOME
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
