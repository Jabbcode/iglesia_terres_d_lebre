type RateLimitEntry = { count: number; resetAt: number }

const store = new Map<string, RateLimitEntry>()

interface RateLimitOptions {
  limit: number
  windowMs: number
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterMs: 0 }
  }

  if (entry.count >= limit) {
    return { allowed: false, retryAfterMs: entry.resetAt - now }
  }

  entry.count++
  return { allowed: true, retryAfterMs: 0 }
}
