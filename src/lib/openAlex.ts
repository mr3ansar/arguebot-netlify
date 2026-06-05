export interface OpenAlexPaper {
  id:           string
  title:        string
  abstract:     string
  authors:      string[]
  year:         number | null
  url:          string
  citationCount: number
  doi:          string | null
}

const ACADEMIC_KEYWORDS = [
  'study', 'research', 'science', 'scientific', 'proven', 'evidence',
  'brain', 'memory', 'sleep', 'health', 'medicine', 'drug', 'vaccine',
  'climate', 'global warming', 'evolution', 'genetic', 'dna', 'virus',
  'ai', 'artificial intelligence', 'machine learning', 'neural',
  'physics', 'quantum', 'space', 'universe', 'black hole', 'planet',
  'psychology', 'behavior', 'cognitive', 'consciousness',
  'nutrition', 'diet', 'exercise', 'cancer', 'disease',
  'economy', 'inflation', 'recession', 'poverty',
  'algorithm', 'data', 'model', 'theory', 'experiment',
  'gmo', 'genetically modified', 'radiation', 'nuclear',
  'microbiome', 'gut', 'immune', 'hormone', 'neuroscience',
  'biodiversity', 'extinction', 'ecosystem', 'renewable',
  'stem cell', 'antibiotic', 'obesity', 'diabetes', 'autism',
  'depression', 'anxiety', 'meditation', 'placebo', 'bias',
  'discrimination', 'inequality', 'crime', 'addiction',
  'politics', 'political', 'government', 'policy', 'law', 'legal',
  'rights', 'human rights', 'freedom', 'democracy', 'election',
  'abortion', 'gun', 'guns', 'immigration', 'border',
  'tax', 'taxes', 'minimum wage', 'capitalism', 'socialism',
  'education', 'school', 'college', 'university',
  'religion', 'god', 'atheist', 'christian', 'islam', 'bible',
  'ethics', 'moral', 'ethical', 'philosophy',
  'war', 'military', 'nuclear weapon', 'terrorism',
  'privacy', 'surveillance', 'censorship', 'social media',
  'pandemic', 'covid', 'lockdown', 'mask', 'quarantine',
  'gender', 'feminism', 'sexism', 'lgbt', 'transgender',
  'race', 'racism', 'police', 'justice', 'prison',
  'history', 'historical', 'ancient', 'medieval',
  'environment', 'pollution', 'recycling', 'sustainable',
  'energy', 'solar', 'fossil fuel', 'renewable energy',
  'technology', 'internet', 'smartphone', 'privacy',
  'sport', 'olympics', 'football', 'soccer',
  'culture', 'art', 'music', 'media', 'movie',
]

export function shouldSearchPapers(argument: string): boolean {
  const lower = argument.toLowerCase()
  return ACADEMIC_KEYWORDS.some(kw => lower.includes(kw))
}

// Simple in-memory cache — 24 hour TTL
const cache = new Map<string, { papers: OpenAlexPaper[]; ts: number }>()
const CACHE_TTL = 1000 * 60 * 60 * 24

export async function searchOpenAlex(
  query: string,
  limit = 3
): Promise<OpenAlexPaper[]> {
  const cacheKey = query.toLowerCase().trim()

  // Return cached result if fresh
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    console.log('[OpenAlex] Cache hit:', query)
    return cached.papers
  }

  const params = new URLSearchParams({
    search:          query,
    per_page:        String(limit + 2), // fetch a couple extra for filtering
    sort:            'relevance_score:desc',
    filter:          'has_abstract:true',
    select:          'id,title,abstract_inverted_index,authorships,publication_year,cited_by_count,doi,primary_location',
    'mailto':        'arguebot@app.com', // OpenAlex asks for this for better rate limits
  })

  let res: Response | null = null
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      res = await fetch(
        'https://api.openalex.org/works?' + params.toString(),
        {
          headers: { 'Accept': 'application/json' },
          signal:  AbortSignal.timeout(12000),
        }
      )
      break
    } catch (err: any) {
      if (attempt === 1) throw err
      console.log('[OpenAlex] Attempt 1 timed out, retrying...')
      await new Promise(r => setTimeout(r, 1500))
    }
  }
  if (!res) throw new Error('OpenAlex fetch failed after retries')
  if (!res.ok) throw new Error('OpenAlex API error: ' + res.status)

  const data   = await res.json()
  const papers = parsePapers(data.results ?? [], limit)

  // Cache the result
  cache.set(cacheKey, { papers, ts: Date.now() })
  return papers
}

function reconstructAbstract(invertedIndex: Record<string, number[]> | null): string {
  if (!invertedIndex) return ''

  // OpenAlex stores abstracts as inverted index — reconstruct word order
  const wordPositions: Array<[number, string]> = []
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      wordPositions.push([pos, word])
    }
  }

  const abstract = wordPositions
    .sort((a, b) => a[0] - b[0])
    .map(([, word]) => word)
    .join(' ')

  return abstract.slice(0, 400) + (abstract.length > 400 ? '…' : '')
}

function parsePapers(raw: any[], limit: number): OpenAlexPaper[] {
  return raw
    .map(p => {
      const abstract = reconstructAbstract(p.abstract_inverted_index)
      if (!abstract || !p.title) return null

      const authors = (p.authorships ?? [])
        .slice(0, 3)
        .map((a: any) => a.author?.display_name ?? '')
        .filter(Boolean)

      const url = p.primary_location?.landing_page_url
        ?? (p.doi ? 'https://doi.org/' + p.doi : 'https://openalex.org/' + (p.id?.split('/').pop() ?? ''))

      return {
        id:            p.id ?? '',
        title:         p.title ?? '',
        abstract,
        authors,
        year:          p.publication_year ?? null,
        url,
        citationCount: p.cited_by_count ?? 0,
        doi:           p.doi ?? null,
      }
    })
    .filter(Boolean)
    .slice(0, limit) as OpenAlexPaper[]
}

export function formatPapersForPrompt(papers: OpenAlexPaper[]): string {
  if (!papers.length) return ''
  return '\n\nRelevant Research Papers from OpenAlex:\n' +
    papers.map((p, i) =>
      '[Paper ' + (i + 1) + '] "' + p.title + '"' +
      (p.year ? ' (' + p.year + ')' : '') +
      (p.authors.length ? ' by ' + p.authors.join(', ') : '') + '\n' +
      'Abstract: ' + p.abstract + '\n' +
      'URL: ' + p.url +
      (p.citationCount > 0 ? ' · ' + p.citationCount + ' citations' : '')
    ).join('\n\n')
}
