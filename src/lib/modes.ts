export type Mode = 'lite' | 'moderate' | 'heavy'

export interface ModeConfig {
  id:          Mode
  label:       string
  emoji:       string
  description: string
  detail:      string
  calls:       number   // Groq API calls used
}

export const MODES: ModeConfig[] = [
  {
    id:          'lite',
    label:       'Lite',
    emoji:       '⚡',
    description: 'Quick verdict',
    detail:      'Fast fact-check with web search. No research papers.',
    calls:       1,
  },
  {
    id:          'moderate',
    label:       'Moderate',
    emoji:       '🔍',
    description: 'Verdict + research',
    detail:      'Full verdict with Semantic Scholar research papers.',
    calls:       2,
  },
  {
    id:          'heavy',
    label:       'Heavy',
    emoji:       '⚔️',
    description: '3-AI debate',
    detail:      'Advocate vs Skeptic — then the Judge delivers the final ruling.',
    calls:       3,
  },
]

// ── Debate types (Heavy mode only) ──────────────────────────────

export interface DebateTurn {
  role:    'advocate' | 'skeptic' | 'judge'
  label:   string
  emoji:   string
  content: string
}

export interface DebateResult {
  topic:     string
  turns:     DebateTurn[]
  ruling:    string   // Judge's final ruling
  score:     number   // 0-100, how defensible the original claim is
  tone:      string
  searchedAt: string
  hasResearchPapers?: boolean
}
