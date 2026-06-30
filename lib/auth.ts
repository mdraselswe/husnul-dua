// Lightweight admin auth: a signed, expiring token stored in an httpOnly cookie.
// Uses Web Crypto (crypto.subtle) so it runs in BOTH the Edge middleware and
// Node API route handlers without extra deps.

export const ADMIN_COOKIE = "hd_admin";
// Non-httpOnly hint cookie so client components can show/hide admin UI.
// Never trusted for authorization — real check is the signed cookie above.
export const ADMIN_HINT_COOKIE = "hd_is_admin";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "husnul-dua-dev-secret-change-me"
  );
}

export function getAdminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD;
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return toHex(sig);
}

// Constant-time-ish string compare.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createToken(): Promise<string> {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS);
  const sig = await sign(exp);
  return `${exp}.${sig}`;
}

export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Number(exp) < now) return false;
  const expected = await sign(exp);
  return safeEqual(sig, expected);
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};

export const hintCookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};
