import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/products";

export default function CollectionGrid({
  products,
  emptyTitle,
  emptyNote,
}: {
  products: Product[];
  emptyTitle: string;
  emptyNote: string;
}) {
  if (products.length > 0) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-navy-600 bg-navy-900/40 px-4 py-12 text-center">
      <h2 className="text-lg font-bold text-white">{emptyTitle}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-400">{emptyNote}</p>
      <Link
        href="/#newsletter"
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/30 active:scale-95 sm:w-auto"
      >
        Get Notified — 10% Off at Launch
      </Link>
    </div>
  );
}
