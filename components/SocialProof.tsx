import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import Reveal from "@/components/Reveal";
import Stars from "@/components/Stars";
import type { FeaturedReview } from "@/lib/reviews";

/**
 * Three large review cards under a "Join N+ Happy Shoppers" headline —
 * real reviews with the product they're about. N comes from actual review
 * volume, rounded down to the nearest hundred.
 */
export default function SocialProof({
  reviews,
  shopperCount,
}: {
  reviews: FeaturedReview[];
  shopperCount: number;
}) {
  const cards = reviews.filter((review) => review.productImage).slice(0, 3);
  if (cards.length < 3) return null;
  const rounded = Math.max(100, Math.floor(shopperCount / 100) * 100);

  return (
    <section
      className="border-y border-navy-800 bg-navy-900/40 px-4 py-16 sm:px-6"
      aria-labelledby="social-proof-heading"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 55% 70% at 50% 100%, rgba(124,58,237,0.08), transparent 65%)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2
            id="social-proof-heading"
            className="text-center text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Join {rounded.toLocaleString()}+ Happy Shoppers
          </h2>
          <p className="mt-3 text-center text-sm text-slate-400">
            Real reviews from real orders — here&apos;s what they&apos;re loving.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {cards.map((review, index) => (
            <Reveal key={`${review.productId}-${review.author}`} delay={index * 120}>
              <article className="flex h-full flex-col rounded-3xl border border-navy-700/60 bg-navy-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40">
                <Stars rating={review.rating} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">
                  “{review.text}”
                </blockquote>
                <footer className="mt-6 flex items-center gap-3 border-t border-navy-700/60 pt-5">
                  <Link
                    href={`/products/${review.productId}`}
                    className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-navy-800"
                  >
                    <ProductImage
                      src={review.productImage}
                      alt={review.productName}
                      sizes="56px"
                    />
                  </Link>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{review.author}</p>
                    <Link
                      href={`/products/${review.productId}`}
                      className="line-clamp-1 text-xs text-slate-500 transition-colors hover:text-brand-light"
                    >
                      Bought: {review.productName}
                    </Link>
                  </div>
                </footer>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
