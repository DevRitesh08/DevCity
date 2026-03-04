// ─── In-Memory Cache ───────────────────────────────────────────
// Simple server-side cache with TTL to avoid hammering the GitHub API.
// Works without external dependencies. Can be upgraded to Redis/Supabase later.
//
// Default TTL: 10 minutes for user data, 30 minutes for stats.

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

/** Default TTL in milliseconds */
const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Get a cached value, or compute and cache it.
 *
 * @param key   Unique cache key (e.g. "github:user:torvalds")
 * @param fn    Async function that produces the value on miss
 * @param ttl   Time-to-live in ms (default: 10 min)
 * @returns     The cached or freshly computed value
 */
export async function cached<T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = DEFAULT_TTL,
): Promise<T> {
  const now = Date.now();
  const existing = store.get(key) as CacheEntry<T> | undefined;

  if (existing && existing.expiresAt > now) {
    return existing.value;
  }

  const value = await fn();
  store.set(key, { value, expiresAt: now + ttl });
  return value;
}

/**
 * Invalidate a single cache key.
 */
export function invalidate(key: string): void {
  store.delete(key);
}

/**
 * Invalidate all keys matching a prefix (e.g. "github:user:torvalds").
 */
export function invalidatePrefix(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
    }
  }
}

/**
 * Clear the entire cache (useful for testing / re-deployment).
 */
export function clearCache(): void {
  store.clear();
}

/**
 * Get cache stats for monitoring.
 */
export function getCacheStats(): { entries: number; keys: string[] } {
  // Clean expired entries first
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.expiresAt <= now) {
      store.delete(key);
    }
  }

  return {
    entries: store.size,
    keys: [...store.keys()],
  };
}

// ─── Pre-defined TTLs ─────────────────────────────────────────

/** 10 minutes — for user profiles that change rarely */
export const TTL_USER = 10 * 60 * 1000;

/** 30 minutes — for computed stats (contributions, stars) */
export const TTL_STATS = 30 * 60 * 1000;

/** 5 minutes — for CI status that changes frequently */
export const TTL_CI = 5 * 60 * 1000;

/** 1 hour — for city overview (many API calls combined) */
export const TTL_CITY = 60 * 60 * 1000;
