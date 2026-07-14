"use client";

import { ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/site";

/** Premium mini-cart: dark drawer sliding in from the right on every add. */
export default function CartDrawer() {
  const { items, subtotal, count, updateQuantity, removeItem } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("spotket:cart-added", onOpen);
    return () => window.removeEventListener("spotket:cart-added", onOpen);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed inset-y-0 right-0 z-[80] flex w-full flex-col bg-navy-900 shadow-2xl shadow-black/70 transition-transform duration-300 ease-out sm:max-w-md sm:border-l sm:border-navy-700/60 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-navy-700/60 px-5">
          <p className="flex items-center gap-2.5 text-base font-semibold text-white">
            <ShoppingBag className="h-5 w-5 text-gold" aria-hidden="true" />
            Your Cart ({count} {count === 1 ? "item" : "items"})
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="flex h-11 w-11 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-navy-800 hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
              <ShoppingBag className="h-7 w-7 text-brand" aria-hidden="true" />
            </span>
            <p className="text-lg font-semibold text-white">Your cart is empty</p>
            <p className="text-sm text-slate-400">
              Find something you&apos;ll love — free shipping over ${FREE_SHIPPING_THRESHOLD}.
            </p>
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="btn-shimmer mt-2 inline-flex min-h-12 items-center justify-center rounded-full px-10 text-sm font-semibold text-white"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="shrink-0 border-b border-navy-700/60 px-5 py-3.5">
              {remaining > 0 ? (
                <p className="text-xs text-slate-400">
                  Add <span className="font-bold text-gold">{formatPrice(remaining)}</span> more
                  for <span className="font-semibold text-white">free shipping</span>
                </p>
              ) : (
                <p className="text-xs font-semibold text-gold">Your order ships free 🎉</p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-950">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand to-gold transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5">
              <ul className="divide-y divide-navy-700/60">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3.5 py-4">
                    <Link
                      href={`/products/${item.productId}`}
                      onClick={() => setOpen(false)}
                      className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-xl bg-navy-800"
                    >
                      {item.image && (
                        <Image src={item.image} alt="" fill sizes="60px" className="object-cover" />
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.productId}`}
                          onClick={() => setOpen(false)}
                          className="line-clamp-2 text-sm font-medium text-white transition-colors hover:text-brand"
                        >
                          {item.name}
                        </Link>
                        <p className="shrink-0 text-sm font-bold text-gold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      {item.variant && (
                        <p className="mt-0.5 text-xs text-slate-500">Style: {item.variant}</p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-navy-600">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="flex h-9 w-9 items-center justify-center text-slate-400 transition-colors hover:text-white"
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-sm font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="flex h-9 w-9 items-center justify-center text-slate-400 transition-colors hover:text-white"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-slate-500 underline-offset-2 transition-colors hover:text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-navy-700/60 px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-slate-400">Subtotal</span>
                <span className="text-xl font-bold text-white">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                Shipping and taxes calculated at checkout
              </p>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="btn-shimmer mt-4 flex min-h-13 w-full items-center justify-center rounded-full text-base font-semibold text-white transition-shadow hover:shadow-lg hover:shadow-brand/30"
              >
                Checkout · {formatPrice(subtotal)}
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full border border-navy-600 text-sm font-semibold text-slate-200 transition-colors hover:border-gold hover:text-gold"
              >
                Continue Shopping
              </button>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="mt-3 block text-center text-xs text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
