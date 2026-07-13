import type { Metadata } from "next";
import ProductsBrowser from "@/components/ProductsBrowser";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse Spotket's curated collection of premium products. Filter by category, price, rating, and brand — free shipping on orders over $35.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const catalog = await getCatalog();

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-6 sm:px-6 sm:pb-8 sm:pt-12">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          Shop All Products
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Every item is hand-picked, quality-checked, and backed by our price
          match guarantee.
        </p>
      </section>
      {/* Key remounts the browser when header search / category links change the URL. */}
      <ProductsBrowser
        key={`${category ?? ""}|${q ?? ""}`}
        products={catalog}
        initialCategory={category}
        initialQuery={q}
      />
    </>
  );
}
