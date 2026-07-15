import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/products";

type ProductRowProps = {
  title: string;
  subtitle?: string;
  href?: string;
  products: Product[];
  /** Shown instead of the grid when there are no products; omit to hide the section entirely. */
  emptyNote?: string;
  /** Horizontal snap-scroll strip instead of a grid (shows every product). */
  scroll?: boolean;
  /** Products shown in grid mode (grid stays 4 columns wide). */
  limit?: number;
};

export default function ProductRow({
  title,
  subtitle,
  href,
  products,
  emptyNote,
  scroll = false,
  limit = 4,
}: ProductRowProps) {
  if (products.length === 0 && !emptyNote) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h2>
          {subtitle && (
            <p className="mt-1 hidden text-sm text-slate-400 sm:block">{subtitle}</p>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="shrink-0 text-sm font-semibold text-brand transition-colors hover:text-white"
          >
            View all →
          </Link>
        )}
      </div>

      {products.length > 0 ? (
        scroll ? (
          <div className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3">
            {products.map((product) => (
              <div key={product.id} className="w-60 shrink-0 snap-start sm:w-68">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {products.slice(0, limit).map((product, index) => (
              <ProductCard key={product.id} product={product} delay={index * 90} />
            ))}
          </div>
        )
      ) : (
        <p className="mt-6 rounded-2xl border border-dashed border-navy-600 bg-navy-900/40 p-6 text-center text-sm text-slate-400">
          {emptyNote}
        </p>
      )}
    </section>
  );
}
