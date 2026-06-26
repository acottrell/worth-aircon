import { Redis } from "@upstash/redis";

const hasRedis =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasRedis ? Redis.fromEnv() : null;

const memoryCache = new Map<string, { data: unknown; timestamp: number }>();

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (redis) {
    try {
      const val = await redis.get<T>(key);
      return val ?? null;
    } catch {
      return null;
    }
  }

  const entry = memoryCache.get(key);
  if (entry) return entry.data as T;
  return null;
}

export async function cacheSet<T>(
  key: string,
  data: T,
  ttlSeconds: number
): Promise<void> {
  if (redis) {
    try {
      await redis.set(key, data, { ex: ttlSeconds });
    } catch {
      // fall through to memory cache
    }
  }

  memoryCache.set(key, { data, timestamp: Date.now() });

  setTimeout(() => {
    const entry = memoryCache.get(key);
    if (entry && Date.now() - entry.timestamp >= ttlSeconds * 1000) {
      memoryCache.delete(key);
    }
  }, ttlSeconds * 1000);
}
