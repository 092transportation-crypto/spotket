"use client";

import { CheckCircle2, Lock, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import {
  ESTIMATED_TAX_RATE,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
} from "@/lib/site";

export default function CartView() {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const tax = subtotal * ESTIMATED_TAX_RATE;
  const total = subtotal + shipping + tax;
  const remainingForFree = FREE_SHIPPING_THRESHOLD - subtotal;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-navy-600 bg-navy-900/40 px-6 py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
          <ShoppingCart className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-xl font-bold text-white">Your cart is empty</h2>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          Looks like you haven&apos;t added anything yet. Head to the shop and
          find something you&apos;ll love.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/30 active:scale-95"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Items */}
      <div className="space-y-4 lg:col-span-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-2xl border border-navy-700/60 bg-navy-800/60 p-4"
          >
            <Link
              href={`/products/${item.productId}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-navy-900"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-xl font-extrabold italic text-navy-600">
                  SK
                </span>
              )}
            </Link>

            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/products/${item.productId}`}
                  className="font-semibold text-white transition-colors hover:text-brand"
                >
                  {item.name}
                  {item.variant && (
                    <span className="mt-0.5 block text-sm font-normal text-slate-400">
                      Style: {item.variant}
                    </span>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:text-red-400"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M4 7h16m-10 4v6m4-6v6M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-sm text-slate-400">{formatPrice(item.price)}</p>

              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center rounded-lg border border-navy-600">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="flex min-h-11 min-w-11 items-center justify-center px-3 text-slate-300 transition-colors hover:text-brand"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="flex min-h-11 min-w-11 items-center justify-center px-3 text-slate-300 transition-colors hover:text-brand"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>
                <p className="font-semibold text-white">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={clearCart}
          className="inline-block py-2.5 text-sm text-slate-500 transition-colors hover:text-red-400"
        >
          Clear cart
        </button>
      </div>

      {/* Summary */}
      <aside className="h-fit rounded-2xl border border-navy-700/60 bg-navy-800/60 p-6">
        <h2 className="text-lg font-bold text-white">Order Summary</h2>

        {remainingForFree > 0 ? (
          <div className="mt-4">
            <p className="text-sm text-slate-300 sm:text-xs">
              Add <span className="font-bold text-brand">{formatPrice(remainingForFree)}</span>{" "}
              more for <span className="font-semibold">free shipping</span>
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-navy-950">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{
                  width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-brand/10 px-3 py-2 text-sm font-semibold text-brand sm:text-xs">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            Your order qualifies for free shipping
          </p>
        )}

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-400">
              Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} item
              {items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "" : "s"})
            </dt>
            <dd className="font-medium text-white">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Shipping</dt>
            <dd className={`font-medium ${shipping === 0 ? "text-brand" : "text-white"}`}>
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Estimated tax</dt>
            <dd className="font-medium text-white">{formatPrice(tax)}</dd>
          </div>
          <div className="flex justify-between border-t border-navy-700/60 pt-3 text-base">
            <dt className="font-semibold text-white">Total</dt>
            <dd className="font-bold text-white">{formatPrice(total)}</dd>
          </div>
        </dl>
        <Link
          href="/checkout"
          className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/30 active:scale-95"
        >
          Proceed to Checkout
        </Link>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm text-slate-500 sm:text-xs">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          Secure checkout · 256-bit SSL encryption
        </p>
      </aside>
    </div>
  );
}
