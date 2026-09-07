import type {
  RequestEventAction,
  RequestEventLoader,
} from "@builder.io/qwik-city";
import { COOKIE_NAME, verifySessionToken } from "./session";

export async function requireAdminSession(
  event: RequestEventLoader | RequestEventAction,
): Promise<void> {
  const secret = event.env.get("SESSION_SECRET");
  const token = event.cookie.get(COOKIE_NAME)?.value;
  const valid = secret ? await verifySessionToken(token, secret) : false;
  if (!valid) {
    throw event.redirect(302, "/admin/login");
  }
}
