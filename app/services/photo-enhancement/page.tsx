import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { FaqSection } from "@/components/faq-section";
import { BeforeAfterGallery } from "@/components/before-after-gallery";
import { StepIcon } from "@/components/icons";
import {
  PHOTO_ENHANCEMENT,
  PHOTO_ENHANCEMENT_ADD_ON_NOTE,
  PHOTO_ENHANCEMENT_FAQ,
  PHOTO_ENHANCEMENT_PRICING,
} from "@/lib/site";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata = pageMetadata(
  "/services/photo-enhancement",
  "AI Listing Photo Enhancement",
  "AI-enhanced photos for Airbnb, Zillow, and realtor listings, delivered in 24-48 hours. From $50 for 5 photos — lighting, color, and cleanup only, never the actual space.",
);

export default function PhotoEnhancementPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: PHOTO_ENHANCEMENT.name, path: "/services/photo-enhancement" },
  ]);

  return (
    <div className="px-4 py-20 sm:px-6 sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          Add-On Service
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {PHOTO_ENHANCEMENT.name}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-neutral-400">
          {PHOTO_ENHANCEMENT.shortDescription}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="btn-shimmer inline-flex w-full items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 sm:w-auto"
          >
            Get a Free Sample
          </Link>
        </div>
      </div>

      <Reveal className="mx-auto mt-14 max-w-2xl rounded-2xl border border-white/10 bg-navy-900/60 p-6 text-center">
        <p className="text-sm leading-relaxed text-neutral-300">
          {PHOTO_ENHANCEMENT.disclaimer}
        </p>
      </Reveal>

      <div className="mx-auto mt-20 max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          Pricing
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          One-time packages
        </h2>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
        {PHOTO_ENHANCEMENT_PRICING.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 80}>
            <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-navy-900/60 p-7">
              <StepIcon icon="camera" />
              <h3 className="mt-4 text-lg font-semibold text-white">
                {tier.name}
              </h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">
                  ${tier.price}
                </span>
                <span className="text-sm text-neutral-400">one-time</span>
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-400">
                {tier.description}
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-white/5 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-brand/15 via-navy-900 to-accent/15 p-6 text-center">
        <p className="text-sm leading-relaxed text-neutral-300">
          {PHOTO_ENHANCEMENT_ADD_ON_NOTE}
        </p>
      </Reveal>

      <BeforeAfterGallery />

      <FaqSection
        eyebrow="FAQ"
        heading="Common questions"
        items={PHOTO_ENHANCEMENT_FAQ}
      />

      <div className="mx-auto mt-20 max-w-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-brand/15 via-navy-900 to-accent/15 p-8 text-center">
        <p className="text-2xl font-bold text-white">
          Want to see what we can do with your photos?
        </p>
        <p className="mt-2 text-sm text-neutral-400">
          Send us a sample listing photo and we&apos;ll enhance one for free,
          no obligation.
        </p>
        <div className="mt-6">
          <Link
            href="/contact"
            className="btn-shimmer inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95"
          >
            Get a Free Sample
          </Link>
        </div>
      </div>
    </div>
  );
}
