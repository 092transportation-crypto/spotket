import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Stripe from "stripe";
import {
  CUSTOMER_FIELDS,
  priceOrder,
  type CustomerInfo,
  type OrderLine,
} from "@/lib/checkout";
import { formatPrice } from "@/lib/products";

type OrderRequest = {
  paymentIntentId: string;
  customer: CustomerInfo;
  items: OrderLine[];
};

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  if (!secretKey || !smtpUser || !smtpPassword || !notificationEmail) {
    return NextResponse.json(
      { error: "Order notifications are not configured" },
      { status: 500 },
    );
  }

  let body: OrderRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { paymentIntentId, customer, items } = body;
  const missing = CUSTOMER_FIELDS.filter(
    (field) => !customer?.[field] || !String(customer[field]).trim(),
  );
  if (!paymentIntentId || missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ") || "paymentIntentId"}` },
      { status: 400 },
    );
  }

  try {
    const totals = await priceOrder(items);

    // The email only goes out for a payment Stripe confirms succeeded and
    // whose charged amount matches the order being reported.
    const stripe = new Stripe(secretKey);
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded" || intent.amount !== totals.amount) {
      console.error(
        `[/api/order] Payment not verified: intent ${paymentIntentId} status=${intent.status} amount=${intent.amount} expected=${totals.amount}`,
      );
      return NextResponse.json(
        { error: "Payment not verified" },
        { status: 400 },
      );
    }

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      dateStyle: "full",
      timeStyle: "long",
    });
    const itemLines = totals.lines
      .map(
        (line) =>
          `- ${line.name}${line.variant ? ` (Style: ${line.variant})` : ""} × ${line.quantity} — ${formatPrice(line.price)} each = ${formatPrice(line.price * line.quantity)}`,
      )
      .join("\n");
    const text = `New order on Spotket

Customer
  Name:  ${customer.name}
  Email: ${customer.email}
  Phone: ${customer.phone}

Shipping address
  ${customer.street}
  ${customer.city}, ${customer.state} ${customer.zip}
  ${customer.country}

Items
${itemLines}

  Subtotal: ${formatPrice(totals.subtotal)}
  Shipping: ${totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
  Tax:      ${formatPrice(totals.tax)}
  Total:    ${formatPrice(totals.total)}

Payment: ${paymentIntentId} (Stripe, succeeded)
Placed:  ${timestamp}
`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: smtpUser, pass: smtpPassword },
    });
    await transporter.sendMail({
      from: `"Spotket Orders" <${smtpUser}>`,
      to: notificationEmail,
      replyTo: customer.email,
      subject: `New Spotket order — ${formatPrice(totals.total)} from ${customer.name}`,
      text,
    });

    return NextResponse.json({ ok: true, orderId: paymentIntentId });
  } catch (error) {
    console.error("[/api/order] Order notification failed:", error);
    const message = error instanceof Error ? error.message : "Order failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
