import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { tavily } from '@tavily/core'
import { SYSTEM_PROMPT, USER_PROMPT } from '@/lib/prompts'
import { Tone, VerdictResult } from '@/lib/types'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY ?? '' })

export async function POST(req: NextRequest) {
  try {
    const { argument, tone, useSearch } = await req.json() as {
      argument: string
      tone: Tone
      useSearch: boolean
    }

    if (!argument || argument.trim().length < 5) {
      return NextResponse.json({ error: 'Argument too short.' }, { status: 400 })
    }

    // ── 1. Web Search ──────────────────────────────────────────────
    let searchContext = 'No search results — reason based on general knowledge only.'

    if (useSearch) {
      try {
        const searchResponse = await tavilyClient.search(argument, {
          searchDepth: 'basic',
          maxResults: 5,
          includeAnswer: true,
        })

        const resultsText = searchResponse.results
          .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.content}`)
          .join('\n\n')

        searchContext = searchResponse.answer
          ? `Quick Answer: ${searchResponse.answer}\n\nDetailed Results:\n${resultsText}`
          : resultsText
      } catch (searchErr) {
        console.error('Tavily search failed:', searchErr)
        searchContext = 'Search unavailable — reason based on general knowledge only.'
      }
    }

    // ── 2. Groq Verdict ────────────────────────────────────────────
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT(tone) },
        { role: 'user',   content: USER_PROMPT(argument, searchContext) },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? ''

    // ── 3. Parse JSON safely ───────────────────────────────────────
    let parsed: Omit<VerdictResult, 'tone' | 'searchedAt'>
    try {
      // Strip any accidental markdown fences
      const clean = raw.replace(/```json|```/g, '').trim()
      parsed = JSON.parse(clean)
    } catch {
      console.error('JSON parse failed. Raw response:', raw)
      return NextResponse.json({ error: 'Verdict engine returned malformed data. Try again.' }, { status: 500 })
    }

    const verdict: VerdictResult = {
      ...parsed,
      tone,
      searchedAt: new Date().toISOString(),
    }

    return NextResponse.json({ verdict })

  } catch (err) {
    console.error('Verdict API error:', err)
    return NextResponse.json({ error: 'Something went wrong. The court is experiencing technical difficulties.' }, { status: 500 })
  }
}
