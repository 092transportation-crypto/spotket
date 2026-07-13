import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { adminClient } from "@/lib/catalog";

/** Subscribes an email: stores it and sends the WELCOME10 welcome email. */
export async function POST(request: Request) {
  let email: string;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  email = String(email ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 120) {
    return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
  }

  // Store the subscriber; tolerate a missing table or duplicate signup so the
  // welcome email still goes out.
  const admin = adminClient();
  if (admin) {
    const { error } = await admin.from("newsletter_subscribers").insert({ email });
    if (error && !/duplicate|unique/i.test(error.message)) {
      console.error("[newsletter] insert failed:", error.message);
    }
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  if (smtpUser && smtpPassword) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: smtpUser, pass: smtpPassword },
      });
      await transporter.sendMail({
        from: `"Spotket" <${smtpUser}>`,
        to: email,
        subject: "Welcome to Spotket — here's your 10% off code",
        text: `Welcome to Spotket!

Your 10% welcome discount code:

    WELCOME10

Enter it in the discount code box at checkout on your first order.

Happy shopping,
The Spotket Team
https://www.spotket.com`,
      });
    } catch (mailError) {
      console.error("[newsletter] welcome email failed:", mailError);
      // Subscription still counts — surface success with the code shown on-site.
    }
  }

  return NextResponse.json({ ok: true, code: "WELCOME10" });
}
