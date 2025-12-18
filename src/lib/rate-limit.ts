type RateLimitResult = {
  success: boolean;
};

const store = new Map<string, { count: number; expires: number }>();

export function rateLimit(
  key: string,
  limit: number = 30,
  windowMs: number = 60_000
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.expires < now) {
    store.set(key, { count: 1, expires: now + windowMs });
    return { success: true };
  }

  if (entry.count >= limit) {
    return { success: false };
  }

  entry.count += 1;
  store.set(key, entry);

  return { success: true };
}
