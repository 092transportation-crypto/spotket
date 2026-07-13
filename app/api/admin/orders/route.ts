import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { adminClient } from "@/lib/catalog";

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const admin = adminClient();
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { data: orders, error } = await admin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Attach customer emails so the dashboard doesn't show bare UUIDs.
  const emails: Record<string, string> = {};
  const { data: usersData } = await admin.auth.admin.listUsers({ perPage: 1000 });
  for (const user of usersData?.users ?? []) {
    emails[user.id] = user.email ?? "";
  }

  // Attach supplier purchase links: match order items to catalog products by
  // product id (new orders) or by name (orders from before ids were stored).
  const { data: products } = await admin
    .from("products")
    .select("id, name, aliexpress_url");
  type OrderItem = { name: string; productId?: string; [key: string]: unknown };
  const withSupplier = (items: OrderItem[]) =>
    (items ?? []).map((item) => {
      const product = (products ?? []).find(
        (candidate) =>
          candidate.id === item.productId || candidate.name === item.name,
      );
      return {
        ...item,
        product_id: product?.id ?? null,
        supplier_url: product?.aliexpress_url ?? null,
      };
    });

  return NextResponse.json({
    orders: (orders ?? []).map((order) => ({
      ...order,
      customer_email: emails[order.user_id] ?? "unknown",
      items: withSupplier(order.items),
    })),
  });
}

export async function PATCH(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const admin = adminClient();
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { id, status } = await request.json();
  const allowed = ["paid", "processing", "shipped", "delivered", "cancelled"];
  if (!id || !allowed.includes(status)) {
    return NextResponse.json(
      { error: `id and a status of ${allowed.join("/")} are required` },
      { status: 400 },
    );
  }
  const { error } = await admin.from("orders").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
