import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '24px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      fontSize: 12,
      color: 'var(--muted)',
      position: 'relative',
      zIndex: 5,
    }}>
      <span>
        &copy; {new Date().getFullYear()} ArgueBot. For entertainment purposes only.
      </span>
      <div style={{ display: 'flex', gap: 16 }}>
        <Link href="/privacy" style={{ color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--white)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)' }}
        >
          Privacy Policy
        </Link>
        <Link href="/terms" style={{ color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--white)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)' }}
        >
          Terms of Service
        </Link>
        <Link href="/delete-data" style={{ color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--white)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)' }}
        >
          Delete My Data
        </Link>
      </div>
    </footer>
  )
}
