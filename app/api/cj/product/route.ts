import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getCjProduct } from "@/lib/cj";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const { searchParams } = new URL(request.url);
  const pid = searchParams.get("pid");
  if (!pid) return NextResponse.json({ error: "pid is required" }, { status: 400 });
  try {
    const product = await getCjProduct(pid);
    const firstVariant = product.variants?.[0];
    return NextResponse.json({
      pid: product.pid,
      name: product.productNameEn,
      image: product.productImage,
      description: (product.description ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
      category: product.categoryName ?? null,
      vid: firstVariant?.vid ?? null,
      cost: firstVariant?.variantSellPrice ?? null,
      variants: (product.variants ?? []).map((variant) => ({
        vid: variant.vid,
        name: variant.variantNameEn ?? "",
        cost: variant.variantSellPrice ?? null,
      })),
    });
  } catch (error) {
    console.error("[cj/product]", error);
    const message = error instanceof Error ? error.message : "CJ product lookup failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
