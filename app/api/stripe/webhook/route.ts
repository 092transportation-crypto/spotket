import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { findPaymentByStripeLinkId, logActivity, updateClient, updatePaymentStatus } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Public Stripe webhook — not under /api/admin, so proxy.ts doesn't gate it.
 * Signature-verified instead (STRIPE_WEBHOOK_SECRET). Listens for
 * checkout.session.completed on a Payment Link to mark the matching
 * payment + client paid.
 */
export async function POST(request: NextRequest) {
  const payload = await request.text();
  const event = constructWebhookEvent(payload, request.headers.get("stripe-signature"));
  if (!event) return NextResponse.json({ detail: "Invalid signature or Stripe not configured" }, { status: 400 });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { payment_link?: string | null };
    const paymentLinkId = session.payment_link;
    if (paymentLinkId) {
      const payment = await findPaymentByStripeLinkId(paymentLinkId);
      if (payment) {
        await updatePaymentStatus(payment.id, "paid");
        if (payment.client_id) await updateClient(payment.client_id, { payment_status: "paid" });
        await logActivity("sales_agent", `Payment received: ${payment.plan} ($${payment.amount})`);
      }
    }
  }

  return NextResponse.json({ received: true });
}
