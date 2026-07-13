"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200";

const slides = [
  {
    eyebrow: "Electronics",
    headline: "Tech that works as hard as you do",
    sub: "Premium gadgets, audio, and smart home gear — hand-picked and quality-checked.",
    cta: "Shop Electronics",
    href: "/products?category=Electronics",
    glow: "rgba(0,102,255,0.30)",
  },
  {
    eyebrow: "Home & Garden",
    headline: "Upgrade every corner of your home",
    sub: "From cozy living rooms to thriving gardens — premium picks at smart prices.",
    cta: "Shop Home & Garden",
    href: "/products?category=Home+%26+Garden",
    glow: "rgba(0,200,170,0.24)",
  },
  {
    eyebrow: "Health & Wellness",
    headline: "Feel your best, every single day",
    sub: "Wellness essentials that actually deliver — backed by 30-day hassle-free returns.",
    cta: "Shop Wellness",
    href: "/products?category=Health+%26+Wellness",
    glow: "rgba(150,80,255,0.24)",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  const go = (next: number) => setIndex((next + slides.length) % slides.length);

  return (
    <section
      aria-label="Featured collections"
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Banner backdrop */}
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/85 to-navy-950/60"
        aria-hidden="true"
      />

      <div
        className="relative flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, slideIndex) => (
          <div key={slide.eyebrow} className="relative w-full shrink-0" aria-hidden={slideIndex !== index}>
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 25% 40%, ${slide.glow}, transparent 55%)`,
              }}
              aria-hidden="true"
            />
            <div className="mx-auto flex min-h-[calc(100dvh-7.5rem)] max-w-7xl flex-col justify-center px-4 py-10 sm:block sm:min-h-0 sm:px-6 sm:py-24">
              <div className="max-w-xl">
                <span className="rounded-full border border-brand/40 bg-brand/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand backdrop-blur">
                  {slide.eyebrow}
                </span>
                <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:mt-5 lg:text-5xl">
                  {slide.headline}
                </h2>
                <p className="mt-3 text-sm text-slate-300 sm:mt-4 sm:text-lg">{slide.sub}</p>
                <Link
                  href={slide.href}
                  tabIndex={slideIndex === index ? 0 : -1}
                  className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-brand px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/40 active:scale-95 sm:w-auto sm:text-sm"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full sm:block border border-navy-600 bg-navy-950/70 p-2.5 text-slate-300 backdrop-blur transition-all hover:border-brand hover:text-brand"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full sm:block border border-navy-600 bg-navy-950/70 p-2.5 text-slate-300 backdrop-blur transition-all hover:border-brand hover:text-brand"
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-1 sm:bottom-2">
        {slides.map((slide, dotIndex) => (
          <button
            key={slide.eyebrow}
            type="button"
            onClick={() => go(dotIndex)}
            aria-label={`Go to slide ${dotIndex + 1}: ${slide.eyebrow}`}
            aria-current={dotIndex === index}
            className="flex h-11 items-center px-1"
          >
            <span
              className={`h-2 rounded-full transition-all ${
                dotIndex === index ? "w-6 bg-brand" : "w-2 bg-slate-500 hover:bg-slate-300"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
