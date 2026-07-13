import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { adminClient } from "@/lib/catalog";
import { REVIEWER_PSEUDONYMS } from "@/lib/reviews";

/**
 * Replaces "AliExpress" placeholder reviewer names (anonymous supplier
 * buyers) with display pseudonyms. Deterministic per review id so re-runs
 * don't reshuffle names.
 */
export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const admin = adminClient();
  if (!admin) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { data: rows, error } = await admin
    .from("reviews")
    .select("id, name")
    .ilike("name", "%aliexpress%");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let updated = 0;
  for (const row of rows ?? []) {
    const seed = [...row.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const pseudonym = REVIEWER_PSEUDONYMS[seed % REVIEWER_PSEUDONYMS.length];
    const { error: updateError } = await admin
      .from("reviews")
      .update({ name: pseudonym })
      .eq("id", row.id);
    if (!updateError) updated += 1;
  }

  return NextResponse.json({ ok: true, found: rows?.length ?? 0, updated });
}
