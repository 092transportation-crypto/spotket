import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PAYMENT_STATUSES, updatePaymentStatus, type PaymentStatus } from "@/lib/supabase";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const { id } = await params;
  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body" }, { status: 400 });
  }
  if (!(PAYMENT_STATUSES as readonly string[]).includes(body.status || "")) {
    return NextResponse.json({ detail: `status must be one of: ${PAYMENT_STATUSES.join(", ")}` }, { status: 400 });
  }
  const ok = await updatePaymentStatus(id, body.status as PaymentStatus);
  if (!ok) return NextResponse.json({ detail: "Could not update — Supabase may not be configured yet" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
