"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const inputClasses =
  "min-h-12 w-full rounded-xl border border-navy-600 bg-navy-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40";

export default function ReviewForm({
  productId,
  onDone,
}: {
  productId: string;
  onDone: () => void;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [name, setName] = useState(user?.name ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<null | { verified: boolean }>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rating === 0) {
      setError("Please pick a star rating");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          title,
          body,
          name: user?.name ?? name,
          accessToken: sessionData.session?.access_token,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not submit review");
      setDone({ verified: data.verified });
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not submit review");
    }
    setBusy(false);
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-sm">
        <p className="font-semibold text-emerald-300">Thanks — your review is live!</p>
        {done.verified && (
          <p className="mt-1 text-emerald-200/80">
            It carries the Verified Purchase badge since you bought this product.
          </p>
        )}
        <button
          type="button"
          onClick={onDone}
          className="mt-3 min-h-11 rounded-xl border border-emerald-500/40 px-4 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/10"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-navy-700/60 bg-navy-800/60 p-5"
    >
      <h3 className="text-lg font-bold text-white">Write a Review</h3>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-medium text-slate-300">
          Your rating <span className="text-red-400">*</span>
        </legend>
        <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHovered(value)}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              aria-pressed={rating === value}
              className="flex h-11 w-11 items-center justify-center"
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  value <= (hovered || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-navy-600"
                }`}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="review-title" className="mb-1.5 block text-sm font-medium text-slate-300">
          Title
        </label>
        <input
          id="review-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={120}
          placeholder="Sums it up in a few words"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="review-body" className="mb-1.5 block text-sm font-medium text-slate-300">
          Your review <span className="text-red-400">*</span>
        </label>
        <textarea
          id="review-body"
          required
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="What did you like or dislike? How are you using it?"
          className={`${inputClasses} min-h-24`}
        />
      </div>

      {!user && (
        <div>
          <label htmlFor="review-name" className="mb-1.5 block text-sm font-medium text-slate-300">
            Your name <span className="text-red-400">*</span>
          </label>
          <input
            id="review-name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={60}
            placeholder="Shown with your review"
            className={inputClasses}
          />
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={busy}
          className="min-h-12 flex-1 rounded-xl bg-brand px-6 text-sm font-semibold text-white transition-all hover:bg-brand-dark active:scale-95 disabled:cursor-not-allowed disabled:bg-navy-600 sm:flex-none sm:px-8"
        >
          {busy ? "Submitting…" : "Submit Review"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="min-h-12 rounded-xl border border-navy-600 px-6 text-sm font-semibold text-slate-300 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
