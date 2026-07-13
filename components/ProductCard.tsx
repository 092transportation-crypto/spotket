"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProductImage from "@/components/ProductImage";
import Stars from "@/components/Stars";
import { useCart } from "@/context/CartContext";
import { flyToCart } from "@/lib/flyToCart";
import { formatPrice, type Product } from "@/lib/products";

export default function ProductCard({
  product,
  badge,
  delay = 0,
}: {
  product: Product;
  badge?: React.ReactNode;
  /** Stagger offset (ms) for the viewport entrance. */
  delay?: number;
}) {
  const { addItem } = useCart();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const onSale =
    product.compareAtPrice !== undefined && product.compareAtPrice > product.price;

  // Slide-up reveal as the card enters the viewport.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    addItem(product, 1, product.variants?.[0]);
    flyToCart(event.currentTarget);
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? "0ms" : `${delay}ms` }}
      className={`group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm shadow-neutral-200/80 ring-1 ring-neutral-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-300/60 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square overflow-hidden bg-navy-800"
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {badge && <span className="absolute left-3 top-3 z-10">{badge}</span>}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {product.brand && (
          <p className="text-sm font-medium text-neutral-500">{product.brand}</p>
        )}
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-2 text-sm font-semibold text-neutral-900 transition-colors hover:text-brand"
        >
          {product.name}
        </Link>
        {product.reviewCount > 0 && (
          <div className="hidden items-center gap-1.5 sm:flex">
            <Stars rating={product.rating} />
            <span className="text-sm text-neutral-500">
              {product.rating.toFixed(1)} ({product.reviewCount.toLocaleString()})
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <p className="text-lg font-bold text-neutral-900">
            {formatPrice(product.price)}
            {onSale && (
              <span className="ml-2 text-sm font-normal text-neutral-400 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          className="btn-shimmer mt-auto min-h-12 w-full rounded-xl px-3 py-2 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-brand/40 active:scale-95 disabled:cursor-not-allowed disabled:bg-navy-600 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100"
        >
          {product.inStock ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}
