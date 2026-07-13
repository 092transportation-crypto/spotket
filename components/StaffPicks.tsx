import { Award } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import type { Product } from "@/lib/products";

/** Four hand-picked products — highest-rated with real review volume. */
export default function StaffPicks({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" aria-labelledby="picks-heading">
      <Reveal>
        <h2 id="picks-heading" className="flex items-center gap-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          <Award className="h-7 w-7 text-gold" aria-hidden="true" />
          Staff Picks
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          The products our team keeps coming back to.
        </p>
      </Reveal>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.slice(0, 4).map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            delay={index * 90}
            badge={
              <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-navy-950">
                Editor&apos;s Choice
              </span>
            }
          />
        ))}
      </div>
    </section>
  );
}
