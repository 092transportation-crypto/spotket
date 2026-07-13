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
};

export default function ProductRow({
  title,
  subtitle,
  href,
  products,
  emptyNote,
  scroll = false,
}: ProductRowProps) {
  if (products.length === 0 && !emptyNote) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-12">
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
          <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
            {products.map((product) => (
              <div key={product.id} className="w-56 shrink-0 snap-start sm:w-64">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {products.slice(0, 4).map((product, index) => (
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
