import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyCronAuth } from "@/lib/auth";
import { LEAD_FINDER_CATEGORIES } from "@/lib/lead-finder-shared";
import type { FoundBusiness } from "@/lib/lead-finder-shared";
import { searchCategoryRapidApi } from "@/lib/rapidapi-local-business";
import {
  existingPhoneNumbers,
  existingRapidApiBusinessIds,
  insertLead,
  isAgentEnabled,
  logActivity,
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

const DAILY_TARGET = 20;
const PER_CATEGORY_FIRST_PASS = 2; // spreads the daily 20 across categories instead of filling from the first one

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function summarize(b: FoundBusiness): string {
  const ratingPart = b.rating !== null ? `${b.rating.toFixed(1)}★ (${b.reviewCount} review${b.reviewCount === 1 ? "" : "s"})` : "no rating";
  const sitePart = !b.website ? "no website" : b.websiteIsBasic ? "basic/placeholder website only" : "has a website";
  return `Found via RapidAPI (Local Business Data): ${ratingPart} · ${sitePart} · ${b.distanceMiles.toFixed(1)}mi from Laurel, MD`;
}

/**
 * Daily, 7am: searches RapidAPI's Local Business Data API across 15
 * service categories within 100mi of Laurel, MD 20723 for small
 * businesses with no or basic-only website (no rating/review-count filter
 * — cast as wide a net as possible), skips anything already in the leads
 * table (by rapidapi_business_id, or by phone number as a secondary
 * check), and inserts up to 20 new leads/day tagged "Auto-Found" (source =
 * lead_finder_agent). See lib/rapidapi-local-business.ts for the honesty
 * notes on the field-mapping and radius limitations.
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

  if (!process.env.RAPIDAPI_KEY) {
    await logActivity("lead_finder_agent", "Skipped — RAPIDAPI_KEY not configured", "warn");
    return NextResponse.json({ skipped: true });
  }

  const [existingIdsResult, existingPhonesResult] = await Promise.all([existingRapidApiBusinessIds(), existingPhoneNumbers()]);
  if (existingIdsResult === null || existingPhonesResult === null) {
    // A failed dedup lookup used to fall back to an empty Set, silently
    // treating "we couldn't check" as "nothing exists yet" — that let the
    // agent re-find businesses already in the table and try to re-insert
    // them, which then failed on the table's unique index with no
    // visible error (the "found 1, inserted 0" bug). Abort instead.
    await logActivity("lead_finder_agent", "Aborted — could not load existing leads for dedup", "error");
    return NextResponse.json({ skipped: true, detail: "dedup lookup failed" }, { status: 500 });
  }
  const existingIds: Set<string> = existingIdsResult;
  const existingPhones: Set<string> = existingPhonesResult;
  const seenPhonesThisRun = new Set<string>();
  const seenIdsThisRun = new Set<string>();
  const picked: FoundBusiness[] = [];

  function isFresh(b: FoundBusiness): boolean {
    if (!b.phone) return false;
    const phoneKey = normalizePhone(b.phone);
    if (!phoneKey || existingPhones.has(phoneKey) || seenPhonesThisRun.has(phoneKey)) return false;
    if (existingIds.has(b.externalId) || seenIdsThisRun.has(b.externalId)) return false;
    return true;
  }

  function claim(b: FoundBusiness) {
    picked.push(b);
    seenIdsThisRun.add(b.externalId);
    if (b.phone) seenPhonesThisRun.add(normalizePhone(b.phone));
  }

  // First pass: up to PER_CATEGORY_FIRST_PASS per category, for variety.
  const byCategory = new Map<string, FoundBusiness[]>();
  for (const category of LEAD_FINDER_CATEGORIES) {
    if (picked.length >= DAILY_TARGET) break;
    const results = await searchCategoryRapidApi(category);
    const fresh = results.filter(isFresh);
    byCategory.set(category.label, fresh);
    for (const b of fresh.slice(0, PER_CATEGORY_FIRST_PASS)) {
      if (picked.length >= DAILY_TARGET) break;
      if (!isFresh(b)) continue; // may have been claimed by an earlier category via the phone-number check
      claim(b);
    }
  }

  // Second pass: fill remaining slots from whichever category still has leftovers.
  for (const [, fresh] of byCategory) {
    if (picked.length >= DAILY_TARGET) break;
    for (const b of fresh) {
      if (picked.length >= DAILY_TARGET) break;
      if (!isFresh(b)) continue;
      claim(b);
    }
  }

  let inserted = 0;
  for (const business of picked) {
    const ok = await insertLead(
      {
        name: business.name,
        business_name: business.name,
        phone: business.phone as string,
        source: "lead_finder_agent",
        business_type: business.category,
        website_url: business.website ?? undefined,
        message: summarize(business),
        rapidapi_business_id: business.externalId,
      },
      "lead_finder_agent",
    );
    if (ok) inserted += 1;
  }

  await logActivity(
    "lead_finder_agent",
    `Found ${picked.length} qualifying business(es) via RapidAPI across ${LEAD_FINDER_CATEGORIES.length} categories, inserted ${inserted} new lead(s)`,
  );

  return NextResponse.json({ found: picked.length, inserted });
}
