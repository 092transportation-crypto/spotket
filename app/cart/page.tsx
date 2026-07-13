import type { Metadata } from "next";
import CartView from "@/components/CartView";
import ProductRow from "@/components/ProductRow";
import { getCatalog } from "@/lib/catalog";
import { getBestSellers } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Cart",
  description:
    "Review your Spotket cart, update quantities, and check out securely. Free shipping on orders over $35.",
};

export default async function CartPage() {
  const catalog = await getCatalog();
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Your Cart</h1>
        <div className="mt-8">
          <CartView />
        </div>
      </div>
      <ProductRow
        title="Customers also bought"
        products={getBestSellers(catalog).slice(0, 4)}
      />
    </>
  );
}
