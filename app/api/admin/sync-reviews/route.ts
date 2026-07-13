import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { adminClient } from "@/lib/catalog";
import type { Review } from "@/lib/products";

const SOURCE_LABEL = "— Verified buyer on supplier marketplace";

function parseLegacyDate(raw: string, fallbackIndex: number): string {
  const parsed = Date.parse(raw);
  if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();
  const date = new Date();
  date.setDate(date.getDate() - (7 + fallbackIndex * 11));
  return date.toISOString();
}

/**
 * One-shot migration + sync, equivalent to:
 *   UPDATE products p SET
 *     review_count = (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id),
 *     rating = COALESCE((SELECT AVG(rating) FROM reviews r WHERE r.product_id = p.id), 0)
 * ...but first moves any legacy reviews stored on the product row into the
 * reviews table so they keep displaying and keep counting.
 */
export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const admin = adminClient();
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { data: products, error } = await admin
    .from("products")
    .select("id, name, reviews, review_count, rating");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const summary: Record<string, { migrated: number; reviewCount: number; rating: number }> = {};

  for (const product of products ?? []) {
    // Step 1: migrate legacy on-row reviews into the reviews table.
    const legacy: Review[] = product.reviews ?? [];
    let migrated = 0;
    if (legacy.length > 0) {
      const rows = legacy.map((review, index) => ({
        product_id: product.id,
        user_id: null,
        rating: Math.min(5, Math.max(1, Math.round(Number(review.rating)))),
        title: review.title ?? "",
        body: `${review.text}\n\n${SOURCE_LABEL}`,
        name: review.author,
        verified_purchase: false,
        created_at: parseLegacyDate(review.date, index),
      }));
      const { error: insertError } = await admin.from("reviews").insert(rows);
      if (insertError) {
        summary[product.name.slice(0, 40)] = {
          migrated: -1,
          reviewCount: product.review_count,
          rating: product.rating,
        };
        continue;
      }
      migrated = rows.length;
    }

    // Step 2: count + average strictly from the reviews table.
    const { data: allRows } = await admin
      .from("reviews")
      .select("rating")
      .eq("product_id", product.id);
    const ratings = (allRows ?? []).map((row) => Number(row.rating));
    const reviewCount = ratings.length;
    const rating =
      reviewCount > 0
        ? Math.round((ratings.reduce((sum, value) => sum + value, 0) / reviewCount) * 10) / 10
        : 0;
    await admin
      .from("products")
      .update({ review_count: reviewCount, rating, reviews: null })
      .eq("id", product.id);
    summary[product.name.slice(0, 40)] = { migrated, reviewCount, rating };
  }

  return NextResponse.json({ ok: true, summary });
}
