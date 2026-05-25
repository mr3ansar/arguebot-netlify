'use client'

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 40px',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 38, height: 38,
          background: 'var(--red)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 20, color: 'white',
          boxShadow: '0 4px 16px var(--red-glow)',
        }}>A</div>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 26, letterSpacing: 2,
        }}>
          ARGUE<span style={{ color: 'var(--red)' }}>BOT</span>
        </span>
      </div>

      {/* Links */}
      <ul style={{ display: 'flex', alignItems: 'center', gap: 8, listStyle: 'none' }}>
        {['Verdicts', 'History', 'About'].map(link => (
          <li key={link}>
            <a href="#" style={{
              color: 'var(--muted)',
              textDecoration: 'none',
              fontSize: 14, fontWeight: 500,
              padding: '8px 16px',
              borderRadius: 12,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.color = 'var(--white)'
              ;(e.target as HTMLElement).style.background = 'var(--charcoal-3)'
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.color = 'var(--muted)'
              ;(e.target as HTMLElement).style.background = 'transparent'
            }}
            >{link}</a>
          </li>
        ))}
        <li>
          <a href="#" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: 14, fontWeight: 500,
            padding: '8px 16px',
            borderRadius: 12,
            background: 'var(--red)',
            boxShadow: '0 4px 14px var(--red-glow)',
            transition: 'all 0.2s',
          }}>Try Free</a>
        </li>
      </ul>
    </nav>
  )
}
