import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyCronAuth } from "@/lib/auth";
import { buildFollowUpEmail, sendEmail } from "@/lib/mailer";
import { isAgentEnabled, leadsDueForFollowUp, logActivity, markFollowedUp } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request.headers.get("authorization"))) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const enabled = await isAgentEnabled("lead_follow_up_agent");
  if (!enabled) {
    await logActivity("lead_follow_up_agent", "Skipped — agent disabled");
    return NextResponse.json({ skipped: true });
  }

  // `contacted` is the closest honest proxy we have for "got a response" —
  // there's no real inbound-reply tracking wired up. A lead only gets a
  // follow-up if nobody has marked it contacted and it's been 24h+.
  const leads = await leadsDueForFollowUp();

  let sent = 0;
  for (const lead of leads) {
    if (!lead.email) continue;
    const { subject, text, html } = buildFollowUpEmail(lead.name || "", lead.business_name);
    const ok = await sendEmail(lead.email, subject, text, html);
    if (ok) {
      await markFollowedUp(lead.id);
      sent += 1;
    }
  }

  await logActivity("lead_follow_up_agent", `Sent ${sent} follow-up email(s) of ${leads.length} due`);
  return NextResponse.json({ due: leads.length, sent });
}
