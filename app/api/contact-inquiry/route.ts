import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { insertLead, logActivity } from "@/lib/supabase";
import { sendSms } from "@/lib/sms";
import { sendEmail, buildContactConfirmationEmail } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactInquiryBody {
  name?: string;
  business_name?: string;
  business_type?: string;
  phone?: string;
  email?: string;
  website_url?: string;
  revenue_range?: string;
  biggest_challenge?: string;
  heard_about_us?: string;
  message?: string;
}

const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(request: NextRequest) {
  let body: ContactInquiryBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body" }, { status: 400 });
  }

  const lead = {
    name: clip(body.name, 100),
    business_name: clip(body.business_name, 150),
    business_type: clip(body.business_type, 60),
    phone: clip(body.phone, 30),
    email: clip(body.email, 150),
    website_url: clip(body.website_url, 300),
    revenue_range: clip(body.revenue_range, 30),
    biggest_challenge: clip(body.biggest_challenge, 60),
    heard_about_us: clip(body.heard_about_us, 60),
    message: clip(body.message, 2000),
  };

  const missing: string[] = [];
  if (!lead.name) missing.push("name");
  if (!lead.business_name) missing.push("business_name");
  if (!lead.business_type) missing.push("business_type");
  if (!lead.phone) missing.push("phone");
  if (!lead.email) missing.push("email");
  if (!lead.biggest_challenge) missing.push("biggest_challenge");
  if (!lead.heard_about_us) missing.push("heard_about_us");
  if (missing.length) {
    return NextResponse.json(
      { detail: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(lead.email)) {
    return NextResponse.json({ detail: "email is invalid" }, { status: 400 });
  }

  const smsLines = [
    `New Spotket contact form inquiry:`,
    `${lead.name} — ${lead.business_name} (${lead.business_type})`,
    `${lead.phone} — ${lead.email}`,
    lead.website_url ? `Site: ${lead.website_url}` : null,
    lead.revenue_range ? `Revenue: ${lead.revenue_range}` : null,
    `Challenge: ${lead.biggest_challenge}`,
    `Heard via: ${lead.heard_about_us}`,
    lead.message ? `Message: ${lead.message.slice(0, 200)}` : null,
  ].filter(Boolean);

  const confirmation = buildContactConfirmationEmail(lead.name);

  const [smsResult, emailResult, dbResult] = await Promise.allSettled([
    sendSms(smsLines.join("\n")),
    sendEmail(lead.email, confirmation.subject, confirmation.text, confirmation.html),
    insertLead({ ...lead, source: "contact_form" }),
    logActivity("sales_agent", `Contact form inquiry from ${lead.name} (${lead.business_name})`),
  ]);

  for (const [label, result] of [
    ["SMS", smsResult],
    ["confirmation email", emailResult],
    ["Supabase insert", dbResult],
  ] as const) {
    if (result.status === "rejected") {
      console.error(`Contact inquiry ${label} dispatch threw:`, result.reason);
    }
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
