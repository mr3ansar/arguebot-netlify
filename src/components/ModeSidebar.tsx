'use client'

import { useState } from 'react'
import { Mode, MODES } from '@/lib/modes'

interface Props {
  selected: Mode
  onChange: (mode: Mode) => void
}

export default function ModeSidebar({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const activeMode = MODES.find(m => m.id === selected)!

  const handleSelect = (mode: Mode) => {
    onChange(mode)
    setOpen(false)
  }

  return (
    <>
      {/* ── Desktop ── */}
      <div style={{
        position: 'fixed',
        left: 0, top: 0,
        height: '100vh',
        zIndex: 30,
        display: 'flex',
      }}
      className="mode-sidebar-desktop"
      >
        {/* Collapsed tab — always visible */}
        <div
          onClick={() => setOpen(v => !v)}
          style={{
            width: 36,
            height: '100vh',
            background: open ? 'var(--charcoal-3)' : 'var(--charcoal-2)',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            gap: 10,
            transition: 'background 0.2s',
            userSelect: 'none',
          }}
          onMouseEnter={e => {
            if (!open) e.currentTarget.style.background = 'var(--charcoal-3)'
          }}
          onMouseLeave={e => {
            if (!open) e.currentTarget.style.background = 'var(--charcoal-2)'
          }}
        >
          {/* Active mode emoji */}
          <span style={{ fontSize: 16 }}>{activeMode.emoji}</span>

          {/* Vertical label */}
          <span style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 13, letterSpacing: '2px',
            color: 'var(--red)',
            textTransform: 'uppercase',
          }}>MODE</span>

          {/* Active mode name */}
          <span style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontSize: 10, fontWeight: 700,
            letterSpacing: '1px',
            color: 'var(--muted)',
            textTransform: 'uppercase',
          }}>{activeMode.label}</span>

          {/* Chevron */}
          <span style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.2)',
            transform: open ? 'rotate(90deg)' : 'rotate(-90deg)',
            transition: 'transform 0.2s',
            display: 'inline-block',
          }}>›</span>
        </div>

        {/* Expanded panel */}
        <div style={{
          width: open ? 220 : 0,
          overflow: 'hidden',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'var(--charcoal-2)',
          borderRight: open ? '1px solid rgba(255,255,255,0.06)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: open ? '0 16px' : '0',
          gap: 8,
          boxShadow: open ? '4px 0 20px rgba(0,0,0,0.3)' : 'none',
        }}>
          {open && (
            <>
              <div style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: '2px', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.2)',
                marginBottom: 4, whiteSpace: 'nowrap',
              }}>Select Mode</div>

              {MODES.map(mode => {
                const active = selected === mode.id
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleSelect(mode.id)}
                    style={{
                      width: '100%',
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px',
                      borderRadius: 14,
                      border: `1.5px solid ${active ? 'var(--red)' : 'rgba(255,255,255,0.06)'}`,
                      background: active ? 'var(--red-dim)' : 'var(--charcoal-3)',
                      cursor: 'pointer', transition: 'all 0.15s',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => {
                      if (active) return
                      e.currentTarget.style.borderColor = 'rgba(232,37,26,0.3)'
                      e.currentTarget.style.background  = 'rgba(232,37,26,0.05)'
                    }}
                    onMouseLeave={e => {
                      if (active) return
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                      e.currentTarget.style.background  = 'var(--charcoal-3)'
                    }}
                  >
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{mode.emoji}</span>
                    <div>
                      <div style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: 15, letterSpacing: 1.5,
                        color: active ? 'var(--white)' : 'var(--muted)',
                      }}>{mode.label}</div>
                      <div style={{
                        fontSize: 11,
                        color: active ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
                        marginTop: 1,
                      }}>{mode.description}</div>
                    </div>
                    {active && (
                      <div style={{
                        marginLeft: 'auto',
                        width: 8, height: 8,
                        borderRadius: '50%',
                        background: 'var(--red)',
                        flexShrink: 0,
                      }} />
                    )}
                  </button>
                )
              })}

              <div style={{
                marginTop: 4,
                fontSize: 10,
                color: 'rgba(255,255,255,0.15)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}>
                {activeMode.calls} API call{activeMode.calls !== 1 ? 's' : ''} · {activeMode.detail}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Backdrop — close on outside click */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            zIndex: 29,
            background: 'transparent',
          }}
        />
      )}

      {/* ── Mobile bottom bar ── */}
      <div
        className="mode-sidebar-mobile"
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          background: 'var(--charcoal-2)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '10px 20px',
          zIndex: 20,
          backdropFilter: 'blur(12px)',
        }}
      >
        {MODES.map(mode => {
          const active = selected === mode.id
          return (
            <button
              key={mode.id}
              onClick={() => handleSelect(mode.id)}
              style={{
                flex: 1, maxWidth: 120,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 3,
                padding: '8px 10px',
                borderRadius: 14,
                border: `1.5px solid ${active ? 'var(--red)' : 'rgba(255,255,255,0.07)'}`,
                background: active ? 'var(--red-dim)' : 'transparent',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 18 }}>{mode.emoji}</span>
              <span style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.5px', textTransform: 'uppercase',
                color: active ? 'var(--white)' : 'var(--muted)',
              }}>{mode.label}</span>
              <span style={{
                fontSize: 9,
                color: active ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
              }}>{mode.description}</span>
            </button>
          )
        })}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .mode-sidebar-mobile { display: none !important; }
          .mode-sidebar-desktop { display: flex !important; }
        }
        @media (max-width: 767px) {
          .mode-sidebar-mobile { display: flex !important; }
          .mode-sidebar-desktop { display: none !important; }
        }
      `}</style>
    </>
  )
}
