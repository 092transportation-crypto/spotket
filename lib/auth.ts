/**
 * Admin session auth: a stateless, HMAC-signed cookie (no session store,
 * no auth dependency). The cookie value is `${expiry}.${hmac}` where hmac =
 * HMAC-SHA256(SESSION_SECRET, "admin." + expiry) — forging it requires
 * knowing SESSION_SECRET. Verified in proxy.ts on every /admin and
 * /api/admin/* request, server-side only.
 */
import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "spotket_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function sign(expiry: number): string {
  const secret = process.env.SESSION_SECRET || "";
  return createHmac("sha256", secret).update(`admin.${expiry}`).digest("hex");
}

/** Returns the cookie value to set after a successful password check. */
export function createSessionToken(): string {
  const expiry = Date.now() + SESSION_TTL_MS;
  return `${expiry}.${sign(expiry)}`;
}

/** Verifies a session cookie value. False on missing/malformed/expired/forged. */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !process.env.SESSION_SECRET) return false;
  const [expiryStr, mac] = token.split(".");
  const expiry = Number(expiryStr);
  if (!expiry || !mac || Date.now() > expiry) return false;
  const expectedMac = sign(expiry);
  const a = Buffer.from(mac);
  const b = Buffer.from(expectedMac);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Compares the submitted admin password against ADMIN_DASHBOARD_PASSWORD. */
export function checkAdminPassword(submitted: string): boolean {
  const expected = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!expected || !submitted) return false;
  const a = Buffer.from(submitted);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Verifies the Authorization header Vercel Cron sends when CRON_SECRET is set. */
export function verifyCronAuth(authHeader: string | null): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.slice("Bearer ".length);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
