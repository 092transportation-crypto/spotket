import { NextResponse } from "next/server";
import {
  activeClientsCount,
  contentStats,
  emailsSentToday,
  leadStats,
  monthlyRecurringRevenue,
  newLeadsToday,
  revenueLast30Days,
} from "@/lib/supabase";

export async function GET() {
  const [leads, content, mrr, newLeads, activeClients, emails, revenue] = await Promise.all([
    leadStats(),
    contentStats(),
    monthlyRecurringRevenue(),
    newLeadsToday(),
    activeClientsCount(),
    emailsSentToday(),
    revenueLast30Days(),
  ]);
  return NextResponse.json({
    ...leads,
    ...content,
    mrr,
    newLeadsToday: newLeads,
    activeClients,
    emailsSentToday: emails,
    revenue,
  });
}
