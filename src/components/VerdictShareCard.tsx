'use client'

import { VerdictResult, TONES, Ruling } from '@/lib/types'

const RULING_COLORS: Record<Ruling, string> = {
  'CORRECT':        '#4CAF50',
  'MOSTLY RIGHT':   '#8BC34A',
  'PARTIALLY RIGHT':'#FF9800',
  'MOSTLY WRONG':   '#FF5722',
  'WRONG':          '#E8251A',
}

interface Props {
  verdict: VerdictResult
  argument: string
}

export default function VerdictShareCard({ verdict, argument }: Props) {
  const tone = TONES.find(t => t.id === verdict.tone)
  const rulingColor = RULING_COLORS[verdict.ruling]

  return (
    <div
      id="verdict-share-card"
      style={{
        width: 600,
        background: '#1A1A1A',
        borderRadius: 32,
        overflow: 'hidden',
        fontFamily: "'DM Sans', sans-serif",
        position: 'absolute',
        left: '-9999px',
        top: 0,
      }}
    >
      {/* Top red bar */}
      <div style={{
        background: '#E8251A',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'white',
            borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Georgia, serif',
            fontWeight: 900,
            fontSize: 18, color: '#E8251A',
          }}>A</div>
          <span style={{
            fontFamily: 'Georgia, serif',
            fontWeight: 900,
            fontSize: 22, letterSpacing: 3,
            color: 'white', textTransform: 'uppercase',
          }}>ArgueBoss</span>
        </div>

        {/* Score badge */}
        <div style={{
          background: 'white',
          color: '#E8251A',
          fontFamily: 'Georgia, serif',
          fontWeight: 900,
          fontSize: 32,
          padding: '6px 20px',
          borderRadius: 16,
        }}>{verdict.score}%</div>
      </div>

      {/* Ruling band */}
      <div style={{
        background: rulingColor,
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <span style={{
          fontFamily: 'Georgia, serif',
          fontWeight: 900,
          fontSize: 28,
          letterSpacing: 2,
          color: 'white',
          textTransform: 'uppercase',
        }}>⚖️ {verdict.ruling}</span>
      </div>

      {/* Body */}
      <div style={{ padding: '28px 32px' }}>

        {/* Argument */}
        <div style={{
          background: '#242424',
          borderRadius: 16,
          padding: '14px 18px',
          marginBottom: 20,
          borderLeft: '3px solid #E8251A',
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700,
            letterSpacing: 2, textTransform: 'uppercase',
            color: '#888', marginBottom: 6,
          }}>The Argument</div>
          <div style={{
            fontSize: 14, color: '#FAFAFA',
            lineHeight: 1.5, fontStyle: 'italic',
          }}>"{argument.length > 120 ? argument.slice(0, 120) + '…' : argument}"</div>
        </div>

        {/* Summary */}
        <p style={{
          fontSize: 15, color: '#FAFAFA',
          lineHeight: 1.7, marginBottom: 24,
        }}>
          {verdict.summary}
        </p>

        {/* Evidence */}
        <div style={{
          background: '#242424',
          borderRadius: 16, padding: '16px 20px',
          marginBottom: 20,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700,
            letterSpacing: 2, textTransform: 'uppercase',
            color: '#888', marginBottom: 12,
          }}>📋 The Evidence</div>
          {verdict.evidence.slice(0, 3).map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10,
              marginBottom: i < 2 ? 10 : 0,
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: 5, height: 5,
                background: '#E8251A',
                borderRadius: '50%',
                marginTop: 7, flexShrink: 0,
              }} />
              <span style={{ fontSize: 13, color: '#ccc', lineHeight: 1.5 }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Twist */}
        {verdict.twist && (
          <div style={{
            background: 'rgba(232,37,26,0.1)',
            border: '1px solid rgba(232,37,26,0.25)',
            borderRadius: 16, padding: '14px 18px',
            marginBottom: 24,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              letterSpacing: 2, textTransform: 'uppercase',
              color: '#E8251A', marginBottom: 6,
            }}>💡 Actually…</div>
            <p style={{ fontSize: 13, color: '#ccc', lineHeight: 1.5, margin: 0 }}>
              {verdict.twist}
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#2E2E2E',
            color: '#ccc',
            fontSize: 11, fontWeight: 600,
            letterSpacing: 1, textTransform: 'uppercase',
            padding: '6px 14px', borderRadius: 100,
          }}>
            {tone?.emoji} {tone?.label} Mode
          </div>

          <div style={{
            fontSize: 11, color: '#555',
            fontFamily: 'monospace',
          }}>
            argueboss.netlify.app
          </div>
        </div>
      </div>
    </div>
  )
}
