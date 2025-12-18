const rateLimitMap = new Map<string, { count: number; time: number }>();

export function rateLimit(
  ip: string,
  limit = process.env.NODE_ENV === "development" ? 1000 : 100,
  windowMs = 15 * 60 * 1000
) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, time: now });
    return { success: true };
  }

  if (now - record.time > windowMs) {
    rateLimitMap.set(ip, { count: 1, time: now });
    return { success: true };
  }

  if (record.count >= limit) {
    return { success: false };
  }

  record.count += 1;
  rateLimitMap.set(ip, record);
  return { success: true };
}
