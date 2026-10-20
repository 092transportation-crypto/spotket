import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AGENT_NAMES, isAgentName, listAgentSettings, setAgentEnabled, type AgentName } from "@/lib/supabase";

export async function GET() {
  const settings = await listAgentSettings();
  // Fill in any agent not yet in Supabase (e.g. before the schema is seeded)
  // so the dashboard always shows all 4 toggles, defaulted to enabled.
  const byName = new Map(settings.map((s) => [s.agent_name, s]));
  const merged = AGENT_NAMES.map(
    (name) => byName.get(name) ?? { agent_name: name, enabled: true, updated_at: null },
  );
  return NextResponse.json({ agents: merged });
}

export async function PATCH(request: NextRequest) {
  let body: { agent_name?: string; enabled?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body" }, { status: 400 });
  }
  if (!body.agent_name || !isAgentName(body.agent_name) || typeof body.enabled !== "boolean") {
    return NextResponse.json({ detail: "agent_name (valid) and enabled (boolean) are required" }, { status: 400 });
  }
  const ok = await setAgentEnabled(body.agent_name as AgentName, body.enabled);
  if (!ok) {
    return NextResponse.json({ detail: "Could not update — Supabase may not be configured yet" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
