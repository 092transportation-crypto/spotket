import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { activityForAgent, actionsLast24h, isAgentName } from "@/lib/supabase";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ agent: string }> }) {
  const { agent } = await params;
  if (!isAgentName(agent)) {
    return NextResponse.json({ detail: "Unknown agent" }, { status: 404 });
  }

  const [logs, actionsToday] = await Promise.all([activityForAgent(agent), actionsLast24h(agent)]);

  return NextResponse.json({
    agent,
    logs,
    actionsToday,
    lastEntry: logs[0] ?? null,
  });
}
