import { MousePointerClick, Package, Truck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TrustBadges from "@/components/TrustBadges";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Spotket exists so you can shop smarter. Learn about our story, our mission, and why thousands of shoppers trust us for premium products at fair prices.",
};

const values = [
  {
    title: "Curation over clutter",
    description:
      "We don't list thousands of products. We test, compare, and hand-pick only the ones we'd buy ourselves.",
  },
  {
    title: "Fair, transparent pricing",
    description:
      "Premium doesn't have to mean overpriced. We work directly with suppliers to cut out the middleman.",
  },
  {
    title: "Service that shows up",
    description:
      "Real support, 24/7. Free shipping on every order and 30 days to change your mind — no questions asked.",
  },
];

const steps = [
  {
    icon: MousePointerClick,
    title: "Browse",
    text: "Explore a tightly curated catalog — every product researched, compared, and chosen on merit.",
  },
  {
    icon: Package,
    title: "Order",
    text: "Check out securely in under a minute with Stripe-encrypted payments and an all-inclusive price.",
  },
  {
    icon: Truck,
    title: "Delivered",
    text: "Track your order to your door, backed by 30-day hassle-free returns if it isn't right.",
  },
];

export default async function AboutPage() {
  const catalog = await getCatalog();
  const reviewTotal = catalog.reduce((sum, product) => sum + product.reviewCount, 0);
  const stats = [
    { value: `${catalog.length}+`, label: "Products Available" },
    { value: `${reviewTotal.toLocaleString()}+`, label: "Verified Reviews" },
    { value: "USA", label: "Nationwide Shipping" },
    { value: "2026", label: "Founded" },
  ];
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">
              Our Story
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-white sm:text-5xl">
              Built for people who shop smarter
            </h1>
            <div className="mt-6 space-y-4 leading-relaxed text-slate-300">
              <p>
                Spotket started with a simple frustration: online shopping is
                full of noise. Endless listings, inflated prices, and products
                that never look like the photos. We believed there was a
                smarter way.
              </p>
              <p>
                So we built a store around one promise —{" "}
                <strong className="text-white">Shop Smarter</strong>. Every
                product in our collection is researched, tested, and chosen
                because it delivers real value. No filler, no gimmicks, just
                premium products delivered to your door.
              </p>
              <p>
                Our mission is to make premium accessible: quality you can
                trust, prices that make sense, and service that treats you like
                a person, not an order number.
              </p>
            </div>
            <Link
              href="/products"
              className="mt-8 inline-block rounded-xl bg-brand px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/40 active:scale-95"
            >
              Explore the Collection
            </Link>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-navy-700/60">
            <Image
              src="/logo.jpeg"
              alt="SpotKet logo — Shop Smarter"
              fill
              sizes="(max-width: 1024px) 100vw, 448px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="border-t border-navy-700/60 bg-navy-900">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-16">
          <h2 className="text-center text-3xl font-bold text-white">
            What we stand for
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="rounded-2xl border border-navy-700/60 bg-navy-800/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/50"
              >
                <span className="text-2xl font-extrabold text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-semibold text-white">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">Our Mission</p>
        <blockquote className="mt-4 text-2xl font-bold leading-snug text-white sm:text-4xl">
          &ldquo;We believe everyone deserves access to premium products
          without premium prices.&rdquo;
        </blockquote>
      </section>

      {/* How Spotket works */}
      <section className="border-t border-navy-700/60 bg-navy-900">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-white">How Spotket works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-navy-700/60 bg-navy-800/60 p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/15">
                  <step.icon className="h-6 w-6 text-brand" aria-hidden="true" />
                </span>
                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-gold">Step {index + 1}</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-white">The team behind Spotket</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-400">
          Spotket is run by a small, product-obsessed team based in Maryland,
          USA. We personally research every item before it earns a listing,
          read the reviews so you don&apos;t have to, and answer support
          ourselves — when you email us, a founder reads it. Small team,
          high standards, no corporate runaround.
        </p>
      </section>

      {/* Stats */}
      <section className="border-t border-navy-700/60 bg-navy-900">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 py-12 text-center sm:px-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-gold sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <TrustBadges />
    </>
  );
}
