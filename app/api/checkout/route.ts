import { NextResponse } from "next/server";
import Stripe from "stripe";
import { priceOrder, PROMO_CODES, type OrderLine } from "@/lib/checkout";

/** Codes already confirmed to exist as Stripe coupons this instance. */
const ensuredCoupons = new Set<string>();

/**
 * Mirrors an active promo code as a Stripe coupon so redemptions are visible
 * in the Stripe dashboard. The discount itself is applied server-side by
 * priceOrder (this flow uses PaymentIntents, which don't take coupons), so a
 * failure here never blocks checkout.
 */
async function ensureStripeCoupon(stripe: Stripe, code: string): Promise<void> {
  if (ensuredCoupons.has(code)) return;
  try {
    await stripe.coupons.retrieve(code);
  } catch {
    await stripe.coupons.create({
      id: code,
      name: code,
      percent_off: PROMO_CODES[code] * 100,
      duration: "forever",
    });
  }
  ensuredCoupons.add(code);
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Payments are not configured" },
      { status: 500 },
    );
  }

  let items: OrderLine[];
  let promoCode: string | undefined;
  try {
    ({ items, promoCode } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const totals = await priceOrder(items, promoCode);
    const stripe = new Stripe(secretKey);
    const appliedCode =
      totals.discount > 0 && promoCode ? promoCode.trim().toUpperCase() : undefined;
    if (appliedCode) {
      try {
        await ensureStripeCoupon(stripe, appliedCode);
      } catch (couponError) {
        console.error("[/api/checkout] Coupon sync failed:", couponError);
      }
    }
    const intent = await stripe.paymentIntents.create({
      amount: totals.amount,
      currency: "usd",
      // Card-only keeps the flow redirect-free; the order email fires after
      // the payment is confirmed in this same session.
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
      ...(appliedCode && {
        metadata: {
          promo_code: appliedCode,
          discount_usd: totals.discount.toFixed(2),
        },
      }),
    });
    return NextResponse.json({
      clientSecret: intent.client_secret,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      tax: totals.tax,
      total: totals.total,
    });
  } catch (error) {
    console.error("[/api/checkout] PaymentIntent creation failed:", error);
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
