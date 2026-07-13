import { getCatalog } from "@/lib/catalog";
import {
  ESTIMATED_TAX_RATE,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
} from "@/lib/site";

/** A cart line as sent to the API — prices are always looked up server-side. */
export type OrderLine = {
  id: string;
  quantity: number;
  variant?: string;
};

export type PricedLine = {
  id: string;
  name: string;
  variant?: string;
  quantity: number;
  price: number;
};

export type OrderTotals = {
  lines: PricedLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  /** Total in cents, for Stripe. */
  amount: number;
};

/** Active promo codes: code -> fraction off the subtotal. */
export const PROMO_CODES: Record<string, number> = {
  WELCOME10: 0.1,
};

/**
 * Prices an order from the catalog. Throws on unknown products or invalid
 * quantities so tampered requests fail loudly.
 */
export async function priceOrder(
  lines: OrderLine[],
  promoCode?: string,
): Promise<OrderTotals> {
  if (!Array.isArray(lines) || lines.length === 0) {
    throw new Error("Order has no items");
  }
  const catalog = await getCatalog();
  const priced = lines.map((line) => {
    const product = catalog.find((candidate) => candidate.id === line.id);
    if (!product) throw new Error(`Unknown product: ${line.id}`);
    const quantity = Math.floor(line.quantity);
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
      throw new Error(`Invalid quantity for ${line.id}`);
    }
    return {
      id: product.id,
      name: product.name,
      variant: line.variant,
      quantity,
      price: product.price,
    };
  });
  const subtotal = priced.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const fraction = promoCode ? PROMO_CODES[promoCode.trim().toUpperCase()] ?? 0 : 0;
  const discount = Math.round(subtotal * fraction * 100) / 100;
  const discounted = subtotal - discount;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const tax = discounted * ESTIMATED_TAX_RATE;
  const total = discounted + shipping + tax;
  return {
    lines: priced,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    amount: Math.round(total * 100),
  };
}

export type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export const CUSTOMER_FIELDS: (keyof CustomerInfo)[] = [
  "name",
  "email",
  "phone",
  "street",
  "city",
  "state",
  "zip",
  "country",
];
