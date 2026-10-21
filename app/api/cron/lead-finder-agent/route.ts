import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyCronAuth } from "@/lib/auth";
import { LEAD_FINDER_CATEGORIES, searchCategory, type FoundBusiness } from "@/lib/google-places";
import { existingGooglePlaceIds, insertLead, isAgentEnabled, logActivity } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const DAILY_TARGET = 20;
const PER_CATEGORY_FIRST_PASS = 2; // spreads the daily 20 across categories instead of filling from the first one

function summarize(b: FoundBusiness): string {
  const ratingPart = b.rating !== null ? `${b.rating.toFixed(1)}★ (${b.reviewCount} review${b.reviewCount === 1 ? "" : "s"})` : "no rating";
  const sitePart = !b.website ? "no website" : b.websiteIsBasic ? "basic/placeholder website only" : "has a website";
  return `Found via Google Places: ${ratingPart} · ${sitePart} · ${b.distanceMiles.toFixed(1)}mi from Laurel, MD`;
}

/**
 * Daily, 7am: searches Google Places across 10 service categories within
 * 50mi of Laurel, MD 20723 for small, underserved businesses (≤50 reviews,
 * rating <4.0, no or basic-only website), skips anything already in the
 * leads table (by google_place_id), and inserts up to 20 new leads tagged
 * "Auto-Found" (source = lead_finder_agent). See lib/google-places.ts for
 * the honesty notes on radius and "basic website" limitations.
 */
export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request.headers.get("authorization"))) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const enabled = await isAgentEnabled("lead_finder_agent");
  if (!enabled) {
    await logActivity("lead_finder_agent", "Skipped — agent disabled");
    return NextResponse.json({ skipped: true });
  }

  if (!process.env.GOOGLE_PLACES_API_KEY) {
    await logActivity("lead_finder_agent", "Skipped — GOOGLE_PLACES_API_KEY not configured", "warn");
    return NextResponse.json({ skipped: true });
  }

  const existingIds = await existingGooglePlaceIds();
  const seenThisRun = new Set<string>();
  const picked: FoundBusiness[] = [];

  // First pass: up to PER_CATEGORY_FIRST_PASS per category, for variety.
  const byCategory = new Map<string, FoundBusiness[]>();
  for (const category of LEAD_FINDER_CATEGORIES) {
    if (picked.length >= DAILY_TARGET) break;
    const results = await searchCategory(category);
    const fresh = results.filter((b) => b.phone && !existingIds.has(b.placeId) && !seenThisRun.has(b.placeId));
    byCategory.set(category.label, fresh);
    for (const b of fresh.slice(0, PER_CATEGORY_FIRST_PASS)) {
      if (picked.length >= DAILY_TARGET) break;
      picked.push(b);
      seenThisRun.add(b.placeId);
    }
  }

  // Second pass: fill remaining slots from whichever category still has leftovers.
  for (const [, fresh] of byCategory) {
    if (picked.length >= DAILY_TARGET) break;
    for (const b of fresh) {
      if (picked.length >= DAILY_TARGET) break;
      if (seenThisRun.has(b.placeId)) continue;
      picked.push(b);
      seenThisRun.add(b.placeId);
    }
  }

  let inserted = 0;
  for (const business of picked) {
    const ok = await insertLead({
      name: business.name,
      business_name: business.name,
      phone: business.phone as string,
      source: "lead_finder_agent",
      business_type: business.category,
      website_url: business.website ?? undefined,
      message: summarize(business),
      google_place_id: business.placeId,
    });
    if (ok) inserted += 1;
  }

  await logActivity(
    "lead_finder_agent",
    `Found ${picked.length} qualifying business(es) across ${LEAD_FINDER_CATEGORIES.length} categories, inserted ${inserted} new lead(s)`,
  );

  return NextResponse.json({ found: picked.length, inserted });
}
