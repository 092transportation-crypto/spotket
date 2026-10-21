import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createEmailCampaign, listEmailCampaigns, logActivity } from "@/lib/supabase";

export async function GET() {
  const campaigns = await listEmailCampaigns();
  return NextResponse.json({ campaigns });
}

interface RecipientInput {
  business_name?: string;
  contact_name?: string;
  email: string;
  website_url?: string;
  notes?: string;
}

export async function POST(request: NextRequest) {
  let body: { name?: string; recipients?: RecipientInput[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body" }, { status: 400 });
  }
  const name = String(body.name || "").trim().slice(0, 150);
  if (!name) return NextResponse.json({ detail: "name is required" }, { status: 400 });

  const recipients = (Array.isArray(body.recipients) ? body.recipients : [])
    .filter((r) => r && typeof r.email === "string" && r.email.includes("@"))
    .map((r) => ({
      business_name: r.business_name?.slice(0, 150),
      contact_name: r.contact_name?.slice(0, 100),
      email: r.email.trim().slice(0, 200),
      website_url: r.website_url?.slice(0, 300),
      notes: r.notes?.slice(0, 1000),
    }));
  if (recipients.length === 0) {
    return NextResponse.json({ detail: "At least one valid recipient with an email is required" }, { status: 400 });
  }

  const campaign = await createEmailCampaign(name, recipients);
  if (!campaign) {
    return NextResponse.json({ detail: "Could not create campaign — Supabase may not be configured yet" }, { status: 502 });
  }
  await logActivity("email_campaign_agent", `Imported campaign "${name}" with ${recipients.length} recipient(s)`);
  return NextResponse.json({ campaign });
}
