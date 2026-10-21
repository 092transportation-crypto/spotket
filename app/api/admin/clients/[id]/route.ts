import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  CLIENT_PLANS,
  CLIENT_STATUSES,
  PAYMENT_STATUSES,
  getClientById,
  updateClient,
  type ClientPlan,
  type ClientStatus,
  type PaymentStatus,
} from "@/lib/supabase";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Props) {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client) return NextResponse.json({ detail: "Client not found" }, { status: 404 });
  return NextResponse.json({ client });
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const { id } = await params;
  let body: {
    plan?: string;
    monthly_amount?: number;
    payment_status?: string;
    status?: string;
    website_url?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body" }, { status: 400 });
  }

  const updates: Parameters<typeof updateClient>[1] = {};
  if (body.plan !== undefined) {
    if (!(CLIENT_PLANS as readonly string[]).includes(body.plan)) {
      return NextResponse.json({ detail: `plan must be one of: ${CLIENT_PLANS.join(", ")}` }, { status: 400 });
    }
    updates.plan = body.plan as ClientPlan;
  }
  if (body.monthly_amount !== undefined) updates.monthly_amount = Number(body.monthly_amount);
  if (body.payment_status !== undefined) {
    if (!(PAYMENT_STATUSES as readonly string[]).includes(body.payment_status)) {
      return NextResponse.json({ detail: `payment_status must be one of: ${PAYMENT_STATUSES.join(", ")}` }, { status: 400 });
    }
    updates.payment_status = body.payment_status as PaymentStatus;
  }
  if (body.status !== undefined) {
    if (!(CLIENT_STATUSES as readonly string[]).includes(body.status)) {
      return NextResponse.json({ detail: `status must be one of: ${CLIENT_STATUSES.join(", ")}` }, { status: 400 });
    }
    updates.status = body.status as ClientStatus;
  }
  if (body.website_url !== undefined) updates.website_url = String(body.website_url).slice(0, 500);

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ detail: "No valid fields to update" }, { status: 400 });
  }

  const ok = await updateClient(id, updates);
  if (!ok) return NextResponse.json({ detail: "Could not update — Supabase may not be configured yet" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
