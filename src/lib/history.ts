import { getSupabase } from './supabase'
import { VerdictResult, HistoryItem } from './types'

export async function saveVerdict(argument: string, verdict: VerdictResult): Promise<void> {
  const { error } = await getSupabase().from('verdicts').insert({
    argument,
    ruling:               verdict.ruling,
    score:                verdict.score,
    summary:              verdict.summary,
    evidence:             verdict.evidence,
    twist:                verdict.twist ?? '',
    tone:                 verdict.tone,
    has_research_papers:  verdict.hasResearchPapers ?? false,
    searched_at:          verdict.searchedAt,
  })

  if (error) console.error('Failed to save verdict:', error)
}

export async function deleteVerdict(id: string): Promise<boolean> {
  const { error } = await getSupabase()
    .from('verdicts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete verdict:', error)
    return false
  }
  return true
}

export async function fetchHistory(limit = 10): Promise<HistoryItem[]> {
  const { data, error } = await getSupabase()
    .from('verdicts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to fetch history:', error)
    return []
  }

  return (data ?? []).map(row => ({
    id:        row.id,
    argument:  row.argument,
    createdAt: row.created_at,
    verdict: {
      ruling:             row.ruling,
      score:              row.score,
      summary:            row.summary,
      evidence:           row.evidence,
      twist:              row.twist,
      tone:               row.tone,
      hasResearchPapers:  row.has_research_papers,
      searchedAt:         row.searched_at,
    },
  }))
}
