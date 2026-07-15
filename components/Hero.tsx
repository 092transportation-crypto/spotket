"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductImage from "@/components/ProductImage";
import { formatPrice, type Product } from "@/lib/products";

/** Rising ember particles — deterministic layout. */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 53) % 98}%`,
  size: 2 + (i % 3),
  gold: i % 3 === 0,
  duration: 9 + (i % 6) * 2,
  delay: (i * 1.1) % 9,
}));

/** Overlapping avatar circles for the trust row — initials on brand hues. */
const TRUST_AVATARS = [
  { initial: "S", gradient: "linear-gradient(135deg, #6366f1, #4f46e5)" },
  { initial: "J", gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)" },
  { initial: "M", gradient: "linear-gradient(135deg, #c9a84c, #a8873a)" },
  { initial: "A", gradient: "linear-gradient(135deg, #818cf8, #6366f1)" },
  { initial: "N", gradient: "linear-gradient(135deg, #a78bfa, #7c3aed)" },
];

type HeroStats = { products: number; reviews: number; rating: number };

const HEADLINE = ["Shop", "Smarter"] as const;
const HEADLINE_LENGTH = HEADLINE.join("").length;
const TYPE_SPEED_MS = 110;
const TYPE_START_DELAY_MS = 400;

/**
 * Typewriter headline. The server renders the full text (SEO and no-JS
 * safe); on mount the client rewinds and types it back in, then the caret
 * blinks a few beats and fades.
 */
function TypewriterHeadline() {
  const [typed, setTyped] = useState(HEADLINE_LENGTH);
  const [caretVisible, setCaretVisible] = useState(false);
  const done = typed >= HEADLINE_LENGTH;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let count = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTyped(0);
     
    setCaretVisible(true);
    const start = setTimeout(() => {
      interval = setInterval(() => {
        count += 1;
        setTyped(count);
        if (count >= HEADLINE_LENGTH) {
          clearInterval(interval);
          // Let the caret blink twice on the finished line, then fade out.
          setTimeout(() => setCaretVisible(false), 2200);
        }
      }, TYPE_SPEED_MS);
    }, TYPE_START_DELAY_MS);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, []);

  const caret = (
    <span
      aria-hidden="true"
      className="inline-block w-[0.07em] rounded-sm bg-gold align-baseline"
      style={{ height: "0.82em", animation: "caret-blink 0.9s step-end infinite" }}
    />
  );

  return (
    <span className="block leading-[0.95]" style={{ fontSize: "clamp(3.25rem, 10vw, 9rem)" }}>
      {HEADLINE.map((word, wordIndex) => {
        const wordStart = HEADLINE.slice(0, wordIndex).join("").length;
        const isLastWord = wordIndex === HEADLINE.length - 1;
        return (
          <span key={word} className={wordIndex > 0 ? "block text-brand" : "block"}>
            {[...word].map((letter, letterIndex) => {
              const global = wordStart + letterIndex;
              return (
                <span key={letterIndex} suppressHydrationWarning>
                  {/* While typing, the caret sits just before the next character. */}
                  {caretVisible && !done && typed === global && caret}
                  <span
                    suppressHydrationWarning
                    className="inline-block"
                    style={{ visibility: global < typed ? "visible" : "hidden" }}
                  >
                    {letter}
                  </span>
                </span>
              );
            })}
            {/* Finished: the caret blinks after the last character. */}
            {caretVisible && done && isLastWord && caret}
          </span>
        );
      })}
    </span>
  );
}

export default function Hero({
  products,
  stats,
}: {
  products: Pick<Product, "id" | "name" | "price" | "image">[];
  stats: HeroStats;
}) {
  return (
    <section className="relative flex min-h-[86dvh] items-center overflow-hidden bg-navy-950 lg:min-h-[94dvh]">
      {/* Glowing gradient blobs — the indigo/purple one sits behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/4 h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.45), rgba(124,58,237,0.22) 55%, transparent 75%)",
          animation: "blob-pulse 9s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] top-[12%] h-[26rem] w-[30rem] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.32), rgba(99,102,241,0.14) 55%, transparent 75%)",
          animation: "blob-pulse 12s ease-in-out 3s infinite",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(201,168,76,0.18), transparent 70%)",
          animation: "blob-pulse 12s ease-in-out 2s infinite",
        }}
      />

      {/* Particles rising */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {PARTICLES.map((particle, index) => (
          <span
            key={index}
            className="absolute bottom-0 rounded-full"
            style={{
              left: particle.left,
              width: particle.size,
              height: particle.size,
              background: particle.gold ? "#c9a84c" : "#818cf8",
              animation: `particle-rise ${particle.duration}s linear ${particle.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_auto] lg:py-16">
        <div>
          <p className="animate-fade-up text-sm font-semibold uppercase tracking-[0.4em] text-gold">
            Spotket · Premium Store
          </p>
          <h1 className="mt-5 font-bold tracking-tight text-white">
            <TypewriterHeadline />
            <span
              className="mt-6 block max-w-lg animate-fade-up font-sans text-base font-normal leading-relaxed text-slate-400 sm:text-lg"
              style={{ animationDelay: "950ms" }}
            >
              — Premium Products Delivered to Your Door
            </span>
          </h1>
          <div
            className="mt-10 flex animate-fade-up flex-col gap-3 sm:flex-row sm:gap-4"
            style={{ animationDelay: "1100ms" }}
          >
            <Link
              href="/products"
              className="btn-shimmer inline-flex min-h-13 items-center justify-center rounded-full px-10 text-base font-semibold text-white transition-all duration-300 hover:shadow-xl hover:shadow-brand/40 active:scale-95"
            >
              Shop Now
            </Link>
            <Link
              href="/trending"
              className="inline-flex min-h-13 items-center justify-center rounded-full border border-navy-600 px-10 text-base font-semibold text-slate-200 transition-all duration-300 hover:border-gold hover:text-gold active:scale-95"
            >
              What&apos;s Trending
            </Link>
          </div>

          {/* Trust row — count fed by real review volume */}
          <div
            className="mt-8 flex animate-fade-up items-center gap-3"
            style={{ animationDelay: "1200ms" }}
          >
            <div className="flex -space-x-2.5" aria-hidden="true">
              {TRUST_AVATARS.map((avatar) => (
                <span
                  key={avatar.initial}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-navy-950 text-xs font-bold text-white"
                  style={{ background: avatar.gradient }}
                >
                  {avatar.initial}
                </span>
              ))}
            </div>
            <p className="text-sm text-slate-300">
              Trusted by{" "}
              <span className="font-bold text-white">
                {Math.max(100, Math.floor(stats.reviews / 100) * 100).toLocaleString()}+
              </span>{" "}
              shoppers
            </p>
          </div>

          {/* Real store stats */}
          <div
            className="mt-12 flex animate-fade-up flex-wrap items-center gap-x-10 gap-y-3"
            style={{ animationDelay: "1250ms" }}
          >
            {[
              { value: `${stats.products}+`, label: "Products" },
              { value: `${stats.reviews.toLocaleString()}+`, label: "Real Reviews" },
              { value: `${stats.rating.toFixed(1)}★`, label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-gold">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Floating product showcase — fanned stack, center card leads */}
        <div className="relative hidden h-[480px] w-[470px] lg:block" aria-label="Featured products">
          {products.slice(0, 3).map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group absolute block overflow-hidden rounded-2xl border border-navy-700/70 bg-navy-900 transition-all hover:z-30 hover:border-brand/60"
              style={{
                width: [270, 240, 240][index],
                height: [270, 240, 240][index],
                left: [110, 0, 225][index],
                top: [30, 120, 150][index],
                zIndex: [20, 10, 12][index],
                boxShadow:
                  "0 30px 60px rgba(0, 0, 0, 0.55), 0 0 45px rgba(99, 102, 241, 0.28)",
                ["--tilt" as string]: `${[2, -9, 9][index]}deg`,
                animation: `float-bounce ${5.5 + index * 1.2}s cubic-bezier(0.45, 0, 0.55, 1) ${index * 0.7}s infinite`,
              }}
            >
              <ProductImage src={product.image} alt={product.name} sizes="270px" />
              <span className="absolute inset-x-0 bottom-0 translate-y-full bg-navy-950/90 px-4 py-3 backdrop-blur transition-transform duration-300 group-hover:translate-y-0">
                <span className="line-clamp-1 block text-sm font-semibold text-white">
                  {product.name}
                </span>
                <span className="text-sm font-bold text-gold">{formatPrice(product.price)}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
