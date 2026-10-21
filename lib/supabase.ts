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
  | "lead_follow_up_agent"
  | "email_campaign_agent"
  | "lead_finder_agent";

export const AGENT_NAMES: AgentName[] = [
  "sales_agent",
  "blog_agent",
  "landing_page_agent",
  "lead_follow_up_agent",
  "email_campaign_agent",
  "lead_finder_agent",
];

export function isAgentName(value: string): value is AgentName {
  return (AGENT_NAMES as string[]).includes(value);
}

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

/** Full (capped) log history for one agent, newest first — powers the per-agent terminal view. */
export async function activityForAgent(agent: AgentName, limit = 300) {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from("agent_activity_log")
    .select("*")
    .eq("agent_name", agent)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error(`activityForAgent(${agent}) failed:`, error.message);
    return [];
  }
  return data ?? [];
}

/** Count of this agent's log entries in the last 24h (a rolling window, not calendar-day). */
export async function actionsLast24h(agent: AgentName): Promise<number> {
  const client = getClient();
  if (!client) return 0;
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error } = await client
    .from("agent_activity_log")
    .select("*", { count: "exact", head: true })
    .eq("agent_name", agent)
    .gte("created_at", since);
  if (error) {
    console.error(`actionsLast24h(${agent}) failed:`, error.message);
    return 0;
  }
  return count ?? 0;
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
  google_place_id?: string;
  yelp_business_id?: string;
  rapidapi_business_id?: string;
}

export const LEAD_STATUSES = ["New", "Called", "Interested", "Closed", "Lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface Lead {
  id: string;
  name: string | null;
  business_name: string | null;
  business_type: string | null;
  phone: string | null;
  email: string | null;
  recommended_package: string | null;
  status: LeadStatus;
  notes: string | null;
  source: string | null;
  created_at: string;
}

/**
 * Most recent leads for the admin dashboard, newest first. Falls back to
 * the pre-migration column set if `status`/`notes` don't exist yet (see
 * supabase-schema.sql — needs a re-run), so existing leads still show up
 * instead of the dashboard silently going empty.
 */
export async function listLeads(limit = 200): Promise<Lead[]> {
  const client = getClient();
  if (!client) return [];
  try {
    const { data, error } = await client
      .from("leads")
      .select("id, name, business_name, business_type, phone, email, recommended_package, status, notes, source, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (!error) return (data ?? []) as Lead[];
    console.error("listLeads failed (status/notes columns may be missing — re-run supabase-schema.sql):", error.message);
  } catch (err) {
    console.error("listLeads threw:", (err as Error).message);
  }
  try {
    const { data, error } = await client
      .from("leads")
      .select("id, name, business_name, business_type, phone, email, recommended_package, source, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.error("listLeads fallback failed:", error.message);
      return [];
    }
    return (data ?? []).map((row) => ({ ...row, status: "New" as LeadStatus, notes: null }));
  } catch (err) {
    console.error("listLeads fallback threw:", (err as Error).message);
    return [];
  }
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const client = getClient();
  if (!client) return null;
  const { data, error } = await client.from("leads").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("getLeadById failed:", error.message);
    return null;
  }
  return data as Lead | null;
}

export async function updateLead(
  id: string,
  updates: { status?: LeadStatus; notes?: string },
): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  try {
    const { error } = await client.from("leads").update(updates).eq("id", id);
    if (error) {
      console.error("updateLead failed:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("updateLead threw:", (err as Error).message);
    return false;
  }
}

export async function deleteLead(id: string): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  try {
    const { error } = await client.from("leads").delete().eq("id", id);
    if (error) {
      console.error("deleteLead failed:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("deleteLead threw:", (err as Error).message);
    return false;
  }
}

/** Every rapidapi_business_id already in the leads table — the Lead Finder Agent's dedup key. */
export async function existingRapidApiBusinessIds(): Promise<Set<string>> {
  const client = getClient();
  if (!client) return new Set();
  const { data, error } = await client.from("leads").select("rapidapi_business_id").not("rapidapi_business_id", "is", null);
  if (error) {
    console.error("existingRapidApiBusinessIds failed:", error.message);
    return new Set();
  }
  return new Set((data ?? []).map((row) => row.rapidapi_business_id as string));
}

/**
 * Every phone number already in the leads table, normalized to digits only.
 * Looser cross-source dedup backstop for the Lead Finder Agent — the same
 * real business can have a different id on Google vs. Yelp, but the same
 * phone number, so this catches what the per-source id checks can't.
 */
export async function existingPhoneNumbers(): Promise<Set<string>> {
  const client = getClient();
  if (!client) return new Set();
  const { data, error } = await client.from("leads").select("phone").not("phone", "is", null);
  if (error) {
    console.error("existingPhoneNumbers failed:", error.message);
    return new Set();
  }
  return new Set((data ?? []).map((row) => String(row.phone).replace(/\D/g, "")).filter(Boolean));
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

// ---------------------------------------------------------------------------
// Clients, payments, email campaigns, client workspace chat — the CRM layer
// on top of the agent system above. Same resilience pattern throughout:
// no Supabase configured → reads return [] / defaults, writes return false,
// nothing ever throws past the caller.
// ---------------------------------------------------------------------------

export const CLIENT_PLANS = ["Starter", "Standard", "Premium", "AI Receptionist"] as const;
export type ClientPlan = (typeof CLIENT_PLANS)[number];

export const PLAN_AMOUNTS: Record<ClientPlan, number> = {
  Starter: 300,
  Standard: 500,
  Premium: 1000,
  "AI Receptionist": 200,
};

export const PAYMENT_STATUSES = ["paid", "pending", "overdue"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const CLIENT_STATUSES = ["active", "paused", "cancelled"] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export interface Client {
  id: string;
  lead_id: string | null;
  name: string | null;
  business_name: string | null;
  phone: string | null;
  email: string | null;
  website_url: string | null;
  plan: string;
  monthly_amount: number;
  payment_status: PaymentStatus;
  status: ClientStatus;
  start_date: string;
  created_at: string;
}

export async function listClients(): Promise<Client[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client.from("clients").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("listClients failed:", error.message);
    return [];
  }
  return (data ?? []) as Client[];
}

export async function getClientById(id: string): Promise<Client | null> {
  const client = getClient();
  if (!client) return null;
  const { data, error } = await client.from("clients").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("getClientById failed:", error.message);
    return null;
  }
  return data as Client | null;
}

export async function updateClient(
  id: string,
  updates: Partial<Pick<Client, "plan" | "monthly_amount" | "payment_status" | "status" | "website_url">>,
): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  const { error } = await client.from("clients").update(updates).eq("id", id);
  if (error) {
    console.error("updateClient failed:", error.message);
    return false;
  }
  return true;
}

export async function deleteClient(id: string): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  try {
    const { error } = await client.from("clients").delete().eq("id", id);
    if (error) {
      console.error("deleteClient failed:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("deleteClient threw:", (err as Error).message);
    return false;
  }
}

/**
 * Finds an existing client by phone OR email (either match counts) — the
 * duplicate guard for both "Add Client" and "Convert Lead to Client".
 * Returns null when neither value is given, Supabase isn't configured, or
 * no match exists; never throws.
 */
export async function findClientByPhoneOrEmail(phone?: string | null, email?: string | null): Promise<Client | null> {
  const client = getClient();
  if (!client || (!phone && !email)) return null;
  const filters = [phone && `phone.eq.${phone}`, email && `email.eq.${email}`].filter(Boolean).join(",");
  if (!filters) return null;
  try {
    const { data, error } = await client.from("clients").select("*").or(filters).limit(1).maybeSingle();
    if (error) {
      console.error("findClientByPhoneOrEmail failed:", error.message);
      return null;
    }
    return data as Client | null;
  } catch (err) {
    console.error("findClientByPhoneOrEmail threw:", (err as Error).message);
    return null;
  }
}

/** Converts a lead into an active client (one click from the Leads CRM). Marks the source lead Closed. */
export async function convertLeadToClient(
  leadId: string,
  input: { plan: ClientPlan; monthly_amount?: number },
): Promise<Client | null> {
  const client = getClient();
  if (!client) return null;
  const { data: lead, error: leadError } = await client.from("leads").select("*").eq("id", leadId).maybeSingle();
  if (leadError || !lead) {
    console.error("convertLeadToClient: lead lookup failed:", leadError?.message);
    return null;
  }
  const { data: newClient, error } = await client
    .from("clients")
    .insert({
      lead_id: leadId,
      name: lead.name,
      business_name: lead.business_name,
      phone: lead.phone,
      email: lead.email,
      website_url: lead.website_url ?? null,
      plan: input.plan,
      monthly_amount: input.monthly_amount ?? PLAN_AMOUNTS[input.plan],
    })
    .select("*")
    .single();
  if (error) {
    console.error("convertLeadToClient insert failed:", error.message);
    return null;
  }
  await updateLead(leadId, { status: "Closed" });
  return newClient as Client;
}

export async function insertClient(input: {
  name?: string;
  business_name?: string;
  phone?: string;
  email?: string;
  website_url?: string;
  plan: ClientPlan;
  monthly_amount?: number;
}): Promise<Client | null> {
  const client = getClient();
  if (!client) return null;
  const { data, error } = await client
    .from("clients")
    .insert({ ...input, monthly_amount: input.monthly_amount ?? PLAN_AMOUNTS[input.plan] })
    .select("*")
    .single();
  if (error) {
    console.error("insertClient failed:", error.message);
    return null;
  }
  return data as Client;
}

export interface Payment {
  id: string;
  client_id: string | null;
  lead_id: string | null;
  plan: string;
  amount: number;
  stripe_payment_link_id: string | null;
  stripe_payment_link_url: string | null;
  status: PaymentStatus;
  created_at: string;
  paid_at: string | null;
}

export async function listPayments(): Promise<Payment[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client.from("payments").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("listPayments failed:", error.message);
    return [];
  }
  return (data ?? []) as Payment[];
}

export async function insertPayment(input: {
  client_id?: string;
  lead_id?: string;
  plan: string;
  amount: number;
  stripe_payment_link_id?: string;
  stripe_payment_link_url?: string;
}): Promise<Payment | null> {
  const client = getClient();
  if (!client) return null;
  const { data, error } = await client.from("payments").insert(input).select("*").single();
  if (error) {
    console.error("insertPayment failed:", error.message);
    return null;
  }
  return data as Payment;
}

export async function updatePaymentStatus(id: string, status: PaymentStatus): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  const updates: { status: PaymentStatus; paid_at?: string } = { status };
  if (status === "paid") updates.paid_at = new Date().toISOString();
  const { error } = await client.from("payments").update(updates).eq("id", id);
  if (error) {
    console.error("updatePaymentStatus failed:", error.message);
    return false;
  }
  return true;
}

/** Payments joined with a human-readable label (client/lead business name) — powers the Payment Tracker table. */
export async function listPaymentsEnriched(): Promise<Array<Payment & { label: string }>> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client.from("payments").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("listPaymentsEnriched failed:", error.message);
    return [];
  }
  const rows = (data ?? []) as Payment[];
  const clientIds = [...new Set(rows.map((r) => r.client_id).filter((v): v is string => Boolean(v)))];
  const leadIds = [...new Set(rows.map((r) => r.lead_id).filter((v): v is string => Boolean(v)))];
  const [{ data: clientRows }, { data: leadRows }] = await Promise.all([
    clientIds.length ? client.from("clients").select("id, business_name, name").in("id", clientIds) : Promise.resolve({ data: [] as { id: string; business_name: string | null; name: string | null }[] }),
    leadIds.length ? client.from("leads").select("id, business_name, name").in("id", leadIds) : Promise.resolve({ data: [] as { id: string; business_name: string | null; name: string | null }[] }),
  ]);
  const clientMap = new Map((clientRows ?? []).map((c) => [c.id, c.business_name || c.name || "Client"]));
  const leadMap = new Map((leadRows ?? []).map((l) => [l.id, l.business_name || l.name || "Lead"]));
  return rows.map((row) => ({
    ...row,
    label: (row.client_id && clientMap.get(row.client_id)) || (row.lead_id && leadMap.get(row.lead_id)) || "—",
  }));
}

/** Finds the payment row for a given Stripe Payment Link id (used by the webhook). */
export async function findPaymentByStripeLinkId(stripeLinkId: string): Promise<Payment | null> {
  const client = getClient();
  if (!client) return null;
  const { data, error } = await client
    .from("payments")
    .select("*")
    .eq("stripe_payment_link_id", stripeLinkId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("findPaymentByStripeLinkId failed:", error.message);
    return null;
  }
  return data as Payment | null;
}

/** MRR = sum of monthly_amount across active clients. */
export async function monthlyRecurringRevenue(): Promise<number> {
  const client = getClient();
  if (!client) return 0;
  const { data, error } = await client.from("clients").select("monthly_amount").eq("status", "active");
  if (error) {
    console.error("monthlyRecurringRevenue failed:", error.message);
    return 0;
  }
  return (data ?? []).reduce((sum, row) => sum + Number(row.monthly_amount || 0), 0);
}

/** Daily revenue (sum of paid payments) for the last `days` days, oldest first — powers the dashboard chart. */
export async function revenueLast30Days(days = 30): Promise<Array<{ date: string; amount: number }>> {
  const client = getClient();
  const buckets: Record<string, number> = {};
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets[d.toISOString().slice(0, 10)] = 0;
  }
  if (!client) return Object.entries(buckets).map(([date, amount]) => ({ date, amount }));
  const since = new Date(today);
  since.setDate(since.getDate() - (days - 1));
  const { data, error } = await client
    .from("payments")
    .select("amount, paid_at")
    .eq("status", "paid")
    .gte("paid_at", since.toISOString());
  if (error) {
    console.error("revenueLast30Days failed:", error.message);
  } else {
    for (const row of data ?? []) {
      if (!row.paid_at) continue;
      const day = String(row.paid_at).slice(0, 10);
      if (day in buckets) buckets[day] += Number(row.amount || 0);
    }
  }
  return Object.entries(buckets).map(([date, amount]) => ({ date, amount }));
}

export async function newLeadsToday(): Promise<number> {
  const client = getClient();
  if (!client) return 0;
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  const { count, error } = await client
    .from("leads")
    .select("*", { count: "exact", head: true })
    .gte("created_at", since.toISOString());
  if (error) {
    console.error("newLeadsToday failed:", error.message);
    return 0;
  }
  return count ?? 0;
}

export async function activeClientsCount(): Promise<number> {
  const client = getClient();
  if (!client) return 0;
  const { count, error } = await client
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");
  if (error) {
    console.error("activeClientsCount failed:", error.message);
    return 0;
  }
  return count ?? 0;
}

export async function emailsSentToday(): Promise<number> {
  const client = getClient();
  if (!client) return 0;
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  const { count, error } = await client
    .from("email_recipients")
    .select("*", { count: "exact", head: true })
    .not("sent_at", "is", null)
    .gte("sent_at", since.toISOString());
  if (error) {
    console.error("emailsSentToday failed:", error.message);
    return 0;
  }
  return count ?? 0;
}

export interface EmailCampaign {
  id: string;
  name: string;
  status: "draft" | "sending" | "done";
  total_recipients: number;
  sent_count: number;
  created_at: string;
}

export interface EmailRecipient {
  id: string;
  campaign_id: string;
  business_name: string | null;
  contact_name: string | null;
  email: string;
  website_url: string | null;
  notes: string | null;
  subject: string | null;
  body: string | null;
  status: "queued" | "sent" | "opened" | "replied" | "bounced" | "failed";
  sent_at: string | null;
  opened_at: string | null;
  replied_at: string | null;
  follow_up_sent: boolean;
  created_at: string;
}

export async function listEmailCampaigns(): Promise<EmailCampaign[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client.from("email_campaigns").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("listEmailCampaigns failed:", error.message);
    return [];
  }
  return (data ?? []) as EmailCampaign[];
}

export async function getEmailCampaign(id: string): Promise<EmailCampaign | null> {
  const client = getClient();
  if (!client) return null;
  const { data, error } = await client.from("email_campaigns").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("getEmailCampaign failed:", error.message);
    return null;
  }
  return data as EmailCampaign | null;
}

export async function recipientsForCampaign(campaignId: string): Promise<EmailRecipient[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from("email_recipients")
    .select("*")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("recipientsForCampaign failed:", error.message);
    return [];
  }
  return (data ?? []) as EmailRecipient[];
}

export async function createEmailCampaign(
  name: string,
  recipients: Array<{ business_name?: string; contact_name?: string; email: string; website_url?: string; notes?: string }>,
): Promise<EmailCampaign | null> {
  const client = getClient();
  if (!client) return null;
  const { data: campaign, error } = await client
    .from("email_campaigns")
    .insert({ name, total_recipients: recipients.length })
    .select("*")
    .single();
  if (error || !campaign) {
    console.error("createEmailCampaign failed:", error?.message);
    return null;
  }
  if (recipients.length > 0) {
    const { error: recipientsError } = await client
      .from("email_recipients")
      .insert(recipients.map((r) => ({ ...r, campaign_id: campaign.id })));
    if (recipientsError) console.error("createEmailCampaign recipients insert failed:", recipientsError.message);
  }
  return campaign as EmailCampaign;
}

export async function setCampaignStatus(id: string, status: EmailCampaign["status"]): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  const { error } = await client.from("email_campaigns").update({ status }).eq("id", id);
  if (error) {
    console.error("setCampaignStatus failed:", error.message);
    return false;
  }
  return true;
}

export async function incrementCampaignSentCount(id: string, by: number): Promise<void> {
  const client = getClient();
  if (!client) return;
  const { data } = await client.from("email_campaigns").select("sent_count").eq("id", id).maybeSingle();
  const next = (data?.sent_count ?? 0) + by;
  await client.from("email_campaigns").update({ sent_count: next }).eq("id", id);
}

/** Queued recipients across every 'sending' campaign, oldest campaign first — feeds the daily send cap. */
export async function nextQueuedRecipients(limit: number): Promise<EmailRecipient[]> {
  const client = getClient();
  if (!client || limit <= 0) return [];
  const { data: campaigns } = await client.from("email_campaigns").select("id").eq("status", "sending");
  const ids = (campaigns ?? []).map((c) => c.id);
  if (ids.length === 0) return [];
  const { data, error } = await client
    .from("email_recipients")
    .select("*")
    .in("campaign_id", ids)
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) {
    console.error("nextQueuedRecipients failed:", error.message);
    return [];
  }
  return (data ?? []) as EmailRecipient[];
}

export async function markRecipientSent(id: string, subject: string, body: string): Promise<void> {
  const client = getClient();
  if (!client) return;
  await client
    .from("email_recipients")
    .update({ status: "sent", subject, body, sent_at: new Date().toISOString() })
    .eq("id", id);
}

export async function markRecipientFailed(id: string): Promise<void> {
  const client = getClient();
  if (!client) return;
  await client.from("email_recipients").update({ status: "failed" }).eq("id", id);
}

export async function markRecipientOpened(id: string): Promise<void> {
  const client = getClient();
  if (!client) return;
  await client
    .from("email_recipients")
    .update({ status: "opened", opened_at: new Date().toISOString() })
    .eq("id", id)
    .is("opened_at", null);
}

export async function updateRecipient(
  id: string,
  updates: Partial<Pick<EmailRecipient, "status" | "replied_at">>,
): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  const { error } = await client.from("email_recipients").update(updates).eq("id", id);
  if (error) {
    console.error("updateRecipient failed:", error.message);
    return false;
  }
  return true;
}

/** Recipients sent 3+ days ago, not replied, not yet followed up — same honest proxy as leadsDueForFollowUp. */
export async function recipientsDueForFollowUp(): Promise<EmailRecipient[]> {
  const client = getClient();
  if (!client) return [];
  const cutoff = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await client
    .from("email_recipients")
    .select("*")
    .eq("status", "sent")
    .eq("follow_up_sent", false)
    .lt("sent_at", cutoff);
  if (error) {
    console.error("recipientsDueForFollowUp failed:", error.message);
    return [];
  }
  return (data ?? []) as EmailRecipient[];
}

export async function markRecipientFollowedUp(id: string): Promise<void> {
  const client = getClient();
  if (!client) return;
  await client.from("email_recipients").update({ follow_up_sent: true }).eq("id", id);
}

export interface ClientChatMessage {
  id: string;
  client_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export async function listClientChatMessages(clientId: string, limit = 50): Promise<ClientChatMessage[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client
    .from("client_chat_messages")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) {
    console.error("listClientChatMessages failed:", error.message);
    return [];
  }
  return (data ?? []) as ClientChatMessage[];
}

export async function insertClientChatMessage(clientId: string, role: "user" | "assistant", content: string): Promise<void> {
  const client = getClient();
  if (!client) return;
  const { error } = await client.from("client_chat_messages").insert({ client_id: clientId, role, content });
  if (error) console.error("insertClientChatMessage failed:", error.message);
}

/** Test-only escape hatch to reset the cached client between test cases. */
export function _resetSupabaseClientForTests(): void {
  cachedClient = undefined;
}
