import Image from "next/image";
import Link from "next/link";
import { CountUp } from "@/components/count-up";
import { LetterFadeHeading } from "@/components/letter-fade-heading";
import { Reveal } from "@/components/reveal";
import { TrustBadges } from "@/components/trust-badges";
import { TierIcon, StepIcon, InitialsAvatar } from "@/components/icons";
import { ServicesSlider } from "@/components/services-slider";
import { FaqSection } from "@/components/faq-section";
import { ExploreLinks } from "@/components/explore-links";
import {
  CONTACT_EMAIL,
  FEATURE_HIGHLIGHTS,
  FOOTER_GUIDE_LINKS,
  HERO_IMAGE,
  HOME_FAQ,
  HOW_IT_WORKS_STEPS,
  LANDING_PAGES,
  MISSED_INQUIRIES_STAT,
  OFFICE_HERO_IMAGE,
  PRICING_TIERS,
  RESULTS_IMAGE,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  STATS,
} from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

const exploreLinks = LANDING_PAGES.filter((page) =>
  (FOOTER_GUIDE_LINKS as readonly string[]).includes(page.slug),
).map((page) => ({ href: `/lp/${page.slug}`, label: page.keyword }));

export const metadata = pageMetadata(
  "/",
  "Spotket | AI Automation That Gets Small Businesses More Customers",
  "We build custom websites, AI chatbots, and AI receptionists for small businesses — plus monthly SEO to grow your Google rankings. Stop missing inquiries. $500/month, no contracts.",
);

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  description: SITE_TAGLINE,
  url: SITE_URL,
  email: CONTACT_EMAIL,
  image: `${SITE_URL}/spotket-logo.png`,
  areaServed: { "@type": "State", name: "Maryland" },
  priceRange: "$500/month",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <section className="relative overflow-hidden px-4 pt-20 pb-20 sm:px-6 sm:pt-28 sm:pb-28">
        <div className="absolute inset-0 -z-20">
          <Image
            src={OFFICE_HERO_IMAGE.src}
            alt={OFFICE_HERO_IMAGE.alt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/90 to-navy-950" />
        </div>
        <div
          aria-hidden
          className="blob-pulse absolute -top-32 -left-32 -z-10 h-80 w-80 rounded-full bg-brand/30 blur-3xl"
        />
        <div
          aria-hidden
          className="blob-pulse-delay absolute top-10 -right-24 -z-10 h-80 w-80 rounded-full bg-accent/25 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="text-center lg:text-left">
            <p className="animate-fade-up text-xs font-semibold uppercase tracking-widest text-brand-light">
              AI Automation for Small Business
            </p>
            <p
              className="animate-fade-up mt-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold text-brand-light"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-light" />
              $500/month, flat rate
            </p>
            <LetterFadeHeading
              text="Stop Missing Inquiries. Start Getting More Customers."
              className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-5xl xl:text-6xl"
            />
            <p
              className="animate-fade-up mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg lg:mx-0"
              style={{ animationDelay: "0.5s" }}
            >
              We build AI systems that respond to every customer 24/7 so you
              never lose another booking.
            </p>
            <p
              className="animate-fade-up mx-auto mt-4 max-w-xl text-sm font-semibold text-brand-light sm:text-base lg:mx-0"
              style={{ animationDelay: "0.55s" }}
            >
              {MISSED_INQUIRIES_STAT}
            </p>
            <div
              className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
              style={{ animationDelay: "0.6s" }}
            >
              <Link
                href="/contact"
                className="btn-shimmer inline-flex w-full items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 sm:w-auto"
              >
                Get Your Free Automation Audit
              </Link>
              <Link
                href="/results"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5 sm:w-auto"
              >
                See Results
              </Link>
            </div>
            <div
              className="animate-fade-up mt-8 flex justify-center lg:justify-start"
              style={{ animationDelay: "0.7s" }}
            >
              <TrustBadges />
            </div>
          </div>

          <Reveal delay={200} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="card-glow relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10">
              <Image
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 1024px) 90vw, 560px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent" />
            </div>
          </Reveal>
        </div>

        <div className="relative mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-navy-900/60 px-6 py-5 text-center"
            >
              <p className="text-3xl font-bold text-white">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-sm font-medium text-neutral-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              One flat plan. No long-term contracts.
            </h2>
          </Reveal>

          <div className="mx-auto mt-12 max-w-md">
            {PRICING_TIERS.map((tier) => (
              <Reveal key={tier.name}>
                <div
                  className={`flex h-full flex-col rounded-2xl border p-7 ${
                    tier.featured
                      ? "border-brand/50 bg-gradient-to-b from-brand/15 via-navy-900 to-navy-900"
                      : "border-white/10 bg-navy-900/60"
                  }`}
                >
                  <TierIcon icon={tier.icon} featured={tier.featured} />
                  {tier.featured && (
                    <span className="mt-3 mb-3 inline-flex w-fit items-center rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold text-brand-light">
                      Most Popular
                    </span>
                  )}
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    {tier.name}
                  </h3>
                  <p className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">
                      ${tier.price}
                    </span>
                    <span className="text-sm text-neutral-400">/month</span>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    {tier.description}
                  </p>
                  <ul className="mt-6 space-y-3">
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
                    className="btn-shimmer mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    Get Started
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
              What&apos;s Included
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              The automation stack behind every plan
            </h2>
          </Reveal>

          <div className="mt-12">
            <ServicesSlider slides={FEATURE_HIGHLIGHTS} />
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/services"
              className="text-sm font-semibold text-brand-light transition-colors hover:text-white"
            >
              See every service in detail &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-navy-900/40 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Up and running in 48 hours
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 100} className="text-center sm:text-left">
                <StepIcon icon={step.icon} />
                <h3 className="mt-4 text-base font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {step.summary}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/how-it-works"
              className="text-sm font-semibold text-brand-light transition-colors hover:text-white"
            >
              See the full process &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-20 sm:px-6">
        <Reveal className="mx-auto grid max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 lg:grid-cols-2">
          <div className="relative hidden aspect-square lg:block">
            <Image
              src={RESULTS_IMAGE.src}
              alt={RESULTS_IMAGE.alt}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 0px, 400px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center bg-gradient-to-br from-brand/15 via-navy-900 to-accent/15 p-8 text-center sm:p-12 lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
              Real Results
            </p>
            <p className="mt-4 text-xl font-semibold text-white sm:text-2xl">
              &ldquo;Our client 92 Transportation saw zero missed inquiries
              after setup.&rdquo;
            </p>
            <div className="mt-5 flex items-center justify-center gap-3 lg:justify-start">
              <InitialsAvatar name="92 Transportation" />
              <span className="text-sm text-neutral-400">
                Owner, 92 Transportation
              </span>
            </div>
            <div className="mt-8">
              <Link
                href="/results"
                className="text-sm font-semibold text-white underline underline-offset-4 transition-colors hover:text-brand-light"
              >
                Read the full case study &rarr;
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-white/10 px-4 py-20 sm:px-6">
        <ExploreLinks
          heading="AI automation for your industry"
          items={exploreLinks}
        />
        <FaqSection eyebrow="FAQ" heading="Quick answers" items={HOME_FAQ} />
      </section>

      <section className="border-t border-white/10 px-4 py-20 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to stop missing customers?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400 sm:text-base">
            Book a free 10 minute call and we&apos;ll show you exactly what
            automation could do for your business.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="btn-shimmer inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95"
            >
              Get Your Free Automation Audit
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
