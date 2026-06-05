import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ── Lazy Redis + Ratelimit instances ──────────────────────────────────────
// All instances are created on first use, NOT at module load time
// This prevents build failures when env vars aren't available during Next.js
// static page collection

let _redis:       Redis       | null = null
let _lite:        Ratelimit   | null = null
let _moderate:    Ratelimit   | null = null
let _heavy:       Ratelimit   | null = null
let _liteAuth:    Ratelimit   | null = null
let _moderateAuth: Ratelimit  | null = null
let _heavyAuth:   Ratelimit   | null = null

function getRedis(): Redis {
  if (_redis) return _redis
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) throw new Error('Upstash env vars missing')
  _redis = new Redis({ url, token })
  return _redis
}

export function getLiteLimiter(): Ratelimit {
  if (_lite) return _lite
  _lite = new Ratelimit({
    redis:     getRedis(),
    limiter:   Ratelimit.slidingWindow(20, '1 m'),
    analytics: true,
    prefix:    'argueboss:lite',
  })
  return _lite
}

export function getModerateLimiter(): Ratelimit {
  if (_moderate) return _moderate
  _moderate = new Ratelimit({
    redis:     getRedis(),
    limiter:   Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
    prefix:    'argueboss:moderate',
  })
  return _moderate
}

export function getHeavyLimiter(): Ratelimit {
  if (_heavy) return _heavy
  _heavy = new Ratelimit({
    redis:     getRedis(),
    limiter:   Ratelimit.slidingWindow(3, '1 m'),
    analytics: true,
    prefix:    'argueboss:heavy',
  })
  return _heavy
}

export function getLiteLimiterAuth(): Ratelimit {
  if (_liteAuth) return _liteAuth
  _liteAuth = new Ratelimit({
    redis:     getRedis(),
    limiter:   Ratelimit.slidingWindow(40, '1 m'),
    analytics: true,
    prefix:    'argueboss:lite:auth',
  })
  return _liteAuth
}

export function getModerateLimiterAuth(): Ratelimit {
  if (_moderateAuth) return _moderateAuth
  _moderateAuth = new Ratelimit({
    redis:     getRedis(),
    limiter:   Ratelimit.slidingWindow(20, '1 m'),
    analytics: true,
    prefix:    'argueboss:moderate:auth',
  })
  return _moderateAuth
}

export function getHeavyLimiterAuth(): Ratelimit {
  if (_heavyAuth) return _heavyAuth
  _heavyAuth = new Ratelimit({
    redis:     getRedis(),
    limiter:   Ratelimit.slidingWindow(6, '1 m'),
    analytics: true,
    prefix:    'argueboss:heavy:auth',
  })
  return _heavyAuth
}

// Keep backward compat alias
export const verdictLimiter = { limit: (...args: Parameters<Ratelimit['limit']>) => getModerateLimiter().limit(...args) }

export interface RateLimitResult {
  success:   boolean
  limit:     number
  remaining: number
  reset:     number
}

export async function checkRateLimit(
  limiter: Ratelimit | { limit: Function },
  req: Request,
  userId?: string
): Promise<RateLimitResult> {
  const identifier =
    userId ??
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'

  const result = await (limiter as Ratelimit).limit(identifier)
  return {
    success:   result.success,
    limit:     result.limit,
    remaining: result.remaining,
    reset:     result.reset,
  }
}
