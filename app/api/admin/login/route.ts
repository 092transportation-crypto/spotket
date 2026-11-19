import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAdminPassword, createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { checkRateLimits, clientKey, type RateRule } from "@/lib/rate-limit";

// Every attempt from one client (hashed IP) counts, right or wrong, so a
// guesser is locked out after a handful of tries whatever they submit.
const LOGIN_RULES: RateRule[] = [
  { name: "admin-login-15min", limit: 5, windowSeconds: 15 * 60 },
  { name: "admin-login-day", limit: 20, windowSeconds: 86_400 },
];

export async function POST(request: NextRequest) {
  const blocked = await checkRateLimits(`admin:${clientKey(request)}`, LOGIN_RULES);
  if (blocked) {
    const retryAfter = blocked.windowSeconds;
    return NextResponse.json(
      {
        detail:
          blocked.windowSeconds >= 86_400
            ? "Too many login attempts. Try again tomorrow."
            : "Too many login attempts. Try again in 15 minutes.",
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body" }, { status: 400 });
  }

  if (!checkAdminPassword(body.password || "")) {
    return NextResponse.json({ detail: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
