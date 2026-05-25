'use client'

import { useState, useRef } from 'react'
import Navbar from '@/components/Navbar'
import ToneSelector from '@/components/ToneSelector'
import VerdictCard from '@/components/VerdictCard'
import LoadingVerdict from '@/components/LoadingVerdict'
import { Tone, VerdictResult } from '@/lib/types'

export default function Home() {
  const [argument, setArgument]     = useState('')
  const [tone, setTone]             = useState<Tone>('hype')
  const [useSearch, setUseSearch]   = useState(true)
  const [loading, setLoading]       = useState(false)
  const [loadStep, setLoadStep]     = useState(0)
  const [verdict, setVerdict]       = useState<VerdictResult | null>(null)
  const [error, setError]           = useState<string | null>(null)
  const verdictRef                  = useRef<HTMLDivElement>(null)

  const handleJudge = async () => {
    if (!argument.trim() || loading) return

    setLoading(true)
    setVerdict(null)
    setError(null)
    setLoadStep(0)

    // Simulate step progression for UX
    const t1 = setTimeout(() => setLoadStep(1), 1200)
    const t2 = setTimeout(() => setLoadStep(2), 2400)

    try {
      const res = await fetch('/api/verdict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ argument, tone, useSearch }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error ?? 'Something went wrong.')
      } else {
        setVerdict(data.verdict)
        setTimeout(() => verdictRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      }
    } catch {
      setError('Network error. Check your connection.')
    } finally {
      clearTimeout(t1)
      clearTimeout(t2)
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>

      {/* Background blobs */}
      <div style={{
        position: 'fixed', width: 400, height: 400,
        background: 'rgba(232,37,26,0.07)',
        borderRadius: '50%', filter: 'blur(80px)',
        top: -100, right: -100, pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{
        position: 'fixed', width: 300, height: 300,
        background: 'rgba(232,37,26,0.04)',
        borderRadius: '50%', filter: 'blur(80px)',
        bottom: 100, left: -80, pointerEvents: 'none', zIndex: 1,
      }} />

      <div style={{ position: 'relative', zIndex: 5 }}>
        <Navbar />

        {/* Hero */}
        <div style={{
          textAlign: 'center',
          padding: '60px 20px 40px',
          maxWidth: 800, margin: '0 auto',
          animation: 'fadeInUp 0.7s ease both',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--red-dim)',
            border: '1px solid rgba(232,37,26,0.3)',
            color: 'var(--red-light)',
            fontSize: 12, fontWeight: 600,
            letterSpacing: '1.5px', textTransform: 'uppercase',
            padding: '6px 16px', borderRadius: 100,
            marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, background: 'var(--red-light)', borderRadius: '50%', animation: 'pulse-dot 1.5s infinite', display: 'inline-block' }} />
            AI-Powered Fact Checker
          </div>

          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(64px, 10vw, 110px)',
            lineHeight: 0.92, letterSpacing: 3,
          }}>
            ARE YOU<br />
            <span style={{ color: 'var(--red)' }}>RIGHT?</span>
          </h1>

          <p style={{
            marginTop: 20, fontSize: 17, fontWeight: 300,
            color: 'var(--muted)', lineHeight: 1.6,
            maxWidth: 500, margin: '20px auto 0',
          }}>
            Drop your argument. We search the web, weigh the facts, and deliver the verdict — with zero mercy and maximum personality.
          </p>
        </div>

        {/* Input Card */}
        <div style={{
          maxWidth: 780, margin: '0 auto', padding: '0 20px',
          animation: 'fadeInUp 0.7s ease 0.15s both',
        }}>
          <div style={{
            background: 'var(--charcoal-2)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 40, padding: 28,
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}>
            {/* Input header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)' }}>
                Your Argument
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>
                {argument.length} / 400
              </span>
            </div>

            <textarea
              value={argument}
              onChange={e => setArgument(e.target.value)}
              maxLength={400}
              rows={4}
              placeholder={`e.g. "Pineapple absolutely belongs on pizza and anyone who disagrees has no taste…"`}
              style={{
                width: '100%',
                background: 'var(--charcoal-3)',
                border: '1.5px solid rgba(255,255,255,0.06)',
                borderRadius: 28,
                padding: '18px 20px',
                color: 'var(--white)',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16, lineHeight: 1.6,
                resize: 'none', outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(232,37,26,0.4)'
                e.target.style.boxShadow = '0 0 0 3px rgba(232,37,26,0.08)'
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255,255,255,0.06)'
                e.target.style.boxShadow = 'none'
              }}
            />

            {/* Tone selector */}
            <div style={{ marginTop: 18 }}>
              <ToneSelector selected={tone} onChange={setTone} />
            </div>

            {/* Submit row */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginTop: 20, gap: 12,
            }}>
              {/* Search toggle */}
              <div
                onClick={() => setUseSearch(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: 'var(--muted)', fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', userSelect: 'none',
                }}
              >
                <div style={{
                  width: 36, height: 20,
                  background: useSearch ? 'var(--red)' : 'var(--charcoal-3)',
                  border: `1.5px solid ${useSearch ? 'var(--red)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 100,
                  position: 'relative',
                  transition: 'all 0.2s',
                  boxShadow: useSearch ? '0 0 10px var(--red-glow)' : 'none',
                }}>
                  <div style={{
                    position: 'absolute', top: 2, left: 2,
                    width: 12, height: 12,
                    background: 'white', borderRadius: '50%',
                    transition: 'transform 0.2s',
                    transform: useSearch ? 'translateX(16px)' : 'none',
                  }} />
                </div>
                Live Web Search
              </div>

              <button
                onClick={handleJudge}
                disabled={!argument.trim() || loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: argument.trim() && !loading ? 'var(--red)' : 'var(--charcoal-3)',
                  color: 'white', border: 'none',
                  borderRadius: 20, padding: '14px 28px',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 20, letterSpacing: 2,
                  cursor: argument.trim() && !loading ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  boxShadow: argument.trim() && !loading ? '0 6px 24px var(--red-glow)' : 'none',
                }}
              >
                🔍 JUDGE ME
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            maxWidth: 780, margin: '16px auto 0', padding: '0 20px',
          }}>
            <div style={{
              background: 'rgba(232,37,26,0.1)',
              border: '1px solid rgba(232,37,26,0.3)',
              borderRadius: 20, padding: '14px 20px',
              color: 'var(--red-light)', fontSize: 14,
            }}>⚠️ {error}</div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ maxWidth: 780, margin: '32px auto 0', padding: '0 20px' }}>
            <LoadingVerdict currentStep={loadStep} />
          </div>
        )}

        {/* Verdict */}
        {verdict && !loading && (
          <div ref={verdictRef} style={{ maxWidth: 780, margin: '32px auto 0', padding: '0 20px' }}>
            <VerdictCard verdict={verdict} />
          </div>
        )}

        {/* Bottom spacing */}
        <div style={{ height: 80 }} />
      </div>
    </div>
  )
}
