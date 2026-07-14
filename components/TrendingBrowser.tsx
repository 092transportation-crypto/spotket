"use client";

import { Flame } from "lucide-react";
import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { promotedRank, type Product } from "@/lib/products";

const TABS = [
  { key: "all", label: "All" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/** Trending = ranked by real review volume; tabs filter by date added. */
export default function TrendingBrowser({ products }: { products: Product[] }) {
  const [tab, setTab] = useState<TabKey>("all");

  const visible = useMemo(() => {
    const now = Date.now();
    const days = (added?: string) =>
      added ? (now - new Date(added).getTime()) / 86400000 : Infinity;
    const filtered = products.filter((product) => {
      if (tab === "week") return days(product.dateAdded) <= 7;
      if (tab === "month") return days(product.dateAdded) <= 31;
      return true;
    });
    return [...filtered].sort(
      (a, b) =>
        promotedRank(a) - promotedRank(b) ||
        b.reviewCount - a.reviewCount ||
        b.rating - a.rating,
    );
  }, [products, tab]);

  return (
    <div>
      <div className="flex gap-2" role="tablist" aria-label="Trending period">
        {TABS.map((option) => (
          <button
            key={option.key}
            type="button"
            role="tab"
            aria-selected={tab === option.key}
            onClick={() => setTab(option.key)}
            className={`min-h-11 rounded-full px-6 text-sm font-semibold transition-colors ${
              tab === option.key
                ? "bg-brand text-white"
                : "border border-navy-600 text-slate-300 hover:border-gold hover:text-gold"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-navy-600 bg-navy-900/40 p-10 text-center text-sm text-slate-400">
          Nothing new in this period yet — check the All tab.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {visible.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              badge={
                <span className="flex items-center gap-1 rounded-full bg-navy-950/85 px-2.5 py-1 text-xs font-bold text-gold backdrop-blur">
                  <Flame className="h-3 w-3" aria-hidden="true" />
                  {index < 3 ? `#${index + 1} Trending` : "Trending"}
                </span>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
