import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { adminClient } from "@/lib/catalog";
import { isExternalImageUrl, rehostUrls } from "@/lib/rehost";

/**
 * Bulk sweep: rehosts any remaining supplier-hosted images across the whole
 * catalog. New saves rehost inline, so this is a safety net for old rows.
 */
export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const admin = adminClient();
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { data: products, error } = await admin.from("products").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const summary: Record<string, { rehosted: number; failed: number }> = {};
  for (const product of products ?? []) {
    const gallery: string[] = product.images ?? [];
    const all = [product.image, ...gallery].filter(Boolean) as string[];
    if (!all.some(isExternalImageUrl)) continue;
    const { urls, rehosted, failed } = await rehostUrls(admin, product.id, all);
    const [image, ...images] = urls;
    await admin
      .from("products")
      .update({ image: product.image ? image : null, images: product.image ? images : urls })
      .eq("id", product.id);
    summary[product.name.slice(0, 40)] = { rehosted, failed };
  }
  return NextResponse.json({ ok: true, summary });
}
