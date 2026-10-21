import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Old dropshipping/ecommerce URLs from before the Spotket Digital
        // rebuild — these routes don't exist in this app, but blocking them
        // explicitly helps clear any stale indexed copies out of Google.
        disallow: [
          "/shop",
          "/shop/*",
          "/store",
          "/store/*",
          "/products",
          "/products/*",
          "/product/*",
          "/collections",
          "/collections/*",
          "/cart",
          "/checkout",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
