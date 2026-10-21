/**
 * Thin Google Places API (New) wrapper for the Lead Finder Agent. Same
 * resilience pattern as the rest of lib/ — no-ops and logs when
 * GOOGLE_PLACES_API_KEY isn't set; never throws past the caller.
 *
 * Honesty notes (read before trusting the filter logic):
 * - Places API (New) Text Search caps `locationBias.circle.radius` at
 *   50,000m (~31 miles) — there is no way to pass a true 50-mile radius to
 *   Google. We clamp to the max and then re-filter every result ourselves
 *   by real haversine distance against the true 50-mile cutoff, so nothing
 *   outside 50mi slips through — but because the *bias* itself only pulls
 *   Google's ranking toward the inner ~31mi, coverage of the 31–50mi ring
 *   is partial/best-effort, not guaranteed.
 * - "No website or basic/outdated website" — Places API can only tell us
 *   whether a `websiteUri` exists, never whether a real site is outdated or
 *   low-quality (no such signal exists in the API). We treat "no website"
 *   literally, and approximate "basic" as the website being a social-media
 *   profile or a free site-builder subdomain (see BASIC_WEBSITE_HOSTS in
 *   lib/lead-finder-shared.ts) — not a real design-quality assessment.
 */
import { LAUREL_MD, SEARCH_RADIUS_MILES, haversineMiles, isBasicWebsite, type FoundBusiness } from "./lead-finder-shared";

export { LAUREL_MD, SEARCH_RADIUS_MILES, LEAD_FINDER_CATEGORIES, type FoundBusiness } from "./lead-finder-shared";

const SEARCH_TEXT_URL = "https://places.googleapis.com/v1/places:searchText";
const MAX_BIAS_RADIUS_METERS = 50000; // Google's hard cap, not our real cutoff

interface PlacesApiResult {
  id: string;
  displayName?: { text?: string };
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  location?: { latitude: number; longitude: number };
}

/**
 * Searches one category via Text Search, already filtered to this agent's
 * targeting rules (≤50 reviews, rating <4.0, no/basic website, within 50mi
 * of Laurel MD). Returns [] (never throws) when unconfigured or the call
 * fails.
 */
export async function searchCategory(category: { label: string; query: string }): Promise<FoundBusiness[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.log("Google Places not configured (GOOGLE_PLACES_API_KEY unset) — skipping.");
    return [];
  }

  try {
    const res = await fetch(SEARCH_TEXT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.location",
      },
      body: JSON.stringify({
        textQuery: `${category.query} near Laurel, MD`,
        locationBias: {
          circle: { center: { latitude: LAUREL_MD.lat, longitude: LAUREL_MD.lng }, radius: MAX_BIAS_RADIUS_METERS },
        },
        maxResultCount: 20,
      }),
    });
    if (!res.ok) {
      console.error(`Google Places API responded ${res.status}: ${await res.text().catch(() => "")}`);
      return [];
    }
    const data = (await res.json()) as { places?: PlacesApiResult[] };
    const places = data.places ?? [];

    const results: FoundBusiness[] = [];
    for (const place of places) {
      const name = place.displayName?.text;
      if (!name || !place.location) continue;

      const distanceMiles = haversineMiles(LAUREL_MD.lat, LAUREL_MD.lng, place.location.latitude, place.location.longitude);
      if (distanceMiles > SEARCH_RADIUS_MILES) continue;

      const reviewCount = place.userRatingCount ?? 0;
      if (reviewCount > 50) continue;

      const rating = place.rating ?? null;
      if (rating === null || rating >= 4.0) continue;

      const website = place.websiteUri ?? null;
      const websiteIsBasic = website ? isBasicWebsite(website) : false;
      if (website && !websiteIsBasic) continue; // has a real, non-placeholder website — skip

      results.push({
        source: "google_places",
        externalId: place.id,
        name,
        phone: place.nationalPhoneNumber ?? place.internationalPhoneNumber ?? null,
        website,
        websiteIsBasic,
        websiteChecked: true,
        rating,
        reviewCount,
        distanceMiles,
        category: category.label,
      });
    }
    return results;
  } catch (err) {
    console.error(`searchCategory(${category.label}) failed:`, (err as Error).message);
    return [];
  }
}
