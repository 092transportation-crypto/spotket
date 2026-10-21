import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { runClientAssistant } from "@/lib/client-assistant";
import { getClientById, insertClientChatMessage, listClientChatMessages } from "@/lib/supabase";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Props) {
  const { id } = await params;
  const messages = await listClientChatMessages(id);
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest, { params }: Props) {
  const { id } = await params;
  let body: { message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body" }, { status: 400 });
  }
  const message = String(body.message || "").trim().slice(0, 2000);
  if (!message) return NextResponse.json({ detail: "message is required" }, { status: 400 });

  const client = await getClientById(id);
  if (!client) return NextResponse.json({ detail: "Client not found" }, { status: 404 });

  const history = await listClientChatMessages(id);
  await insertClientChatMessage(id, "user", message);

  const reply = await runClientAssistant(
    client,
    [...history.map((m) => ({ role: m.role, content: m.content })), { role: "user", content: message }],
  );

  await insertClientChatMessage(id, "assistant", reply);
  return NextResponse.json({ reply });
}
