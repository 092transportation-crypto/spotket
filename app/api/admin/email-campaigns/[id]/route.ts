import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getEmailCampaign, recipientsForCampaign } from "@/lib/supabase";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [campaign, recipients] = await Promise.all([getEmailCampaign(id), recipientsForCampaign(id)]);
  if (!campaign) return NextResponse.json({ detail: "Campaign not found" }, { status: 404 });
  return NextResponse.json({ campaign, recipients });
}
