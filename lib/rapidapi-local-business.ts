/**
 * RapidAPI "Local Business Data" wrapper for the Lead Finder Agent — a
 * documented, API-key-authenticated REST endpoint on the RapidAPI
 * marketplace, not a scraper we wrote against Google/Yelp/Yellow Pages
 * ourselves (that approach was explicitly requested and declined earlier;
 * see docs/agent-system.md). Same resilience pattern as the rest of lib/ —
 * no-ops and logs when RAPIDAPI_KEY isn't set; never throws past the
 * caller.
 *
 * Honesty note on the field mapping below: this was written from this
 * product's documented request/response shape, not a live call verified
 * at the time of writing (no network access to RapidAPI from here). Every
 * field is read defensively with a couple of plausible name variants, and
 * a response that doesn't look like the expected `{ data: [...] }` shape
 * is logged in full rather than silently swallowed — check the Lead
 * Finder Agent's activity log in /admin after your first real run
 * (manually hit GET /api/cron/lead-finder-agent with the right
 * Authorization header, or just wait for 7am) and report back the actual
 * response if result counts look wrong, so the field names can be
 * corrected against real data instead of guessed again.
 *
 * Also worth knowing: this is a third-party data vendor, not Google or
 * Yelp's own API — we haven't audited how *they* source this data on
 * their end. That's a vendor relationship the business already has
 * (RAPIDAPI_KEY was already configured), not something built here.
 */
import { LAUREL_MD, SEARCH_RADIUS_MILES, haversineMiles, isBasicWebsite, type FoundBusiness } from "./lead-finder-shared";

const DEFAULT_HOST = "local-business-data.p.rapidapi.com";
const SEARCH_ZOOM = 9; // approximates a wide, ~50mi-ish viewport; we re-filter by real distance regardless

interface RapidApiBusiness {
  business_id?: string;
  google_id?: string;
  place_id?: string;
  name?: string;
  phone_number?: string;
  phone?: string;
  website?: string;
  site?: string;
  rating?: number;
  review_count?: number;
  reviews_count?: number;
  reviews?: number;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
}

function num(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/**
 * Searches one category via RapidAPI's Local Business Data /search
 * endpoint, already filtered to this agent's targeting rules (≤50
 * reviews, rating <4.0, no/basic website, within 50mi of Laurel MD).
 * Returns [] (never throws) when unconfigured or the call fails.
 */
export async function searchCategoryRapidApi(category: { label: string; query: string }): Promise<FoundBusiness[]> {
  const apiKey = process.env.RAPIDAPI_KEY;
  const host = process.env.RAPIDAPI_HOST || DEFAULT_HOST;
  if (!apiKey) {
    console.log("RapidAPI not configured (RAPIDAPI_KEY unset) — skipping.");
    return [];
  }

  try {
    const params = new URLSearchParams({
      query: `${category.query} near Laurel, MD`,
      lat: String(LAUREL_MD.lat),
      lng: String(LAUREL_MD.lng),
      zoom: String(SEARCH_ZOOM),
      limit: "20",
      language: "en",
      region: "us",
    });
    const res = await fetch(`https://${host}/search?${params.toString()}`, {
      headers: { "X-RapidAPI-Key": apiKey, "X-RapidAPI-Host": host },
    });
    const bodyText = await res.text();
    if (!res.ok) {
      console.error(`RapidAPI Local Business Data responded ${res.status}: ${bodyText}`);
      return [];
    }

    let parsed: { data?: RapidApiBusiness[] };
    try {
      parsed = JSON.parse(bodyText);
    } catch {
      console.error(`RapidAPI Local Business Data returned non-JSON: ${bodyText.slice(0, 500)}`);
      return [];
    }
    if (!Array.isArray(parsed.data)) {
      console.error(`RapidAPI Local Business Data: unexpected response shape, no "data" array: ${bodyText.slice(0, 500)}`);
      return [];
    }

    const results: FoundBusiness[] = [];
    for (const row of parsed.data) {
      const name = row.name;
      const lat = num(row.latitude) ?? num(row.lat);
      const lng = num(row.longitude) ?? num(row.lng);
      if (!name || lat === undefined || lng === undefined) continue;

      const distanceMiles = haversineMiles(LAUREL_MD.lat, LAUREL_MD.lng, lat, lng);
      if (distanceMiles > SEARCH_RADIUS_MILES) continue;

      const reviewCount = num(row.review_count) ?? num(row.reviews_count) ?? num(row.reviews) ?? 0;
      if (reviewCount > 50) continue;

      const rating = num(row.rating) ?? null;
      if (rating === null || rating >= 4.0) continue;

      const website = row.website ?? row.site ?? null;
      const websiteIsBasic = website ? isBasicWebsite(website) : false;
      if (website && !websiteIsBasic) continue; // has a real, non-placeholder website — skip

      const externalId = row.business_id ?? row.google_id ?? row.place_id;
      if (!externalId) continue;

      results.push({
        externalId,
        name,
        phone: row.phone_number ?? row.phone ?? null,
        website,
        websiteIsBasic,
        rating,
        reviewCount,
        distanceMiles,
        category: category.label,
      });
    }
    return results;
  } catch (err) {
    console.error(`searchCategoryRapidApi(${category.label}) failed:`, (err as Error).message);
    return [];
  }
}
