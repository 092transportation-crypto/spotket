"use client";

import { PackageSearch } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Stars from "@/components/Stars";
import { categories, getBrands, type Product } from "@/lib/products";

const sortOptions = [
  { value: "best-sellers", label: "Best Sellers" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

const priceRanges = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 to $50", min: 25, max: 50 },
  { label: "$50 to $100", min: 50, max: 100 },
  { label: "$100 & up", min: 100, max: Infinity },
];

const checkboxClasses =
  "h-5 w-5 shrink-0 accent-[#0066ff]";

export default function ProductsBrowser({
  products,
  initialCategory,
  initialQuery,
}: {
  products: Product[];
  initialCategory?: string;
  initialQuery?: string;
}) {
  const brands = getBrands(products);
  const [category, setCategory] = useState<string>(
    initialCategory && (categories as readonly string[]).includes(initialCategory)
      ? initialCategory
      : "All",
  );
  const search = initialQuery ?? "";
  const [selectedRanges, setSelectedRanges] = useState<Set<string>>(new Set());
  const [minRating, setMinRating] = useState<number | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortValue>("best-sellers");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggle = (set: Set<string>, value: string) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  const visibleProducts = useMemo(() => {
    let result = products.filter((product) => {
      if (category !== "All" && product.category !== category) return false;
      if (
        search.trim() &&
        !`${product.name} ${product.brand ?? ""}`
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      )
        return false;
      if (selectedRanges.size > 0) {
        const inRange = priceRanges.some(
          (range) =>
            selectedRanges.has(range.label) &&
            product.price >= range.min &&
            product.price < range.max,
        );
        if (!inRange) return false;
      }
      if (minRating !== null && product.rating < minRating) return false;
      if (
        selectedBrands.size > 0 &&
        (product.brand === undefined || !selectedBrands.has(product.brand))
      )
        return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].sort(
          (a, b) =>
            new Date(b.dateAdded ?? 0).getTime() - new Date(a.dateAdded ?? 0).getTime(),
        );
        break;
      case "best-sellers":
        result = [...result].sort(
          (a, b) =>
            Number(b.bestSeller ?? false) - Number(a.bestSeller ?? false) ||
            b.reviewCount - a.reviewCount,
        );
        break;
    }
    return result;
  }, [products, category, search, selectedRanges, minRating, selectedBrands, sort]);

  const filterPanel = (
    <div className="space-y-7">
      {/* Category */}
      <fieldset>
        <legend className="text-sm font-bold text-white">Category</legend>
        <div className="mt-3 space-y-2">
          {["All", ...categories].map((option) => (
            <label key={option} className="flex min-h-10 cursor-pointer items-center gap-2.5 py-0.5 text-sm text-slate-300 hover:text-white">
              <input
                type="radio"
                name="category"
                checked={category === option}
                onChange={() => setCategory(option)}
                className={checkboxClasses}
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Price */}
      <fieldset>
        <legend className="text-sm font-bold text-white">Price</legend>
        <div className="mt-3 space-y-2">
          {priceRanges.map((range) => (
            <label key={range.label} className="flex min-h-10 cursor-pointer items-center gap-2.5 py-0.5 text-sm text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={selectedRanges.has(range.label)}
                onChange={() => setSelectedRanges(toggle(selectedRanges, range.label))}
                className={checkboxClasses}
              />
              {range.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Rating */}
      <fieldset>
        <legend className="text-sm font-bold text-white">Customer Rating</legend>
        <div className="mt-3 space-y-2">
          {[4, 3, 2].map((stars) => (
            <label key={stars} className="flex min-h-10 cursor-pointer items-center gap-2.5 py-0.5 text-sm text-slate-300 hover:text-white">
              <input
                type="radio"
                name="rating"
                checked={minRating === stars}
                onChange={() => setMinRating(stars)}
                className={checkboxClasses}
              />
              <Stars rating={stars} />
              <span>&amp; up</span>
            </label>
          ))}
          {minRating !== null && (
            <button
              type="button"
              onClick={() => setMinRating(null)}
              className="inline-block py-1.5 text-sm text-brand hover:underline"
            >
              Clear rating filter
            </button>
          )}
        </div>
      </fieldset>

      {/* Brand */}
      <fieldset>
        <legend className="text-sm font-bold text-white">Brand</legend>
        <div className="mt-3 space-y-2">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <label key={brand} className="flex min-h-10 cursor-pointer items-center gap-2.5 py-0.5 text-sm text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={selectedBrands.has(brand)}
                  onChange={() => setSelectedBrands(toggle(selectedBrands, brand))}
                  className={checkboxClasses}
                />
                {brand}
              </label>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              Brands will appear here once products are added.
            </p>
          )}
        </div>
      </fieldset>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-20">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-700/60 pb-4">
        <p className="text-sm text-slate-400">
          <span className="font-semibold text-white">{visibleProducts.length}</span>{" "}
          result{visibleProducts.length === 1 ? "" : "s"}
          {search.trim() && (
            <>
              {" "}
              for <span className="font-semibold text-brand">“{search.trim()}”</span>
            </>
          )}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className="min-h-11 rounded-xl border border-navy-600 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-brand hover:text-brand lg:hidden"
            aria-expanded={filtersOpen}
          >
            Filters {filtersOpen ? "−" : "+"}
          </button>
          <label htmlFor="product-sort" className="hidden text-sm text-slate-400 sm:block">
            Sort by
          </label>
          <select
            id="product-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortValue)}
            className="min-h-11 rounded-xl border border-navy-600 bg-navy-900/70 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-[230px_1fr] lg:gap-10">
        {/* Sidebar */}
        <aside
          className={`${filtersOpen ? "block" : "hidden"} mb-8 rounded-2xl border border-navy-700/60 bg-navy-900/40 p-5 lg:mb-0 lg:block lg:h-fit lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0`}
          aria-label="Product filters"
        >
          {filterPanel}
        </aside>

        {/* Grid / empty state */}
        <div>
          {visibleProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-navy-600 bg-navy-900/40 px-6 py-20 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
                <PackageSearch className="h-8 w-8" aria-hidden="true" />
              </span>
              <h2 className="mt-6 text-xl font-bold text-white">
                {products.length === 0
                  ? "New products dropping soon"
                  : "No products match your filters"}
              </h2>
              <p className="mt-2 max-w-sm text-sm text-slate-400">
                {products.length === 0
                  ? "We're hand-picking our first collection of premium products. Join the newsletter for 10% off when we launch."
                  : "Try adjusting your filters or search term."}
              </p>
              {products.length === 0 && (
                <Link
                  href="/#newsletter"
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/30 active:scale-95"
                >
                  Get 10% Off at Launch
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
