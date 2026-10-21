import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyCronAuth } from "@/lib/auth";
import { LEAD_FINDER_CATEGORIES, searchCategory } from "@/lib/google-places";
import type { FoundBusiness } from "@/lib/lead-finder-shared";
import { searchCategoryYelp } from "@/lib/yelp";
import {
  existingGooglePlaceIds,
  existingPhoneNumbers,
  existingYelpBusinessIds,
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
  const sourceLabel = b.source === "google_places" ? "Google Places" : "Yelp";
  const ratingPart = b.rating !== null ? `${b.rating.toFixed(1)}★ (${b.reviewCount} review${b.reviewCount === 1 ? "" : "s"})` : "no rating";
  const sitePart = !b.websiteChecked
    ? "website not checked (Yelp has no website data)"
    : !b.website
      ? "no website"
      : b.websiteIsBasic
        ? "basic/placeholder website only"
        : "has a website";
  return `Found via ${sourceLabel}: ${ratingPart} · ${sitePart} · ${b.distanceMiles.toFixed(1)}mi from Laurel, MD`;
}

/**
 * Daily, 7am: searches Google Places + Yelp (official APIs, not scraping)
 * across 10 service categories within 50mi of Laurel, MD 20723 for small,
 * underserved businesses (≤50 reviews, rating <4.0 — Google results are
 * also filtered to no/basic-only website, Yelp's API has no website data
 * so that filter doesn't apply to Yelp results). Skips anything already in
 * the leads table by per-source id (google_place_id / yelp_business_id) or
 * by phone number (the same real business can have different ids on each
 * platform), and inserts up to 20 new leads/day tagged "Auto-Found"
 * (source = lead_finder_agent). See lib/google-places.ts and lib/yelp.ts
 * for the full honesty notes on radius and website-data limitations.
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

  const googleConfigured = Boolean(process.env.GOOGLE_PLACES_API_KEY);
  const yelpConfigured = Boolean(process.env.YELP_API_KEY);
  if (!googleConfigured && !yelpConfigured) {
    await logActivity("lead_finder_agent", "Skipped — neither GOOGLE_PLACES_API_KEY nor YELP_API_KEY configured", "warn");
    return NextResponse.json({ skipped: true });
  }

  const [existingPlaceIds, existingYelpIds, existingPhones] = await Promise.all([
    existingGooglePlaceIds(),
    existingYelpBusinessIds(),
    existingPhoneNumbers(),
  ]);
  const seenPhonesThisRun = new Set<string>();
  const seenIdsThisRun = new Set<string>();
  const picked: FoundBusiness[] = [];

  function isFresh(b: FoundBusiness): boolean {
    if (!b.phone) return false;
    const phoneKey = normalizePhone(b.phone);
    if (!phoneKey || existingPhones.has(phoneKey) || seenPhonesThisRun.has(phoneKey)) return false;
    if (b.source === "google_places" && existingPlaceIds.has(b.externalId)) return false;
    if (b.source === "yelp" && existingYelpIds.has(b.externalId)) return false;
    if (seenIdsThisRun.has(`${b.source}:${b.externalId}`)) return false;
    return true;
  }

  function claim(b: FoundBusiness) {
    picked.push(b);
    seenIdsThisRun.add(`${b.source}:${b.externalId}`);
    if (b.phone) seenPhonesThisRun.add(normalizePhone(b.phone));
  }

  // First pass: up to PER_CATEGORY_FIRST_PASS per category, for variety —
  // pooling both sources per category before moving to the next one.
  const byCategory = new Map<string, FoundBusiness[]>();
  for (const category of LEAD_FINDER_CATEGORIES) {
    if (picked.length >= DAILY_TARGET) break;
    const [googleResults, yelpResults] = await Promise.all([
      googleConfigured ? searchCategory(category) : Promise.resolve([]),
      yelpConfigured ? searchCategoryYelp(category) : Promise.resolve([]),
    ]);
    const fresh = [...googleResults, ...yelpResults].filter(isFresh);
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
    const ok = await insertLead({
      name: business.name,
      business_name: business.name,
      phone: business.phone as string,
      source: "lead_finder_agent",
      business_type: business.category,
      website_url: business.website ?? undefined,
      message: summarize(business),
      google_place_id: business.source === "google_places" ? business.externalId : undefined,
      yelp_business_id: business.source === "yelp" ? business.externalId : undefined,
    });
    if (ok) inserted += 1;
  }

  const sources = [googleConfigured && "Google Places", yelpConfigured && "Yelp"].filter(Boolean).join(" + ");
  await logActivity(
    "lead_finder_agent",
    `Found ${picked.length} qualifying business(es) via ${sources} across ${LEAD_FINDER_CATEGORIES.length} categories, inserted ${inserted} new lead(s)`,
  );

  return NextResponse.json({ found: picked.length, inserted });
}
