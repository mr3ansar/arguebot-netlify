'use client'

import { Tone, TONES } from '@/lib/types'

interface Props {
  selected: Tone
  onChange: (tone: Tone) => void
}

export default function ToneSelector({ selected, onChange }: Props) {
  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 600,
        letterSpacing: '2px', textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: 12,
      }}>Pick Your Judge</div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {TONES.map(tone => {
          const active = selected === tone.id
          return (
            <button
              key={tone.id}
              onClick={() => onChange(tone.id)}
              title={tone.description}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 16px',
                borderRadius: 100,
                border: `1.5px solid ${active ? 'var(--red)' : 'rgba(255,255,255,0.08)'}`,
                background: active ? 'var(--red-dim)' : 'transparent',
                color: active ? 'var(--white)' : 'var(--muted)',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                boxShadow: active ? '0 0 0 3px rgba(232,37,26,0.1)' : 'none',
              }}
            >
              <span style={{ fontSize: 15 }}>{tone.emoji}</span>
              {tone.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
