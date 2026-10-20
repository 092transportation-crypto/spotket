import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyCronAuth } from "@/lib/auth";
import { callAnthropic, extractText, slugify } from "@/lib/anthropic";
import { existingBusinessTypes, insertLandingPage, isAgentEnabled, logActivity } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const CANDIDATE_BUSINESS_TYPES = [
  "limo companies",
  "dentists",
  "HVAC companies",
  "roofers",
  "law firms",
  "real estate agents",
  "restaurants",
  "auto repair shops",
  "salons and spas",
  "landscaping companies",
  "plumbers",
  "chiropractors",
  "med spas",
  "moving companies",
  "pest control companies",
];

const PAGE_TYPES: Array<{ pageType: string; titleTemplate: (bt: string) => string }> = [
  { pageType: "ai-automation", titleTemplate: (bt) => `AI Automation for ${bt}` },
  { pageType: "chatbot", titleTemplate: (bt) => `Chatbot for ${bt}` },
  { pageType: "seo", titleTemplate: (bt) => `SEO Services for ${bt}` },
];

export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request.headers.get("authorization"))) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const enabled = await isAgentEnabled("landing_page_agent");
  if (!enabled) {
    await logActivity("landing_page_agent", "Skipped — agent disabled");
    return NextResponse.json({ skipped: true });
  }

  const covered = new Set(await existingBusinessTypes());
  const available = CANDIDATE_BUSINESS_TYPES.filter((bt) => !covered.has(bt));
  const businessType = (available.length > 0 ? available : CANDIDATE_BUSINESS_TYPES)[0];

  const created: string[] = [];
  const failures: string[] = [];

  for (const { pageType, titleTemplate } of PAGE_TYPES) {
    const title = titleTemplate(businessType);
    const system = `You write landing page copy for Spotket, an AI automation and web design agency for small businesses. Output ONLY valid JSON (no markdown fences, no commentary) matching exactly:
{"bodyMarkdown": string (500-800 words, uses ## for H2 section headings, ends with a call-to-action to visit /contact)}`;

    const result = await callAnthropic({
      system,
      messages: [{ role: "user", content: `Write landing page copy titled: "${title}"` }],
      maxTokens: 3072,
    });

    if (!result) {
      failures.push(title);
      continue;
    }

    const raw = extractText(result.content);
    let parsed: { bodyMarkdown?: string };
    try {
      parsed = JSON.parse(raw);
    } catch {
      failures.push(title);
      continue;
    }
    if (!parsed.bodyMarkdown) {
      failures.push(title);
      continue;
    }

    const slug = `${pageType}-${slugify(businessType)}`;
    const ok = await insertLandingPage({
      slug,
      business_type: businessType,
      page_type: pageType,
      title,
      content: parsed.bodyMarkdown,
    });
    if (ok) created.push(slug);
    else failures.push(title);
  }

  if (failures.length > 0) {
    await logActivity(
      "landing_page_agent",
      `Created ${created.length}/3 pages for "${businessType}" (${failures.length} failed — check ANTHROPIC_API_KEY/Supabase config)`,
      created.length > 0 ? "warn" : "error",
    );
  } else {
    await logActivity("landing_page_agent", `Created 3 pages for "${businessType}": ${created.join(", ")}`);
  }

  return NextResponse.json({ businessType, created, failures });
}
