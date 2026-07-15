import type { Metadata } from "next";
import { Flame } from "lucide-react";
import AsSeenOn from "@/components/AsSeenOn";
import CustomerPhotos from "@/components/CustomerPhotos";
import FeaturedCategories from "@/components/FeaturedCategories";
import FeaturedCollection from "@/components/FeaturedCollection";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import GoldDivider from "@/components/GoldDivider";
import Marquee from "@/components/Marquee";
import StaffPicks from "@/components/StaffPicks";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import ProductCard from "@/components/ProductCard";
import ProductRow from "@/components/ProductRow";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import Reveal from "@/components/Reveal";
import SocialProof from "@/components/SocialProof";
import TrustBar from "@/components/TrustBar";
import WhySpotket from "@/components/WhySpotket";
import { getCatalog } from "@/lib/catalog";
import { promotedRank } from "@/lib/products";
import { getFeaturedReviews } from "@/lib/reviews";

// Revalidate once a minute: catalog changes appear quickly while the page
// itself serves statically from the edge (TTFB fix).
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Spotket | Shop Smarter — Free Shipping Over $35",
  description:
    "Shop smarter with Spotket. Premium products with free shipping over $35, 30-day returns, and secure checkout.",
};

/**
 * Hand-picked Staff Picks, one per major category, matched by name because
 * catalog ids are per-database uuids. Falls back to top-rated products if a
 * pick ever leaves the catalog.
 */
const STAFF_PICK_NAMES = [
  "eye massager",
  "moon lamp",
  "gaming mouse pad",
  "cat paw mochi",
];

/** The three products floating beside the hero headline. */
const SHOWCASE_NAMES = ["eye massager", "moon lamp", "squishy"];

export default async function HomePage() {
  const [catalog, featuredReviews] = await Promise.all([getCatalog(), getFeaturedReviews(8)]);

  // Real store stats for the hero — no invented numbers.
  const reviewTotal = catalog.reduce((sum, product) => sum + product.reviewCount, 0);
  const rated = catalog.filter((product) => product.reviewCount > 0);
  const avgRating =
    rated.reduce((sum, product) => sum + product.rating * product.reviewCount, 0) /
    Math.max(1, reviewTotal);

  const trending = [...catalog]
    .sort((a, b) => promotedRank(a) - promotedRank(b) || b.reviewCount - a.reviewCount)
    .slice(0, 8);
  const picked = STAFF_PICK_NAMES.map((needle) =>
    catalog.find((product) => product.name.toLowerCase().includes(needle)),
  ).filter((product): product is NonNullable<typeof product> => product !== undefined);
  const fallback = [...catalog]
    .filter(
      (product) =>
        product.reviewCount >= 10 && !picked.some((pick) => pick.id === product.id),
    )
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  const staffPicks = [...picked, ...fallback].slice(0, 4);
  // Proven favorites: most-reviewed products, best-rated first among ties.
  const bestSellers = [...catalog]
    .filter((product) => product.reviewCount > 0)
    .sort((a, b) => b.reviewCount - a.reviewCount || b.rating - a.rating)
    .slice(0, 8);
  // Latest additions — catalog arrives ordered by created_at ascending.
  const recentlyAdded = [...catalog].reverse().slice(0, 10);
  const nightGlow = ["moon lamp", "crystal ball"]
    .map((needle) =>
      catalog.find((product) => product.name.toLowerCase().includes(needle)),
    )
    .filter((product): product is NonNullable<typeof product> => product !== undefined);
  const heroPicks = SHOWCASE_NAMES.map((needle) =>
    catalog.find(
      (product) => product.image && product.name.toLowerCase().includes(needle),
    ),
  ).filter((product): product is NonNullable<typeof product> => product !== undefined);
  const showcase = [
    ...heroPicks,
    ...trending.filter(
      (product) => product.image && !heroPicks.some((pick) => pick.id === product.id),
    ),
  ]
    .slice(0, 3)
    .map(({ id, name, price, image }) => ({ id, name, price, image }));

  return (
    <>
      <Hero
        products={showcase}
        stats={{ products: catalog.length, reviews: reviewTotal, rating: avgRating }}
      />
      <FlashSaleBanner />
      <Marquee />

      {/* Trending Now */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-9" aria-labelledby="trending-heading">
        <Reveal>
          <h2 id="trending-heading" className="flex items-center gap-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            <Flame className="h-7 w-7 text-gold" aria-hidden="true" />
            Trending Now
          </h2>
        </Reveal>
        <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3">
          {trending.map((product, index) => (
            <div key={product.id} className="w-64 shrink-0 snap-start sm:w-72">
              <ProductCard
                product={product}
                delay={index * 80}
                tall
                urgency
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

      <GoldDivider />

      <FeaturedCategories />

      <GoldDivider />

      <ProductRow
        title="Best Sellers"
        subtitle="The most-loved products in the store, ranked by real reviews."
        href="/best-sellers"
        products={bestSellers}
        limit={8}
      />

      <FeaturedCollection products={nightGlow} category="Home & Garden" />

      <StaffPicks products={staffPicks} />

      <GoldDivider />

      <ProductRow
        title="Recently Added"
        subtitle="Fresh finds, straight from this week's drops."
        href="/new-arrivals"
        products={recentlyAdded}
        scroll
      />

      <SocialProof reviews={featuredReviews} shopperCount={reviewTotal} />

      <CustomerPhotos />

      <ReviewsCarousel reviews={featuredReviews.slice(0, 5)} />

      <WhySpotket />

      <AsSeenOn />

      <Newsletter />
      <TrustBar />
    </>
  );
}
