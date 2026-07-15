import type { SupabaseClient } from "@supabase/supabase-js";
import { adminClient } from "@/lib/catalog";
import type { Review } from "@/lib/products";

/** Display handles for anonymous supplier reviewers ("AliExpress Shopper"). */
export const REVIEWER_PSEUDONYMS = [
  "Sarah M.", "James K.", "Michael T.", "Jennifer L.", "David R.",
  "Amanda C.", "Chris W.", "Nicole B.", "Robert H.", "Emily S.",
];

/**
 * Recomputes a product's review_count and average rating from every review
 * that exists: rows in the reviews table plus any legacy reviews still on
 * the product row. Call after any insert or delete so counts never drift.
 */
export async function recomputeProductRating(
  admin: SupabaseClient,
  productId: string,
): Promise<{ rating: number; reviewCount: number }> {
  const [{ data: rows }, { data: product }] = await Promise.all([
    admin.from("reviews").select("rating").eq("product_id", productId),
    admin.from("products").select("reviews").eq("id", productId).single(),
  ]);
  const legacy: { rating: number }[] = product?.reviews ?? [];
  const ratings = [...(rows ?? []), ...legacy].map((review) => Number(review.rating));
  const reviewCount = ratings.length;
  const rating =
    reviewCount > 0
      ? Math.round((ratings.reduce((sum, value) => sum + value, 0) / reviewCount) * 10) / 10
      : 0;
  await admin
    .from("products")
    .update({ rating, review_count: reviewCount })
    .eq("id", productId);
  return { rating, reviewCount };
}

/** Customer reviews for a product, newest first, mapped to the display shape. */
export async function getProductReviews(productId: string): Promise<Review[]> {
  const admin = adminClient();
  if (!admin) return [];
  const { data, error } = await admin
    .from("reviews")
    .select("rating, title, body, name, verified_purchase, created_at")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error || !data) {
    if (error) console.error("Reviews fetch failed:", error.message);
    return [];
  }
  return data.map((row) => ({
    author: row.name,
    rating: row.rating,
    title: row.title,
    text: row.body,
    date: new Date(row.created_at).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    verified: row.verified_purchase,
  }));
}

export type FeaturedReview = {
  author: string;
  rating: number;
  text: string;
  productId: string;
  productName: string;
  productImage?: string;
};

/** Strong real reviews for the homepage carousel — 4-5 stars with substance. */
export async function getFeaturedReviews(limit = 8): Promise<FeaturedReview[]> {
  const admin = adminClient();
  if (!admin) return [];
  const [{ data: rows }, { data: products }] = await Promise.all([
    admin
      .from("reviews")
      .select("rating, body, name, product_id")
      .gte("rating", 4)
      .order("created_at", { ascending: false })
      .limit(120),
    admin.from("products").select("id, name, image"),
  ]);
  const catalog = new Map(
    (products ?? []).map((product) => [
      product.id,
      { name: product.name as string, image: (product.image as string | null) ?? undefined },
    ]),
  );
  const candidates = (rows ?? [])
    .map((row) => ({
      author: row.name,
      rating: row.rating,
      // Show just the review text — the source label is displayed separately.
      text: row.body.split("\n\n—")[0].trim(),
      productId: row.product_id,
      productName: (catalog.get(row.product_id)?.name ?? "").slice(0, 48),
      productImage: catalog.get(row.product_id)?.image,
    }))
    .filter((review) => review.text.length > 60 && review.text.length < 260 && review.productName);
  // One review per product so the carousel shows a spread of the catalog;
  // topped up with remaining strong reviews if that leaves slots open.
  const seen = new Set<string>();
  const spread = candidates.filter((review) => {
    if (seen.has(review.productId)) return false;
    seen.add(review.productId);
    return true;
  });
  const rest = candidates.filter((review) => !spread.includes(review));
  return [...spread, ...rest].slice(0, limit);
}
