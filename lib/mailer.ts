/**
 * SMTP email sender (nodemailer). Works with any standard SMTP provider —
 * Zoho (smtp.zoho.com:465) is the suggested default, see docs/agent-system.md
 * — configured entirely via env vars, nothing provider-specific in code.
 * No-ops and logs when SMTP_USER/SMTP_PASSWORD aren't set; never throws
 * past the caller.
 */
import nodemailer from "nodemailer";
import { SITE_NAME } from "./site";

let cachedTransport: ReturnType<typeof nodemailer.createTransport> | null | undefined;

function getTransport() {
  if (cachedTransport !== undefined) return cachedTransport;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!user || !pass) {
    console.log("SMTP not configured (SMTP_USER/SMTP_PASSWORD unset) — skipping email dispatch.");
    cachedTransport = null;
    return null;
  }
  const host = process.env.SMTP_HOST || "smtp.zoho.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  cachedTransport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return cachedTransport;
}

function fromAddress(): string {
  const user = process.env.SMTP_USER || "no-reply@spotket.com";
  return `${SITE_NAME} <${user}>`;
}

export async function sendEmail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
  const transport = getTransport();
  if (!transport) return false;
  try {
    await transport.sendMail({ from: fromAddress(), to, subject, text, html: html ?? text });
    return true;
  } catch (err) {
    console.error("sendEmail failed:", (err as Error).message);
    return false;
  }
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function shell(innerHtml: string): string {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#0a0a0f;padding:30px;">
      <div style="max-width:560px;margin:0 auto;background:#111116;border:1px solid #26262f;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(100deg,#6366f1,#4f46e5 55%,#a855f7);padding:20px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:18px;letter-spacing:1px;">${SITE_NAME}</h1>
        </div>
        <div style="padding:26px;color:#f5f5f5;">${innerHtml}</div>
      </div>
    </div>`;
}

export function buildContactConfirmationEmail(name: string): {
  subject: string;
  text: string;
  html: string;
} {
  const firstName = (name || "there").split(" ")[0] || "there";
  const subject = "We got your message — Spotket";
  const text = `Hi ${firstName},\n\nThanks for reaching out to Spotket. We'll be in touch within 24 hours.`;
  const html = shell(
    `<p style="font-size:15px;line-height:1.6;">Hi ${escapeHtml(firstName)},</p>` +
      `<p style="font-size:15px;line-height:1.6;">Thanks for reaching out to Spotket. We'll be in touch within 24 hours.</p>`
  );
  return { subject, text, html };
}

/** Internal alert email sent to ALERT_EMAIL whenever any surface captures a lead. */
export function buildLeadAlertEmail(
  source: string,
  fields: Array<{ label: string; value?: string }>
): { subject: string; text: string; html: string } {
  const filled = fields.filter((f): f is { label: string; value: string } => Boolean(f.value));
  const subject = `New Spotket lead (${source})`;
  const text = [`New lead from ${source}:`, "", ...filled.map((f) => `${f.label}: ${f.value}`)].join("\n");
  const rows = filled
    .map(
      (f) =>
        `<tr><td style="padding:6px 10px;color:#9ca3af;font-size:13px;white-space:nowrap;">${escapeHtml(
          f.label
        )}</td><td style="padding:6px 10px;color:#fff;font-size:14px;">${escapeHtml(f.value)}</td></tr>`
    )
    .join("");
  const html = shell(
    `<p style="font-size:15px;margin:0 0 14px;">New lead from <strong>${escapeHtml(source)}</strong>:</p>` +
      `<table style="width:100%;border-collapse:collapse;">${rows}</table>`
  );
  return { subject, text, html };
}

export function buildFollowUpEmail(name: string): { subject: string; text: string; html: string } {
  const firstName = (name || "there").split(" ")[0] || "there";
  const subject = `Following up, ${firstName}`;
  const text = `Hey ${firstName} — just following up on your interest in Spotket. Would love to show you a quick demo.`;
  const html = shell(
    `<p style="font-size:15px;line-height:1.6;">Hey ${escapeHtml(firstName)} — just following up on your interest in Spotket. Would love to show you a quick demo.</p>`
  );
  return { subject, text, html };
}

/** Monthly summary email sent from a client's workspace. Real data (plan) only — no fabricated metrics. */
export function buildClientReportEmail(businessName: string, plan: string): { subject: string; text: string; html: string } {
  const subject = `Your Spotket monthly report — ${businessName}`;
  const text = `Hi ${businessName},\n\nHere's your monthly Spotket summary:\n\n- Plan: ${plan}\n- Your AI automation is live and running\n\nQuestions or want to add anything? Just reply to this email.\n\n— Spotket Digital`;
  const html = shell(
    `<p style="font-size:15px;line-height:1.6;">Hi ${escapeHtml(businessName)},</p>` +
      `<p style="font-size:15px;line-height:1.6;">Here's your monthly Spotket summary:</p>` +
      `<ul style="font-size:14px;line-height:1.8;padding-left:18px;">` +
      `<li><strong>Plan:</strong> ${escapeHtml(plan)}</li>` +
      `<li>Your AI automation is live and running</li>` +
      `</ul>` +
      `<p style="font-size:14px;line-height:1.6;">Questions or want to add anything? Just reply to this email.</p>`
  );
  return { subject, text, html };
}

/** 3-day no-reply follow-up for an email campaign recipient — same honest "no reply tracked" caveat as buildFollowUpEmail. */
export function buildCampaignFollowUpEmail(contactName: string | null, businessName: string | null): { subject: string; text: string; html: string } {
  const name = (contactName || "there").split(" ")[0] || "there";
  const business = businessName || "your business";
  const subject = "Following up — quick question";
  const text = `Hi ${name},\n\nJust following up on my last note about helping ${business} with AI automation — happy to answer any questions, no pressure either way.\n\n— Spotket Digital\n\nIf you'd rather not hear from us again, just reply "unsubscribe."`;
  const html = shell(
    `<p style="font-size:15px;line-height:1.6;">Hi ${escapeHtml(name)},</p>` +
      `<p style="font-size:15px;line-height:1.6;">Just following up on my last note about helping ${escapeHtml(business)} with AI automation — happy to answer any questions, no pressure either way.</p>` +
      `<p style="font-size:13px;color:#9ca3af;">If you'd rather not hear from us again, just reply "unsubscribe."</p>`
  );
  return { subject, text, html };
}

/** Outbound cold-email campaign send — subject/body are already fully composed (lib/email-campaign.ts). */
export async function sendCampaignEmail(to: string, subject: string, body: string, trackingPixelUrl?: string): Promise<boolean> {
  const html =
    body
      .split("\n\n")
      .map((para) => `<p style="font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(para)}</p>`)
      .join("") + (trackingPixelUrl ? `<img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:none;" />` : "");
  return sendEmail(to, subject, body, shell(html));
}
