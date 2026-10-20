import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { RESULTS_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Results",
  description:
    "See how 92 Transportation went from missed inquiries to zero missed bookings after setting up Spotket Digital's AI automation.",
};

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

      <Reveal className="mx-auto mt-16 max-w-2xl text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Want results like this for your business?
        </h2>
        <div className="mt-8">
          <Link
            href="/contact"
            className="btn-shimmer inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95"
          >
            Get a Free Demo
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
