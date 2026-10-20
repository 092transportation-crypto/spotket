import Link from "next/link";
import { listBlogPosts } from "@/lib/supabase";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata(
  "/blog",
  "Blog",
  "AI automation for small business, AI receptionists, automated review requests, and tips to get more bookings with AI — from Spotket Digital.",
);

export default async function BlogIndexPage() {
  const posts = await listBlogPosts();

  return (
    <div className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">Blog</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Insights for growing your business
        </h1>
      </div>

      <div className="mx-auto mt-16 max-w-3xl space-y-6">
        {posts.length === 0 && (
          <p className="text-center text-sm text-neutral-500">No posts yet — check back soon.</p>
        )}
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card-glow block rounded-2xl border border-white/10 bg-navy-900/60 p-6 transition-shadow"
          >
            <h2 className="text-lg font-semibold text-white">{post.title}</h2>
            {post.excerpt && <p className="mt-2 text-sm text-neutral-400">{post.excerpt}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
