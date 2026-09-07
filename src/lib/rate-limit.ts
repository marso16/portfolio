import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export function createLoginRateLimiter(
  url: string | undefined,
  token: string | undefined,
): Ratelimit | null {
  if (!url || !token) return null;
  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    prefix: "ratelimit:admin-login",
  });
}
