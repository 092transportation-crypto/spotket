/**
 * Fixed-window rate limiter for public, paid-API endpoints (the chat widget).
 *
 * Primary store is Supabase (table chat_rate_limits + function
 * chat_rate_limit_hit, see supabase-schema.sql), so limits hold across every
 * serverless instance. If Supabase isn't reachable or the schema hasn't been
 * run yet, it falls back to an in-memory window per instance, which still
 * blocks bursts from a single client but isn't global.
 */
import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { rateLimitHit } from "./supabase";

export interface RateRule {
  /** Short name for logs and the storage key, e.g. "ip-minute". */
  name: string;
  limit: number;
  windowSeconds: number;
}

const memory = new Map<string, { count: number; windowStart: number }>();

function memoryHit(key: string, limit: number, windowSeconds: number): boolean {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || now - entry.windowStart >= windowSeconds * 1000) {
    memory.set(key, { count: 1, windowStart: now });
  } else {
    entry.count += 1;
  }
  // Keep the map from growing without bound on a long-lived instance.
  if (memory.size > 5000) {
    for (const [k, v] of memory) {
      if (now - v.windowStart > 86_400_000) memory.delete(k);
    }
  }
  return (memory.get(key)?.count ?? 0) <= limit;
}

/** Client IP from Vercel's forwarding headers, hashed so raw IPs are never stored. */
export function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`spotket-chat:${ip}`).digest("hex").slice(0, 32);
}

/**
 * Counts one hit against every rule and returns the first rule that is now
 * over its limit (or null if all pass). Every rule is counted, so a client
 * that keeps retrying while blocked stays blocked.
 */
export async function checkRateLimits(subject: string, rules: RateRule[]): Promise<RateRule | null> {
  let blocked: RateRule | null = null;
  for (const rule of rules) {
    const key = `${rule.name}:${subject}`;
    const remote = await rateLimitHit(key, rule.limit, rule.windowSeconds);
    const allowed = remote ?? memoryHit(key, rule.limit, rule.windowSeconds);
    if (!allowed && !blocked) blocked = rule;
  }
  return blocked;
}
