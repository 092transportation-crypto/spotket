import { Flame } from "lucide-react";
import type { Metadata } from "next";
import TrendingBrowser from "@/components/TrendingBrowser";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "What's Trending",
  description:
    "The most popular products on Spotket right now — ranked by real buyer reviews and updated as new favorites emerge.",
};

export default async function TrendingPage() {
  const catalog = await getCatalog();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        What&apos;s Trending
        <Flame className="h-9 w-9 text-gold" aria-hidden="true" />
      </h1>
      <p className="mt-3 max-w-xl text-sm text-slate-400">
        Ranked by what buyers are actually reviewing and loving — not by what
        we want to push.
      </p>
      <div className="mt-10">
        <TrendingBrowser products={catalog} />
      </div>
    </div>
  );
}
