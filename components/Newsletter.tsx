"use client";

import { useState, type FormEvent } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Subscription failed");
      setSubscribed(true);
    } catch (subscribeError) {
      setError(subscribeError instanceof Error ? subscribeError.message : "Subscription failed");
    }
    setBusy(false);
  };

  return (
    <section id="newsletter" className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 sm:pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-navy-700/60 bg-gradient-to-br from-navy-800 to-navy-900 px-5 py-8 text-center sm:px-12 sm:py-12">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
          aria-hidden="true"
        />
        <span className="rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand">
          10% Off Your First Order
        </span>
        <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
          Sign up and get 10% off your first order
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
          Join the Spotket list for your welcome discount, early access to new
          drops, and members-only deals. No spam, ever.
        </p>

        {error && (
          <p className="mx-auto mt-4 max-w-md rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
        {subscribed ? (
          <p className="mx-auto mt-8 max-w-md rounded-xl border border-brand/40 bg-brand/10 px-4 py-3 text-sm font-medium text-brand">
            You&apos;re subscribed! Check your email for your 10% discount code.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="min-h-11 w-full rounded-xl border border-navy-600 bg-navy-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <button
              type="submit"
              className="min-h-11 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/30 active:scale-95"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
