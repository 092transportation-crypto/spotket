import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { InitialsAvatar } from "@/components/icons";
import { FaqSection } from "@/components/faq-section";
import {
  BUSINESS_PHOTO,
  CASE_STUDIES,
  RESULTS_COMPARISON,
  RESULTS_FAQ,
  RESULTS_IMAGE,
  RESULTS_STATS,
} from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "/results",
  "Results",
  "See how AI automation gets small businesses more bookings — real results for 92 Transportation, DCA Limos, BWI Chauffeur, IAD Airport Limo, and MSY Limo Service.",
);

const BEFORE = [
  "Inquiries came in after hours and sat unanswered until morning",
  "Leads booked with a competitor while waiting for a callback",
  "Reviews only came in when someone remembered to ask",
  "No visibility into how many inquiries were being missed",
] as const;

const AFTER = [
  "Every inquiry gets an instant AI response, 24/7",
  "Staff get a text alert the moment a new lead comes in",
  "Every completed job triggers an automatic review request",
  "Zero missed inquiries since the system went live",
] as const;

export default function ResultsPage() {
  return (
    <div className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          Results
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Proof it works
        </h1>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        {RESULTS_STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-navy-900/60 px-6 py-5 text-center"
          >
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="mt-1 text-sm font-medium text-neutral-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <Reveal className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-3xl border border-white/10">
        <div className="relative aspect-[16/9]">
          <Image
            src={RESULTS_IMAGE.src}
            alt={RESULTS_IMAGE.alt}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
        </div>
        <div className="bg-gradient-to-br from-brand/15 via-navy-900 to-accent/15 p-8 text-center sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
            Case Study
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            92 Transportation
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white">
            Our client 92 Transportation saw zero missed inquiries after
            setup.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Before Spotket Digital, every inquiry that came in outside office
            hours was a coin flip — answered in the morning, or lost to a
            competitor overnight. After rolling out the AI chatbot and
            booking automation, every lead gets an instant response and an
            immediate alert to staff, day or night.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <InitialsAvatar name="92 Transportation" />
            <span className="text-sm text-neutral-400">
              Owner, 92 Transportation
            </span>
          </div>
        </div>
      </Reveal>

      <Reveal className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-white/10">
        <div className="relative aspect-[21/9]">
          <Image
            src={BUSINESS_PHOTO.src}
            alt={BUSINESS_PHOTO.alt}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      </Reveal>

      <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
        <Reveal className="rounded-2xl border border-white/10 bg-navy-900/60 p-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Before
          </p>
          <ul className="mt-4 space-y-3">
            {BEFORE.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-relaxed text-neutral-400"
              >
                <span className="mt-0.5 text-neutral-600">&times;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120} className="rounded-2xl border border-brand/30 bg-navy-900/60 p-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
            After
          </p>
          <ul className="mt-4 space-y-3">
            {AFTER.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-relaxed text-neutral-200"
              >
                <span className="mt-0.5 text-brand-light">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="mx-auto mt-20 max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          More Results
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          More businesses, same results
        </h2>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
        {CASE_STUDIES.map((study, i) => (
          <Reveal key={study.business} delay={i * 80}>
            <div className="card-glow flex h-full flex-col rounded-2xl border border-white/10 bg-navy-900/60 p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-white">
                  {study.business}
                </h3>
                <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  {study.location}
                </span>
              </div>

              <div className="mt-4 space-y-3 text-sm leading-relaxed">
                <p className="text-neutral-400">
                  <span className="font-semibold text-neutral-300">
                    Before:{" "}
                  </span>
                  {study.problem}
                </p>
                <p className="text-neutral-400">
                  <span className="font-semibold text-neutral-300">
                    What we built:{" "}
                  </span>
                  {study.built}
                </p>
              </div>

              <ul className="mt-4 space-y-2">
                {study.results.map((result) => (
                  <li
                    key={result}
                    className="flex gap-3 text-sm leading-relaxed text-neutral-200"
                  >
                    <span className="mt-0.5 text-brand-light">✓</span>
                    <span>{result}</span>
                  </li>
                ))}
              </ul>

              <blockquote className="mt-5 flex-1 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-neutral-300 italic">
                &ldquo;{study.quote}&rdquo;
                <footer className="mt-3 flex items-center gap-2.5 not-italic">
                  <InitialsAvatar name={study.business} />
                  <span className="text-xs font-semibold text-neutral-500">
                    {study.quoteAttribution}
                  </span>
                </footer>
              </blockquote>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto mt-20 max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          At A Glance
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          Before Spotket vs. After Spotket
        </h2>
      </div>

      <Reveal className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-3 bg-white/5 text-xs font-semibold uppercase tracking-widest text-neutral-400">
          <div className="px-4 py-3 sm:px-6">&nbsp;</div>
          <div className="px-4 py-3 text-neutral-500 sm:px-6">
            Before Spotket
          </div>
          <div className="px-4 py-3 text-brand-light sm:px-6">
            After Spotket
          </div>
        </div>
        {RESULTS_COMPARISON.map((row, i) => (
          <div
            key={row.label}
            className={`grid grid-cols-3 text-sm leading-relaxed ${
              i % 2 === 0 ? "bg-navy-900/40" : "bg-navy-900/60"
            }`}
          >
            <div className="px-4 py-4 font-semibold text-white sm:px-6">
              {row.label}
            </div>
            <div className="px-4 py-4 text-neutral-500 sm:px-6">
              {row.before}
            </div>
            <div className="px-4 py-4 text-neutral-200 sm:px-6">
              {row.after}
            </div>
          </div>
        ))}
      </Reveal>

      <FaqSection eyebrow="Results FAQ" heading="Proof it's real" items={RESULTS_FAQ} />

      <Reveal className="mx-auto mt-20 max-w-2xl text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Want results like this for your business?
        </h2>
        <div className="mt-8">
          <Link
            href="/contact"
            className="btn-shimmer inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95"
          >
            Get Your Free Automation Audit
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
