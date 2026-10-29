import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { insertLead, logActivity } from "@/lib/supabase";
import { sendEmail, buildContactConfirmationEmail, buildLeadAlertEmail } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactInquiryBody {
  name?: string;
  business_name?: string;
  business_type?: string;
  service_interest?: string;
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
    service_interest: clip(body.service_interest, 60),
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
  if (!lead.service_interest) missing.push("service_interest");
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

  const alertTo = process.env.ALERT_EMAIL;
  const alert = buildLeadAlertEmail("contact form", [
    { label: "Name", value: lead.name },
    { label: "Business", value: lead.business_name },
    { label: "Business type", value: lead.business_type },
    { label: "Interested in", value: lead.service_interest },
    { label: "Phone", value: lead.phone },
    { label: "Email", value: lead.email },
    { label: "Website", value: lead.website_url },
    { label: "Revenue range", value: lead.revenue_range },
    { label: "Biggest challenge", value: lead.biggest_challenge },
    { label: "Heard about us via", value: lead.heard_about_us },
    { label: "Message", value: lead.message },
  ]);
  const confirmation = buildContactConfirmationEmail(lead.name);

  // service_interest has no column of its own — it's stored as recommended_package
  // so it shows up tagged under "Service" on the admin leads dashboard.
  const { service_interest, ...leadForDb } = lead;

  const [alertResult, confirmResult, dbResult] = await Promise.allSettled([
    alertTo ? sendEmail(alertTo, alert.subject, alert.text, alert.html) : Promise.resolve(false),
    sendEmail(lead.email, confirmation.subject, confirmation.text, confirmation.html),
    insertLead({ ...leadForDb, recommended_package: service_interest, source: "contact_form" }),
    logActivity("sales_agent", `Contact form inquiry from ${lead.name} (${lead.business_name})`),
  ]);

  for (const [label, result] of [
    ["lead alert email", alertResult],
    ["confirmation email", confirmResult],
    ["Supabase insert", dbResult],
  ] as const) {
    if (result.status === "rejected") {
      console.error(`Contact inquiry ${label} dispatch threw:`, result.reason);
    }
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
