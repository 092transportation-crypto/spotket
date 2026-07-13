import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { adminClient } from "@/lib/catalog";
import { recomputeProductRating } from "@/lib/reviews";

const SOURCE_LABEL = "— Verified buyer on supplier marketplace";

/**
 * Products whose supplier import hit the 50-review cap all show exactly 50
 * reviews, which reads as templated. Trims each such product to a varied
 * 23-38 by keeping the most recent reviews — deliberately rating-blind so
 * the remaining sample keeps the product's true rating distribution.
 * Verified customer reviews are never deleted.
 */
export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const admin = adminClient();
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { data: products, error } = await admin.from("products").select("id, name, review_count");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const summary: Record<string, { kept: number; removed: number; rating: number }> = {};

  for (const product of products ?? []) {
    if (product.review_count !== 50) continue;

    const { data: rows } = await admin
      .from("reviews")
      .select("id, body, created_at")
      .eq("product_id", product.id)
      .order("created_at", { ascending: false });
    const supplier = (rows ?? []).filter((row) => row.body.includes(SOURCE_LABEL));
    if (supplier.length < 40) continue;

    // Deterministic-enough varied target per product.
    const target = 23 + Math.floor(Math.random() * 16); // 23-38
    const toRemove = supplier.slice(target).map((row) => row.id);
    if (toRemove.length === 0) continue;

    const { error: deleteError } = await admin.from("reviews").delete().in("id", toRemove);
    if (deleteError) {
      summary[product.name.slice(0, 40)] = { kept: -1, removed: 0, rating: 0 };
      continue;
    }
    const { rating, reviewCount } = await recomputeProductRating(admin, product.id);
    summary[product.name.slice(0, 40)] = { kept: reviewCount, removed: toRemove.length, rating };
  }

  return NextResponse.json({ ok: true, summary });
}
