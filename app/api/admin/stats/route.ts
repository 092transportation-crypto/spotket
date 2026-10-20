import { NextResponse } from "next/server";
import { leadStats, contentStats } from "@/lib/supabase";

export async function GET() {
  const [leads, content] = await Promise.all([leadStats(), contentStats()]);
  return NextResponse.json({ ...leads, ...content });
}
