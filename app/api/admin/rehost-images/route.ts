import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { adminClient } from "@/lib/catalog";

const BUCKET = "product-images";

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

function isExternalSupplierUrl(url: string | null | undefined): url is string {
  return typeof url === "string" && /alicdn\.com/i.test(url);
}

/**
 * Downloads supplier-hosted (alicdn) product images and rehosts them in the
 * public Supabase Storage bucket so customers never see AliExpress URLs.
 * Idempotent: already-rehosted URLs are left alone; failures keep the
 * original URL rather than breaking the image.
 */
export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const admin = adminClient();
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  // Bucket is created on first run; "already exists" is fine.
  await admin.storage
    .createBucket(BUCKET, { public: true })
    .catch(() => undefined);

  const { data: products, error } = await admin.from("products").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const summary: Record<string, { rehosted: number; failed: number }> = {};

  for (const product of products ?? []) {
    let rehosted = 0;
    let failed = 0;

    const rehost = async (url: string, index: number): Promise<string> => {
      try {
        const response = await fetch(url, {
          headers: { Referer: "https://www.aliexpress.com/" },
          signal: AbortSignal.timeout(30000),
        });
        if (!response.ok) throw new Error(`fetch ${response.status}`);
        const contentType = response.headers.get("content-type") ?? "image/jpeg";
        const extension = EXTENSIONS[contentType.split(";")[0]] ?? "jpg";
        const bytes = new Uint8Array(await response.arrayBuffer());
        if (bytes.length < 500) throw new Error("suspiciously small file");
        const path = `${product.id}/${index}.${extension}`;
        const { error: uploadError } = await admin.storage
          .from(BUCKET)
          .upload(path, bytes, { contentType, upsert: true });
        if (uploadError) throw new Error(uploadError.message);
        rehosted += 1;
        return admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      } catch (rehostError) {
        console.error(`[rehost] ${product.id} image ${index}:`, rehostError);
        failed += 1;
        return url; // keep the working original rather than break the image
      }
    };

    const update: { image?: string; images?: string[] } = {};
    if (isExternalSupplierUrl(product.image)) {
      update.image = await rehost(product.image, 0);
    }
    if (Array.isArray(product.images) && product.images.some(isExternalSupplierUrl)) {
      const next: string[] = [];
      for (const [index, imageUrl] of (product.images as string[]).entries()) {
        next.push(
          isExternalSupplierUrl(imageUrl) ? await rehost(imageUrl, index + 1) : imageUrl,
        );
      }
      update.images = next;
    }

    if (Object.keys(update).length > 0) {
      await admin.from("products").update(update).eq("id", product.id);
    }
    if (rehosted > 0 || failed > 0) {
      summary[product.name.slice(0, 40)] = { rehosted, failed };
    }
  }

  return NextResponse.json({ ok: true, summary });
}
