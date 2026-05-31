import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function getRedis(): Redis {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) throw new Error('Upstash env vars missing')
  return new Redis({ url, token })
}

// Different limits per mode
export const liteLimiter = new Ratelimit({
  redis:     getRedis(),
  limiter:   Ratelimit.slidingWindow(20, '1 m'),
  analytics: true,
  prefix:    'arguebot:lite',
})

export const moderateLimiter = new Ratelimit({
  redis:     getRedis(),
  limiter:   Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix:    'arguebot:moderate',
})

export const heavyLimiter = new Ratelimit({
  redis:     getRedis(),
  limiter:   Ratelimit.slidingWindow(3, '1 m'),
  analytics: true,
  prefix:    'arguebot:heavy',
})

// Keep verdictLimiter as alias for backward compat
export const verdictLimiter = moderateLimiter

export interface RateLimitResult {
  success:   boolean
  limit:     number
  remaining: number
  reset:     number
}

export async function checkRateLimit(
  limiter: Ratelimit,
  req: Request
): Promise<RateLimitResult> {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'

  const result = await limiter.limit(ip)
  return {
    success:   result.success,
    limit:     result.limit,
    remaining: result.remaining,
    reset:     result.reset,
  }
}
