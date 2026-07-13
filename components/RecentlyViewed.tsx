"use client";

import Link from "next/link";
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

export default function RecentlyViewed({ products }: { products: Product[] }) {
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
    setViewed(getProductsByIds(ids, products));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-12" aria-labelledby="recently-viewed-heading">
      <h2 id="recently-viewed-heading" className="text-2xl font-bold text-white sm:text-3xl">
        Recently viewed
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Pick up where you left off — the products you&apos;ve looked at recently
        live here, saved on this device.
      </p>

      {viewed && viewed.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {viewed.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed border-navy-600 bg-navy-900/40 px-6 py-8 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-slate-400">
            Nothing here yet. Start browsing and we&apos;ll keep your recently
            viewed products one click away.
          </p>
          <Link
            href="/products"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-white transition-all hover:bg-brand-dark active:scale-95"
          >
            Start Browsing
          </Link>
        </div>
      )}
    </section>
  );
}
