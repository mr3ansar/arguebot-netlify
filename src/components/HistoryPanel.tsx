'use client'

import { HistoryItem, Ruling, TONES } from '@/lib/types'

const RULING_COLORS: Record<Ruling, string> = {
  'CORRECT':        '#4CAF50',
  'MOSTLY RIGHT':   '#8BC34A',
  'PARTIALLY RIGHT':'#FF9800',
  'MOSTLY WRONG':   '#FF5722',
  'WRONG':          '#E8251A',
}

interface Props {
  items: HistoryItem[]
  onSelect: (item: HistoryItem) => void
  loading: boolean
}

export default function HistoryPanel({ items, onSelect, loading }: Props) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)', fontSize: 14 }}>
        Loading history…
      </div>
    )
  }

  if (!items.length) {
    return (
      <div style={{
        textAlign: 'center', padding: '28px 20px',
        color: 'var(--muted)', fontSize: 14, lineHeight: 1.6,
      }}>
        No verdicts yet.<br />
        <span style={{ fontSize: 12 }}>Your rulings will appear here.</span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map(item => {
        const tone = TONES.find(t => t.id === item.verdict.tone)
        const rulingColor = RULING_COLORS[item.verdict.ruling as Ruling] ?? 'var(--muted)'
        const date = new Date(item.createdAt).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric',
        })

        return (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            style={{
              background: 'var(--charcoal-2)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 20, padding: '14px 16px',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(232,37,26,0.3)'
              el.style.background  = 'var(--charcoal-3)'
              el.style.transform   = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(255,255,255,0.06)'
              el.style.background  = 'var(--charcoal-2)'
              el.style.transform   = 'none'
            }}
          >
            {/* Ruling + score */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 6,
            }}>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 13, letterSpacing: 1.5,
                color: rulingColor,
              }}>{item.verdict.ruling}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11, color: 'var(--muted)',
                }}>{item.verdict.score}%</span>
                <span style={{ fontSize: 13 }}>{tone?.emoji}</span>
              </div>
            </div>

            {/* Argument */}
            <div style={{
              fontSize: 13, color: 'var(--muted)',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: 8,
            }}>
              {item.argument}
            </div>

            {/* Date + research badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>{date}</span>
              {item.verdict.hasResearchPapers && (
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: 1, textTransform: 'uppercase',
                  color: 'var(--red)', background: 'var(--red-dim)',
                  padding: '1px 6px', borderRadius: 6,
                }}>🎓 Research</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
