type RateLimitEntry = { count: number; resetAt: number }

const store = new Map<string, RateLimitEntry>()

interface RateLimitOptions {
  limit: number
  windowMs: number
}

export function isRateLimited(
  key: string,
  { limit, windowMs: _windowMs }: RateLimitOptions
): { blocked: boolean; retryAfterMs: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now >= entry.resetAt) return { blocked: false, retryAfterMs: 0 }

  if (entry.count >= limit) {
    return { blocked: true, retryAfterMs: entry.resetAt - now }
  }

  return { blocked: false, retryAfterMs: 0 }
}

export function recordFailure(
  key: string,
  { limit, windowMs }: RateLimitOptions
): void {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
  } else if (entry.count < limit) {
    entry.count++
  }
}
