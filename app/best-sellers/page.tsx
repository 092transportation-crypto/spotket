import type { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getCatalog } from "@/lib/catalog";
import { getBestSellers } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Best Sellers",
  description:
    "Spotket's most-loved products, ranked by real customer orders and reviews. Shop the favorites with free shipping over $35.",
};

export default async function BestSellersPage() {
  const catalog = await getCatalog();
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">
        Customer Favorites
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
        Best Sellers
      </h1>
      <p className="mt-2 max-w-xl text-sm text-slate-400">
        The products smart shoppers keep coming back for — ranked by orders and
        verified reviews.
      </p>

      <div className="mt-10">
        <CollectionGrid
          products={getBestSellers(catalog)}
          emptyTitle="Best sellers coming soon"
          emptyNote="Once our first products launch, the most-ordered items will earn their spot here."
        />
      </div>
    </div>
  );
}
