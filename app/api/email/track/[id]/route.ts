import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { markRecipientOpened } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// 1x1 transparent GIF, served as a base64 constant.
const PIXEL = Buffer.from("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", "base64");

/** Public open-tracking pixel embedded in campaign emails. Not under /api/admin — must be reachable from any inbox. */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await markRecipientOpened(id);
  return new NextResponse(PIXEL, {
    headers: { "Content-Type": "image/gif", "Cache-Control": "no-store" },
  });
}
