/**
 * Shared constants/types/helpers for the Lead Finder Agent
 * (lib/rapidapi-local-business.ts). Kept separate from the cron route so
 * the search categories, radius math, and "basic website" heuristic live
 * in one place.
 */

export const LAUREL_MD = { lat: 39.0993, lng: -76.8483 };
export const SEARCH_RADIUS_MILES = 50;

export const LEAD_FINDER_CATEGORIES = [
  { label: "limo service", query: "limo service" },
  { label: "barbershop", query: "barbershop" },
  { label: "nail salon", query: "nail salon" },
  { label: "cleaning service", query: "cleaning service" },
  { label: "HVAC", query: "HVAC company" },
  { label: "auto detailing", query: "auto detailing" },
  { label: "moving company", query: "moving company" },
  { label: "pressure washing", query: "pressure washing service" },
  { label: "landscaping", query: "landscaping company" },
  { label: "restaurant", query: "restaurant" },
] as const;

const BASIC_WEBSITE_HOSTS = [
  "facebook.com",
  "instagram.com",
  "linktr.ee",
  "wixsite.com",
  "weebly.com",
  "godaddysites.com",
  "square.site",
  "business.site", // Google Business Profile's own placeholder site
  "sites.google.com",
];

export function isBasicWebsite(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return BASIC_WEBSITE_HOSTS.some((basic) => host === basic || host.endsWith(`.${basic}`));
  } catch {
    return false;
  }
}

export function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export interface FoundBusiness {
  externalId: string;
  name: string;
  phone: string | null;
  website: string | null;
  websiteIsBasic: boolean;
  rating: number | null;
  reviewCount: number;
  distanceMiles: number;
  category: string;
}
