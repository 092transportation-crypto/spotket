import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost } from "@/lib/supabase";
import { renderMarkdown } from "@/lib/markdown";
import { pageMetadata } from "@/lib/seo";
import { LANDING_PAGES } from "@/lib/site";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post not found" };
  return pageMetadata(
    `/blog/${slug}`,
    post.title,
    post.excerpt || `${post.title} — AI automation insights from Spotket Digital.`,
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const offset = slug.length % LANDING_PAGES.length;
  const relatedPages = [
    LANDING_PAGES[offset],
    LANDING_PAGES[(offset + 1) % LANDING_PAGES.length],
    LANDING_PAGES[(offset + 2) % LANDING_PAGES.length],
  ];

  return (
    <article className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <Link href="/blog" className="text-sm text-brand-light hover:text-white">
          &larr; Back to blog
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />

        <div className="mt-12 rounded-2xl border border-white/10 bg-navy-900/60 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
            Related guides
          </p>
          <ul className="mt-4 space-y-2">
            {relatedPages.map((page) => (
              <li key={page.slug}>
                <Link
                  href={`/lp/${page.slug}`}
                  className="text-sm text-neutral-300 hover:text-white"
                >
                  {page.h1} &rarr;
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <Link
            href="/contact"
            className="btn-shimmer inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white"
          >
            Get Your Free Automation Audit
          </Link>
        </div>
      </div>
    </article>
  );
}
