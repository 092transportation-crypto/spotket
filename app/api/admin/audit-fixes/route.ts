import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { adminClient } from "@/lib/catalog";
import { recomputeProductRating } from "@/lib/reviews";

const SOURCE_LABEL = "— Verified buyer on supplier marketplace";

type Rename = { id: string; name: string };
type Trim = { id: string; target: number };

/** Fisher-Yates shuffle (copy) — trims are deliberately rating-blind. */
function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * One-off catalog cleanups driven by the request body:
 *   { renames: [{ id, name }], trims: [{ id, target }] }
 *
 * Renames update only the product name. Trims delete a random selection of
 * supplier-imported reviews (verified customer reviews are only touched if
 * supplier rows alone can't reach the target) until the product has `target`
 * reviews, then recompute the product's rating and review_count.
 */
export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const admin = adminClient();
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  let renames: Rename[];
  let trims: Trim[];
  try {
    const body = await request.json();
    renames = body.renames ?? [];
    trims = body.trims ?? [];
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const renamed: Record<string, string> = {};
  for (const { id, name } of renames) {
    if (!id || !name?.trim()) continue;
    const { error } = await admin.from("products").update({ name: name.trim() }).eq("id", id);
    renamed[id] = error ? `ERROR: ${error.message}` : name.trim();
  }

  const trimmed: Record<
    string,
    { before: number; after: number; rating: number } | { error: string }
  > = {};
  for (const { id, target } of trims) {
    if (!id || !Number.isInteger(target) || target < 1) continue;
    const [{ data: rows, error: rowsError }, { data: product }] = await Promise.all([
      admin.from("reviews").select("id, body").eq("product_id", id),
      admin.from("products").select("name, reviews").eq("id", id).single(),
    ]);
    if (rowsError || !product) {
      trimmed[id] = { error: rowsError?.message ?? "product not found" };
      continue;
    }
    const legacy: unknown[] = product.reviews ?? [];
    const before = (rows ?? []).length + legacy.length;
    let excess = before - target;
    if (excess <= 0) {
      trimmed[product.name.slice(0, 40)] = { before, after: before, rating: -1 };
      continue;
    }

    // Supplier-imported rows go first; verified customer rows only as a last resort.
    const supplier = (rows ?? []).filter((row) => row.body.includes(SOURCE_LABEL));
    const customer = (rows ?? []).filter((row) => !row.body.includes(SOURCE_LABEL));
    const deletable = [...shuffled(supplier), ...shuffled(customer)]
      .slice(0, excess)
      .map((row) => row.id);
    if (deletable.length > 0) {
      const { error: deleteError } = await admin.from("reviews").delete().in("id", deletable);
      if (deleteError) {
        trimmed[product.name.slice(0, 40)] = { error: deleteError.message };
        continue;
      }
      excess -= deletable.length;
    }
    if (excess > 0 && legacy.length > 0) {
      const keptLegacy = shuffled(legacy).slice(0, Math.max(0, legacy.length - excess));
      await admin
        .from("products")
        .update({ reviews: keptLegacy.length > 0 ? keptLegacy : null })
        .eq("id", id);
    }
    const { rating, reviewCount } = await recomputeProductRating(admin, id);
    trimmed[product.name.slice(0, 40)] = { before, after: reviewCount, rating };
  }

  return NextResponse.json({ ok: true, renamed, trimmed });
}
