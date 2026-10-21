/**
 * Claude-powered assistant inside a Client Workspace (/admin → Clients →
 * a client). Two commands execute for real (send_payment_link,
 * send_monthly_report) because they map onto systems this repo actually
 * has (Stripe, SMTP). Everything else — "build their website", "write
 * blogs for them" — Claude drafts as text in the chat; there's no live
 * website builder or per-client CMS wired up here, so the system prompt
 * is told to say so and hand back a usable draft instead of pretending to
 * have deployed something. Same honesty-over-simulation stance as the
 * rest of the agent system (see docs/agent-system.md).
 */
import type { AnthropicMessage } from "./anthropic";
import { callAnthropic, extractText } from "./anthropic";
import { buildClientReportEmail, buildPaymentLinkEmail, sendEmail } from "./mailer";
import { createPaymentLink } from "./stripe";
import {
  PLAN_AMOUNTS,
  insertPayment,
  logActivity,
  type Client,
  type ClientPlan,
} from "./supabase";

const TOOLS = [
  {
    name: "send_payment_link",
    description:
      "Generate a Stripe payment link for this client's plan (or a specified plan/amount) and email it to them.",
    input_schema: {
      type: "object",
      properties: {
        plan: { type: "string", description: "Starter, Standard, Premium, or AI Receptionist. Defaults to the client's current plan." },
        amount: { type: "number", description: "Override amount in USD. Defaults to the plan's standard price." },
      },
    },
  },
  {
    name: "send_monthly_report",
    description: "Email this client a monthly performance summary.",
    input_schema: { type: "object", properties: {} },
  },
];

function systemPrompt(client: Client): string {
  return `You are Spotket's internal account assistant for ONE client, inside their admin workspace. You are talking to a Spotket team member managing this account, not the client directly.

Client: ${client.business_name || client.name || "Unknown business"}
Plan: ${client.plan} ($${client.monthly_amount}/mo)
Payment status: ${client.payment_status}
Website: ${client.website_url || "none on file"}

You have two real tools: send_payment_link and send_monthly_report. Use them when asked to send a payment link or a report.

For anything else — "build their website," "write blogs for them," drafting ad copy, outreach ideas, etc. — there is no live website builder or per-client CMS connected here. Be honest about that, then actually do the useful part: write the requested draft (blog post, website copy, email, etc.) directly in your reply so the team member can review and ship it themselves.

Be concise and operational — you're a tool for a busy agency team, not a chatty assistant.`;
}

export async function runClientAssistant(
  client: Client,
  history: AnthropicMessage[],
): Promise<string> {
  const result = await callAnthropic({ system: systemPrompt(client), messages: history, tools: TOOLS, maxTokens: 1024 });
  if (!result) {
    return "The AI assistant isn't available right now (Claude API not configured) — try again later.";
  }

  const toolUse = result.content.find((block) => block.type === "tool_use");
  if (!toolUse) {
    return extractText(result.content) || "I didn't have anything to add there.";
  }

  const input = (toolUse.input ?? {}) as { plan?: string; amount?: number };

  if (toolUse.name === "send_payment_link") {
    if (!client.email) return "This client has no email on file — add one before sending a payment link.";
    const plan = (input.plan as ClientPlan) || (client.plan as ClientPlan);
    const amount = input.amount ?? PLAN_AMOUNTS[plan] ?? client.monthly_amount;
    const link = await createPaymentLink(plan, amount, { client_id: client.id });
    if (!link) return "Couldn't create a Stripe payment link — Stripe isn't configured yet (STRIPE_SECRET_KEY unset).";
    await insertPayment({
      client_id: client.id,
      plan,
      amount,
      stripe_payment_link_id: link.id,
      stripe_payment_link_url: link.url,
    });
    const { subject, text, html } = buildPaymentLinkEmail(
      client.name || client.business_name || "",
      plan,
      amount,
      link.url,
    );
    const sent = await sendEmail(client.email, subject, text, html);
    await logActivity("sales_agent", `Sent ${plan} payment link to ${client.business_name || client.email}`);
    return sent
      ? `Sent a $${amount}/mo ${plan} payment link to ${client.email}: ${link.url}`
      : `Created the payment link (${link.url}) but the email didn't send — SMTP may not be configured.`;
  }

  if (toolUse.name === "send_monthly_report") {
    if (!client.email) return "This client has no email on file — add one before sending a report.";
    const { subject, text, html } = buildClientReportEmail(client.business_name || client.name || "there", client.plan);
    const sent = await sendEmail(client.email, subject, text, html);
    await logActivity("sales_agent", `Sent monthly report to ${client.business_name || client.email}`);
    return sent ? `Sent the monthly report to ${client.email}.` : "Report ready but the email didn't send — SMTP may not be configured.";
  }

  return "I tried to run a command I don't recognize — nothing happened.";
}
