"use client";

import { useEffect, useState } from "react";
import Stars from "@/components/Stars";

const testimonials = [
  {
    quote:
      "Ordered on a Tuesday, it was at my door by Friday. The quality honestly surprised me for the price — I've already ordered twice more.",
    name: "Sarah M.",
    detail: "Verified Buyer · Electronics",
    rating: 5,
  },
  {
    quote:
      "Their support replied within minutes when I needed to change my shipping address. That kind of service is rare these days.",
    name: "James K.",
    detail: "Verified Buyer · Kitchen",
    rating: 5,
  },
  {
    quote:
      "Smooth checkout, great packaging, and the 30-day returns gave me the confidence to try something new. Spotket is now my go-to.",
    name: "Amina R.",
    detail: "Verified Buyer · Beauty",
    rating: 4,
  },
  {
    quote:
      "I price-checked everywhere before buying — Spotket matched the lowest price I found without any hassle. Impressive.",
    name: "Daniel O.",
    detail: "Verified Buyer · Sports",
    rating: 5,
  },
  {
    quote:
      "The product looked exactly like the photos, which sadly isn't a given online anymore. Everything felt genuinely premium.",
    name: "Lena T.",
    detail: "Verified Buyer · Home & Garden",
    rating: 5,
  },
  {
    quote:
      "Returned an item that wasn't quite right for me — refund landed in three days. Zero friction, zero interrogation.",
    name: "Marcus W.",
    detail: "Verified Buyer · Outdoor",
    rating: 4,
  },
];

export default function TestimonialsCarousel() {
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const pages = Math.ceil(testimonials.length / 3);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setPage((current) => (current + 1) % pages), 6000);
    return () => clearInterval(id);
  }, [paused, pages]);

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Testimonials
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Loved by smart shoppers
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((page - 1 + pages) % pages)}
            aria-label="Previous testimonials"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-600 text-slate-300 transition-all hover:border-brand hover:text-brand"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setPage((page + 1) % pages)}
            aria-label="Next testimonials"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-600 text-slate-300 transition-all hover:border-brand hover:text-brand"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-8 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {Array.from({ length: pages }, (_, pageIndex) => (
            <div
              key={pageIndex}
              className="grid w-full shrink-0 gap-6 md:grid-cols-3"
              aria-hidden={pageIndex !== page}
            >
              {testimonials
                .slice(pageIndex * 3, pageIndex * 3 + 3)
                .map((testimonial) => (
                  <figure
                    key={testimonial.name}
                    className="rounded-2xl border border-navy-700/60 bg-navy-800/60 p-6"
                  >
                    <Stars rating={testimonial.rating} />
                    <blockquote className="mt-4 text-sm leading-relaxed text-slate-300">
                      “{testimonial.quote}”
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-sm font-bold text-brand">
                        {testimonial.name[0]}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                        <p className="text-sm text-slate-400 sm:text-xs">{testimonial.detail}</p>
                      </div>
                    </figcaption>
                  </figure>
                ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: pages }, (_, dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            onClick={() => setPage(dotIndex)}
            aria-label={`Go to testimonials page ${dotIndex + 1}`}
            aria-current={dotIndex === page}
            className="flex h-11 items-center px-1"
          >
            <span
              className={`h-2 rounded-full transition-all ${
                dotIndex === page ? "w-6 bg-brand" : "w-2 bg-slate-500 hover:bg-slate-300"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
