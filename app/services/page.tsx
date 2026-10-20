import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI chatbots, booking automation, review generation, and custom websites for small businesses — starting at $500/month.",
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
          Each service is built to run on its own, so your business keeps
          working even when you&apos;re not.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
        {SERVICES.map((service) => (
          <div
            key={service.name}
            className="card-glow rounded-2xl border border-white/10 bg-navy-900/60 p-7 transition-shadow"
          >
            <h2 className="text-xl font-semibold text-white">
              {service.name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-brand/15 via-navy-900 to-accent/15 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-light">
          Pricing
        </p>
        <p className="mt-3 text-2xl font-bold text-white">
          Starting at $500/month
        </p>
        <p className="mt-2 text-sm text-neutral-400">
          Pick the plan that fits your business — no long-term contracts.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/pricing"
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5 sm:w-auto"
          >
            See Pricing
          </Link>
          <Link
            href="/contact"
            className="btn-shimmer inline-flex w-full items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 sm:w-auto"
          >
            Get a Free Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
