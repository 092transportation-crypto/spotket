/**
 * Thin Stripe wrapper — same resilience pattern as lib/supabase.ts and
 * lib/mailer.ts. No-ops and logs when STRIPE_SECRET_KEY isn't set yet;
 * never throws past the caller. Payment Links require an existing Price,
 * so createPaymentLink first creates a one-off Price for the plan amount,
 * then a Payment Link against it.
 */
import Stripe from "stripe";

let cachedClient: Stripe | null | undefined;

function getClient(): Stripe | null {
  if (cachedClient !== undefined) return cachedClient;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.log("Stripe not configured (STRIPE_SECRET_KEY unset) — skipping.");
    cachedClient = null;
    return null;
  }
  cachedClient = new Stripe(key);
  return cachedClient;
}

export interface CreatedPaymentLink {
  id: string;
  url: string;
}

/**
 * Creates a Stripe Payment Link for a one-time charge of `amountUsd` labeled
 * `planName`. Returns null (never throws) if Stripe isn't configured or the
 * API call fails.
 */
export async function createPaymentLink(
  planName: string,
  amountUsd: number,
  metadata: Record<string, string> = {},
): Promise<CreatedPaymentLink | null> {
  const stripe = getClient();
  if (!stripe) return null;
  try {
    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: Math.round(amountUsd * 100),
      product_data: { name: `Spotket — ${planName}` },
    });
    const link = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      metadata,
    });
    return { id: link.id, url: link.url };
  } catch (err) {
    console.error("createPaymentLink failed:", (err as Error).message);
    return null;
  }
}

/** Verifies a webhook request's signature. Returns null (never throws) if unconfigured or invalid. */
export function constructWebhookEvent(payload: string | Buffer, signature: string | null): Stripe.Event | null {
  const stripe = getClient();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret || !signature) return null;
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("constructWebhookEvent failed:", (err as Error).message);
    return null;
  }
}
