import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

const MODELS = ["llama-3.1-8b-instant", "llama3-8b-8192"];

const CATEGORY_RULES =
  'The category MUST be exactly one of: "Electronics", "Home & Garden", "Health & Wellness", "Beauty", "Sports", "Kitchen", "Toys", "Outdoor". Apply these rules: salt lamps, LED lamps, night lights, projection lights, home decor, furniture -> "Home & Garden". Eye massagers, scalp massagers, wellness and personal-care devices -> "Health & Wellness". Phone cases, USB hubs, chargers, cables, gadgets, audio -> "Electronics". Kitchen tools and cooking gadgets -> "Kitchen". Beauty tools, skincare, makeup -> "Beauty". Toys, fidget toys, stress-relief squishies -> "Toys". Sports and fitness equipment -> "Sports". Outdoor/garden lights, solar-powered gear, camping -> "Outdoor". Never invent other category names like "Garden" or "Lighting".';

const EXTRACT_PROMPT =
  'You are a product listing writer for an e-commerce store. From the AliExpress product page content provided, produce: a professional product title (concise, in English only — no Chinese characters, ALL-CAPS spam, or emoji), a detailed marketing description of AT LEAST 300 words (3-5 paragraphs covering what it is, key benefits, use cases, and build quality — use the product specs found on the page), 6-8 key feature bullet points, the original AliExpress price in USD as a number, shipping details, the seller rating if shown, and the best category. Return only valid JSON with fields: title (string), description (string, 300+ words), features (array of 6-8 strings), originalPrice (number), category (string), sellerRating (number or null), shipping (object with: minDays number, maxDays number, shipsFrom string like "China", freeShipping boolean — use the estimated delivery to the US; if not found use 10-20 days from China with freeShipping true). ' +
  CATEGORY_RULES;

const URL_ONLY_PROMPT =
  'You are a product listing writer for an e-commerce store. The product page could not be fetched; you only have the product URL, whose slug usually describes the product. Infer what the product is and write: a professional English product title, a plausible detailed description of at least 300 words, 6-8 generic but relevant feature bullet points, and the best category. Set originalPrice to 0 and sellerRating to null since they are unknown, and shipping to {"minDays":10,"maxDays":20,"shipsFrom":"China","freeShipping":true}. Return only valid JSON with fields: title, description, features (array of strings), originalPrice (number), category, sellerRating, shipping. ' +
  CATEGORY_RULES;

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMeta(html: string, property: string): string | null {
  const match =
    html.match(
      new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)`, "i"),
    ) ??
    html.match(
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"),
    );
  return match ? match[1] : null;
}

function extractImages(html: string): string[] {
  const found = new Set<string>();
  const og = extractMeta(html, "og:image");
  if (og) found.add(og.startsWith("//") ? `https:${og}` : og);
  // Product images live on alicdn; grab src / data-src / data-lazy-src values.
  const pattern = /(?:https?:)?\/\/[^"'\s)]+alicdn\.com[^"'\s)]+?\.(?:jpe?g|png|webp)/gi;
  for (const match of html.match(pattern) ?? []) {
    const cleaned = match.startsWith("//") ? `https:${match}` : match;
    // Skip tiny thumbnails and sprite assets.
    if (/_(?:50x50|64x64|80x80|100x100|120x120)/.test(cleaned)) continue;
    found.add(cleaned);
    if (found.size >= 12) break;
  }
  return [...found];
}

/**
 * AliExpress renders client-side; the real product data (title, price, sku,
 * shipping) lives in embedded script JSON like window.runParams. Pull the
 * interesting script bodies so Groq sees actual data, not an empty shell.
 */
function extractEmbeddedJson(html: string): string {
  const scripts = html.match(/<script[\s\S]*?<\/script>/gi) ?? [];
  const interesting = scripts.filter((script) =>
    /subject|priceAmount|imagePathList|deliveryDate|shippingFee|formatedAmount|storeName|evarageStar/i.test(
      script,
    ),
  );
  return interesting
    .join(" ")
    .replace(/<\/?script[^>]*>/gi, " ")
    .replace(/\s+/g, " ")
    .slice(0, 12000);
}

/** Pulls shipping/delivery snippets so they survive page-text truncation. */
function extractShippingHints(text: string): string {
  const pattern =
    /.{0,60}(?:estimated delivery|free shipping|ships? (?:from|to)|delivery in|shipping[:\s]|arrives?\s+by)[^|]{0,140}/gi;
  return [...new Set(text.match(pattern) ?? [])].slice(0, 12).join("\n");
}

function extractPriceHint(html: string): string | null {
  const match =
    html.match(/(?:US\s?\$|USD\s?)\s?(\d+(?:[.,]\d{1,2})?)/i) ??
    html.match(/"(?:minPrice|salePrice|actMinPrice)"\s*:\s*"?(\d+(?:\.\d{1,2})?)/i);
  return match ? match[1].replace(",", ".") : null;
}

/** Primary fetch — ScraperAPI rotates residential proxies past bot detection. */
async function fetchViaScraperApi(
  url: string,
  debug: string[],
  extra: string,
): Promise<string | null> {
  const apiKey = process.env.SCRAPER_API_KEY;
  if (!apiKey) {
    debug.push("scraperapi: no key");
    return null;
  }
  try {
    const response = await fetch(
      `https://api.scraperapi.com?api_key=${apiKey}&country_code=us${extra}&url=${encodeURIComponent(url)}`,
      { signal: AbortSignal.timeout(70000) },
    );
    const body = await response.text();
    debug.push(
      `scraperapi(${extra || "plain"}): ${response.status}, ${body.length} bytes, textLen=${htmlToText(body).length}, title=${JSON.stringify((extractMeta(body, "og:title") ?? body.match(/<title>([^<]*)/i)?.[1])?.slice(0, 80) ?? null)}`,
    );
    if (!response.ok) {
      debug.push(`scraperapi body: ${body.slice(0, 150)}`);
      return null;
    }
    return body;
  } catch (error) {
    debug.push(`scraperapi threw: ${error instanceof Error ? error.message : "?"}`);
    return null;
  }
}

async function fetchDirect(url: string): Promise<string | null> {
  try {
    const page = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    if (!page.ok) return null;
    return await page.text();
  } catch {
    return null;
  }
}

async function fetchViaProxy(url: string): Promise<string | null> {
  try {
    const proxied = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
      { signal: AbortSignal.timeout(25000) },
    );
    if (!proxied.ok) return null;
    const data = await proxied.json();
    return typeof data.contents === "string" ? data.contents : null;
  } catch {
    return null;
  }
}

/** Free reader proxy — renders the page and returns markdown/plain text. */
async function fetchViaReader(url: string): Promise<string | null> {
  try {
    const response = await fetch(`https://r.jina.ai/${url}`, {
      headers: { Accept: "text/plain" },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

const VALID_CATEGORIES = [
  "Electronics", "Home & Garden", "Health & Wellness", "Beauty",
  "Sports", "Kitchen", "Toys", "Outdoor",
];

/** Coerces whatever the model returned onto the real category list. */
function normalizeCategory(raw: unknown): string {
  const value = String(raw ?? "").trim().toLowerCase();
  const exact = VALID_CATEGORIES.find((c) => c.toLowerCase() === value);
  if (exact) return exact;
  if (/garden|home|lamp|light|decor|furnit/.test(value)) return "Home & Garden";
  if (/health|wellness|massag|care/.test(value)) return "Health & Wellness";
  if (/beauty|skin|makeup|cosmetic/.test(value)) return "Beauty";
  if (/sport|fitness|gym/.test(value)) return "Sports";
  if (/kitchen|cook|bak/.test(value)) return "Kitchen";
  if (/toy|fidget|game/.test(value)) return "Toys";
  if (/outdoor|camp|solar|hik/.test(value)) return "Outdoor";
  return "Electronics";
}

async function askGroq(
  groqKey: string,
  system: string,
  user: string,
): Promise<{ extracted: Record<string, unknown>; model: string } | null> {
  for (const model of MODELS) {
    try {
      const completion = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
        signal: AbortSignal.timeout(30000),
      });
      const data = await completion.json();
      if (!completion.ok) continue;
      return { extracted: JSON.parse(data.choices[0].message.content), model };
    } catch {
      // Try the next model.
    }
  }
  return null;
}

export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return NextResponse.json({ error: "GROQ_API_KEY is not set" }, { status: 500 });
  }

  let url: string;
  try {
    ({ url } = await request.json());
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Layer 1: direct fetch. Layer 2: allorigins proxy (different egress IP, so
  // AliExpress bot detection often lets it through).
  // A fetch only counts if it returned the actual product page — AliExpress
  // sometimes serves proxies a generic homepage or captcha instead. The
  // client-rendered shell still counts when its <title>/og:title names a real
  // product, since the embedded script JSON carries the product data.
  const itemId = url.match(/item\/(\d+)/)?.[1];
  const pageTitle = (h: string | null) =>
    (h && (extractMeta(h, "og:title") ?? h.match(/<title>([^<]*)/i)?.[1])) || "";
  const hasRealTitle = (h: string | null) => {
    const title = pageTitle(h).trim();
    return title.length >= 12 && !/^aliexpress/i.test(title);
  };
  const looksBlocked = (h: string | null) =>
    !h ||
    /captcha|punish|denied/i.test(h.slice(0, 4000)) ||
    (!hasRealTitle(h) &&
      (htmlToText(h).length < 500 || (itemId !== undefined && !h.includes(itemId))));

  const debug: string[] = [];
  let html = await fetchViaScraperApi(url, debug, "");
  let via = "scraperapi";
  if (looksBlocked(html)) {
    debug.push(`${via} blocked/insufficient`);
    html = await fetchDirect(url);
    via = "direct";
  }
  if (looksBlocked(html)) {
    debug.push(`${via} blocked/insufficient`);
    html = await fetchViaProxy(url);
    via = "proxy";
  }
  if (looksBlocked(html)) {
    debug.push(`${via} blocked/insufficient`);
    html = await fetchViaReader(url);
    via = "reader";
  }

  if (!looksBlocked(html) && html) {
    const title = extractMeta(html, "og:title") ?? html.match(/<h1[^>]*>([^<]+)/i)?.[1] ?? "";
    const images = extractImages(html);
    const priceHint = extractPriceHint(html);
    const text = htmlToText(html);
    const embedded = extractEmbeddedJson(html);
    const shippingHints = extractShippingHints(`${text} ${embedded}`);
    const pageText = [
      title && `PAGE TITLE: ${title}`,
      priceHint && `PRICE FOUND ON PAGE: $${priceHint} USD`,
      shippingHints && `SHIPPING SNIPPETS FROM PAGE:\n${shippingHints}`,
      embedded && `EMBEDDED PRODUCT DATA (JSON from page scripts):\n${embedded}`,
      text.slice(0, 8000),
    ]
      .filter(Boolean)
      .join("\n\n");

    const result = await askGroq(groqKey, EXTRACT_PROMPT, pageText);
    const extractedTitle = String(result?.extracted.title ?? "");
    const junkTitle = /aliexpress\s+(official|website)|^aliexpress$|login|captcha/i.test(
      extractedTitle,
    );
    if (result && !junkTitle) {
      result.extracted.category = normalizeCategory(result.extracted.category);
      return NextResponse.json({
        product: result.extracted,
        images,
        source: via,
        model: result.model,
        debug,
      });
    }
  }

  // Layer 3: never fail — generate a best-guess listing from the URL alone.
  const result = await askGroq(groqKey, URL_ONLY_PROMPT, `Product URL: ${url}`);
  if (result) {
    result.extracted.category = normalizeCategory(result.extracted.category);
    return NextResponse.json({
      product: result.extracted,
      images: [],
      source: "url-only",
      model: result.model,
      debug,
    });
  }

  return NextResponse.json(
    { error: "Import is temporarily unavailable (Groq unreachable)" },
    { status: 502 },
  );
}
