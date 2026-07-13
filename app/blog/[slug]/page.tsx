import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getPost } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: { "@type": "Organization", name: "Spotket" },
          }),
        }}
      />
      <Link href="/blog" className="text-sm text-slate-400 hover:text-brand">
        ← All articles
      </Link>
      <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
        {post.title}
      </h1>
      <p className="mt-3 text-xs uppercase tracking-widest text-gold">
        {new Date(post.date).toLocaleDateString("en-US", { dateStyle: "long" })} ·{" "}
        {post.readMinutes} min read
      </p>
      <div className="mt-10 space-y-8">
        {post.sections.map((section, index) => (
          <section key={index}>
            {section.heading && (
              <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">{section.heading}</h2>
            )}
            {section.paragraphs.map((paragraph, pIndex) => (
              <p key={pIndex} className="mb-4 leading-relaxed text-slate-300">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
      <div className="mt-12 rounded-3xl border border-navy-700/60 bg-navy-900 p-7 text-center">
        <p className="font-semibold text-white">Ready to browse?</p>
        <Link
          href="/products"
          className="btn-shimmer mt-4 inline-flex min-h-12 items-center justify-center rounded-full px-8 text-sm font-semibold text-white"
        >
          Shop the Collection
        </Link>
      </div>
    </article>
  );
}
