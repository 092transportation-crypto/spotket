import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyCronAuth } from "@/lib/auth";
import { writeOutreachEmail } from "@/lib/email-campaign";
import { buildCampaignFollowUpEmail, sendCampaignEmail, sendEmail } from "@/lib/mailer";
import { SITE_URL } from "@/lib/site";
import {
  emailsSentToday,
  incrementCampaignSentCount,
  isAgentEnabled,
  logActivity,
  markRecipientFailed,
  markRecipientFollowedUp,
  markRecipientSent,
  nextQueuedRecipients,
  recipientsDueForFollowUp,
  recipientsForCampaign,
  setCampaignStatus,
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

const DAILY_CAP = 100;

/**
 * Daily: sends up to the remaining 100/day allowance across every campaign
 * marked 'sending' (newest-queued first), then sends 3-day no-reply
 * follow-ups within whatever allowance is left. "No reply" is the same
 * honest proxy used by lead_follow_up_agent — there's no inbound-email
 * webhook wired up, so it really means "nobody in /admin marked this
 * recipient Replied."
 */
export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request.headers.get("authorization"))) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const enabled = await isAgentEnabled("email_campaign_agent");
  if (!enabled) {
    await logActivity("email_campaign_agent", "Skipped — agent disabled");
    return NextResponse.json({ skipped: true });
  }

  const sentToday = await emailsSentToday();
  let remaining = Math.max(0, DAILY_CAP - sentToday);

  let newSent = 0;
  if (remaining > 0) {
    const queued = await nextQueuedRecipients(remaining);
    const byCampaign = new Map<string, number>();
    for (const recipient of queued) {
      const { subject, body } = await writeOutreachEmail(recipient);
      const trackingPixelUrl = `${SITE_URL}/api/email/track/${recipient.id}`;
      const ok = await sendCampaignEmail(recipient.email, subject, body, trackingPixelUrl);
      if (ok) {
        await markRecipientSent(recipient.id, subject, body);
        byCampaign.set(recipient.campaign_id, (byCampaign.get(recipient.campaign_id) ?? 0) + 1);
        newSent += 1;
      } else {
        await markRecipientFailed(recipient.id);
      }
    }
    for (const [campaignId, count] of byCampaign) {
      await incrementCampaignSentCount(campaignId, count);
      const stillQueued = (await recipientsForCampaign(campaignId)).some((r) => r.status === "queued");
      if (!stillQueued) await setCampaignStatus(campaignId, "done");
    }
    remaining -= newSent;
  }

  let followUpsSent = 0;
  if (remaining > 0) {
    const due = (await recipientsDueForFollowUp()).slice(0, remaining);
    for (const recipient of due) {
      const { subject, text, html } = buildCampaignFollowUpEmail(recipient.contact_name, recipient.business_name);
      const ok = await sendEmail(recipient.email, subject, text, html);
      if (ok) {
        await markRecipientFollowedUp(recipient.id);
        followUpsSent += 1;
      }
    }
  }

  await logActivity(
    "email_campaign_agent",
    `Sent ${newSent} new outreach email(s) and ${followUpsSent} 3-day follow-up(s) (daily cap ${DAILY_CAP})`,
  );

  return NextResponse.json({ newSent, followUpsSent });
}
