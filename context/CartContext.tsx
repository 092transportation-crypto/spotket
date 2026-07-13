"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product, Variant } from "@/lib/products";

export type CartItem = {
  /** Cart line id — product id, plus the variant name when one was selected. */
  id: string;
  /** Product id, for linking back to the product page. */
  productId: string;
  name: string;
  price: number;
  image?: string;
  variant?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: Variant) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
};

const STORAGE_KEY = "spotket-cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // The persisted cart must load after hydration (localStorage is
  // client-only and reading it during render would mismatch the SSR HTML).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // Carts persisted before variants existed have no productId.
        const parsed: CartItem[] = JSON.parse(stored);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(parsed.map((item) => ({ ...item, productId: item.productId ?? item.id })));
      }
    } catch {
      // Corrupt or unavailable storage — start with an empty cart.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private mode, quota) — cart stays in memory.
    }
  }, [items, hydrated]);

  const addItem = (product: Product, quantity = 1, variant?: Variant) => {
    const lineId = variant ? `${product.id}::${variant.name}` : product.id;
    // Let the mini-cart drawer slide in.
    window.dispatchEvent(new CustomEvent("spotket:cart-added"));
    setItems((current) => {
      const existing = current.find((item) => item.id === lineId);
      if (existing) {
        return current.map((item) =>
          item.id === lineId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [
        ...current,
        {
          id: lineId,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: variant?.image ?? product.image,
          variant: variant?.name,
          quantity,
        },
      ];
    });
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => setItems([]);

  const { count, subtotal } = useMemo(
    () => ({
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    [items],
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, count, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
