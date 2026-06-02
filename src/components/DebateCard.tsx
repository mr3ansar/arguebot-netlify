'use client'

import { useState } from 'react'
import { DebateResult } from '@/lib/modes'
import { TONES, Ruling } from '@/lib/types'
import { downloadDebateCard } from '@/lib/downloadCard'

const RULING_COLORS: Record<string, string> = {
  'CORRECT':        '#4CAF50',
  'MOSTLY RIGHT':   '#8BC34A',
  'PARTIALLY RIGHT':'#FF9800',
  'MOSTLY WRONG':   '#FF5722',
  'WRONG':          '#E8251A',
}

interface Props {
  debate:   DebateResult
  argument: string
}

export default function DebateCard({ debate, argument }: Props) {
  const tone        = TONES.find(t => t.id === debate.tone)
  const rulingColor = RULING_COLORS[debate.ruling] ?? '#E8251A'
  const [copied, setCopied]           = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    const html2canvas = (await import('html2canvas')).default
    await downloadDebateCard(debate, argument ?? '', html2canvas)
    setDownloading(false)
  }

  const handleShare = async () => {
    const text = '⚔️ ArgueBot Debate Verdict: ' + debate.ruling + ' (' + debate.score + '%)\n\n' +
      debate.turns.find(t => t.role === 'judge')?.content.slice(0, 120) + '...\n\nGet your argument debated at arguebot.app'
    if (navigator.share) {
      await navigator.share({ title: 'My ArgueBot Debate', text })
    } else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const advocate = debate.turns.find(t => t.role === 'advocate')
  const skeptic  = debate.turns.find(t => t.role === 'skeptic')
  const judge    = debate.turns.find(t => t.role === 'judge')

  return (
    <div style={{
      background: 'var(--white)',
      borderRadius: 40, overflow: 'hidden',
      boxShadow: '0 24px 70px rgba(0,0,0,0.5)',
      animation: 'fadeInUp 0.5s ease both',
    }}>

      {/* Header */}
      <div style={{
        background: 'var(--charcoal)',
        padding: '20px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 26 }}>⚔️</span>
          <div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 22, letterSpacing: 2, color: 'white',
            }}>THE DEBATE IS OVER</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>
              3-AI debate · {new Date(debate.searchedAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
        <div style={{
          background: 'var(--red)', color: 'white',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 28, letterSpacing: 1,
          padding: '8px 18px', borderRadius: 20,
          boxShadow: '0 4px 12px var(--red-glow)',
        }}>{debate.score}%</div>
      </div>

      <div style={{ padding: 28, background: 'var(--white)' }}>

        {/* Topic */}
        <div style={{
          background: 'var(--off-white)',
          borderRadius: 14, padding: '10px 16px',
          marginBottom: 20,
          borderLeft: '3px solid var(--charcoal)',
          fontSize: 13, color: '#555', fontStyle: 'italic',
        }}>
          "{argument.length > 100 ? argument.slice(0, 100) + '…' : argument}"
        </div>

        {/* Advocate */}
        {advocate && (
          <div style={{ marginBottom: 14 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#4CAF50',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, flexShrink: 0,
              }}>✓</div>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 15, letterSpacing: 1.5, color: '#4CAF50',
              }}>ADVOCATE — FOR</span>
            </div>
            <div style={{
              background: 'rgba(76,175,80,0.06)',
              border: '1.5px solid rgba(76,175,80,0.2)',
              borderRadius: 16, padding: '14px 16px',
              fontSize: 14, color: '#333', lineHeight: 1.7,
            }}>
              {advocate.content}
            </div>
          </div>
        )}

        {/* VS divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          margin: '16px 0',
        }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 18, letterSpacing: 3,
            color: 'var(--muted)',
          }}>VS</div>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
        </div>

        {/* Skeptic */}
        {skeptic && (
          <div style={{ marginBottom: 20 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--red)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: 'white', flexShrink: 0,
              }}>✗</div>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 15, letterSpacing: 1.5, color: 'var(--red)',
              }}>SKEPTIC — AGAINST</span>
            </div>
            <div style={{
              background: 'rgba(232,37,26,0.05)',
              border: '1.5px solid rgba(232,37,26,0.15)',
              borderRadius: 16, padding: '14px 16px',
              fontSize: 14, color: '#333', lineHeight: 1.7,
            }}>
              {skeptic.content}
            </div>
          </div>
        )}

        {/* Judge ruling */}
        {judge && (
          <div style={{
            background: 'var(--charcoal)',
            borderRadius: 20, padding: '20px 22px',
            marginBottom: 20,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>⚖️</span>
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 16, letterSpacing: 2, color: 'var(--muted)',
                }}>JUDGE'S RULING</span>
              </div>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 16, letterSpacing: 1.5,
                color: rulingColor, padding: '4px 12px',
                background: rulingColor + '22',
                borderRadius: 100,
              }}>{debate.ruling}</div>
            </div>
            <p style={{
              fontSize: 14, color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.7, margin: 0,
            }}>{judge.content}</p>
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 18, borderTop: '1px solid rgba(0,0,0,0.06)',
          flexWrap: 'wrap', gap: 10,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--charcoal)', color: 'white',
            fontSize: 12, fontWeight: 600,
            letterSpacing: 1, textTransform: 'uppercase',
            padding: '6px 14px', borderRadius: 100,
          }}>
            {tone?.emoji} {tone?.label} · ⚔️ Heavy Mode
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleShare}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'var(--charcoal-3)', color: 'white',
                border: 'none', borderRadius: 12, padding: '10px 18px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >{copied ? '✓ Copied!' : '🔗 Share Debate'}</button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: downloading ? 'var(--charcoal-3)' : 'var(--red)',
                color: 'white', border: 'none', borderRadius: 12,
                padding: '10px 18px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: 600,
                cursor: downloading ? 'wait' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: downloading ? 'none' : '0 4px 12px var(--red-glow)',
              }}
            >{downloading ? '⏳ Saving…' : '⬇️ Download Card'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
