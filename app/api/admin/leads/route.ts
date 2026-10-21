import { NextResponse } from "next/server";
import { listLeads } from "@/lib/supabase";

export async function GET() {
  const leads = await listLeads();
  return NextResponse.json({ leads });
}
