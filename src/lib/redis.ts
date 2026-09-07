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
  const value = await redis.get<T>(key);
  return value ?? fallback;
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
