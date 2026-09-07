import { component$ } from "@builder.io/qwik";
import { Form, routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { createLoginRateLimiter } from "~/lib/rate-limit";
import {
  COOKIE_NAME,
  createSessionToken,
  timingSafeEqual,
  verifySessionToken,
} from "~/lib/session";

export const useRedirectIfLoggedIn = routeLoader$(async (event) => {
  const secret = event.env.get("SESSION_SECRET");
  const token = event.cookie.get(COOKIE_NAME)?.value;
  if (secret && (await verifySessionToken(token, secret))) {
    throw event.redirect(302, "/admin");
  }
  return null;
});

export const useLogin = routeAction$(async (form, event) => {
  const password = String(form.password ?? "");
  const adminPassword = event.env.get("ADMIN_PASSWORD");
  const sessionSecret = event.env.get("SESSION_SECRET");

  if (!adminPassword || !sessionSecret) {
    return { success: false, error: "Admin login is not configured." };
  }

  const ip = event.request.headers.get("x-forwarded-for") ?? "unknown";
  const limiter = createLoginRateLimiter(
    event.env.get("UPSTASH_REDIS_REST_URL"),
    event.env.get("UPSTASH_REDIS_REST_TOKEN"),
  );
  if (limiter) {
    const { success } = await limiter.limit(ip);
    if (!success) {
      return {
        success: false,
        error: "Too many attempts. Try again in a minute.",
      };
    }
  }

  if (!timingSafeEqual(password, adminPassword)) {
    return { success: false, error: "Incorrect password." };
  }

  const token = await createSessionToken(sessionSecret);
  event.cookie.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  throw event.redirect(302, "/admin");
});

export default component$(() => {
  const login = useLogin();

  return (
    <div class="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <p class="font-mono text-sm text-amber">$ sudo login</p>
      <h1 class="mt-4 text-2xl font-semibold text-ink">Admin</h1>
      <Form action={login} class="mt-6 flex flex-col gap-4">
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          class="rounded border border-border-line bg-surface px-3 py-2 text-ink outline-none focus-visible:border-cyan"
        />
        <button
          type="submit"
          class="rounded bg-amber px-3 py-2 font-semibold text-void hover:bg-amber/90"
        >
          Log in
        </button>
        {login.value?.error && (
          <p class="text-sm text-red-400">{login.value.error}</p>
        )}
      </Form>
    </div>
  );
});
