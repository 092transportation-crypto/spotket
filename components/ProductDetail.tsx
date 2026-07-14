"use client";

import { Check, Lock, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductImage from "@/components/ProductImage";
import ReviewForm from "@/components/ReviewForm";
import { trackProductView } from "@/components/RecentlyViewed";
import Stars from "@/components/Stars";
import { useCart } from "@/context/CartContext";
import { flyToCart } from "@/lib/flyToCart";
import { formatDeliveryWindow } from "@/lib/delivery";
import { formatPrice, type Product } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/site";

/**
 * Star breakdown computed from real reviews when present; otherwise
 * approximated from the average rating.
 */
function ratingBreakdown(product: Product): { stars: number; percent: number }[] {
  const reviews = product.reviews;
  if (reviews && reviews.length > 0) {
    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      percent: Math.round(
        (reviews.filter((review) => Math.round(review.rating) === stars).length /
          reviews.length) *
          100,
      ),
    }));
  }
  const weights = [5, 4, 3, 2, 1].map((stars) =>
    Math.max(0.02, 1 - Math.abs(product.rating - stars) / 2.2),
  );
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return weights.map((weight, index) => ({
    stars: 5 - index,
    percent: Math.round((weight / total) * 100),
  }));
}

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const selectedVariant = product.variants?.[variantIndex];
  const hasWrittenReviews = (product.reviews?.length ?? 0) > 0;

  useEffect(() => {
    trackProductView(product.id);
  }, [product.id]);

  const gallery = [
    ...(product.image ? [product.image] : []),
    ...(product.images ?? []),
  ];
  const onSale =
    product.compareAtPrice !== undefined && product.compareAtPrice > product.price;

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    addItem(product, quantity, selectedVariant);
    flyToCart(event.currentTarget);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedVariant);
    router.push("/cart");
  };

  const selectVariant = (index: number) => {
    setVariantIndex(index);
    const variantImage = product.variants?.[index]?.image;
    const galleryIndex = variantImage ? gallery.indexOf(variantImage) : -1;
    if (galleryIndex >= 0) setSelectedImage(galleryIndex);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-14">
      <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/products" className="transition-colors hover:text-brand">
          Products
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/products?category=${encodeURIComponent(product.category)}`}
          className="transition-colors hover:text-brand"
        >
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {/* Gallery — min-w-0 lets the thumbnail strip scroll instead of
            forcing the grid column (and the whole page) wider than the
            viewport; grid items otherwise refuse to shrink below their
            content's min size. */}
        <div className="min-w-0">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-navy-700/60 bg-navy-900">
            <div key={selectedImage} className="absolute inset-0 animate-fade-in">
              <ProductImage
                src={gallery[selectedImage]}
                alt={`${product.name} — image ${selectedImage + 1}`}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {gallery.map((image, imageIndex) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(imageIndex)}
                  aria-label={`View image ${imageIndex + 1}`}
                  aria-current={imageIndex === selectedImage}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                    imageIndex === selectedImage
                      ? "border-brand"
                      : "border-navy-700/60 hover:border-navy-600"
                  }`}
                >
                  <ProductImage src={image} alt="" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex flex-col">
          {product.brand && (
            <p className="text-sm font-semibold text-brand">{product.brand}</p>
          )}
          <h1 className="mt-1 break-words text-2xl font-extrabold text-white sm:text-4xl">
            {product.name}
          </h1>
          {product.reviewCount > 0 ? (
            <a href="#reviews" className="mt-3 flex items-center gap-2 text-sm text-slate-400 hover:text-brand">
              <Stars rating={product.rating} />
              {product.rating.toFixed(1)} · {product.reviewCount.toLocaleString()} reviews
              {product.soldCount !== undefined && product.soldCount > 0 && (
                <span>· {product.soldCount.toLocaleString()}+ sold</span>
              )}
            </a>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              No reviews yet
              {product.soldCount !== undefined && product.soldCount > 0 && (
                <span> · {product.soldCount.toLocaleString()}+ sold</span>
              )}
            </p>
          )}

          <div className="mt-5 border-t border-navy-700/60 pt-5">
            <p className="flex flex-wrap items-center gap-3 text-4xl font-extrabold text-white">
              {formatPrice(product.price)}
              {onSale && (
                <>
                  <span className="text-base font-normal text-slate-500 line-through">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-bold text-emerald-300">
                    Save {Math.round((1 - product.price / product.compareAtPrice!) * 100)}%
                  </span>
                </>
              )}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {product.shipping?.freeShipping
                ? "Free shipping on this item"
                : `Free shipping on orders over $${FREE_SHIPPING_THRESHOLD}`}
            </p>
          </div>

          {/* Shipping + stock */}
          <div className="mt-5 space-y-2 rounded-2xl border border-navy-700/60 bg-navy-800/60 p-4 text-sm">
            <p className="flex items-center gap-2 text-slate-300">
              <Truck className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
              <span className="font-semibold text-white">
                Delivery:{" "}
                <span suppressHydrationWarning>
                  {formatDeliveryWindow(
                    product.shipping?.minDays,
                    product.shipping?.maxDays,
                  )}
                </span>
              </span>
            </p>
            {product.inStock ? (
              <p className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <Check className="h-4 w-4" aria-hidden="true" />
                In Stock — ready to ship
              </p>
            ) : (
              <p className="font-semibold text-red-400">Currently out of stock</p>
            )}
            {product.shipping?.shipsFrom && (
              <p className="text-slate-400">
                Shipping: {product.shipping.minDays}–{product.shipping.maxDays} days
                from {product.shipping.shipsFrom}
              </p>
            )}
            {product.shipping?.onTimeNote && (
              <p className="text-slate-400">{product.shipping.onTimeNote}</p>
            )}
            {product.shipping?.lateDeliveryPerk && (
              <p className="text-slate-400">{product.shipping.lateDeliveryPerk}</p>
            )}
          </div>

          {/* Variant selector */}
          {product.variants && product.variants.length > 0 && (
            <fieldset className="mt-6">
              <legend className="text-sm font-medium text-slate-300">
                Style:{" "}
                <span className="font-semibold text-white">{selectedVariant?.name}</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.variants.map((variant, index) => (
                  <button
                    key={variant.name}
                    type="button"
                    onClick={() => selectVariant(index)}
                    aria-pressed={index === variantIndex}
                    className={`flex min-h-12 items-center gap-2.5 rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                      index === variantIndex
                        ? "border-brand bg-brand/10 text-white"
                        : "border-navy-600 text-slate-300 hover:border-navy-500 hover:text-white"
                    }`}
                  >
                    {variant.image && (
                      <span className="relative h-8 w-8 overflow-hidden rounded-lg">
                        <Image
                          src={variant.image}
                          alt=""
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </span>
                    )}
                    {variant.name}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {/* Quantity + CTAs */}
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-300">Quantity</span>
              <div className="flex items-center rounded-xl border border-navy-600">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex min-h-11 min-w-11 items-center justify-center px-4 text-slate-300 transition-colors hover:text-brand"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-semibold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex min-h-11 min-w-11 items-center justify-center px-4 text-slate-300 transition-colors hover:text-brand"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAdd}
                disabled={!product.inStock}
                className="min-h-13 flex-1 rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-brand active:scale-95 disabled:cursor-not-allowed disabled:bg-navy-600"
              >
                {added ? "Added to Cart" : "Add to Cart"}
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="min-h-13 flex-1 rounded-full border border-navy-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:border-brand active:scale-95 disabled:cursor-not-allowed disabled:text-slate-500"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 border-t border-navy-700/60 pt-6">
            <h2 className="text-lg font-bold text-white">About this item</h2>
            <p className="mt-3 break-words leading-relaxed text-slate-300">{product.description}</p>
            {product.features.length > 0 && (
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {product.features.map((feature, index) => (
                  <li
                    key={feature}
                    style={{ animationDelay: `${index * 90}ms` }}
                    className="flex animate-fade-up items-start gap-2.5"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/15">
                      <Check className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="mt-6 flex items-center gap-1.5 text-sm text-slate-500">
            <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Secure checkout · 30-day returns · Price match guarantee · Authentic products only
          </p>
        </div>
      </div>

      {/* Reviews — always visible; never gated behind scroll animations */}
      <section id="reviews" className="mt-16 border-t border-navy-700/60 pt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-white">Customer reviews</h2>
          {!reviewFormOpen && (
            <button
              type="button"
              onClick={() => setReviewFormOpen(true)}
              className="min-h-12 w-full rounded-xl border-2 border-brand px-6 text-sm font-semibold text-brand transition-colors hover:bg-brand/10 sm:w-auto"
            >
              Write a Review
            </button>
          )}
        </div>

        {reviewFormOpen && (
          <div className="mt-6">
            <ReviewForm productId={product.id} onDone={() => setReviewFormOpen(false)} />
          </div>
        )}

        {!hasWrittenReviews ? (
          <div className="mt-6 rounded-2xl border border-dashed border-navy-600 bg-navy-900/40 p-8 text-center">
            <p className="font-semibold text-white">No reviews yet.</p>
            <p className="mt-1 text-sm text-slate-400">
              Be the first to review this product.
            </p>
          </div>
        ) : (
        <div className="mt-6 grid gap-10 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <Stars rating={product.rating} />
              <span className="text-lg font-bold text-white">
                {product.rating.toFixed(1)} out of 5
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {product.reviewCount.toLocaleString()} global ratings
            </p>
            <div className="mt-5 space-y-2">
              {ratingBreakdown(product).map(({ stars, percent }) => (
                <div key={stars} className="flex items-center gap-3 text-sm">
                  <span className="w-12 shrink-0 text-slate-300">{stars} star</span>
                  <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-navy-800">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-slate-400">
                    {percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <ul className="space-y-6">
              {(product.reviews ?? []).map((review) => (
                <li
                  key={`${review.author}-${review.date}-${review.title}`}
                  className="rounded-2xl border border-navy-700/60 bg-navy-800/60 p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-sm font-bold text-brand">
                      {review.author[0]}
                    </span>
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-white">
                        {review.author}
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[11px] font-bold text-emerald-300">
                            <Check className="h-3 w-3" aria-hidden="true" />
                            Verified Purchase
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Stars rating={review.rating} />
                    <span className="text-sm font-semibold text-white">{review.title}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-slate-300">
                    {review.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        )}
      </section>
    </div>
  );
}
