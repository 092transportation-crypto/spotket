import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sendEmail, buildPaymentLinkEmail } from "@/lib/mailer";
import { createPaymentLink } from "@/lib/stripe";
import {
  PLAN_AMOUNTS,
  getClientById,
  getLeadById,
  insertPayment,
  listPaymentsEnriched,
  logActivity,
  CLIENT_PLANS,
  type ClientPlan,
} from "@/lib/supabase";

export async function GET() {
  const payments = await listPaymentsEnriched();
  return NextResponse.json({ payments });
}

function isClientPlan(value: unknown): value is ClientPlan {
  return typeof value === "string" && (CLIENT_PLANS as readonly string[]).includes(value);
}

/** Sends a Stripe payment link to any lead OR client — the generic "Send Payment Link" action. */
export async function POST(request: NextRequest) {
  let body: { clientId?: string; leadId?: string; plan?: string; amount?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body" }, { status: 400 });
  }
  if (!isClientPlan(body.plan)) {
    return NextResponse.json({ detail: `plan must be one of: ${CLIENT_PLANS.join(", ")}` }, { status: 400 });
  }
  if (!body.clientId && !body.leadId) {
    return NextResponse.json({ detail: "clientId or leadId is required" }, { status: 400 });
  }

  const amount = body.amount ?? PLAN_AMOUNTS[body.plan];

  let email: string | null = null;
  let label = "";
  let contactName = "";
  if (body.clientId) {
    const client = await getClientById(body.clientId);
    if (!client) return NextResponse.json({ detail: "Client not found" }, { status: 404 });
    email = client.email;
    label = client.business_name || client.name || client.email || "client";
    contactName = client.name || client.business_name || "";
  } else if (body.leadId) {
    const lead = await getLeadById(body.leadId);
    if (!lead) return NextResponse.json({ detail: "Lead not found" }, { status: 404 });
    email = lead.email;
    label = lead.business_name || lead.name || lead.email || "lead";
    contactName = lead.name || lead.business_name || "";
  }

  const link = await createPaymentLink(body.plan, amount, { clientId: body.clientId ?? "", leadId: body.leadId ?? "" });
  if (!link) {
    return NextResponse.json({ detail: "Could not create payment link — Stripe isn't configured yet (STRIPE_SECRET_KEY unset)" }, { status: 502 });
  }

  const payment = await insertPayment({
    client_id: body.clientId,
    lead_id: body.leadId,
    plan: body.plan,
    amount,
    stripe_payment_link_id: link.id,
    stripe_payment_link_url: link.url,
  });

  let emailed = false;
  if (email) {
    const { subject, text, html } = buildPaymentLinkEmail(contactName, body.plan, amount, link.url);
    emailed = await sendEmail(email, subject, text, html);
  }

  await logActivity("sales_agent", `Sent ${body.plan} payment link to ${label}`);
  return NextResponse.json({ payment, link, emailed });
}
