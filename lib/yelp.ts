/**
 * Thin Yelp Fusion API wrapper for the Lead Finder Agent — Yelp's own
 * official API (https://api.yelp.com/v3/businesses/search), not scraping
 * yelp.com. Same resilience pattern as the rest of lib/ — no-ops and logs
 * when YELP_API_KEY isn't set; never throws past the caller.
 *
 * Honesty notes (read before trusting the filter logic):
 * - Yelp's `radius` param caps at 40,000m (~24.9mi) — even tighter than
 *   Google's cap. We still re-filter every result by real distance against
 *   the true 50-mile cutoff, but Yelp coverage of the 25–50mi ring is
 *   partial/best-effort at best, likely thinner than Google's.
 * - Yelp's Business Search response has NO website field at all — only a
 *   `url` to the business's *Yelp listing page*, never their own site. The
 *   "no website or basic website" filter is NOT applied to Yelp results —
 *   there's no data to apply it to. Every FoundBusiness from this file has
 *   `websiteChecked: false` so callers/docs can be honest about that gap,
 *   rather than silently treating "no data" as "no website."
 */
import { LAUREL_MD, SEARCH_RADIUS_MILES, haversineMiles, type FoundBusiness } from "./lead-finder-shared";

const SEARCH_URL = "https://api.yelp.com/v3/businesses/search";
const MAX_RADIUS_METERS = 40000; // Yelp's hard cap, not our real cutoff

interface YelpBusiness {
  id: string;
  name: string;
  phone?: string;
  display_phone?: string;
  rating?: number;
  review_count?: number;
  coordinates?: { latitude: number; longitude: number };
  is_closed?: boolean;
}

/**
 * Searches one category via Yelp's Business Search. Filters to ≤50
 * reviews, rating <4.0, within 50mi of Laurel MD — the website criterion
 * is skipped entirely (Yelp's API has no website field; see file header).
 * Returns [] (never throws) when unconfigured or the call fails.
 */
export async function searchCategoryYelp(category: { label: string; query: string }): Promise<FoundBusiness[]> {
  const apiKey = process.env.YELP_API_KEY;
  if (!apiKey) {
    console.log("Yelp not configured (YELP_API_KEY unset) — skipping.");
    return [];
  }

  try {
    const params = new URLSearchParams({
      term: category.query,
      location: "Laurel, MD 20723",
      radius: String(MAX_RADIUS_METERS),
      limit: "20",
    });
    const res = await fetch(`${SEARCH_URL}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) {
      console.error(`Yelp API responded ${res.status}: ${await res.text().catch(() => "")}`);
      return [];
    }
    const data = (await res.json()) as { businesses?: YelpBusiness[] };
    const businesses = data.businesses ?? [];

    const results: FoundBusiness[] = [];
    for (const business of businesses) {
      if (business.is_closed || !business.coordinates) continue;

      const distanceMiles = haversineMiles(
        LAUREL_MD.lat,
        LAUREL_MD.lng,
        business.coordinates.latitude,
        business.coordinates.longitude,
      );
      if (distanceMiles > SEARCH_RADIUS_MILES) continue;

      const reviewCount = business.review_count ?? 0;
      if (reviewCount > 50) continue;

      const rating = business.rating ?? null;
      if (rating === null || rating >= 4.0) continue;

      results.push({
        source: "yelp",
        externalId: business.id,
        name: business.name,
        phone: business.display_phone ?? business.phone ?? null,
        website: null,
        websiteIsBasic: false,
        websiteChecked: false,
        rating,
        reviewCount,
        distanceMiles,
        category: category.label,
      });
    }
    return results;
  } catch (err) {
    console.error(`searchCategoryYelp(${category.label}) failed:`, (err as Error).message);
    return [];
  }
}
