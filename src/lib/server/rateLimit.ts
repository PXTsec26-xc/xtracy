import { env } from './env';

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, RateLimitBucket>();

export function checkRateLimit(ip: string): { success: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const windowMs = env.RATE_LIMIT_WINDOW_MS;
  const maxRequests = env.RATE_LIMIT_MAX_REQUESTS;

  let bucket = buckets.get(ip);

  if (!bucket) {
    bucket = { tokens: maxRequests - 1, lastRefill: now };
    buckets.set(ip, bucket);
    return { success: true, remaining: bucket.tokens, resetMs: windowMs };
  }

  const timePassed = now - bucket.lastRefill;
  if (timePassed >= windowMs) {
    bucket.tokens = maxRequests;
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return { success: true, remaining: bucket.tokens, resetMs: windowMs - (now - bucket.lastRefill) };
  }

  return { success: false, remaining: 0, resetMs: windowMs - (now - bucket.lastRefill) };
}
