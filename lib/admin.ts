import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "spotket2026";

/** Returns null when authorized, or a 401 response to return as-is. */
export function requireAdmin(request: Request): NextResponse | null {
  if (request.headers.get("x-admin-password") === ADMIN_PASSWORD) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
