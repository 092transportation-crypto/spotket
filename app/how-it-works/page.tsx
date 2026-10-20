import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Our three-step process: we audit your current system, build your custom AI automation, and you get more bookings on autopilot.",
};

const STEPS = [
  {
    title: "We audit your current system",
    description:
      "We review how customers currently reach your business — your website, phone line, texts, and socials — and find exactly where inquiries get missed, delayed, or lost.",
  },
  {
    title: "We build your custom AI automation",
    description:
      "We set up your AI chatbot, booking alerts, and automatic review requests, tuned to how your business actually runs. No generic templates — it's built around your services, hours, and pricing.",
  },
  {
    title: "You get more bookings on autopilot",
    description:
      "Customers get instant answers any time of day, you get notified the second a lead comes in, and happy customers get asked for a review automatically. You focus on the work — the system handles the rest.",
  },
] as const;

export default function HowItWorksPage() {
  return (
    <div className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          How It Works
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Three steps to more bookings on autopilot
        </h1>
      </div>

      <div className="mx-auto mt-16 max-w-2xl space-y-10">
        {STEPS.map((step, i) => (
          <div key={step.title} className="flex gap-5">
            <div className="flex flex-col items-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/15 text-base font-bold text-brand-light">
                {i + 1}
              </span>
              {i < STEPS.length - 1 && (
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
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-2xl text-center">
        <Link
          href="/contact"
          className="btn-shimmer inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95"
        >
          Get a Free Demo
        </Link>
      </div>
    </div>
  );
}
