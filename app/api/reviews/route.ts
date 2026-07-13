import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { adminClient } from "@/lib/catalog";
import { recomputeProductRating } from "@/lib/reviews";

/** Public listing for a product (reviews are world-readable anyway). */
export async function GET(request: Request) {
  const admin = adminClient();
  if (!admin) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("product_id");
  if (!productId) return NextResponse.json({ error: "product_id is required" }, { status: 400 });
  const { data, error } = await admin
    .from("reviews")
    .select("id, rating, title, body, name, verified_purchase, created_at")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ reviews: data });
}

/** Admin moderation — remove a review by id. */
export async function DELETE(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const admin = adminClient();
  if (!admin) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const { data: deleted, error } = await admin
    .from("reviews")
    .delete()
    .eq("id", id)
    .select("product_id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  // Moderation also keeps the product's numbers truthful.
  if (deleted?.product_id) await recomputeProductRating(admin, deleted.product_id);
  return NextResponse.json({ ok: true });
}

type ReviewRequest = {
  productId: string;
  rating: number;
  title: string;
  body: string;
  name: string;
  /** Supabase access token of the signed-in customer, if any. */
  accessToken?: string;
};

export async function POST(request: Request) {
  const admin = adminClient();
  if (!admin) {
    return NextResponse.json({ error: "Reviews are not configured" }, { status: 500 });
  }

  let payload: ReviewRequest;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const rating = Math.round(Number(payload.rating));
  const title = String(payload.title ?? "").trim().slice(0, 120);
  const body = String(payload.body ?? "").trim().slice(0, 2000);
  const name = String(payload.name ?? "").trim().slice(0, 60);
  if (!payload.productId || rating < 1 || rating > 5 || !body || !name) {
    return NextResponse.json(
      { error: "Rating (1-5), review text, and name are required" },
      { status: 400 },
    );
  }

  const { data: product, error: productError } = await admin
    .from("products")
    .select("id, name, rating, review_count")
    .eq("id", payload.productId)
    .single();
  if (productError || !product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Verified-purchase status is computed here, never trusted from the client.
  let userId: string | null = null;
  let verified = false;
  if (payload.accessToken) {
    const { data: userData } = await admin.auth.getUser(payload.accessToken);
    if (userData.user) {
      userId = userData.user.id;
      const { data: orders } = await admin
        .from("orders")
        .select("items")
        .eq("user_id", userId);
      verified = (orders ?? []).some((order) =>
        (order.items as { name: string }[]).some((item) => item.name === product.name),
      );
    }
  }

  const { error: insertError } = await admin.from("reviews").insert({
    product_id: product.id,
    user_id: userId,
    rating,
    title,
    body,
    name,
    verified_purchase: verified,
  });
  if (insertError) {
    console.error("[/api/reviews] insert failed:", insertError.message);
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  // Recompute count and average from all real reviews so the product card
  // and detail page show the new numbers immediately.
  const { rating: newAverage, reviewCount: newCount } = await recomputeProductRating(
    admin,
    product.id,
  );

  return NextResponse.json({
    ok: true,
    verified,
    rating: newAverage,
    reviewCount: newCount,
  });
}
