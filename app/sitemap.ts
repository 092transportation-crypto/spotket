import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
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
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const [posts, pages] = await Promise.all([listBlogPosts(), listLandingPages()]);

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const landingEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${SITE_URL}/lp/${page.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries, ...landingEntries];
}
