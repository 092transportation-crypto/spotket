"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Slide {
  name: string;
  description: string;
  image: { src: string; alt: string };
}

export function ServicesSlider({ slides }: { slides: readonly Slide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function onScroll() {
      if (!track) return;
      const slideWidth = track.scrollWidth / slides.length;
      const index = Math.round(track.scrollLeft / slideWidth);
      setActive(Math.min(Math.max(index, 0), slides.length - 1));
    }

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [slides.length]);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.min(Math.max(index, 0), slides.length - 1);
    const slideWidth = track.scrollWidth / slides.length;
    track.scrollTo({ left: slideWidth * clamped, behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
      >
        {slides.map((slide) => (
          <div
            key={slide.name}
            className="w-[82%] shrink-0 snap-center sm:w-[48%] lg:w-[31%]"
          >
            <div className="card-glow group h-full overflow-hidden rounded-2xl border border-white/10 bg-navy-900/60">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={slide.image.src}
                  alt={slide.image.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 82vw, (max-width: 1024px) 48vw, 360px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/10 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-base font-semibold text-white">
                  {slide.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/5 disabled:opacity-30"
        >
          &larr;
        </button>

        <div className="flex gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.name}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === active ? "bg-brand-light" : "bg-white/15"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next slide"
          onClick={() => goTo(active + 1)}
          disabled={active === slides.length - 1}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/5 disabled:opacity-30"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}
