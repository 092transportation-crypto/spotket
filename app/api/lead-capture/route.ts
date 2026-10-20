import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { insertLead, logActivity } from "@/lib/supabase";
import { sendSms } from "@/lib/sms";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: { source?: string; name?: string; phone?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body" }, { status: 400 });
  }

  const source = body.source === "exit_intent" ? "exit_intent" : "lead_popup";
  const name = String(body.name || "").trim().slice(0, 100);
  const phone = String(body.phone || "").trim().slice(0, 30);
  const email = body.email ? String(body.email).trim().slice(0, 150) : undefined;

  if (!name || !phone) {
    return NextResponse.json({ detail: "name and phone are required" }, { status: 400 });
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ detail: "email is invalid" }, { status: 400 });
  }

  const smsBody = `New Spotket lead (${source}): ${name} — ${phone}${email ? ` — ${email}` : ""}`;
  await Promise.allSettled([
    sendSms(smsBody),
    insertLead({ name, phone, email, source }),
    logActivity("sales_agent", `Captured lead via ${source}: ${name}`),
  ]);

  return NextResponse.json({ ok: true }, { status: 201 });
}
