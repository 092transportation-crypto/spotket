import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PRICING_TIERS } from "@/lib/site";
import { insertLead, isAgentEnabled, logActivity } from "@/lib/supabase";
import { sendEmail, buildLeadAlertEmail } from "@/lib/mailer";
import { callAnthropic, extractText, type AnthropicMessage } from "@/lib/anthropic";

const FALLBACK_REPLY =
  "Live chat isn't available right now — email hello@spotket.com and we'll get right back to you.";

function pricingSummary(): string {
  return PRICING_TIERS.map(
    (tier) => `- ${tier.name} ($${tier.price}/mo): ${tier.description} Features: ${tier.features.join("; ")}.`,
  ).join("\n");
}

function systemPrompt(): string {
  return `You are Spotket AI, the assistant on spotket.com, an AI automation and web design agency for small businesses. Introduce yourself as Spotket AI in your very first message.

Your job is to qualify the visitor as a potential client, not to answer unrelated questions.

Conversation flow:
1. Ask what type of business they run.
2. Then ask what they need help with, or what's getting in the way of growing their business.
3. Based on their answers, recommend exactly ONE of these real packages (never invent features or packages beyond this list):
${pricingSummary()}
4. Ask if they'd like a free demo/consultation. If yes, collect name, business name, phone, and email ONE AT A TIME (don't ask for all of them in one message).
5. Once you have all four (name, business name, phone, email), call the submit_lead tool.

Rules:
- Be warm, concise, consultative — not pushy.
- Never invent pricing, features, or guarantees beyond the package list above.
- If asked something unrelated to Spotket's services, gently redirect to how Spotket could help their business.`;
}

// claude-sonnet-4-6 isn't a real Anthropic model id — same correction as the
// rest of this repo's agents. ANTHROPIC_SALES_CHAT_MODEL lets this one
// widget be overridden independently of ANTHROPIC_CHAT_MODEL (which the
// blog/landing-page agents use), since Sonnet costs more per call than the
// Haiku default those run on.
const SALES_CHAT_MODEL = process.env.ANTHROPIC_SALES_CHAT_MODEL || "claude-sonnet-5-5";

const TOOLS = [
  {
    name: "submit_lead",
    description: "Submit a qualified lead once name, business name, phone, and email have all been collected.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        business_name: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" },
        recommended_package: { type: "string", description: "Starter, Standard, or Premium" },
      },
      required: ["name", "business_name", "phone", "email"],
    },
  },
];

export async function POST(request: NextRequest) {
  let body: { messages?: AnthropicMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ reply: FALLBACK_REPLY }, { status: 200 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];

  const enabled = await isAgentEnabled("sales_agent");
  if (!enabled) {
    return NextResponse.json({ reply: FALLBACK_REPLY });
  }

  const result = await callAnthropic({ system: systemPrompt(), messages, tools: TOOLS, model: SALES_CHAT_MODEL });
  if (!result) {
    return NextResponse.json({ reply: FALLBACK_REPLY });
  }

  const toolUse = result.content.find((block) => block.type === "tool_use" && block.name === "submit_lead");

  if (toolUse && toolUse.input) {
    const input = toolUse.input as {
      name?: string;
      business_name?: string;
      phone?: string;
      email?: string;
      recommended_package?: string;
    };
    const name = String(input.name || "").trim().slice(0, 100);
    const businessName = String(input.business_name || "").trim().slice(0, 150);
    const phone = String(input.phone || "").trim().slice(0, 30);
    const email = String(input.email || "").trim().slice(0, 150);
    const recommendedPackage = String(input.recommended_package || "").trim().slice(0, 30);

    const alertTo = process.env.ALERT_EMAIL;
    const alert = buildLeadAlertEmail("Spotket AI chat widget", [
      { label: "Name", value: name },
      { label: "Business", value: businessName },
      { label: "Phone", value: phone },
      { label: "Email", value: email },
      { label: "Recommended package", value: recommendedPackage },
    ]);
    await Promise.allSettled([
      alertTo ? sendEmail(alertTo, alert.subject, alert.text, alert.html) : Promise.resolve(false),
      insertLead({
        name,
        business_name: businessName,
        phone,
        email,
        recommended_package: recommendedPackage,
        source: "sales_agent",
      }),
      logActivity("sales_agent", `Captured lead: ${name} (${businessName})`),
    ]);

    return NextResponse.json({
      reply: `Thanks, ${name.split(" ")[0] || "there"}! Someone from our team will reach out to ${phone} shortly to set up your demo.`,
      leadCaptured: true,
    });
  }

  const text = extractText(result.content);
  return NextResponse.json({ reply: text || FALLBACK_REPLY });
}
