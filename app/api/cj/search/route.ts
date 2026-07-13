import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { searchCjProducts } from "@/lib/cj";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  const page = Number(searchParams.get("page") ?? 1);
  if (!query) return NextResponse.json({ error: "q is required" }, { status: 400 });
  try {
    const data = await searchCjProducts(query, page);
    return NextResponse.json({
      total: data.total,
      results: (data.list ?? []).map((item) => ({
        pid: item.pid,
        name: item.productNameEn,
        image: item.productImage,
        cost: Number(item.sellPrice) || null,
        category: item.categoryName ?? null,
        // CJ standard line estimate; exact freight is computed at fulfillment.
        shippingEstimate: "7-15 days (CJPacket)",
      })),
    });
  } catch (error) {
    console.error("[cj/search]", error);
    const message = error instanceof Error ? error.message : "CJ search failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
