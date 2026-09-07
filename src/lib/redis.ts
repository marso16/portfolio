import { Redis } from "@upstash/redis";

export const CONTENT_KEYS = {
  profile: "portfolio:profile",
  experience: "portfolio:experience",
  projects: "portfolio:projects",
  skills: "portfolio:skills",
  resumeUrl: "portfolio:resume_url",
} as const;

export function getRedis(
  url: string | undefined,
  token: string | undefined,
): Redis | null {
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function readContent<T>(
  redis: Redis | null,
  key: string,
  fallback: T,
): Promise<T> {
  if (!redis) return fallback;
  try {
    const value = await redis.get<T>(key);
    return value ?? fallback;
  } catch (error) {
    console.error(`readContent: failed to read key "${key}"`, error);
    return fallback;
  }
}

/**
 * Batched version of `readContent` for reading several keys in a single
 * round trip via Redis `MGET`. Falls back to the corresponding per-key
 * fallback when a slot comes back null/undefined, when Redis isn't
 * configured, or when the `mget` call itself throws.
 */
export async function readAllContent<T extends readonly unknown[]>(
  redis: Redis | null,
  keys: readonly string[],
  fallbacks: T,
): Promise<T> {
  if (!redis) return fallbacks;
  try {
    const values = await redis.mget<unknown[]>(...keys);
    return keys.map((_key, i) => values[i] ?? fallbacks[i]) as unknown as T;
  } catch (error) {
    console.error(
      `readAllContent: failed to mget keys [${keys.join(", ")}]`,
      error,
    );
    return fallbacks;
  }
}

export async function writeContent<T>(
  redis: Redis | null,
  key: string,
  value: T,
): Promise<void> {
  if (!redis) {
    throw new Error("Redis is not configured (missing Upstash env vars)");
  }
  await redis.set(key, value);
}
