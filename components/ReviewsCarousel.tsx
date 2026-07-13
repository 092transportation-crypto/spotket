"use client";

import { useEffect, useState } from "react";
import Stars from "@/components/Stars";

export type FeaturedReview = {
  author: string;
  rating: number;
  text: string;
  productName: string;
};

/** Auto-advancing carousel of real customer/buyer reviews. */
export default function ReviewsCarousel({ reviews }: { reviews: FeaturedReview[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reviews.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 5000);
    return () => clearInterval(id);
  }, [reviews.length]);

  if (reviews.length === 0) return null;
  const review = reviews[index];

  return (
    <section
      className="border-y border-navy-800 bg-navy-900/50 px-4 py-20 text-center sm:px-6"
      aria-labelledby="reviews-heading"
      style={{
        backgroundImage: "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(99,102,241,0.10), transparent 65%)",
      }}
    >
      <h2 id="reviews-heading" className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        What Buyers Say
      </h2>
      <div key={index} className="mt-8 animate-fade-in">
        <div className="flex justify-center">
          <Stars rating={review.rating} />
        </div>
        <blockquote
          className="mx-auto mt-6 max-w-3xl leading-snug text-slate-200"
          style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(1.4rem, 3vw, 2.1rem)" }}
        >
          “{review.text}”
        </blockquote>
        <span className="mx-auto mt-7 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-navy-800 text-lg font-bold text-gold">
          {review.author[0]}
        </span>
        <p className="mt-3 text-sm font-semibold text-white">{review.author}</p>
        <p className="mt-0.5 text-xs text-slate-500">
          Verified buyer · {review.productName}
        </p>
      </div>
      {reviews.length > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {reviews.map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              onClick={() => setIndex(dotIndex)}
              aria-label={`Review ${dotIndex + 1}`}
              aria-current={dotIndex === index}
              className={`h-2 rounded-full transition-all ${
                dotIndex === index ? "w-6 bg-gold" : "w-2 bg-navy-600 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
