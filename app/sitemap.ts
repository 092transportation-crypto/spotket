import type { MetadataRoute } from "next";
import { LANDING_PAGES, SITE_URL } from "@/lib/site";
import { listBlogPosts, listLandingPages } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/services",
    "/how-it-works",
    "/results",
    "/pricing",
    "/contact",
    "/blog",
    "/privacy-policy",
    "/terms-of-service",
    "/refund-policy",
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const staticLandingSlugs = new Set(LANDING_PAGES.map((page) => page.slug));

  const staticLandingEntries: MetadataRoute.Sitemap = LANDING_PAGES.map((page) => ({
    url: `${SITE_URL}/lp/${page.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const [posts, pages] = await Promise.all([listBlogPosts(), listLandingPages()]);

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Dynamic (agent-generated) landing pages, excluding any slug already
  // covered by the static LANDING_PAGES set above.
  const dynamicLandingEntries: MetadataRoute.Sitemap = pages
    .filter((page) => !staticLandingSlugs.has(page.slug))
    .map((page) => ({
      url: `${SITE_URL}/lp/${page.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticEntries, ...staticLandingEntries, ...blogEntries, ...dynamicLandingEntries];
}
