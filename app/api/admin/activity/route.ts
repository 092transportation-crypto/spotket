import { NextResponse } from "next/server";
import { recentActivity } from "@/lib/supabase";

export async function GET() {
  const activity = await recentActivity(50);
  return NextResponse.json({ activity });
}
