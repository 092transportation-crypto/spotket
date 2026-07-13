"use client";

import { ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";

/** Mini-cart that slides in from the right whenever an item is added. */
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

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col bg-white shadow-2xl shadow-neutral-400/30 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-navy-700/60 px-5">
          <p className="flex items-center gap-2 text-base font-semibold text-white">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            Your Cart ({count})
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="flex h-11 w-11 items-center justify-center rounded-full text-slate-300 hover:bg-navy-800"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-400">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-navy-800">
                    {item.image && (
                      <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-white">{item.name}</p>
                    {item.variant && (
                      <p className="text-xs text-slate-400">Style: {item.variant}</p>
                    )}
                    <div className="mt-1.5 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-navy-600">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="flex h-9 w-9 items-center justify-center text-slate-300 hover:text-white"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="flex h-9 w-9 items-center justify-center text-slate-300 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="mt-1 text-xs text-slate-500 underline-offset-2 hover:text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-navy-700/60 px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-base font-bold text-white">{formatPrice(subtotal)}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-center rounded-full border border-navy-600 text-sm font-semibold text-white transition-colors hover:border-gold"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
