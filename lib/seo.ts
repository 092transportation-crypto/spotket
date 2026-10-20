import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Consistent per-page metadata: unique title/description, canonical URL,
 * and matching Open Graph / Twitter tags. `path` is the route (e.g. "/pricing").
 */
export function pageMetadata(
  path: string,
  title: string,
  description: string,
): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
