import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The store is shut down — every route collapses to the single
// "Spotket is now RIFQA" landing page, except the files crawlers need.
const ALLOWED_PATHS = new Set(["/", "/robots.txt", "/sitemap.xml"]);

export function proxy(request: NextRequest) {
  if (ALLOWED_PATHS.has(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/", request.url), 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
