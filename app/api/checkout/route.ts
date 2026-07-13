import { NextResponse } from "next/server";
import Stripe from "stripe";
import { priceOrder, type OrderLine } from "@/lib/checkout";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Payments are not configured" },
      { status: 500 },
    );
  }

  let items: OrderLine[];
  try {
    ({ items } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const totals = await priceOrder(items);
    const stripe = new Stripe(secretKey);
    const intent = await stripe.paymentIntents.create({
      amount: totals.amount,
      currency: "usd",
      // Card-only keeps the flow redirect-free; the order email fires after
      // the payment is confirmed in this same session.
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    });
    return NextResponse.json({
      clientSecret: intent.client_secret,
      subtotal: totals.subtotal,
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
