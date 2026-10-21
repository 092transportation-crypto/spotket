import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LEAD_STATUSES, updateLead, type LeadStatus } from "@/lib/supabase";

interface Props {
  params: Promise<{ id: string }>;
}

function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && (LEAD_STATUSES as readonly string[]).includes(value);
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const { id } = await params;
  let body: { status?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body" }, { status: 400 });
  }

  const updates: { status?: LeadStatus; notes?: string } = {};
  if (body.status !== undefined) {
    if (!isLeadStatus(body.status)) {
      return NextResponse.json({ detail: `status must be one of: ${LEAD_STATUSES.join(", ")}` }, { status: 400 });
    }
    updates.status = body.status;
  }
  if (body.notes !== undefined) {
    updates.notes = String(body.notes).slice(0, 5000);
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ detail: "status and/or notes required" }, { status: 400 });
  }

  const ok = await updateLead(id, updates);
  if (!ok) {
    return NextResponse.json({ detail: "Could not update — Supabase may not be configured yet" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
