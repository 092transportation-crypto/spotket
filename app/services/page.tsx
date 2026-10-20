import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { TierIcon } from "@/components/icons";
import { CONTACT_IMAGE, FEATURE_HIGHLIGHTS, PRICING_TIERS, SERVICES_FAQ } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "/services",
  "Services",
  "AI automation for small business and AI chatbots for limo companies — AI receptionist, booking automation, and automated review requests. Plans from $200/month.",
);

const servicesFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SERVICES_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function ServicesPage() {
  return (
    <div className="px-4 py-20 sm:px-6 sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesFaqSchema) }}
      />

      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          Services
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Everything you need to automate growth
        </h1>
        <p className="mt-4 text-base leading-relaxed text-neutral-400">
          Four plans built to run on their own. No long-term contracts.
          Cancel any time.
        </p>
      </div>

      <Reveal className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl border border-white/10">
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

      <div className="mx-auto mt-16 max-w-6xl">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
            What&apos;s Included
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            The automation stack behind every plan
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_HIGHLIGHTS.map((feature, i) => (
            <Reveal key={feature.name} delay={i * 80}>
              <div className="card-glow group h-full overflow-hidden rounded-2xl border border-white/10 bg-navy-900/60 transition-transform duration-300 hover:-translate-y-1.5">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={feature.image.src}
                    alt={feature.image.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/10 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-base font-semibold text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          Plans
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          Simple monthly pricing
        </h2>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PRICING_TIERS.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 80}>
            <div
              className={`flex h-full flex-col rounded-2xl border p-7 ${
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
              <h3 className="mt-4 text-lg font-semibold text-white">
                {tier.name}
              </h3>
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

      <div className="mx-auto mt-20 max-w-3xl">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Common questions
          </h2>
        </Reveal>

        <div className="mt-10 space-y-4">
          {SERVICES_FAQ.map((item, i) => (
            <Reveal key={item.question} delay={i * 80}>
              <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-6">
                <h3 className="text-base font-semibold text-white">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {item.answer}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-brand/15 via-navy-900 to-accent/15 p-8 text-center">
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
