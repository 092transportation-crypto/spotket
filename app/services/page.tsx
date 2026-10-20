import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { PRICING_TIERS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Three simple plans for AI automation and web design — Starter at $300/month, Standard at $500/month, Premium at $1,000/month.",
};

export default function ServicesPage() {
  return (
    <div className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          Services
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Everything you need to automate growth
        </h1>
        <p className="mt-4 text-base leading-relaxed text-neutral-400">
          Three plans built to run on their own. No long-term contracts.
          Cancel any time.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
        {PRICING_TIERS.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 80}>
            <div
              className={`flex h-full flex-col rounded-2xl border p-7 ${
                tier.featured
                  ? "border-brand/50 bg-gradient-to-b from-brand/15 via-navy-900 to-navy-900"
                  : "border-white/10 bg-navy-900/60"
              }`}
            >
              {tier.featured && (
                <span className="mb-4 inline-flex w-fit items-center rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold text-brand-light">
                  Most Popular
                </span>
              )}
              <h2 className="text-lg font-semibold text-white">
                {tier.name}
              </h2>
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
          </Reveal>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-brand/15 via-navy-900 to-accent/15 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-light">
          Not sure which plan fits?
        </p>
        <p className="mt-3 text-2xl font-bold text-white">
          Get a free automation audit
        </p>
        <p className="mt-2 text-sm text-neutral-400">
          We&apos;ll look at your business and recommend the right plan — no
          pressure.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="btn-shimmer inline-flex w-full items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 sm:w-auto"
          >
            Get Your Free Automation Audit
          </Link>
        </div>
      </div>
    </div>
  );
}
