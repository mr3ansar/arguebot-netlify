'use client'

import { useState } from 'react'
import { VerdictResult, TONES, Ruling } from '@/lib/types'
import { downloadVerdictCard } from '@/lib/downloadCard'

const RULING_COLORS: Record<Ruling, string> = {
  'CORRECT':        '#4CAF50',
  'MOSTLY RIGHT':   '#8BC34A',
  'PARTIALLY RIGHT':'#FF9800',
  'MOSTLY WRONG':   '#FF5722',
  'WRONG':          '#E8251A',
}

const RULING_ICONS: Record<Ruling, string> = {
  'CORRECT':        '✓',
  'MOSTLY RIGHT':   '✓',
  'PARTIALLY RIGHT':'~',
  'MOSTLY WRONG':   '✗',
  'WRONG':          '✗',
}

interface Props {
  verdict: VerdictResult
  argument?: string
}

export default function VerdictCard({ verdict, argument }: Props) {
  const tone        = TONES.find(t => t.id === verdict.tone)
  const rulingColor = RULING_COLORS[verdict.ruling]
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied]           = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    await downloadVerdictCard(verdict, argument ?? '')
    setDownloading(false)
  }

  const handleShare = async () => {
    const text = `🤖 ArgueBot says I'm ${verdict.ruling} (${verdict.score}%)\n\n${verdict.summary.slice(0, 120)}...\n\nGet judged at arguebot.app`
    if (navigator.share) {
      await navigator.share({ title: 'My ArgueBot Verdict', text })
    } else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const webEvidence   = verdict.evidence.filter(e => e.type !== 'paper')
  const paperEvidence = verdict.evidence.filter(e => e.type === 'paper')

  return (
    <div style={{
      background: 'var(--white)',
      borderRadius: 40,
      overflow: 'hidden',
      boxShadow: '0 24px 70px rgba(0,0,0,0.5)',
      animation: 'fadeInUp 0.5s ease both',
    }}>

      {/* Header */}
      <div style={{
        background: 'var(--red)',
        padding: '20px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 26 }}>⚖️</span>
          <div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 22, letterSpacing: 2, color: 'white',
            }}>THE VERDICT IS IN</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>
              Based on live web search · {new Date(verdict.searchedAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
        <div style={{
          background: 'white', color: 'var(--red)',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 28, letterSpacing: 1,
          padding: '8px 18px', borderRadius: 20,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>{verdict.score}%</div>
      </div>

      {/* Body */}
      <div style={{ padding: 28, background: 'var(--white)', color: 'var(--charcoal)' }}>

        {/* Ruling */}
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 34, letterSpacing: 2,
          color: rulingColor, marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, background: rulingColor,
            borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 18, flexShrink: 0,
          }}>{RULING_ICONS[verdict.ruling]}</div>
          {verdict.ruling}
        </div>

        {/* Summary */}
        <p style={{
          fontSize: 15, lineHeight: 1.7,
          color: '#333', marginBottom: 20,
        }}>{verdict.summary}</p>

        {/* Web Evidence */}
        {webEvidence.length > 0 && (
          <div style={{
            background: 'var(--off-white)',
            borderRadius: 20, padding: '16px 20px', marginBottom: 16,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 10,
            }}>📋 The Evidence</div>

            {webEvidence.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                marginBottom: i < webEvidence.length - 1 ? 10 : 0,
              }}>
                <div style={{
                  width: 6, height: 6, background: 'var(--red)',
                  borderRadius: '50%', flexShrink: 0, marginTop: 7,
                }} />
                <div>
                  <span style={{ fontSize: 14, color: '#444', lineHeight: 1.5 }}>
                    {item.text}
                  </span>
                  {item.source && (
                    <span style={{
                      fontSize: 11, color: 'var(--muted)',
                      marginLeft: 6, fontFamily: "'DM Mono', monospace",
                    }}>— {item.source}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Research Papers */}
        {paperEvidence.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 10,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              🎓 Research Papers
              <span style={{
                background: 'var(--charcoal)', color: 'white',
                fontSize: 10, fontWeight: 700,
                letterSpacing: 1, padding: '2px 8px', borderRadius: 100,
              }}>OpenAlex</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {paperEvidence.map((item, i) => (
                <div key={i} style={{
                  background: 'white',
                  border: '1.5px solid rgba(232,37,26,0.15)',
                  borderRadius: 16, padding: '14px 16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: 6, marginBottom: 8,
                  }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      letterSpacing: 1.5, textTransform: 'uppercase',
                      color: 'var(--red)',
                    }}>Research Paper</span>
                    {item.year && (
                      <span style={{
                        fontSize: 10, color: 'var(--muted)',
                        fontFamily: "'DM Mono', monospace",
                        background: 'var(--off-white)',
                        padding: '1px 6px', borderRadius: 6,
                      }}>{item.year}</span>
                    )}
                  </div>

                  <p style={{
                    fontSize: 13, color: '#444',
                    lineHeight: 1.6, margin: '0 0 10px',
                  }}>{item.text}</p>

                  <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', flexWrap: 'wrap', gap: 6,
                  }}>
                    {item.authors && (
                      <span style={{
                        fontSize: 11, color: 'var(--muted)', fontStyle: 'italic',
                      }}>{item.authors}</span>
                    )}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: 11, color: 'var(--red)',
                          textDecoration: 'none', fontWeight: 600,
                        }}
                      >View on OpenAlex →</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Twist */}
        {verdict.twist && (
          <div style={{
            background: 'rgba(232,37,26,0.06)',
            border: '1.5px solid rgba(232,37,26,0.2)',
            borderRadius: 20, padding: '14px 18px', marginBottom: 20,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--red)', marginBottom: 6,
            }}>💡 Actually…</div>
            <p style={{ fontSize: 14, color: '#444', lineHeight: 1.5, margin: 0 }}>
              {verdict.twist}
            </p>
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
            {tone?.emoji} {tone?.label} Mode
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
            >{copied ? '✓ Copied!' : '🔗 Share'}</button>

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
