import Link from "next/link";
import { SERVICES } from "@/lib/site";

const STATS = [
  { label: "24/7 AI response" },
  { label: "Zero missed bookings" },
  { label: "5x more Google reviews" },
] as const;

const STEPS = [
  { title: "We audit your current system", description: "We look at how customers reach you today and where inquiries fall through the cracks." },
  { title: "We build your custom AI automation", description: "Chatbot, booking alerts, and review requests, set up and tuned for your business." },
  { title: "You get more bookings on autopilot", description: "Customers get answered instantly, you get notified instantly, and reviews pile up on their own." },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32">
        <div
          aria-hidden
          className="blob-pulse absolute -top-32 -left-32 h-80 w-80 rounded-full bg-brand/30 blur-3xl"
        />
        <div
          aria-hidden
          className="blob-pulse-delay absolute top-10 -right-24 h-80 w-80 rounded-full bg-accent/25 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl text-center animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
            AI Automation &amp; Web Design
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            We Build AI Systems That Get You More Customers
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
            Automated booking systems, AI chatbots, and custom websites for
            small businesses.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="btn-shimmer inline-flex w-full items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 sm:w-auto"
            >
              Get a Free Demo
            </Link>
            <Link
              href="/results"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5 sm:w-auto"
            >
              See Results
            </Link>
          </div>
        </div>

        <div className="relative mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-navy-900/60 px-6 py-5 text-center"
            >
              <p className="text-base font-semibold text-white">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
              What We Do
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Everything your business needs to stop losing customers
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <div
                key={service.name}
                className="card-glow rounded-2xl border border-white/10 bg-navy-900/60 p-6 transition-shadow"
              >
                <h3 className="text-lg font-semibold text-white">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="text-sm font-semibold text-brand-light transition-colors hover:text-white"
            >
              See all services &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-navy-900/40 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Up and running in three simple steps
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="text-center sm:text-left">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-sm font-bold text-brand-light">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-brand/15 via-navy-900 to-accent/15 p-8 text-center sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
            Real Results
          </p>
          <p className="mt-4 text-xl font-semibold text-white sm:text-2xl">
            &ldquo;Our client 92 Transportation saw zero missed inquiries
            after setup.&rdquo;
          </p>
          <div className="mt-8">
            <Link
              href="/results"
              className="text-sm font-semibold text-white underline underline-offset-4 transition-colors hover:text-brand-light"
            >
              Read the full case study &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
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
              Get a Free Demo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
