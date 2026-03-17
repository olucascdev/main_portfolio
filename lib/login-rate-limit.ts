type RateLimitEntry = {
  count: number
  resetAt: number
  blockedUntil: number
}

const WINDOW_MS = 15 * 60 * 1000
const BLOCK_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

const attempts = new Map<string, RateLimitEntry>()

function getFreshEntry(now: number): RateLimitEntry {
  return {
    count: 0,
    resetAt: now + WINDOW_MS,
    blockedUntil: 0,
  }
}

function getEntry(key: string, now: number): RateLimitEntry {
  const current = attempts.get(key)
  if (!current || current.resetAt <= now) {
    const fresh = getFreshEntry(now)
    attempts.set(key, fresh)
    return fresh
  }
  return current
}

export function getLoginRateLimitKey(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for")
  const realIp = headers.get("x-real-ip")
  const userAgent = headers.get("user-agent") ?? "unknown-agent"
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown-ip"
  return `${ip}:${userAgent}`
}

export function getLoginRateLimitState(key: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now()
  const entry = getEntry(key, now)

  if (entry.blockedUntil > now) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
    }
  }

  return { allowed: true, retryAfter: 0 }
}

export function recordFailedLoginAttempt(key: string): void {
  const now = Date.now()
  const entry = getEntry(key, now)

  entry.count += 1
  if (entry.count >= MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_MS
    entry.count = 0
    entry.resetAt = now + WINDOW_MS
  }

  attempts.set(key, entry)
}

export function clearLoginAttempts(key: string): void {
  attempts.delete(key)
}
