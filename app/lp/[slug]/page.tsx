import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { FaqSection } from "@/components/faq-section";
import { CONTACT_IMAGE, LANDING_PAGES, PRICING_TIERS } from "@/lib/site";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { getLandingPage } from "@/lib/supabase";
import { renderMarkdown } from "@/lib/markdown";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

function findStaticPage(slug: string) {
  return LANDING_PAGES.find((page) => page.slug === slug);
}

export async function generateStaticParams() {
  return LANDING_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const staticPage = findStaticPage(slug);
  if (staticPage) {
    // metaTitle already includes "| Spotket Digital" for clarity in the data
    // file, but the root layout's title template appends that suffix again —
    // strip it here so the rendered <title> isn't doubled.
    const title = staticPage.metaTitle.replace(/ \| Spotket Digital$/, "");
    return pageMetadata(`/lp/${slug}`, title, staticPage.metaDescription);
  }
  const page = await getLandingPage(slug);
  if (!page) return { title: "Page not found" };
  return pageMetadata(`/lp/${slug}`, page.title, page.title);
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params;
  const staticPage = findStaticPage(slug);

  if (staticPage) {
    const breadcrumb = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/services" },
      { name: staticPage.h1, path: `/lp/${staticPage.slug}` },
    ]);
    const related = LANDING_PAGES.filter((page) =>
      (staticPage.relatedSlugs as readonly string[]).includes(page.slug),
    );

    return (
      <div className="px-4 py-20 sm:px-6 sm:py-28">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />

        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
            {staticPage.keyword}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {staticPage.h1}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-400">
            {staticPage.heroSubheading}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="btn-shimmer inline-flex w-full items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 sm:w-auto"
            >
              Get Your Free Automation Audit
            </Link>
          </div>
        </div>

        <Reveal className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-3xl border border-white/10">
          <div className="relative aspect-[21/9]">
            <Image
              src={CONTACT_IMAGE.src}
              alt={CONTACT_IMAGE.alt}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent" />
          </div>
        </Reveal>

        <div className="mx-auto mt-16 max-w-3xl">
          <Reveal>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Sound familiar?
            </h2>
          </Reveal>
          <ul className="mt-6 space-y-3">
            {staticPage.painPoints.map((point) => (
              <li
                key={point}
                className="flex gap-3 rounded-xl border border-white/10 bg-navy-900/60 p-4 text-sm leading-relaxed text-neutral-300"
              >
                <span className="mt-0.5 text-neutral-600">&times;</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <Reveal>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              What Spotket builds for you
            </h2>
          </Reveal>
          <ul className="mt-6 space-y-3">
            {staticPage.included.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-brand/20 bg-navy-900/60 p-4 text-sm leading-relaxed text-neutral-200"
              >
                <span className="mt-0.5 text-brand-light">&check;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-neutral-400">
            See the full stack on the{" "}
            <Link href="/services" className="text-brand-light hover:text-white">
              services page
            </Link>
            , or compare plans on{" "}
            <Link href="/pricing" className="text-brand-light hover:text-white">
              pricing
            </Link>
            .
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl text-center">
          <Reveal className="rounded-2xl border border-white/10 bg-navy-900/60 p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
              Plans
            </p>
            <p className="mt-3 text-2xl font-bold text-white">
              Starting at ${Math.min(...PRICING_TIERS.map((t) => t.price))}/month
            </p>
            <p className="mt-2 text-sm text-neutral-400">
              No long-term contracts. Cancel any time.
            </p>
          </Reveal>
        </div>

        <FaqSection heading="Common questions" items={staticPage.faq} />

        {related.length > 0 && (
          <div className="mx-auto mt-20 max-w-5xl">
            <Reveal className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
                Related
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                You might also be looking for
              </h2>
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {related.map((page) => (
                <Link
                  key={page.slug}
                  href={`/lp/${page.slug}`}
                  className="rounded-xl border border-white/10 bg-navy-900/60 px-5 py-4 text-sm font-medium text-neutral-300 transition-colors hover:border-brand/40 hover:text-white"
                >
                  {page.h1}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto mt-20 max-w-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-brand/15 via-navy-900 to-accent/15 p-8 text-center">
          <p className="text-2xl font-bold text-white">
            Ready to stop missing customers?
          </p>
          <p className="mt-2 text-sm text-neutral-400">
            Book a free 10 minute call and we&apos;ll show you exactly what
            automation could do for your business.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="btn-shimmer inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95"
            >
              Get Your Free Automation Audit
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
