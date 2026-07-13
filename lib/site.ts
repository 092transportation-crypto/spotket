// Canonical domain — apex spotket.com 308-redirects to www, so www is canonical.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.spotket.com";

export const SITE_NAME = "Spotket";
export const SITE_TAGLINE = "Shop Smarter";
export const SITE_DESCRIPTION =
  "Spotket is a premium online store. Shop smarter with curated products, free shipping over $35, 30-day returns, price match guarantee, and 24/7 support.";

/** Orders at or above this subtotal ship free. */
export const FREE_SHIPPING_THRESHOLD = 35;
export const STANDARD_SHIPPING_COST = 4.99;
/** Flat estimate shown in the cart until real tax calculation is wired up. */
export const ESTIMATED_TAX_RATE = 0.08;

export const SUPPORT_EMAIL = "support@spotket.com";
export const SUPPORT_PHONE = "(667) 400-0092";
export const SUPPORT_PHONE_TEL = "tel:+16674000092";
