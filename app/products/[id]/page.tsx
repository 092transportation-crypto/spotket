import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import ProductRow from "@/components/ProductRow";
import { getCatalog } from "@/lib/catalog";
import { getProduct, getRelated } from "@/lib/products";
import { getProductReviews } from "@/lib/reviews";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id, await getCatalog());
  if (!product) {
    return { title: "Product Not Found" };
  }
  return {
    title: product.brand ? `${product.name} — ${product.brand}` : product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image ? [product.image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const catalog = await getCatalog();
  const product = getProduct(id, catalog);
  if (!product) notFound();

  const related = getRelated(product, catalog);
  // Customer reviews from the database lead (newest first); any legacy
  // reviews stored on the product row follow.
  const dbReviews = await getProductReviews(product.id);
  const merged = { ...product, reviews: [...dbReviews, ...(product.reviews ?? [])] };

  return (
    <>
      <ProductDetail product={merged} />
      <ProductRow title="Customers also bought" products={related} scroll />
    </>
  );
}
