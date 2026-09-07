import { describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken } from "./session";

describe("session tokens", () => {
  it("verifies a freshly created token", async () => {
    const token = await createSessionToken("test-secret");
    expect(await verifySessionToken(token, "test-secret")).toBe(true);
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await createSessionToken("test-secret");
    expect(await verifySessionToken(token, "wrong-secret")).toBe(false);
  });

  it("rejects a tampered signature", async () => {
    const token = await createSessionToken("test-secret");
    const [expiry] = token.split(".");
    expect(
      await verifySessionToken(`${expiry}.not-a-real-signature`, "test-secret"),
    ).toBe(false);
  });

  it("rejects an expired token", async () => {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode("test-secret"),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const expiredExpiry = Date.now() - 1000;
    const sigBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(String(expiredExpiry)),
    );
    const signature = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    expect(
      await verifySessionToken(`${expiredExpiry}.${signature}`, "test-secret"),
    ).toBe(false);
  });

  it("rejects a missing token", async () => {
    expect(await verifySessionToken(undefined, "test-secret")).toBe(false);
  });

  it("rejects a malformed token", async () => {
    expect(await verifySessionToken("not-a-valid-token", "test-secret")).toBe(
      false,
    );
  });
});
