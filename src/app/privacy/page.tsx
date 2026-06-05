import Link from 'next/link'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Privacy Policy — ArgueBoss',
  description: 'How ArgueBoss collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
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

      <div style={{ position: 'relative', zIndex: 5 }}>
        <Navbar />

        <div className="about-content" style={{
          maxWidth: 680, margin: '40px auto 80px',
          padding: '0 24px',
          animation: 'fadeInUp 0.6s ease both',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--red-dim)',
            border: '1px solid rgba(232,37,26,0.3)',
            color: 'var(--red-light)',
            fontSize: 12, fontWeight: 600,
            letterSpacing: '1.5px', textTransform: 'uppercase',
            padding: '6px 16px', borderRadius: 100, marginBottom: 20,
          }}>Privacy Policy</div>

          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(36px, 6vw, 60px)',
            lineHeight: 0.92, letterSpacing: 3,
            marginBottom: 20,
          }}>
            YOUR DATA.<br />
            <span style={{ color: 'var(--red)' }}>YOUR CONTROL.</span>
          </h1>

          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 40 }}>
            Last updated: June 5, 2026
          </p>

          <div className="about-card" style={{
            background: 'var(--charcoal-2)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 32, padding: 32, marginBottom: 24,
          }}>
            <Section title="What We Collect">
              <p>ArgueBoss collects only the data necessary to provide the service:</p>
              <ul>
                <li><strong>Account information</strong> — email address and password (if you sign up). If you use Google OAuth, we receive your email, name, and avatar URL from Google.</li>
                <li><strong>Arguments and verdicts</strong> — the text you submit and the resulting verdict are stored to show you your history.</li>
                <li><strong>IP addresses</strong> — used temporarily for rate limiting to prevent abuse. Not stored permanently.</li>
                <li><strong>Auth cookies</strong> — Supabase session cookies keep you logged in. No tracking or advertising cookies are used.</li>
              </ul>
            </Section>

            <Section title="How We Use Your Data">
              <ul>
                <li>To authenticate you and manage your account.</li>
                <li>To process your argument and generate a verdict (sent to Groq LLM, Tavily web search, and OpenAlex research API).</li>
                <li>To display your verdict history when you request it.</li>
                <li>To enforce rate limits and prevent abuse.</li>
              </ul>
            </Section>

            <Section title="Third-Party Services">
              <p>Your data is processed by these third-party services, each with their own privacy practices:</p>
              <ul>
                <li><strong>Supabase</strong> — authentication, database, and session cookies. <a href="https://supabase.com/privacy" style={{ color: 'var(--red-light)' }} target="_blank" rel="noopener noreferrer">Supabase Privacy Policy</a>.</li>
                <li><strong>Groq</strong> — processes your argument text to generate the verdict. <a href="https://groq.com/privacy" style={{ color: 'var(--red-light)' }} target="_blank" rel="noopener noreferrer">Groq Privacy Policy</a>.</li>
                <li><strong>Tavily</strong> — searches the web using your argument text. <a href="https://tavily.com/privacy" style={{ color: 'var(--red-light)' }} target="_blank" rel="noopener noreferrer">Tavily Privacy Policy</a>.</li>
                <li><strong>OpenAlex</strong> — searches academic papers using a rewritten research query. <a href="https://openalex.org/policies" style={{ color: 'var(--red-light)' }} target="_blank" rel="noopener noreferrer">OpenAlex Policies</a>.</li>
                <li><strong>Upstash</strong> — rate limiting with IP-based counters. <a href="https://upstash.com/privacy" style={{ color: 'var(--red-light)' }} target="_blank" rel="noopener noreferrer">Upstash Privacy Policy</a>.</li>
              </ul>
            </Section>

            <Section title="Data Retention">
              <p>Verdict history is retained until you delete it. Account data is retained until you delete your account. Rate limit counters expire automatically within minutes.</p>
            </Section>

            <Section title="Your Rights">
              <p>You have the right to:</p>
              <ul>
                <li><strong>Access</strong> your data — view your verdict history at any time.</li>
                <li><strong>Delete</strong> your data — individual verdicts can be removed, or you can <Link href="/delete-data" style={{ color: 'var(--red-light)' }}>delete your entire account</Link>.</li>
                <li><strong>Opt out</strong> — simply stop using the service. No ongoing data collection occurs when you are not actively using the site.</li>
              </ul>
            </Section>

            <Section title="Cookies">
              <p>ArgueBoss only uses Supabase auth session cookies (essential for login functionality). These are first-party, necessary cookies. No analytics, tracking, or advertising cookies are used.</p>
            </Section>

            <Section title="Contact">
              <p>For privacy questions or data requests, email <a href="mailto:privacy@argueboss.netlify.app" style={{ color: 'var(--red-light)' }}>privacy@argueboss.netlify.app</a>.</p>
            </Section>
          </div>

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
              BACK TO ARGUEBOSS
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 22, letterSpacing: 1.5,
        color: 'var(--white)', marginBottom: 10,
      }}>{title}</h2>
      <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>
        {children}
      </div>
      <style>{`
        ul { padding-left: 20px; margin: 8px 0; }
        li { margin-bottom: 6px; }
      `}</style>
    </div>
  )
}
