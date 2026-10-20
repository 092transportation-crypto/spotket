import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyCronAuth } from "@/lib/auth";
import { callAnthropic, extractText, slugify } from "@/lib/anthropic";
import { insertBlogPost, isAgentEnabled, lastBlogTopics, logActivity } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const TOPICS = [
  "AI automation for small businesses",
  "how to get more Google reviews",
  "limo company marketing",
  "chatbot benefits",
  "SEO tips",
];

function pickTopic(recent: string[]): string {
  const available = TOPICS.filter((t) => !recent.includes(t));
  const pool = available.length > 0 ? available : TOPICS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request.headers.get("authorization"))) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const enabled = await isAgentEnabled("blog_agent");
  if (!enabled) {
    await logActivity("blog_agent", "Skipped — agent disabled");
    return NextResponse.json({ skipped: true });
  }

  const recentTopics = await lastBlogTopics(3);
  const topic = pickTopic(recentTopics);

  const system = `You write SEO-optimized blog posts for Spotket, an AI automation and web design agency for small businesses. Output ONLY valid JSON (no markdown fences, no commentary) matching exactly:
{"title": string, "metaDescription": string (<=160 chars), "excerpt": string (1-2 sentences), "bodyMarkdown": string (800-1200 words, uses ## for H2 section headings, ends with a short call-to-action to visit /contact)}`;

  const result = await callAnthropic({
    system,
    messages: [{ role: "user", content: `Write a blog post about: ${topic}` }],
    maxTokens: 4096,
  });

  if (!result) {
    await logActivity("blog_agent", "Skipped — ANTHROPIC_API_KEY not configured or API call failed", "warn");
    return NextResponse.json({ skipped: true });
  }

  const raw = extractText(result.content);
  let parsed: { title?: string; metaDescription?: string; excerpt?: string; bodyMarkdown?: string };
  try {
    parsed = JSON.parse(raw);
  } catch {
    await logActivity("blog_agent", "Failed to parse model output as JSON", "error");
    return NextResponse.json({ detail: "Model output was not valid JSON" }, { status: 502 });
  }

  if (!parsed.title || !parsed.bodyMarkdown) {
    await logActivity("blog_agent", "Model output missing required fields", "error");
    return NextResponse.json({ detail: "Model output missing required fields" }, { status: 502 });
  }

  const slug = `${slugify(parsed.title)}-${Date.now().toString(36)}`;
  const ok = await insertBlogPost({
    slug,
    title: parsed.title,
    excerpt: parsed.excerpt || parsed.metaDescription || "",
    content: parsed.bodyMarkdown,
    topic,
  });

  if (!ok) {
    await logActivity("blog_agent", `Generated "${parsed.title}" but Supabase insert failed (not configured yet?)`, "warn");
    return NextResponse.json({ detail: "Supabase insert failed" }, { status: 502 });
  }

  await logActivity("blog_agent", `Published "${parsed.title}" (/blog/${slug})`);
  return NextResponse.json({ ok: true, slug, title: parsed.title });
}
