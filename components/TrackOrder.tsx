"use client";

import { PackageSearch, Truck } from "lucide-react";
import { useState, type FormEvent } from "react";

type TrackResult = {
  status: string;
  trackNumber: string | null;
  created: string | null;
  tracking: unknown;
};

export default function TrackOrder() {
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackResult | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Tracking failed");
      setResult(data);
    } catch (trackError) {
      setError(trackError instanceof Error ? trackError.message : "Tracking failed");
    }
    setBusy(false);
  };

  const events: { trackingStatus?: string; deliveryTime?: string }[] = Array.isArray(
    result?.tracking,
  )
    ? (result?.tracking as { trackingStatus?: string; deliveryTime?: string }[])
    : [];

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          required
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. pi_3Ts… or your CJ order ID"
          aria-label="Order ID"
          className="min-h-13 w-full rounded-full border border-navy-600 bg-navy-900 px-6 text-sm text-white placeholder:text-slate-500 focus:border-brand focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="btn-shimmer inline-flex min-h-13 shrink-0 items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold text-white disabled:opacity-60"
        >
          <PackageSearch className="h-4 w-4" aria-hidden="true" />
          {busy ? "Checking…" : "Track Order"}
        </button>
      </form>

      {error && (
        <p className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-300">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-8 rounded-3xl border border-navy-700/60 bg-navy-900 p-6">
          <p className="flex items-center gap-2 text-lg font-semibold text-white">
            <Truck className="h-5 w-5 text-gold" aria-hidden="true" />
            Status: <span className="text-gold">{result.status}</span>
          </p>
          {result.created && (
            <p className="mt-1 text-xs text-slate-500">Order created {result.created}</p>
          )}
          {result.trackNumber ? (
            <p className="mt-3 text-sm text-slate-300">
              Tracking number: <span className="font-mono text-white">{result.trackNumber}</span>
            </p>
          ) : (
            <p className="mt-3 text-sm text-slate-400">
              Your package hasn&apos;t shipped yet — tracking appears here once the carrier scans it.
            </p>
          )}
          {events.length > 0 && (
            <ul className="mt-5 space-y-2 border-t border-navy-700/60 pt-4">
              {events.map((event, index) => (
                <li key={index} className="flex items-baseline gap-3 text-sm">
                  <span className="shrink-0 text-xs text-slate-500">{event.deliveryTime ?? ""}</span>
                  <span className="text-slate-300">{event.trackingStatus ?? ""}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
