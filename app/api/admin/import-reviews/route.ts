import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { adminClient } from "@/lib/catalog";
import { REVIEWER_PSEUDONYMS } from "@/lib/reviews";

const SOURCE_LABEL = "— Verified buyer on supplier marketplace";
const MAX_REVIEWS = 50;
const PAGE_SIZE = 20;

type FeedbackItem = {
  buyerName?: string;
  buyerCountry?: string;
  buyerEval?: number;
  buyerFeedback?: string;
  buyerTranslationFeedback?: string;
  evalDate?: string;
};

/** Follows shortener redirects (tinyurl etc.) to the real AliExpress URL. */
async function resolveUrl(url: string, debug: string[]): Promise<string> {
  if (/aliexpress\.[a-z.]+\/item\//i.test(url)) return url;
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
      signal: AbortSignal.timeout(20000),
    });
    // response.url is the end of the redirect chain even if the page 403s.
    debug.push(`resolved ${url.slice(0, 40)} -> ${response.url.slice(0, 90)}`);
    return response.url || url;
  } catch (error) {
    debug.push(`redirect resolution failed: ${error instanceof Error ? error.message : "?"}`);
    return url;
  }
}

/**
 * aliexpress.us item ids are the global item id plus 2^51; the feedback API
 * only knows the global id, so offer both forms.
 */
const US_ID_OFFSET = BigInt("2251799813685248");
function candidateItemIds(itemId: string): string[] {
  const ids = [itemId];
  try {
    const big = BigInt(itemId);
    if (big > US_ID_OFFSET) ids.push((big - US_ID_OFFSET).toString());
  } catch {
    // Not numeric — keep as-is.
  }
  return ids;
}

function feedbackUrl(itemId: string, page: number): string {
  return `https://feedback.aliexpress.com/pc/searchEvaluation.do?productId=${itemId}&lang=en_US&country=US&page=${page}&pageSize=${PAGE_SIZE}&filter=all&sort=complex_default`;
}

async function fetchFeedbackPage(
  itemId: string,
  page: number,
  debug: string[],
): Promise<FeedbackItem[]> {
  const url = feedbackUrl(itemId, page);
  const attempts: { name: string; target: string }[] = [
    { name: "direct", target: url },
  ];
  const scraperKey = process.env.SCRAPER_API_KEY;
  if (scraperKey) {
    attempts.push({
      name: "scraperapi",
      target: `https://api.scraperapi.com?api_key=${scraperKey}&url=${encodeURIComponent(url)}`,
    });
  }
  for (const attempt of attempts) {
    try {
      const response = await fetch(attempt.target, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(45000),
      });
      const text = await response.text();
      const parsed = JSON.parse(text);
      const list: FeedbackItem[] = parsed?.data?.evaViewList ?? [];
      debug.push(`page ${page} via ${attempt.name}: ${response.status}, ${list.length} reviews`);
      return list;
    } catch (error) {
      debug.push(
        `page ${page} via ${attempt.name} failed: ${
          error instanceof Error ? error.message.slice(0, 80) : "?"
        }`,
      );
    }
  }
  return [];
}

/** Fetches the product page and extracts the total units sold, if shown. */
async function fetchSoldCount(sourceUrl: string, debug: string[]): Promise<number | null> {
  const apiKey = process.env.SCRAPER_API_KEY;
  if (!apiKey) return null;
  try {
    const response = await fetch(
      `https://api.scraperapi.com?api_key=${apiKey}&country_code=us&url=${encodeURIComponent(sourceUrl)}`,
      { signal: AbortSignal.timeout(70000) },
    );
    const html = await response.text();
    const match =
      html.match(/"tradeCount"\s*:\s*"?([\d,]+)/i) ??
      html.match(/"formatTradeCount"\s*:\s*"([\d,.]+)/i) ??
      html.match(/([\d,]{2,})\+?\s*(?:sold|orders)/i);
    const count = match ? parseInt(match[1].replace(/[,.]/g, ""), 10) : NaN;
    debug.push(`sold count: ${Number.isFinite(count) ? count : "not found"}`);
    return Number.isFinite(count) && count > 0 ? count : null;
  } catch (error) {
    debug.push(`sold count fetch failed: ${error instanceof Error ? error.message.slice(0, 60) : "?"}`);
    return null;
  }
}

/**
 * First name only, cleaned of masking artifacts. Anonymous buyers (shown by
 * AliExpress as "AliExpress Shopper") get a display pseudonym instead.
 */
function displayName(raw: string | undefined, seed: number): string {
  const first = String(raw ?? "").trim().split(/\s+/)[0] ?? "";
  const cleaned = first.replace(/[^A-Za-z0-9*.]/g, "");
  if (cleaned.length === 0 || /aliexpress/i.test(cleaned)) {
    return REVIEWER_PSEUDONYMS[seed % REVIEWER_PSEUDONYMS.length];
  }
  return cleaned;
}

function parseDate(raw: string | undefined, index: number): string {
  if (raw) {
    const parsed = Date.parse(raw);
    if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();
  }
  // No usable date — spread deterministically over the last 6 months.
  const daysAgo = 3 + ((index * 37) % 180);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

type ImportResult = {
  ok: boolean;
  imported?: number;
  rating?: number;
  reviewCount?: number;
  soldCount?: number | null;
  error?: string;
  debug: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function importForProduct(
  admin: any,
  product: any,
  urlOverride?: string,
  resetOnEmpty = false,
): Promise<ImportResult> {
  const debug: string[] = [];
  const rawUrl: string | undefined = urlOverride || product.aliexpress_url;
  if (!rawUrl) {
    return { ok: false, error: "No AliExpress URL on this product — set one first (Edit → AliExpress URL)", debug };
  }
  const sourceUrl = await resolveUrl(rawUrl, debug);
  const itemId = sourceUrl.match(/item\/(\d+)/)?.[1];
  if (!itemId) {
    console.error("[import-reviews] no item id after resolution:", { rawUrl, sourceUrl });
    return {
      ok: false,
      error: `Couldn't find an AliExpress item id in ${sourceUrl.slice(0, 80)} — paste the full product link`,
      debug,
    };
  }

  // Pick whichever id form the feedback API recognizes (US ids need the
  // 2^51 offset removed), then page through it.
  let bestId = itemId;
  let collected: FeedbackItem[] = [];
  for (const candidate of candidateItemIds(itemId)) {
    const items = await fetchFeedbackPage(candidate, 1, debug);
    if (items.length > collected.length) {
      collected = items;
      bestId = candidate;
    }
    if (items.length >= PAGE_SIZE / 2) break;
  }
  for (let page = 2; page <= 3 && collected.length > 0 && collected.length < MAX_REVIEWS; page += 1) {
    const items = await fetchFeedbackPage(bestId, page, debug);
    if (items.length === 0) break;
    collected.push(...items);
  }
  const usable = collected
    .map((item, index) => ({
      name: displayName(item.buyerName, index),
      country: item.buyerCountry,
      rating: Math.min(5, Math.max(1, Math.round((item.buyerEval ?? 100) / 20))),
      text: String(item.buyerTranslationFeedback || item.buyerFeedback || "").trim(),
      date: item.evalDate,
    }))
    .filter((item) => item.text.length >= 3)
    .slice(0, MAX_REVIEWS);

  if (usable.length === 0) {
    if (resetOnEmpty) {
      // Nothing importable — reset the product to the reviews that really
      // exist: drop old supplier imports and legacy seeded reviews, keep
      // genuine Spotket customer reviews, recompute honestly.
      await admin
        .from("reviews")
        .delete()
        .eq("product_id", product.id)
        .like("body", `%${SOURCE_LABEL}`);
      const { data: remaining } = await admin
        .from("reviews")
        .select("rating")
        .eq("product_id", product.id);
      const kept = (remaining ?? []).map((review: { rating: number }) => Number(review.rating));
      const keptAvg =
        kept.length > 0
          ? Math.round((kept.reduce((a: number, b: number) => a + b, 0) / kept.length) * 10) / 10
          : 0;
      await admin
        .from("products")
        .update({ rating: keptAvg, review_count: kept.length, reviews: null })
        .eq("id", product.id);
      debug.push("reset to real review data (no supplier reviews importable)");
      return { ok: true, imported: 0, rating: keptAvg, reviewCount: kept.length, debug };
    }
    console.error("[import-reviews] zero reviews:", { sourceUrl, debug });
    return { ok: false, error: "No reviews found — try a different URL", debug };
  }

  // Re-import is idempotent: replace previously imported supplier reviews.
  await admin
    .from("reviews")
    .delete()
    .eq("product_id", product.id)
    .like("body", `%${SOURCE_LABEL}`);

  const rows = usable.map((item, index) => ({
    product_id: product.id,
    user_id: null,
    rating: item.rating,
    title: "",
    body: `${item.text}${item.country ? ` (${item.country})` : ""}\n\n${SOURCE_LABEL}`,
    name: item.name,
    verified_purchase: false,
    created_at: parseDate(item.date, index),
  }));
  const { error: insertError } = await admin.from("reviews").insert(rows);
  if (insertError) {
    return { ok: false, error: insertError.message, debug };
  }

  // Importing resets the product to real data only: legacy reviews stored on
  // the product row (pre-import seed data) are cleared, and rating/count
  // recompute from the reviews table — freshly imported supplier reviews
  // plus any genuine Spotket customer reviews.
  const { data: allReviews } = await admin
    .from("reviews")
    .select("rating")
    .eq("product_id", product.id);
  const ratings = (allReviews ?? []).map((review: { rating: number }) => Number(review.rating));
  const count = ratings.length;
  const average =
    count > 0
      ? Math.round((ratings.reduce((sum: number, value: number) => sum + value, 0) / count) * 10) / 10
      : 0;
  await admin
    .from("products")
    .update({ rating: average, review_count: count, reviews: null })
    .eq("id", product.id);

  // Sold count + source URL — tolerate older tables missing the columns.
  const soldCount = await fetchSoldCount(sourceUrl, debug);
  if (soldCount) {
    const { error: soldError } = await admin
      .from("products")
      .update({ sold_count: soldCount })
      .eq("id", product.id);
    if (soldError) debug.push(`sold_count not saved: ${soldError.message.slice(0, 80)}`);
  }
  const { error: urlError } = await admin
    .from("products")
    .update({ aliexpress_url: sourceUrl })
    .eq("id", product.id);
  if (urlError) debug.push(`aliexpress_url not saved: ${urlError.message.slice(0, 80)}`);

  return { ok: true, imported: rows.length, rating: average, reviewCount: count, soldCount, debug };
}

export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const admin = adminClient();
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  let body: { productId?: string; url?: string; all?: boolean; resetOnEmpty?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Bulk mode: every product that has a stored AliExpress URL.
  if (body.all) {
    const { data: withUrls, error } = await admin
      .from("products")
      .select("*")
      .not("aliexpress_url", "is", null);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const results: Record<string, ImportResult> = {};
    for (const product of withUrls ?? []) {
      results[product.name.slice(0, 50)] = await importForProduct(admin, product);
    }
    return NextResponse.json({ ok: true, results });
  }

  if (!body.productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }
  const { data: product, error: productError } = await admin
    .from("products")
    .select("*")
    .eq("id", body.productId)
    .single();
  if (productError || !product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const result = await importForProduct(admin, product, body.url, body.resetOnEmpty ?? false);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
