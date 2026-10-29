import Link from "next/link";
import { TierIcon, StepIcon } from "@/components/icons";
import { FaqSection } from "@/components/faq-section";
import {
  PHOTO_ENHANCEMENT,
  PHOTO_ENHANCEMENT_ADD_ON_NOTE,
  PHOTO_ENHANCEMENT_PRICING,
  PRICING_FAQ,
  PRICING_TIERS,
} from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "/pricing",
  "Pricing",
  "AI automation for small business — $500/month flat. Custom website, AI chatbot, AI receptionist, instant lead alerts, and monthly SEO. No long-term contracts.",
);

export default function PricingPage() {
  return (
    <div className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          Pricing
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Simple monthly pricing
        </h1>
        <p className="mt-4 text-base leading-relaxed text-neutral-400">
          No long-term contracts. Cancel any time.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-6">
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`flex flex-col rounded-2xl border p-7 ${
              tier.featured
                ? "border-brand/50 bg-gradient-to-b from-brand/15 via-navy-900 to-navy-900"
                : "border-white/10 bg-navy-900/60"
            }`}
          >
            <TierIcon icon={tier.icon} featured={tier.featured} />
            {tier.featured && (
              <span className="mt-4 mb-4 inline-flex w-fit items-center rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold text-brand-light">
                Most Popular
              </span>
            )}
            <h2 className="mt-4 text-lg font-semibold text-white">{tier.name}</h2>
            <p className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">
                ${tier.price}
              </span>
              <span className="text-sm text-neutral-400">/month</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {tier.description}
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 text-sm leading-relaxed text-neutral-300"
                >
                  <span className="mt-0.5 text-brand-light">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className={`mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-95 ${
                tier.featured
                  ? "btn-shimmer text-white"
                  : "border border-white/15 text-white hover:bg-white/5"
              }`}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-20 max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          One-Time Service
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          {PHOTO_ENHANCEMENT.name}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-neutral-400">
          {PHOTO_ENHANCEMENT.shortDescription}
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
        {PHOTO_ENHANCEMENT_PRICING.map((tier) => (
          <div
            key={tier.name}
            className="flex h-full flex-col rounded-2xl border border-white/10 bg-navy-900/60 p-7"
          >
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
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-2xl text-center">
        <p className="text-xs text-neutral-500">{PHOTO_ENHANCEMENT.disclaimer}</p>
        <p className="mt-4 text-sm text-neutral-400">{PHOTO_ENHANCEMENT_ADD_ON_NOTE}</p>
        <Link
          href="/services/photo-enhancement"
          className="mt-4 inline-block text-sm font-semibold text-brand-light transition-colors hover:text-white"
        >
          See pricing &amp; details &rarr;
        </Link>
      </div>

      <div className="mx-auto mt-16 max-w-xl text-center">
        <p className="text-sm text-neutral-400">
          Not sure if this is right for your business?
        </p>
        <div className="mt-6">
          <Link
            href="/contact"
            className="text-sm font-semibold text-brand-light transition-colors hover:text-white"
          >
            Book a free 10 minute call &rarr;
          </Link>
        </div>
      </div>

      <FaqSection eyebrow="Pricing FAQ" heading="Billing questions" items={PRICING_FAQ} />
    </div>
  );
}
