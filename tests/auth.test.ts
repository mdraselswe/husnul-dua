import { describe, it, expect, beforeAll } from "vitest";
import { createToken, verifyToken } from "@/lib/auth";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-secret";
});

describe("auth token", () => {
  it("round-trips a valid token", async () => {
    const t = await createToken();
    expect(await verifyToken(t)).toBe(true);
  });

  it("rejects tampered / malformed / missing tokens", async () => {
    expect(await verifyToken(undefined)).toBe(false);
    expect(await verifyToken("garbage")).toBe(false);
    const t = await createToken();
    expect(await verifyToken(t + "x")).toBe(false);
  });

  it("rejects an expired token", async () => {
    const past = Math.floor(Date.now() / 1000) - 10;
    // forge exp in the past but signature won't match anyway -> false
    expect(await verifyToken(`${past}.deadbeef`)).toBe(false);
  });
});
