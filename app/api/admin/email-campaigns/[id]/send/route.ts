import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { writeOutreachEmail } from "@/lib/email-campaign";
import { sendCampaignEmail } from "@/lib/mailer";
import { SITE_URL } from "@/lib/site";
import {
  emailsSentToday,
  getEmailCampaign,
  incrementCampaignSentCount,
  logActivity,
  markRecipientFailed,
  markRecipientSent,
  recipientsForCampaign,
  setCampaignStatus,
} from "@/lib/supabase";

const DAILY_CAP = 100;

/** Starts (or resumes) sending a campaign — sends today's remaining allowance now; the rest goes out via the daily cron. */
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getEmailCampaign(id);
  if (!campaign) return NextResponse.json({ detail: "Campaign not found" }, { status: 404 });

  if (campaign.status === "draft") await setCampaignStatus(id, "sending");

  const sentToday = await emailsSentToday();
  const remainingToday = Math.max(0, DAILY_CAP - sentToday);
  const all = await recipientsForCampaign(id);
  const queued = all.filter((r) => r.status === "queued").slice(0, remainingToday);

  let sent = 0;
  let failed = 0;
  for (const recipient of queued) {
    const { subject, body } = await writeOutreachEmail(recipient);
    const trackingPixelUrl = `${SITE_URL}/api/email/track/${recipient.id}`;
    const ok = await sendCampaignEmail(recipient.email, subject, body, trackingPixelUrl);
    if (ok) {
      await markRecipientSent(recipient.id, subject, body);
      sent += 1;
    } else {
      await markRecipientFailed(recipient.id);
      failed += 1;
    }
  }
  if (sent > 0) await incrementCampaignSentCount(id, sent);

  const totalQueued = all.filter((r) => r.status === "queued").length;
  const remainingAfter = totalQueued - sent - failed;
  if (remainingAfter <= 0) await setCampaignStatus(id, "done");

  await logActivity("email_campaign_agent", `Campaign "${campaign.name}": sent ${sent}, failed ${failed}, ${Math.max(remainingAfter, 0)} still queued`);

  return NextResponse.json({ sent, failed, remainingToday: remainingToday - sent, stillQueued: remainingAfter > 0, capHit: remainingToday === 0 && queued.length === 0 });
}
