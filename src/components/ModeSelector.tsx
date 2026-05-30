'use client'

import { Mode, MODES } from '@/lib/modes'

interface Props {
  selected: Mode
  onChange: (mode: Mode) => void
}

export default function ModeSelector({ selected, onChange }: Props) {
  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 600,
        letterSpacing: '2px', textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: 12,
      }}>Mode</div>

      <div style={{ display: 'flex', gap: 8 }}>
        {MODES.map(mode => {
          const active = selected === mode.id
          return (
            <button
              key={mode.id}
              onClick={() => onChange(mode.id)}
              title={mode.detail}
              style={{
                flex: 1,
                display: 'flex', flexDirection: 'column',
                alignItems: 'flex-start', gap: 4,
                padding: '12px 14px',
                borderRadius: 16,
                border: `1.5px solid ${active ? 'var(--red)' : 'rgba(255,255,255,0.07)'}`,
                background: active ? 'var(--red-dim)' : 'var(--charcoal-3)',
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: active ? '0 0 0 3px rgba(232,37,26,0.1)' : 'none',
                textAlign: 'left',
              }}
              onMouseEnter={e => {
                if (active) return
                const el = e.currentTarget
                el.style.borderColor = 'rgba(232,37,26,0.3)'
                el.style.background  = 'rgba(232,37,26,0.05)'
              }}
              onMouseLeave={e => {
                if (active) return
                const el = e.currentTarget
                el.style.borderColor = 'rgba(255,255,255,0.07)'
                el.style.background  = 'var(--charcoal-3)'
              }}
            >
              {/* Emoji + label row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16 }}>{mode.emoji}</span>
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 16, letterSpacing: 1.5,
                  color: active ? 'var(--white)' : 'var(--muted)',
                }}>{mode.label}</span>
              </div>

              {/* Description */}
              <span style={{
                fontSize: 11, fontWeight: 500,
                color: active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)',
                lineHeight: 1.3,
              }}>{mode.description}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
