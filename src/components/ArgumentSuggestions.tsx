'use client'

import { useEffect, useState } from 'react'
import { getRandomSuggestions, Suggestion } from '@/lib/suggestions'

interface Props {
  onSelect: (text: string) => void
}

export default function ArgumentSuggestions({ onSelect }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  useEffect(() => {
    setSuggestions(getRandomSuggestions(3))
  }, [])

  const refresh = () => setSuggestions(getRandomSuggestions(3))

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 10,
      }}>
        <span style={{
          fontSize: 11, fontWeight: 600,
          letterSpacing: '2px', textTransform: 'uppercase',
          color: 'var(--muted)',
        }}>Try one of these</span>
        <button
          onClick={refresh}
          style={{
            background: 'none', border: 'none',
            color: 'var(--muted)', fontSize: 12,
            cursor: 'pointer', padding: '2px 6px',
            borderRadius: 6, transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
        >↻ Shuffle</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s.text)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--charcoal-3)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14, padding: '10px 14px',
              color: 'var(--muted)', fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, textAlign: 'left',
              cursor: 'pointer', transition: 'all 0.2s',
              width: '100%',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.borderColor = 'rgba(232,37,26,0.3)'
              el.style.color       = 'var(--white)'
              el.style.background  = 'var(--red-dim)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.borderColor = 'rgba(255,255,255,0.06)'
              el.style.color       = 'var(--muted)'
              el.style.background  = 'var(--charcoal-3)'
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>{s.emoji}</span>
            <span style={{ lineHeight: 1.4 }}>{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
