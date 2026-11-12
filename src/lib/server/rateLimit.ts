import { env } from './env';

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const MAX_BUCKETS = 5000;
const buckets = new Map<string, RateLimitBucket>();

function pruneStaleBuckets(now: number, windowMs: number) {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [key, bucket] of Array.from(buckets.entries())) {
    if (now - bucket.lastRefill > windowMs * 2) {
      buckets.delete(key);
    }
    if (buckets.size <= Math.floor(MAX_BUCKETS * 0.7)) break;
  }
  if (buckets.size >= MAX_BUCKETS) {
    const firstKey = buckets.keys().next().value;
    if (firstKey) buckets.delete(firstKey);
  }
}

export function extractClientKey(headers: Headers): string {
  const realIp = headers.get('x-real-ip')?.trim();
  if (realIp) return realIp.slice(0, 64);

  const vercelIp = headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim();
  if (vercelIp) return vercelIp.slice(0, 64);

  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (forwarded) return forwarded.slice(0, 64);

  const ua = headers.get('user-agent')?.slice(0, 48) || 'anon';
  return `local:${ua}`;
}

export function checkRateLimit(
  clientKey: string,
  maxOverride?: number
): { success: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const windowMs = Number.isFinite(env.RATE_LIMIT_WINDOW_MS) && env.RATE_LIMIT_WINDOW_MS > 0 ? env.RATE_LIMIT_WINDOW_MS : 60000;
  const maxRequests =
    maxOverride && maxOverride > 0
      ? maxOverride
      : Number.isFinite(env.RATE_LIMIT_MAX_REQUESTS) && env.RATE_LIMIT_MAX_REQUESTS > 0
      ? env.RATE_LIMIT_MAX_REQUESTS
      : 60;

  pruneStaleBuckets(now, windowMs);

  let bucket = buckets.get(clientKey);
  if (!bucket) {
    bucket = { tokens: Math.max(0, maxRequests - 1), lastRefill: now };
    buckets.set(clientKey, bucket);
    return { success: true, remaining: bucket.tokens, resetMs: windowMs };
  }

  const timePassed = now - bucket.lastRefill;
  if (timePassed >= windowMs) {
    bucket.tokens = maxRequests;
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return {
      success: true,
      remaining: bucket.tokens,
      resetMs: Math.max(0, windowMs - (now - bucket.lastRefill)),
    };
  }

  return {
    success: false,
    remaining: 0,
    resetMs: Math.max(0, windowMs - (now - bucket.lastRefill)),
  };
}
