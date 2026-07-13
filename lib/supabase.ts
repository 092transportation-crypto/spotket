import { createClient } from "@supabase/supabase-js";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://cfzkuwehlqgvdidvfaie.supabase.co";
// Falls back to a placeholder so local builds without env vars still prerender;
// real requests then fail loudly with 401 instead of crashing at import time.
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon-key-not-set";

/**
 * Browser client — sessions persist in localStorage and refresh automatically,
 * so a login carries across tabs and devices (per-device sign-in, shared account).
 */
export const supabase = createClient(url, anonKey, {
  db: { schema: "public" },
});
