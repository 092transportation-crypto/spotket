import { MoonStar } from "lucide-react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import Reveal from "@/components/Reveal";
import { formatPrice, type Product } from "@/lib/products";

/**
 * Full-width collection spotlight — deep purple banner with two overlapping
 * product shots from the highlighted category.
 */
export default function FeaturedCollection({
  products,
  category,
}: {
  products: Product[];
  category: string;
}) {
  const shots = products.filter((product) => product.image).slice(0, 2);
  if (shots.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden border-y border-navy-800"
      aria-labelledby="collection-heading"
      style={{
        background:
          "linear-gradient(115deg, #0a0a0a 0%, #16102a 45%, #1e1038 70%, #0a0a0a 100%)",
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 45% 90% at 75% 50%, rgba(124,58,237,0.22), transparent 70%)",
        }}
      />
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-2">
        <Reveal>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            <MoonStar className="h-4 w-4" aria-hidden="true" />
            Featured Collection
          </p>
          <h2
            id="collection-heading"
            className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            The Night Glow Edit
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
            Moon lamps, crystal galaxies, and ambient light that turns any room
            into the coziest place on earth. Hand-picked from our{" "}
            {category} collection.
          </p>
          <Link
            href={`/products?category=${encodeURIComponent(category)}`}
            className="btn-shimmer mt-6 inline-flex min-h-12 items-center justify-center rounded-full px-8 text-sm font-semibold text-white transition-all duration-300 hover:shadow-xl hover:shadow-brand/40 active:scale-95"
          >
            Shop the Collection
          </Link>
        </Reveal>

        <Reveal delay={150} className="relative mx-auto h-64 w-full max-w-md sm:h-72">
          {shots.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group absolute block overflow-hidden rounded-2xl border border-navy-700/70 bg-navy-900 transition-all hover:z-20 hover:border-gold/50"
              style={{
                width: "58%",
                aspectRatio: "1",
                left: index === 0 ? 0 : "42%",
                top: index === 0 ? 0 : "14%",
                zIndex: index === 0 ? 10 : 5,
                transform: `rotate(${index === 0 ? -4 : 5}deg)`,
                boxShadow:
                  "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 35px rgba(124, 58, 237, 0.25)",
              }}
            >
              <ProductImage src={product.image} alt={product.name} sizes="280px" />
              <span className="absolute inset-x-0 bottom-0 bg-navy-950/85 px-3 py-2 backdrop-blur">
                <span className="line-clamp-1 block text-xs font-semibold text-white">
                  {product.name}
                </span>
                <span className="text-xs font-bold text-gold">
                  {formatPrice(product.price)}
                </span>
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
