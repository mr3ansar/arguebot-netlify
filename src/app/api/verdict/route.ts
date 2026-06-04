import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { tavily } from '@tavily/core'
import { SYSTEM_PROMPT, USER_PROMPT } from '@/lib/prompts'
import { Tone, VerdictResult, EvidenceItem } from '@/lib/types'
import { shouldSearchPapers, searchOpenAlex, formatPapersForPrompt, OpenAlexPaper } from '@/lib/openAlex'
import { Mode, DebateResult, DebateTurn } from '@/lib/modes'
import { ADVOCATE_PROMPT, SKEPTIC_PROMPT, JUDGE_PROMPT } from '@/lib/debatePrompts'
import { createRouteSupabase } from '@/lib/supabaseRoute'

export const dynamic = 'force-dynamic'

// Lazy init — never runs at module load time / build time
function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY })
}
function getTavily() {
  return tavily({ apiKey: process.env.TAVILY_API_KEY ?? '' })
}

const QUESTION_REWRITE_PROMPT = [
  'You are an academic research assistant.',
  'Rewrite the given argument or claim as a precise academic research question.',
  'Rules:',
  '- Output a single concise research question, max 12 words',
  '- Use formal scientific language',
  '- Focus on the core testable claim, strip all opinion and emotion',
  '- Output ONLY the question, nothing else',
  '',
  'Examples:',
  'Argument: GMO foods are dangerous to human health',
  'Question: What are the health effects of genetically modified food consumption?',
  'Argument: Coffee improves your focus',
  'Question: How does caffeine affect cognitive performance and attention?',
  'Argument: Social media causes depression in teenagers',
  'Question: What is the relationship between social media use and adolescent mental health?',
].join('\n')

// ── Shared: web search ─────────────────────────────────────────────────────
async function getWebContext(argument: string, deep = false): Promise<string> {
  try {
    const searchResponse = await getTavily().search(argument, {
      searchDepth:   deep ? 'advanced' : 'basic',
      maxResults:    deep ? 7 : 5,
      includeAnswer: true,
    })
    const resultsText = searchResponse.results
      .map((r, i) => '[' + (i + 1) + '] ' + r.title + '\nURL: ' + r.url + '\n' + r.content)
      .join('\n\n')
    return searchResponse.answer
      ? 'Quick Answer: ' + searchResponse.answer + '\n\nDetailed Results:\n' + resultsText
      : resultsText
  } catch {
    return 'Search unavailable — reason based on general knowledge only.'
  }
}

// ── Shared: research papers ────────────────────────────────────────────────
async function getPaperContext(argument: string): Promise<{ context: string; papers: OpenAlexPaper[] }> {
  if (!shouldSearchPapers(argument)) return { context: '', papers: [] }

  try {
    const questionCompletion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile', temperature: 0.1, max_tokens: 60,
      messages: [
        { role: 'system', content: QUESTION_REWRITE_PROMPT },
        { role: 'user',   content: 'Argument: ' + argument },
      ],
    })
    const q      = questionCompletion.choices[0]?.message?.content?.trim() ?? argument
    console.log('[OpenAlex] Question:', q)
    const papers = await searchOpenAlex(q, 3)
    console.log('[OpenAlex] Papers:', papers.length)
    return { context: formatPapersForPrompt(papers), papers }
  } catch (err) {
    console.error('[OpenAlex] Failed:', err)
    return { context: '', papers: [] }
  }
}

// ── Mode: LITE ─────────────────────────────────────────────────────────────
async function runLite(argument: string, tone: Tone, useSearch: boolean) {
  const searchContext = useSearch
    ? await getWebContext(argument, false)
    : 'No search — reason based on general knowledge only.'

  const completion = await getGroq().chat.completions.create({
    model: 'llama-3.3-70b-versatile', temperature: 0.8, max_tokens: 800,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT(tone) },
      { role: 'user',   content: USER_PROMPT(argument, searchContext) },
    ],
  })

  const raw   = completion.choices[0]?.message?.content ?? ''
  const clean = extractJSON(raw)
  const parsed = JSON.parse(clean)

  const verdict: VerdictResult = {
    ...parsed,
    evidence:          (parsed.evidence ?? []).map((e: EvidenceItem) => ({ ...e, type: 'web' as const })),
    tone,
    searchedAt:        new Date().toISOString(),
    hasResearchPapers: false,
  }
  return { type: 'verdict' as const, data: verdict }
}

// ── Mode: MODERATE ─────────────────────────────────────────────────────────
async function runModerate(argument: string, tone: Tone, useSearch: boolean) {
  const [webContext, { context: paperContext, papers }] = await Promise.all([
    useSearch ? getWebContext(argument, false) : Promise.resolve('No search — reason based on general knowledge only.'),
    getPaperContext(argument),
  ])

  const fullContext = webContext + paperContext

  const completion = await getGroq().chat.completions.create({
    model: 'llama-3.3-70b-versatile', temperature: 0.8, max_tokens: 1024,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT(tone) },
      { role: 'user',   content: USER_PROMPT(argument, fullContext) },
    ],
  })

  const raw    = completion.choices[0]?.message?.content ?? ''
  const clean  = extractJSON(raw)
  const parsed = JSON.parse(clean)

  const paperEvidence: EvidenceItem[] = papers.map(p => ({
    text:     p.abstract,
    source:  'OpenAlex',
    type:    'paper' as const,
    url:     p.url,
    authors: p.authors.length > 0
      ? p.authors.length > 2 ? p.authors[0] + ' et al.' : p.authors.join(', ')
      : undefined,
    year: p.year ? String(p.year) : undefined,
  }))

  const verdict: VerdictResult = {
    ...parsed,
    evidence: [
      ...(parsed.evidence ?? []).map((e: EvidenceItem) => ({ ...e, type: 'web' as const })),
      ...paperEvidence,
    ],
    tone,
    searchedAt:        new Date().toISOString(),
    hasResearchPapers: paperEvidence.length > 0,
  }
  return { type: 'verdict' as const, data: verdict }
}

// ── Mode: HEAVY (debate) ───────────────────────────────────────────────────
async function runHeavy(argument: string, tone: Tone, useSearch: boolean) {
  // Get context for both sides
  const [webContext, { context: paperContext, papers }] = await Promise.all([
    useSearch ? getWebContext(argument, true) : Promise.resolve(''),
    getPaperContext(argument),
  ])
  const fullContext = webContext + paperContext

  // Step 1: Advocate and Skeptic run in parallel
  const [advocateRes, skepticBaseRes] = await Promise.all([
    getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile', temperature: 0.85, max_tokens: 300,
      messages: [{ role: 'user', content: ADVOCATE_PROMPT(argument, fullContext) }],
    }),
    // Skeptic gets a placeholder — will use advocate's actual response
    getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile', temperature: 0.85, max_tokens: 300,
      messages: [{ role: 'user', content: ADVOCATE_PROMPT(argument, fullContext) }],
    }),
  ])

  const advocateContent = advocateRes.choices[0]?.message?.content?.trim() ?? ''

  // Step 2: Skeptic rebuts the advocate (sequential — needs advocate output)
  const skepticRes = await getGroq().chat.completions.create({
    model: 'llama-3.3-70b-versatile', temperature: 0.85, max_tokens: 300,
    messages: [{ role: 'user', content: SKEPTIC_PROMPT(argument, advocateContent, fullContext) }],
  })
  const skepticContent = skepticRes.choices[0]?.message?.content?.trim() ?? ''

  // Step 3: Judge rules on both
  const judgeRes = await getGroq().chat.completions.create({
    model: 'llama-3.3-70b-versatile', temperature: 0.8, max_tokens: 400,
    messages: [
      { role: 'system', content: 'CRITICAL: Respond ONLY with a raw JSON object. No markdown, no backticks, no explanation. Start with { and end with }.' },
      { role: 'user',   content: JUDGE_PROMPT(tone, argument, advocateContent, skepticContent) },
    ],
  })

  const judgeRaw   = judgeRes.choices[0]?.message?.content ?? ''
  const judgeClean = extractJSON(judgeRaw)
  const judgeData  = JSON.parse(judgeClean)

  const turns: DebateTurn[] = [
    { role: 'advocate', label: 'Advocate', emoji: '✓', content: advocateContent },
    { role: 'skeptic',  label: 'Skeptic',  emoji: '✗', content: skepticContent },
    { role: 'judge',    label: 'Judge',    emoji: '⚖️', content: judgeData.verdict ?? judgeData.summary ?? '' },
  ]

  const debate: DebateResult = {
    topic:             argument,
    turns,
    ruling:            judgeData.ruling ?? 'PARTIALLY RIGHT',
    score:             judgeData.score  ?? 50,
    tone,
    searchedAt:        new Date().toISOString(),
    hasResearchPapers: papers.length > 0,
  }
  return { type: 'debate' as const, data: debate }
}

// ── JSON extractor ─────────────────────────────────────────────────────────
function extractJSON(raw: string): string {
  let clean = raw.replace(/```json|```/g, '').trim()
  const start = clean.indexOf('{')
  const end   = clean.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON found')
  clean = clean.slice(start, end + 1)

  // Remove all control characters except valid JSON whitespace
  // This handles the "bad control character" error from Groq responses
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ')

  // Replace literal (unescaped) newlines/tabs inside JSON string values
  // We do this by processing char by char to only fix chars inside strings
  let result   = ''
  let inString = false
  let escaped  = false

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i]
    if (escaped) {
      result  += ch
      escaped  = false
      continue
    }
    if (ch === '\\') { result += ch; escaped = true; continue }
    if (ch === '"')  { result += ch; inString = !inString; continue }
    if (inString) {
      if (ch === '\n') { result += '\\n'; continue }
      if (ch === '\r') { result += '\\r'; continue }
      if (ch === '\t') { result += '\\t'; continue }
    }
    result += ch
  }

  return result
}


// ── Main handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json() as {
    argument:  string
    tone:      Tone
    useSearch: boolean
    mode:      Mode
  }

  const { argument, tone, useSearch, mode = 'moderate' } = body

  // Get user from session if authenticated
  const res = NextResponse.next()
  const supabase = createRouteSupabase(req, res)
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id

  // Rate limit per mode (dynamic import defers module evaluation to runtime)
  const { checkRateLimit, getLiteLimiter, getModerateLimiter, getHeavyLimiter, getLiteLimiterAuth, getModerateLimiterAuth, getHeavyLimiterAuth } =
    await import('@/lib/rateLimit')
  const limiter =
    mode === 'lite'  ? (userId ? getLiteLimiterAuth() : getLiteLimiter()) :
    mode === 'heavy' ? (userId ? getHeavyLimiterAuth() : getHeavyLimiter()) :
    (userId ? getModerateLimiterAuth() : getModerateLimiter())
  const rl = await checkRateLimit(limiter, req, userId)
  const headers = {
    'X-RateLimit-Limit':     String(rl.limit),
    'X-RateLimit-Remaining': String(rl.remaining),
    'X-RateLimit-Reset':     String(rl.reset),
  }

  if (!rl.success) {
    const resetIn = Math.ceil((rl.reset - Date.now()) / 1000)
    return NextResponse.json(
      { error: 'Too many requests. The court needs a breather.', resetIn, rateLimited: true },
      { status: 429, headers }
    )
  }

  if (!argument || argument.trim().length < 5) {
    return NextResponse.json({ error: 'Argument too short.' }, { status: 400, headers })
  }

  try {
    let result: { type: 'verdict' | 'debate'; data: VerdictResult | DebateResult }

    if (mode === 'lite')     result = await runLite(argument, tone, useSearch)
    else if (mode === 'heavy') result = await runHeavy(argument, tone, useSearch)
    else                     result = await runModerate(argument, tone, useSearch)

    return NextResponse.json(result, { headers })

  } catch (err) {
    console.error('Verdict API error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. The court is experiencing technical difficulties.' },
      { status: 500, headers }
    )
  }
}
