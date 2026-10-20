import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLandingPage } from "@/lib/supabase";
import { renderMarkdown } from "@/lib/markdown";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPage(slug);
  if (!page) return { title: "Page not found" };
  return { title: page.title };
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params;
  const page = await getLandingPage(slug);
  if (!page) notFound();

  return (
    <article className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(page.content) }} />
        <div className="mt-10">
          <Link
            href="/contact"
            className="btn-shimmer inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white"
          >
            Get Started
          </Link>
        </div>
      </div>
    </article>
  );
}
