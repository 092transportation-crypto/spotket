import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CLIENT_PLANS, insertClient, listClients, logActivity, type ClientPlan } from "@/lib/supabase";

export async function GET() {
  const clients = await listClients();
  return NextResponse.json({ clients });
}

function isClientPlan(value: unknown): value is ClientPlan {
  return typeof value === "string" && (CLIENT_PLANS as readonly string[]).includes(value);
}

export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    business_name?: string;
    phone?: string;
    email?: string;
    website_url?: string;
    plan?: string;
    monthly_amount?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body" }, { status: 400 });
  }
  if (!isClientPlan(body.plan)) {
    return NextResponse.json({ detail: `plan must be one of: ${CLIENT_PLANS.join(", ")}` }, { status: 400 });
  }
  const client = await insertClient({ ...body, plan: body.plan });
  if (!client) {
    return NextResponse.json({ detail: "Could not create client — Supabase may not be configured yet" }, { status: 502 });
  }
  await logActivity("sales_agent", `Added client: ${client.business_name || client.name} (${client.plan})`);
  return NextResponse.json({ client });
}
