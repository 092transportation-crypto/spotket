import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "product-images";

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

/** External http(s) image that isn't already in our Supabase storage. */
export function isExternalImageUrl(url: string | null | undefined): url is string {
  return (
    typeof url === "string" &&
    /^https?:\/\//i.test(url) &&
    !url.includes(".supabase.co/")
  );
}

/**
 * Downloads external image URLs and rehosts them in the public
 * product-images bucket under the product's id. Returns the same-length
 * array with rehosted URLs; a failed download keeps the original URL so
 * the image never breaks.
 */
export async function rehostUrls(
  admin: SupabaseClient,
  productId: string,
  urls: string[],
): Promise<{ urls: string[]; rehosted: number; failed: number }> {
  let rehosted = 0;
  let failed = 0;
  const out: string[] = [];
  const stamp = Date.now();

  for (const [index, url] of urls.entries()) {
    if (!isExternalImageUrl(url)) {
      out.push(url);
      continue;
    }
    try {
      const response = await fetch(url, {
        headers: { Referer: "https://www.aliexpress.com/" },
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw new Error(`fetch ${response.status}`);
      const contentType = (response.headers.get("content-type") ?? "image/jpeg").split(";")[0];
      const extension = EXTENSIONS[contentType] ?? "jpg";
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.length < 500) throw new Error("suspiciously small file");
      const path = `${productId}/${stamp}-${index}.${extension}`;
      const { error } = await admin.storage
        .from(BUCKET)
        .upload(path, bytes, { contentType, upsert: true });
      if (error) throw new Error(error.message);
      out.push(admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
      rehosted += 1;
    } catch (rehostError) {
      console.error(`[rehost] ${productId} image ${index}:`, rehostError);
      out.push(url);
      failed += 1;
    }
  }
  return { urls: out, rehosted, failed };
}
