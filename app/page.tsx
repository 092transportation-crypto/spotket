import type { Metadata } from "next";
import { Flame } from "lucide-react";
import FeaturedCategories from "@/components/FeaturedCategories";
import Marquee from "@/components/Marquee";
import StaffPicks from "@/components/StaffPicks";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import ProductCard from "@/components/ProductCard";
import ProductRow from "@/components/ProductRow";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import Reveal from "@/components/Reveal";
import TrustBar from "@/components/TrustBar";
import WhySpotket from "@/components/WhySpotket";
import { getCatalog } from "@/lib/catalog";
import { getNewArrivals } from "@/lib/products";
import { getFeaturedReviews } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Spotket — Shop Smarter | Premium Products, Free Shipping Over $35",
  description:
    "Shop smarter with Spotket. Premium electronics, home, beauty, and wellness products with free shipping over $35, 30-day returns, price match guarantee, and 24/7 support.",
};

export default async function HomePage() {
  const [catalog, featuredReviews] = await Promise.all([getCatalog(), getFeaturedReviews()]);

  // Real store stats for the hero — no invented numbers.
  const reviewTotal = catalog.reduce((sum, product) => sum + product.reviewCount, 0);
  const rated = catalog.filter((product) => product.reviewCount > 0);
  const avgRating =
    rated.reduce((sum, product) => sum + product.rating * product.reviewCount, 0) /
    Math.max(1, reviewTotal);

  const trending = [...catalog].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
  const staffPicks = [...catalog]
    .filter((product) => product.reviewCount >= 10)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 4);
  const newArrivals = getNewArrivals(catalog).slice(0, 8);
  const showcase = trending
    .filter((product) => product.image)
    .slice(0, 3)
    .map(({ id, name, price, image }) => ({ id, name, price, image }));

  return (
    <>
      <Hero
        products={showcase}
        stats={{ products: catalog.length, reviews: reviewTotal, rating: avgRating }}
      />
      <Marquee />

      {/* Trending Now */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" aria-labelledby="trending-heading">
        <Reveal>
          <h2 id="trending-heading" className="flex items-center gap-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            <Flame className="h-7 w-7 text-gold" aria-hidden="true" />
            Trending Now
          </h2>
        </Reveal>
        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
          {trending.map((product, index) => (
            <div key={product.id} className="w-56 shrink-0 snap-start sm:w-64">
              <ProductCard
                product={product}
                delay={index * 80}
                badge={
                  <span className="flex items-center gap-1 rounded-full bg-navy-950/85 px-2.5 py-1 text-xs font-bold text-gold backdrop-blur">
                    <Flame className="h-3 w-3" aria-hidden="true" />
                    Hot
                  </span>
                }
              />
            </div>
          ))}
        </div>
      </section>

      <FeaturedCategories />

      <StaffPicks products={staffPicks} />

      <WhySpotket />

      {newArrivals.length > 0 && (
        <ProductRow title="New Arrivals" href="/new-arrivals" products={newArrivals} />
      )}

      <ReviewsCarousel reviews={featuredReviews} />

      <Newsletter />
      <TrustBar />
    </>
  );
}
