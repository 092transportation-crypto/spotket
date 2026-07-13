import { NextResponse } from "next/server";
import { getCjOrder, getCjTracking, listCjOrders } from "@/lib/cj";

/** Public order tracking: accepts a CJ order id or a Spotket order reference (pi_…). */
export async function POST(request: Request) {
  let query: string;
  try {
    ({ query } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  query = String(query ?? "").trim();
  if (!query || query.length > 80) {
    return NextResponse.json({ error: "Enter your order ID" }, { status: 400 });
  }

  try {
    let order = null;
    if (query.startsWith("pi_")) {
      // Spotket order reference — match against CJ order numbers.
      const { list } = await listCjOrders();
      const hit = (list ?? []).find((row) => row.orderNum === query);
      if (hit) order = await getCjOrder(hit.orderId);
    } else {
      order = await getCjOrder(query);
    }
    if (!order) {
      return NextResponse.json(
        { error: "Order not found — check the ID from your confirmation screen or email" },
        { status: 404 },
      );
    }

    let tracking = null;
    if (order.trackNumber) {
      try {
        tracking = await getCjTracking(order.trackNumber);
      } catch {
        tracking = null; // tracking often lags order creation — not an error
      }
    }
    return NextResponse.json({
      ok: true,
      status: order.orderStatus ?? "Processing",
      trackNumber: order.trackNumber ?? null,
      created: order.createDate ?? null,
      tracking,
    });
  } catch (error) {
    console.error("[track]", error);
    return NextResponse.json(
      { error: "Tracking is temporarily unavailable — please try again shortly" },
      { status: 502 },
    );
  }
}
