"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getProductsByIds, type Product } from "@/lib/products";

export const RECENTLY_VIEWED_KEY = "spotket-recently-viewed";
const MAX_TRACKED = 8;

/** Call from a product page to record the visit. */
export function trackProductView(id: string) {
  try {
    const stored: string[] = JSON.parse(
      window.localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]",
    );
    const next = [id, ...stored.filter((entry) => entry !== id)].slice(0, MAX_TRACKED);
    window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable — recently viewed simply won't populate.
  }
}

export default function RecentlyViewed({
  products,
  excludeId,
}: {
  products: Product[];
  /** Product to leave out — e.g. the one whose page the section sits on. */
  excludeId?: string;
}) {
  const [viewed, setViewed] = useState<Product[] | null>(null);

  // Read after mount — localStorage is client-only.
  useEffect(() => {
    let ids: string[] = [];
    try {
      ids = JSON.parse(window.localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]");
    } catch {
      // Corrupt storage — treat as no history.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViewed(
      getProductsByIds(ids, products).filter((product) => product.id !== excludeId),
    );
  }, [products, excludeId]);

  // Nothing viewed yet (or still reading storage) — render nothing rather
  // than an empty shell.
  if (!viewed || viewed.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-12" aria-labelledby="recently-viewed-heading">
      <h2 id="recently-viewed-heading" className="text-2xl font-bold text-white sm:text-3xl">
        Recently viewed
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Pick up where you left off — the products you&apos;ve looked at recently
        live here, saved on this device.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {viewed.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
