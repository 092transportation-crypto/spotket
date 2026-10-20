import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost } from "@/lib/supabase";
import { renderMarkdown } from "@/lib/markdown";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.excerpt || undefined };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <article className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <Link href="/blog" className="text-sm text-brand-light hover:text-white">
          &larr; Back to blog
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
      </div>
    </article>
  );
}
