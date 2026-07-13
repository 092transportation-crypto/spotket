import type { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getCatalog } from "@/lib/catalog";
import { getNewArrivals } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Arrivals",
  description:
    "The newest additions to Spotket's curated collection. Fresh premium products added every week — free shipping over $35 and 30-day returns.",
};

export default async function NewArrivalsPage() {
  const catalog = await getCatalog();
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">
        Just Landed
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
        New Arrivals
      </h1>
      <p className="mt-2 max-w-xl text-sm text-slate-400">
        The latest additions to the collection — tested, quality-checked, and
        ready to ship.
      </p>

      <div className="mt-10">
        <CollectionGrid
          products={getNewArrivals(catalog)}
          emptyTitle="First arrivals landing soon"
          emptyNote="Our first collection is on its way. Join the list and be the first to shop it — with 10% off."
        />
      </div>
    </div>
  );
}
