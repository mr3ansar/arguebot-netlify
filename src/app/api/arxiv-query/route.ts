import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { argument } = await req.json() as { argument: string }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1, // low temp for deterministic extraction
      max_tokens: 60,
      messages: [
        {
          role: 'system',
          content: `You are an academic search query extractor.
Your job is to convert a casual argument or claim into a precise, minimal academic search query suitable for arXiv.

Rules:
- Extract only the core scientific/technical topic — strip all opinion, emotion, and filler words
- Output 2-4 keywords maximum, space separated
- Use standard scientific terminology (e.g. "GMO safety human health" not "are GMOs dangerous")
- Never use question form, never use words like "dangerous", "good", "bad", "prove", "fact"
- Output ONLY the search query — no explanation, no punctuation, no quotes

Examples:
Input: "Pineapple absolutely does NOT belong on pizza, it ruins the flavour chemistry"
Output: pineapple pizza flavor chemistry

Input: "GMO foods are dangerous to human health"
Output: GMO genetically modified food safety human health

Input: "We only use 10% of our brain at any time"
Output: human brain capacity utilization neuroscience

Input: "Coffee improves cognitive performance better than any other drink"
Output: caffeine coffee cognitive performance

Input: "Sleep deprivation is ruining an entire generation of teenagers"
Output: sleep deprivation adolescent health cognitive effects

Input: "Social media causes depression in young people"
Output: social media depression mental health youth`,
        },
        {
          role: 'user',
          content: argument,
        },
      ],
    })

    const query = completion.choices[0]?.message?.content?.trim() ?? ''

    return NextResponse.json({ query })
  } catch (err) {
    console.error('arXiv query extraction failed:', err)
    return NextResponse.json({ query: '' }, { status: 500 })
  }
}
