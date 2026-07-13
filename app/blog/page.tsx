import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Buying Guides & Product Deep-Dives",
  description:
    "Spotket's buying guides: stress relief toys, gaming setups, wellness gadgets, and honest advice on what's worth your money in 2026.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">The Spotket Blog</h1>
      <p className="mt-3 text-sm text-slate-400">
        Buying guides and deep-dives — researched the same way we curate the store.
      </p>
      <ul className="mt-10 space-y-6">
        {BLOG_POSTS.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block rounded-3xl border border-navy-700/60 bg-navy-900 p-7 transition-colors hover:border-brand/50"
            >
              <p className="text-xs uppercase tracking-widest text-gold">
                {new Date(post.date).toLocaleDateString("en-US", { dateStyle: "long" })} ·{" "}
                {post.readMinutes} min read
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">{post.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{post.description}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand">Read article →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
