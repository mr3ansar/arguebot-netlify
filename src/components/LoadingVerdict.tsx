'use client'

const STEPS = ['Searching web', 'Analyzing facts', 'Writing verdict']

interface Props {
  currentStep: number // 0, 1, 2
}

export default function LoadingVerdict({ currentStep }: Props) {
  return (
    <div style={{
      background: 'var(--charcoal-2)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 40,
      padding: '40px 28px',
      textAlign: 'center',
      animation: 'fadeInUp 0.4s ease both',
    }}>
      {/* Spinner */}
      <div style={{
        width: 48, height: 48,
        border: '3px solid rgba(232,37,26,0.15)',
        borderTopColor: 'var(--red)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto 16px',
      }} />

      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 24, letterSpacing: 2,
        color: 'var(--white)', marginBottom: 4,
      }}>Gathering Evidence…</div>

      <div style={{ fontSize: 13, color: 'var(--muted)' }}>
        The court is in session
      </div>

      {/* Steps */}
      <div className="loading-steps" style={{
        display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24,
      }}>
        {STEPS.map((step, i) => {
          const isDone   = i < currentStep
          const isActive = i === currentStep
          return (
            <div key={step} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12,
              color: isDone ? '#4CAF50' : isActive ? 'var(--white)' : 'var(--muted)',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: isDone ? '#4CAF50' : isActive ? 'var(--red)' : 'var(--charcoal-3)',
                animation: isActive ? 'pulse-dot 1s infinite' : 'none',
              }} />
              {step}
            </div>
          )
        })}
      </div>
    </div>
  )
}
