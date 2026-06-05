import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1A1A1A',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Background blobs */}
        <div style={{
          position: 'absolute',
          top: -100, right: -100,
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'rgba(232,37,26,0.15)',
          filter: 'blur(80px)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -80, left: -80,
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'rgba(232,37,26,0.08)',
          filter: 'blur(60px)',
          display: 'flex',
        }} />

        {/* Logo row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 40,
        }}>
          <div style={{
            width: 56, height: 56,
            background: '#E8251A',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            fontWeight: 900,
            color: 'white',
          }}>A</div>
          <span style={{
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: 6,
            color: 'white',
            textTransform: 'uppercase',
          }}>ARGUEBOSS</span>
        </div>

        {/* Main headline */}
        <div style={{
          fontSize: 96,
          fontWeight: 900,
          color: 'white',
          letterSpacing: 4,
          textTransform: 'uppercase',
          lineHeight: 0.9,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <span>ARE YOU</span>
          <span style={{ color: '#E8251A' }}>RIGHT?</span>
        </div>

        {/* Subheadline */}
        <div style={{
          marginTop: 32,
          fontSize: 22,
          color: 'rgba(255,255,255,0.5)',
          textAlign: 'center',
          maxWidth: 700,
          lineHeight: 1.5,
          display: 'flex',
        }}>
          AI searches the web · weighs the facts · delivers the verdict
        </div>

        {/* Mode badges */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginTop: 40,
        }}>
          {['⚡ Lite', '🔍 Moderate', '⚔️ Heavy'].map(label => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 100,
              padding: '8px 20px',
              fontSize: 16,
              color: 'rgba(255,255,255,0.6)',
              display: 'flex',
            }}>{label}</div>
          ))}
        </div>
      </div>
    ),
    {
      width:  1200,
      height: 630,
    }
  )
}
