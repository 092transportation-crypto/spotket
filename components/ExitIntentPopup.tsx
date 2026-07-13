"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

const SEEN_KEY = "spotket-exit-popup-seen";

/** 10%-off capture shown once when the cursor heads for the tab bar. */
export default function ExitIntentPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.localStorage.getItem(SEEN_KEY)) return;
    const onLeave = (event: MouseEvent) => {
      if (event.clientY > 12 || event.relatedTarget) return;
      window.localStorage.setItem(SEEN_KEY, "1");
      setOpen(true);
      document.removeEventListener("mouseout", onLeave);
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, []);

  // Never interrupt checkout or admin work.
  if (pathname.startsWith("/checkout") || pathname.startsWith("/admin")) return null;
  if (!open) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Something went wrong");
      setDone(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong");
    }
    setBusy(false);
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Discount offer"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-md animate-fade-up rounded-3xl border border-navy-700/60 bg-navy-900 p-8 text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-navy-800 hover:text-white"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {done ? (
          <>
            <h2 className="text-2xl font-bold text-white">You&apos;re in! 🎉</h2>
            <p className="mt-3 text-sm text-slate-300">
              Use code{" "}
              <span className="rounded-lg bg-brand/15 px-2 py-1 font-mono font-bold text-brand">
                WELCOME10
              </span>{" "}
              at checkout for 10% off. It&apos;s in your inbox too.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">Wait!</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Get 10% off your first order</h2>
            <p className="mt-2 text-sm text-slate-400">
              Drop your email and we&apos;ll send you the code.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="min-h-12 w-full rounded-full border border-navy-600 bg-navy-950 px-5 text-sm text-white placeholder:text-slate-500 focus:border-brand focus:outline-none"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="btn-shimmer min-h-12 w-full rounded-full text-sm font-semibold text-white disabled:opacity-60"
              >
                {busy ? "Claiming…" : "Claim Discount"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full py-2 text-sm text-slate-500 hover:text-slate-300"
              >
                No thanks
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
