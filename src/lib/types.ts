export type Tone =
  | 'hype'
  | 'professor'
  | 'judge'
  | 'petty'
  | 'commentator'

export interface ToneConfig {
  id: Tone
  label: string
  emoji: string
  description: string
}

export const TONES: ToneConfig[] = [
  { id: 'hype',        label: 'Hype Man',           emoji: '🔥', description: 'Celebrates you either way, then drops the truth' },
  { id: 'professor',   label: 'Disappointed Prof',  emoji: '😤', description: 'Sighs heavily and explains where you went wrong' },
  { id: 'judge',       label: 'Cold Judge',         emoji: '⚖️', description: 'Formal, dramatic, zero emotion' },
  { id: 'petty',       label: 'Petty Friend',       emoji: '💅', description: 'Oh sweetie… no.' },
  { id: 'commentator', label: 'Sports Commentator', emoji: '🎙️', description: 'Play-by-play of your argument like it\'s a game' },
]

export type Ruling = 'CORRECT' | 'MOSTLY RIGHT' | 'PARTIALLY RIGHT' | 'MOSTLY WRONG' | 'WRONG'

export interface EvidenceItem {
  text: string
  source?: string
}

export interface VerdictResult {
  ruling: Ruling
  score: number          // 0–100
  summary: string        // toned response paragraph
  evidence: EvidenceItem[]
  twist: string          // the "actually…" wrinkle
  tone: Tone
  searchedAt: string
}

export interface HistoryItem {
  id: string
  argument: string
  verdict: VerdictResult
  createdAt: string
}
