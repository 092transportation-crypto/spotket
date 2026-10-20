import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { HOW_IT_WORKS_STEPS, WHAT_YOU_GET } from "@/lib/site";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Our four-step process: Free Audit, Custom Build, Go Live, and Ongoing Support — your AI automation is live within 48 hours.",
};

export default function HowItWorksPage() {
  return (
    <div className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          How It Works
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Four steps to more bookings on autopilot
        </h1>
      </div>

      {/* Timeline graphic */}
      <div className="mx-auto mt-16 hidden max-w-5xl sm:block">
        <div className="relative grid grid-cols-4">
          <div className="absolute top-6 right-[12.5%] left-[12.5%] h-px bg-white/10" />
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              <span className="z-10 flex h-12 w-12 items-center justify-center rounded-full border border-brand/40 bg-navy-900 text-base font-bold text-brand-light">
                {i + 1}
              </span>
              <p className="mt-4 text-sm font-semibold text-white">
                {step.title}
              </p>
              <p className="mt-1 text-xs text-neutral-500">{step.summary}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-2xl space-y-14 sm:mt-20">
        {HOW_IT_WORKS_STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 80}>
            <div className="flex gap-5">
              <div className="flex flex-col items-center">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/15 text-base font-bold text-brand-light">
                  {i + 1}
                </span>
                {i < HOW_IT_WORKS_STEPS.length - 1 && (
                  <span className="mt-2 w-px flex-1 bg-white/10" />
                )}
              </div>
              <div className="pb-2">
                <h2 className="text-lg font-semibold text-white">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {step.description}
                </p>

                <div className="mt-5 space-y-3">
                  {step.faq.map((item) => (
                    <div
                      key={item.question}
                      className="rounded-xl border border-white/10 bg-navy-900/60 p-4"
                    >
                      <p className="text-sm font-semibold text-white">
                        {item.question}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mx-auto mt-20 max-w-2xl rounded-2xl border border-white/10 bg-navy-900/60 p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          What You Get
        </p>
        <ul className="mt-5 space-y-3">
          {WHAT_YOU_GET.map((item) => (
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

      <div className="mx-auto mt-16 max-w-2xl text-center">
        <Link
          href="/contact"
          className="btn-shimmer inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95"
        >
          Get Your Free Automation Audit
        </Link>
      </div>
    </div>
  );
}
