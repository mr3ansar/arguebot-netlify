import Link from 'next/link'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'About — ArgueBot',
  description: 'ArgueBot is an AI-powered argument fact-checker that delivers verdicts with personality.',
}

export default function AboutPage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Background blobs */}
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

      <div style={{ position: 'relative', zIndex: 5, flex: 1 }}>
        <Navbar />

        <div className="about-content" style={{
          maxWidth: 680, margin: '40px auto 40px',
          padding: '0 24px',
          animation: 'fadeInUp 0.6s ease both',
        }}>

          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--red-dim)',
              border: '1px solid rgba(232,37,26,0.3)',
              color: 'var(--red-light)',
              fontSize: 12, fontWeight: 600,
              letterSpacing: '1.5px', textTransform: 'uppercase',
              padding: '6px 16px', borderRadius: 100, marginBottom: 20,
            }}>About ArgueBot</div>

            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(48px, 8vw, 80px)',
              lineHeight: 0.92, letterSpacing: 3,
              marginBottom: 20,
            }}>
              THE JUDGE<br />
              <span style={{ color: 'var(--red)' }}>YOU NEED.</span>
            </h1>

            <p style={{
              fontSize: 17, fontWeight: 300,
              color: 'var(--muted)', lineHeight: 1.7,
            }}>
              ArgueBot is an AI-powered fact checker that searches the web in real time,
              weighs the evidence, and delivers a verdict on your argument — with personality,
              zero neutrality, and maximum entertainment value.
            </p>
          </div>

          {/* How it works */}
          <div className="about-card" style={{
            background: 'var(--charcoal-2)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 32, padding: 32, marginBottom: 24,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 24,
            }}>How it works</div>

            {[
              { step: '01', title: 'Drop your argument',   desc: 'Type whatever you want to be judged on. A hot take, a belief, a claim you made in a group chat.' },
              { step: '02', title: 'Pick your judge',       desc: 'Choose from 5 personality modes — from the Hype Man to the Cold Judge to the Petty Friend.' },
              { step: '03', title: 'We search the web',    desc: 'Tavily pulls real-time sources. For scientific claims, arXiv research papers are included automatically.' },
              { step: '04', title: 'The verdict drops',    desc: 'Groq\'s LLM delivers a ruling — right, wrong, or somewhere in between — with evidence and a score.' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: 20,
                paddingBottom: i < 3 ? 24 : 0,
                marginBottom: i < 3 ? 24 : 0,
                borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 28, letterSpacing: 2,
                  color: 'var(--red)', flexShrink: 0,
                  lineHeight: 1,
                }}>{item.step}</div>
                <div>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 20, letterSpacing: 1.5,
                    color: 'var(--white)', marginBottom: 6,
                  }}>{item.title}</div>
                  <p style={{
                    fontSize: 14, color: 'var(--muted)',
                    lineHeight: 1.6, margin: 0,
                  }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tech stack */}
          <div className="about-card" style={{
            background: 'var(--charcoal-2)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 32, padding: 32, marginBottom: 24,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 20,
            }}>Built with</div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {[
                { name: 'Next.js',    desc: 'Framework'     },
                { name: 'Groq',       desc: 'LLM inference' },
                { name: 'Tavily',     desc: 'Web search'    },
                { name: 'arXiv',      desc: 'Research'      },
                { name: 'Supabase',   desc: 'Database'      },
                { name: 'Llama 3.3',  desc: 'AI model'      },
              ].map(tech => (
                <div key={tech.name} style={{
                  background: 'var(--charcoal-3)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14, padding: '10px 16px',
                }}>
                  <div style={{
                    fontSize: 14, fontWeight: 600,
                    color: 'var(--white)', marginBottom: 2,
                  }}>{tech.name}</div>
                  <div style={{
                    fontSize: 11, color: 'var(--muted)',
                  }}>{tech.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* The 5 judges */}
          <div className="about-card" style={{
            background: 'var(--charcoal-2)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 32, padding: 32, marginBottom: 24,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 20,
            }}>The 5 judges</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { emoji: '🔥', name: 'Hype Man',           desc: 'Celebrates you either way, then drops the truth at the end.' },
                { emoji: '😤', name: 'Disappointed Prof',  desc: 'Sighs heavily. Has seen it all. Will find what\'s wrong with your reasoning.' },
                { emoji: '⚖️', name: 'Cold Judge',         desc: 'Formal, emotionless, dramatic. The gavel has spoken.' },
                { emoji: '💅', name: 'Petty Friend',       desc: 'Loving but ruthless. "Oh sweetie… no."' },
                { emoji: '🎙️', name: 'Sports Commentator', desc: 'Play-by-play of your argument like it\'s a championship match.' },
              ].map((tone, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{tone.emoji}</span>
                  <div>
                    <div style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 18, letterSpacing: 1.5,
                      color: 'var(--white)', marginBottom: 3,
                    }}>{tone.name}</div>
                    <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                      {tone.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What We Collect & Why — transparency section */}
          <div className="about-card" style={{
            background: 'var(--charcoal-2)',
            border: '1px solid rgba(232,37,26,0.15)',
            borderRadius: 32, padding: 32, marginBottom: 24,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 20,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700,
                letterSpacing: '2px', textTransform: 'uppercase',
                color: 'var(--red-light)',
              }}>What We Collect & Why</div>
            </div>

            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 20 }}>
              We believe in being upfront about data. Here is exactly what ArgueBot collects and why.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                {
                  title: 'Account Info',
                  detail: 'Email and password (or Google profile if you use OAuth). Used only for authentication. Stored securely via Supabase.',
                },
                {
                  title: 'Arguments & Verdicts',
                  detail: 'The text you submit and the resulting verdict are saved so you can review your history. You can delete individual verdicts or wipe your entire history at any time.',
                },
                {
                  title: 'IP Addresses',
                  detail: 'Temporarily used for rate limiting to prevent abuse. Not stored permanently or logged.',
                },
                {
                  title: 'Cookies',
                  detail: 'Supabase auth session cookies only. No tracking, analytics, or advertising cookies — period.',
                },
                {
                  title: 'Third-Party Processing',
                  detail: 'Your argument text is sent to Groq (LLM), Tavily (web search), and OpenAlex (research papers) to generate your verdict. Each service operates under its own privacy policy.',
                },
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'var(--charcoal-3)',
                  borderRadius: 14, padding: '14px 18px',
                }}>
                  <div style={{
                    fontSize: 13, fontWeight: 600,
                    color: 'var(--white)', marginBottom: 4,
                  }}>{item.title}</div>
                  <p style={{
                    fontSize: 13, color: 'var(--muted)',
                    lineHeight: 1.5, margin: 0,
                  }}>{item.detail}</p>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 20,
              padding: '14px 18px',
              background: 'var(--red-dim)',
              borderRadius: 14,
              border: '1px solid rgba(232,37,26,0.15)',
            }}>
              <p style={{
                fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.6,
              }}>
                You have full control over your data. View your{' '}
                <Link href="/delete-data" style={{ color: 'var(--red-light)' }}>data deletion page</Link>{' '}
                to remove verdicts or delete your account at any time. See our{' '}
                <Link href="/privacy" style={{ color: 'var(--red-light)' }}>Privacy Policy</Link>{' '}
                and{' '}
                <Link href="/terms" style={{ color: 'var(--red-light)' }}>Terms of Service</Link>{' '}
                for full details.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'var(--red)', color: 'white',
              textDecoration: 'none', borderRadius: 20,
              padding: '16px 36px',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 22, letterSpacing: 2,
              boxShadow: '0 6px 24px var(--red-glow)',
              transition: 'all 0.2s',
            }}>
              START ARGUING
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
