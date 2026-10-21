/**
 * AI-personalized cold outreach email writer. Only ever sent to addresses
 * the admin explicitly imported via CSV (see docs/agent-system.md) — never
 * scraped — so this doesn't carry the same compliance risk the original
 * agent-system spec flagged for an autonomous prospecting agent. Includes a
 * one-line opt-out per email (CAN-SPAM) since this is commercial bulk email.
 */
import { callAnthropic, extractText } from "./anthropic";
import { CONTACT_EMAIL, PRICING_TIERS } from "./site";

function pricingSummary(): string {
  return PRICING_TIERS.map((tier) => `- ${tier.name} ($${tier.price}/mo): ${tier.description}`).join("\n");
}

export interface OutreachTarget {
  business_name?: string | null;
  contact_name?: string | null;
  website_url?: string | null;
  notes?: string | null;
}

const FALLBACK_SUBJECT = "Quick question about your business";
function fallbackBody(target: OutreachTarget): string {
  const name = target.contact_name || "there";
  const business = target.business_name || "your business";
  return `Hi ${name},\n\nI help small businesses like ${business} stop missing inquiries with 24/7 AI chatbots and booking automation. Would you be open to a quick, free audit of what you might be missing today?\n\nReply here or reach us at ${CONTACT_EMAIL}.\n\n— Spotket Digital\n\nIf you'd rather not hear from us again, just reply "unsubscribe."`;
}

/** Writes one personalized cold email via Claude. Falls back to a generic template if the API is unavailable. */
export async function writeOutreachEmail(
  target: OutreachTarget,
): Promise<{ subject: string; body: string }> {
  const system = `You write short, personalized cold outreach emails for Spotket Digital, an AI automation agency for small businesses. Spotket's real plans:
${pricingSummary()}

Rules:
- Plain text only, no markdown, no HTML.
- Under 120 words.
- One specific, plausible pain point for this business type/name — don't invent facts about them you don't know.
- End with a clear, low-pressure call to action (reply to this email, or book a free audit).
- End with exactly this opt-out line on its own line: If you'd rather not hear from us again, just reply "unsubscribe."
- Sign off as "— Spotket Digital".
- Respond with the subject line on the first line prefixed "Subject: ", then a blank line, then the email body. Nothing else.`;

  const details = [
    target.business_name ? `Business name: ${target.business_name}` : null,
    target.contact_name ? `Contact name: ${target.contact_name}` : null,
    target.website_url ? `Website: ${target.website_url}` : null,
    target.notes ? `Notes: ${target.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const result = await callAnthropic({
    system,
    messages: [{ role: "user", content: details || "No details available — write a generic version." }],
    maxTokens: 400,
  });

  if (!result) return { subject: FALLBACK_SUBJECT, body: fallbackBody(target) };

  const text = extractText(result.content);
  const match = text.match(/^Subject:\s*(.+)\n+([\s\S]+)$/i);
  if (!match) return { subject: FALLBACK_SUBJECT, body: text || fallbackBody(target) };
  return { subject: match[1].trim().slice(0, 150), body: match[2].trim() };
}
