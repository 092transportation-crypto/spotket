import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/** Reports integration readiness (booleans only — no data or secrets). */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const result: Record<string, boolean | string> = {
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    smtp: Boolean(process.env.SMTP_USER && process.env.SMTP_PASSWORD),
    groq: Boolean(process.env.GROQ_API_KEY),
    supabaseConfigured: Boolean(url && serviceKey),
    ordersTable: false,
    cartTable: false,
    productsTable: false,
    reviewsTable: false,
  };

  if (url && serviceKey) {
    const admin = createClient(url, serviceKey);
    for (const table of ["orders", "cart", "products", "reviews"] as const) {
      // A real GET — HEAD probes report success even when the table is missing.
      const { error } = await admin.from(table).select("id").limit(1);
      result[`${table}Table`] = !error;
      if (error) result[`${table}Error`] = error.message;
    }
  }

  // Column-level audit — every column the code touches, per table. A table
  // can exist with a stale shape, which table-level checks won't catch.
  const expectedColumns: Record<string, string[]> = {
    products: [
      "id", "name", "category", "price", "compare_at_price", "description",
      "features", "image", "images", "variants", "rating", "review_count",
      "reviews", "stock", "shipping", "best_seller", "new_arrival", "deal",
      "trending", "date_added", "aliexpress_url", "sold_count", "created_at",
    ],
    orders: ["id", "user_id", "items", "total", "status", "shipping_address", "created_at"],
    cart: ["id", "user_id", "product_id", "quantity", "created_at"],
    reviews: [
      "id", "product_id", "user_id", "rating", "title", "body", "name",
      "verified_purchase", "created_at",
    ],
  };
  if (url && serviceKey) {
    const admin = createClient(url, serviceKey);
    for (const [table, columns] of Object.entries(expectedColumns)) {
      if (!result[`${table}Table`]) continue;
      const missing: string[] = [];
      for (const column of columns) {
        const { error } = await admin.from(table).select(column).limit(1);
        if (error) missing.push(column);
      }
      result[`${table}MissingColumns`] = missing.join(",") || "none";
    }
  }

  return NextResponse.json(result);
}
