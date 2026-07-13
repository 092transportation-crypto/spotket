import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Stripe from "stripe";
import { adminClient } from "@/lib/catalog";
import { createCjOrder, type CjOrderItem } from "@/lib/cj";
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

    // Auto-fulfillment: send CJ-sourced items to CJDropshipping. A CJ failure
    // never fails the customer's order — it's flagged in the owner email.
    let cjOrderId: string | null = null;
    let cjNote = "No CJ-sourced items in this order";
    try {
      const admin = adminClient();
      if (admin) {
        const ids = totals.lines.map((line) => line.id);
        const { data: rows } = await admin
          .from("products")
          .select("id, shipping")
          .in("id", ids);
        const cjItems: CjOrderItem[] = [];
        for (const line of totals.lines) {
          const row = (rows ?? []).find((candidate) => candidate.id === line.id);
          const vid = row?.shipping?.cj?.vid;
          if (vid) cjItems.push({ vid, quantity: line.quantity });
        }
        if (cjItems.length > 0) {
          const country = /united states|usa|^us$/i.test(customer.country.trim())
            ? "US"
            : customer.country.trim().slice(0, 2).toUpperCase();
          const result = await createCjOrder({
            orderNumber: paymentIntentId,
            name: customer.name,
            phone: customer.phone,
            street: customer.street,
            city: customer.city,
            state: customer.state,
            zip: customer.zip,
            countryCode: country,
            items: cjItems,
          });
          cjOrderId = result.orderId;
          cjNote = `CJ order created: ${cjOrderId} (${cjItems.length} item${cjItems.length === 1 ? "" : "s"})`;
        }
      }
    } catch (cjError) {
      console.error("[/api/order] CJ fulfillment failed:", cjError);
      cjNote = `CJ FULFILLMENT FAILED — place manually! ${cjError instanceof Error ? cjError.message : ""}`;
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
Fulfillment: ${cjNote}
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

    return NextResponse.json({ ok: true, orderId: paymentIntentId, cjOrderId });
  } catch (error) {
    console.error("[/api/order] Order notification failed:", error);
    const message = error instanceof Error ? error.message : "Order failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
