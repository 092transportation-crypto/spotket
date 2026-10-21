import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CLIENT_PLANS, convertLeadToClient, logActivity, type ClientPlan } from "@/lib/supabase";

interface Props {
  params: Promise<{ id: string }>;
}

function isClientPlan(value: unknown): value is ClientPlan {
  return typeof value === "string" && (CLIENT_PLANS as readonly string[]).includes(value);
}

export async function POST(request: NextRequest, { params }: Props) {
  const { id } = await params;
  let body: { plan?: string; monthly_amount?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body" }, { status: 400 });
  }
  if (!isClientPlan(body.plan)) {
    return NextResponse.json({ detail: `plan must be one of: ${CLIENT_PLANS.join(", ")}` }, { status: 400 });
  }

  const client = await convertLeadToClient(id, { plan: body.plan, monthly_amount: body.monthly_amount });
  if (!client) {
    return NextResponse.json({ detail: "Could not convert lead — Supabase may not be configured, or the lead wasn't found" }, { status: 502 });
  }
  await logActivity("sales_agent", `Converted lead to client: ${client.business_name || client.name} (${client.plan})`);
  return NextResponse.json({ client });
}
