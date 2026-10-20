/**
 * Thin Supabase wrapper. Every exported helper degrades gracefully when
 * SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY aren't set yet (pre-launch, or a
 * preview deploy without secrets) — reads return safe defaults, writes
 * no-op and log, nothing ever throws past the caller. This lets every
 * route that depends on these helpers ship and deploy before the Supabase
 * project exists.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null | undefined;

function getClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;
  // NEXT_PUBLIC_SUPABASE_URL is accepted as a fallback — this project already
  // has a Supabase project configured under that name (pre-dating this
  // agent system) with a working SUPABASE_SERVICE_ROLE_KEY alongside it.
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.log("Supabase not configured (SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY unset) — skipping.");
    cachedClient = null;
    return null;
  }
  cachedClient = createClient(url, key, { auth: { persistSession: false } });
  return cachedClient;
}

export type AgentName =
  | "sales_agent"
  | "blog_agent"
  | "landing_page_agent"
  | "lead_follow_up_agent";

/** Defaults to true (agent runs) when Supabase isn't configured yet, or the row is missing. */
export async function isAgentEnabled(agent: AgentName): Promise<boolean> {
  const client = getClient();
  if (!client) return true;
  try {
    const { data, error } = await client
      .from("agent_settings")
      .select("enabled")
      .eq("agent_name", agent)
      .maybeSingle();
    if (error) {
      console.error(`isAgentEnabled(${agent}) query failed:`, error.message);
      return true;
    }
    return data ? Boolean(data.enabled) : true;
  } catch (err) {
    console.error(`isAgentEnabled(${agent}) threw:`, (err as Error).message);
    return true;
  }
}

export async function setAgentEnabled(agent: AgentName, enabled: boolean): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  try {
    const { error } = await client
      .from("agent_settings")
      .upsert({ agent_name: agent, enabled, updated_at: new Date().toISOString() });
    if (error) {
      console.error(`setAgentEnabled(${agent}) failed:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`setAgentEnabled(${agent}) threw:`, (err as Error).message);
    return false;
  }
}

export async function listAgentSettings(): Promise<Array<{ agent_name: string; enabled: boolean; updated_at: string }>> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client.from("agent_settings").select("*").order("agent_name");
  if (error) {
    console.error("listAgentSettings failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function logActivity(agent: AgentName, message: string, level: "info" | "warn" | "error" = "info"): Promise<void> {
  const client = getClient();
  console.log(`[${agent}] ${level.toUpperCase()}: ${message}`);
  if (!client) return;
  try {
    const { error } = await client.from("agent_activity_log").insert({ agent_name: agent, message, level });
    if (error) console.error("logActivity insert failed:", error.message);
  } catch (err) {
    console.error("logActivity threw:", (err as Error).message);
  }
}

export async function recentActivity(limit = 50) {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from("agent_activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("recentActivity failed:", error.message);
    return [];
  }
  return data ?? [];
}

export interface NewLead {
  name: string;
  business_name?: string;
  phone: string;
  email?: string;
  recommended_package?: string;
  source: string;
  business_type?: string;
  website_url?: string;
  revenue_range?: string;
  biggest_challenge?: string;
  heard_about_us?: string;
  message?: string;
}

export async function insertLead(lead: NewLead): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  try {
    const { error } = await client.from("leads").insert(lead);
    if (error) {
      console.error("insertLead failed:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("insertLead threw:", (err as Error).message);
    return false;
  }
}

export async function leadStats() {
  const client = getClient();
  if (!client) return { totalLeads: 0, followUpsSent: 0 };
  const [{ count: totalLeads }, { count: followUpsSent }] = await Promise.all([
    client.from("leads").select("*", { count: "exact", head: true }),
    client.from("leads").select("*", { count: "exact", head: true }).eq("followed_up", true),
  ]);
  return { totalLeads: totalLeads ?? 0, followUpsSent: followUpsSent ?? 0 };
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function contentStats() {
  const client = getClient();
  if (!client) return { blogPosts: 0, blogPostsThisWeek: 0, landingPages: 0, landingPagesThisWeek: 0 };
  const since = new Date(Date.now() - WEEK_MS).toISOString();
  const [{ count: blogPosts }, { count: blogPostsThisWeek }, { count: landingPages }, { count: landingPagesThisWeek }] =
    await Promise.all([
      client.from("blog_posts").select("*", { count: "exact", head: true }),
      client.from("blog_posts").select("*", { count: "exact", head: true }).gte("published_at", since),
      client.from("landing_pages").select("*", { count: "exact", head: true }),
      client.from("landing_pages").select("*", { count: "exact", head: true }).gte("published_at", since),
    ]);
  return {
    blogPosts: blogPosts ?? 0,
    blogPostsThisWeek: blogPostsThisWeek ?? 0,
    landingPages: landingPages ?? 0,
    landingPagesThisWeek: landingPagesThisWeek ?? 0,
  };
}

export async function listBlogPosts() {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client.from("blog_posts").select("*").order("published_at", { ascending: false });
  if (error) {
    console.error("listBlogPosts failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getBlogPost(slug: string) {
  const client = getClient();
  if (!client) return null;
  const { data, error } = await client.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.error("getBlogPost failed:", error.message);
    return null;
  }
  return data;
}

export async function lastBlogTopics(limit = 3): Promise<string[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from("blog_posts")
    .select("topic")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map((row) => row.topic).filter((t): t is string => Boolean(t));
}

export async function insertBlogPost(post: {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  topic: string;
}): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  const { error } = await client.from("blog_posts").insert(post);
  if (error) {
    console.error("insertBlogPost failed:", error.message);
    return false;
  }
  return true;
}

export async function listLandingPages() {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client.from("landing_pages").select("*").order("published_at", { ascending: false });
  if (error) {
    console.error("listLandingPages failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getLandingPage(slug: string) {
  const client = getClient();
  if (!client) return null;
  const { data, error } = await client.from("landing_pages").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.error("getLandingPage failed:", error.message);
    return null;
  }
  return data;
}

export async function existingBusinessTypes(): Promise<string[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client.from("landing_pages").select("business_type");
  if (error || !data) return [];
  return [...new Set(data.map((row) => row.business_type))];
}

export async function insertLandingPage(page: {
  slug: string;
  business_type: string;
  page_type: string;
  title: string;
  content: string;
}): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  const { error } = await client.from("landing_pages").insert(page);
  if (error) {
    console.error("insertLandingPage failed:", error.message);
    return false;
  }
  return true;
}

export async function leadsDueForFollowUp() {
  const client = getClient();
  if (!client) return [];
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await client
    .from("leads")
    .select("*")
    .lt("created_at", cutoff)
    .eq("followed_up", false)
    .eq("contacted", false);
  if (error) {
    console.error("leadsDueForFollowUp failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function markFollowedUp(id: string): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  const { error } = await client.from("leads").update({ followed_up: true }).eq("id", id);
  if (error) {
    console.error("markFollowedUp failed:", error.message);
    return false;
  }
  return true;
}

/** Test-only escape hatch to reset the cached client between test cases. */
export function _resetSupabaseClientForTests(): void {
  cachedClient = undefined;
}
