"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProductImage from "@/components/ProductImage";
import Stars from "@/components/Stars";
import { useCart } from "@/context/CartContext";
import { flyToCart } from "@/lib/flyToCart";
import { formatPrice, type Product } from "@/lib/products";

const WISHLIST_KEY = "spotket-wishlist";

function readWishlist(): string[] {
  try {
    return JSON.parse(window.localStorage.getItem(WISHLIST_KEY) ?? "[]");
  } catch {
    return [];
  }
}

/** Small stable hash so per-product numbers don't change between renders. */
function productSeed(id: string): number {
  let seed = 0;
  for (let i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) >>> 0;
  return seed;
}

export default function ProductCard({
  product,
  badge,
  delay = 0,
  tall = false,
  urgency = false,
}: {
  product: Product;
  badge?: React.ReactNode;
  /** Stagger offset (ms) for the viewport entrance. */
  delay?: number;
  /** Taller 4:5 image for showcase rows (e.g. Trending). */
  tall?: boolean;
  /** Live-viewer count and, on some products, a low-stock note. */
  urgency?: boolean;
}) {
  const { addItem } = useCart();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [wished, setWished] = useState(false);
  const onSale =
    product.compareAtPrice !== undefined && product.compareAtPrice > product.price;

  const seed = productSeed(product.id);
  const viewers = 3 + (seed % 10); // 3-12
  const lowStock = seed % 3 === 0 ? 3 + ((seed >> 4) % 6) : null; // 3-8, ~1 in 3 products

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

  // Wishlist state lives in localStorage — read after mount (client-only).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWished(readWishlist().includes(product.id));
  }, [product.id]);

  const toggleWishlist = () => {
    const current = readWishlist();
    const next = current.includes(product.id)
      ? current.filter((id) => id !== product.id)
      : [...current, product.id];
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable — the heart still toggles for this visit.
    }
    setWished(next.includes(product.id));
  };

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    addItem(product, 1, product.variants?.[0]);
    flyToCart(event.currentTarget);
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? "0ms" : `${delay}ms` }}
      className={`card-glow group flex flex-col overflow-hidden rounded-2xl bg-navy-900 ring-1 ring-navy-700/60 transition-all duration-500 hover:-translate-y-1 hover:ring-brand/50 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <Link
        href={`/products/${product.id}`}
        className={`img-shimmer relative overflow-hidden ${tall ? "aspect-[4/5]" : "aspect-square"}`}
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {badge && <span className="absolute left-3 top-3 z-10">{badge}</span>}
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            toggleWishlist();
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-navy-950/70 backdrop-blur transition-all hover:scale-110 active:scale-95"
        >
          <Heart
            className={`h-4.5 w-4.5 transition-colors ${
              wished ? "fill-red-500 text-red-500" : "text-white"
            }`}
            aria-hidden="true"
          />
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
        {urgency && (
          <p className="text-xs font-semibold text-brand-light">
            🔥 {viewers} people viewing this now
          </p>
        )}
        {product.brand && (
          <p className="text-sm font-medium text-slate-500">{product.brand}</p>
        )}
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-2 text-[15px] font-bold leading-snug text-white transition-colors hover:text-brand-light"
        >
          {product.name}
        </Link>
        {product.reviewCount > 0 && (
          <div className="hidden items-center gap-1.5 sm:flex">
            <Stars rating={product.rating} />
            <span className="text-sm text-slate-400">
              {product.rating.toFixed(1)} ({product.reviewCount.toLocaleString()})
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xl font-extrabold text-gold">
            {formatPrice(product.price)}
            {onSale && (
              <span className="ml-2 text-sm font-normal text-slate-500 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </p>
        </div>
        {urgency && lowStock !== null && product.inStock && (
          <p className="text-xs font-semibold text-amber-400">
            Only {lowStock} left in stock
          </p>
        )}

        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          className="btn-shimmer mt-auto min-h-12 w-full rounded-xl px-3 py-2 text-sm font-semibold text-white transition-all duration-500 ease-out hover:shadow-lg hover:shadow-brand/40 active:scale-95 disabled:cursor-not-allowed disabled:bg-navy-600 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100"
        >
          {product.inStock ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}
