"use client";

import Link from "next/link";
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

type HeroStats = { products: number; reviews: number; rating: number };

/** Letter-by-letter reveal for a word. */
function AnimatedWord({
  word,
  startDelay,
  className = "",
}: {
  word: string;
  startDelay: number;
  className?: string;
}) {
  return (
    <span className={className}>
      {[...word].map((letter, index) => (
        <span
          key={index}
          className="inline-block animate-fade-up"
          style={{ animationDelay: `${startDelay + index * 55}ms` }}
        >
          {letter}
        </span>
      ))}
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
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-navy-950">
      {/* Glowing gradient blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/4 h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.35), rgba(124,58,237,0.12) 60%, transparent 75%)",
          animation: "blob-pulse 9s ease-in-out infinite",
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

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="animate-fade-up text-sm font-semibold uppercase tracking-[0.4em] text-gold">
            Spotket · Premium Store
          </p>
          <h1
            className="mt-5 font-bold leading-[0.95] tracking-tight text-white"
            style={{ fontSize: "clamp(5rem, 10vw, 9rem)" }}
          >
            <AnimatedWord word="Shop" startDelay={200} />
            <br />
            <AnimatedWord word="Smarter." startDelay={480} className="text-brand" />
          </h1>
          <p
            className="mt-6 max-w-lg animate-fade-up text-base leading-relaxed text-slate-400 sm:text-lg"
            style={{ animationDelay: "950ms" }}
          >
            Premium products. Unbeatable prices. Delivered to your door.
          </p>
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

        {/* Floating product showcase */}
        <div className="relative hidden h-[560px] w-[420px] lg:block" aria-label="Featured products">
          {products.slice(0, 3).map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group absolute block overflow-hidden rounded-2xl border border-navy-700/70 bg-navy-900 shadow-2xl shadow-black/50 transition-shadow hover:border-brand/60 hover:shadow-brand/25"
              style={{
                width: index === 0 ? 280 : 250,
                height: index === 0 ? 280 : 250,
                left: [90, 0, 160][index],
                top: [0, 200, 320][index],
                zIndex: index === 0 ? 3 : index,
                ["--tilt" as string]: `${[3, -4, 2][index]}deg`,
                animation: `float-y ${5.5 + index * 1.2}s cubic-bezier(0.45, 0, 0.55, 1) ${index * 0.7}s infinite`,
              }}
            >
              <ProductImage src={product.image} alt={product.name} sizes="280px" />
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
