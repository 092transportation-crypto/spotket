"use client";

import { useState, type FormEvent } from "react";

const inputCls =
  "w-full rounded-xl border border-white/15 bg-navy-900/60 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-brand";
const labelCls = "mb-1.5 block text-sm font-medium text-neutral-300";
const selectCls = `${inputCls} appearance-none`;

const BUSINESS_TYPES = [
  "Limo/Car Service",
  "Barbershop",
  "Restaurant",
  "Cleaning Company",
  "Real Estate",
  "Other",
] as const;

const REVENUE_RANGES = ["Under $5k", "$5k-$20k", "$20k-$50k", "$50k+"] as const;

const CHALLENGES = [
  "Not enough leads",
  "Missing inquiries",
  "No website",
  "Low Google reviews",
  "Other",
] as const;

const HEARD_ABOUT_US = ["Google", "Instagram", "Cold call", "Referral", "Other"] as const;

type Status = "idle" | "submitting" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      business_name: String(data.get("business_name") ?? "").trim(),
      business_type: String(data.get("business_type") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      website_url: String(data.get("website_url") ?? "").trim(),
      revenue_range: String(data.get("revenue_range") ?? "").trim(),
      biggest_challenge: String(data.get("biggest_challenge") ?? "").trim(),
      heard_about_us: String(data.get("heard_about_us") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail || "Something went wrong submitting the form.");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or call us directly."
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/15 text-2xl text-brand-light">
          ✓
        </div>
        <h3 className="mt-4 text-lg font-semibold text-white">
          Thanks — we got it!
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-400">
          We&apos;ll be in touch within 24 hours. Check your email for a
          confirmation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className={labelCls}>
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={inputCls}
          placeholder="Full name"
        />
      </div>

      <div>
        <label htmlFor="business_name" className={labelCls}>
          Business Name
        </label>
        <input
          id="business_name"
          name="business_name"
          type="text"
          required
          autoComplete="organization"
          className={inputCls}
          placeholder="Your business name"
        />
      </div>

      <div>
        <label htmlFor="business_type" className={labelCls}>
          Business Type
        </label>
        <select
          id="business_type"
          name="business_type"
          required
          defaultValue=""
          className={selectCls}
        >
          <option value="" disabled>
            Select your business type
          </option>
          {BUSINESS_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="phone" className={labelCls}>
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          inputMode="numeric"
          autoComplete="tel"
          pattern="[0-9]{7,15}"
          onInput={(event) => {
            const target = event.currentTarget;
            target.value = target.value.replace(/\D/g, "");
          }}
          className={inputCls}
          placeholder="Digits only"
        />
      </div>

      <div>
        <label htmlFor="email" className={labelCls}>
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputCls}
          placeholder="you@yourbusiness.com"
        />
      </div>

      <div>
        <label htmlFor="website_url" className={labelCls}>
          Website URL <span className="text-neutral-500">(optional)</span>
        </label>
        <input
          id="website_url"
          name="website_url"
          type="url"
          autoComplete="url"
          className={inputCls}
          placeholder="https://"
        />
        <p className="mt-1.5 text-xs text-neutral-500">
          So we can audit it before the call.
        </p>
      </div>

      <div>
        <label htmlFor="revenue_range" className={labelCls}>
          Monthly Revenue Range <span className="text-neutral-500">(optional)</span>
        </label>
        <select id="revenue_range" name="revenue_range" defaultValue="" className={selectCls}>
          <option value="">Prefer not to say</option>
          {REVENUE_RANGES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="biggest_challenge" className={labelCls}>
          Biggest Challenge
        </label>
        <select
          id="biggest_challenge"
          name="biggest_challenge"
          required
          defaultValue=""
          className={selectCls}
        >
          <option value="" disabled>
            Select your biggest challenge
          </option>
          {CHALLENGES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="heard_about_us" className={labelCls}>
          How did you hear about us?
        </label>
        <select
          id="heard_about_us"
          name="heard_about_us"
          required
          defaultValue=""
          className={selectCls}
        >
          <option value="" disabled>
            Select one
          </option>
          {HEARD_ABOUT_US.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>
          Message / Additional Info <span className="text-neutral-500">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={`${inputCls} resize-none`}
          placeholder="Anything else we should know?"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-shimmer w-full rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.01] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {status === "submitting" ? "Sending…" : "Book a Free 10 Minute Call"}
      </button>

      {status === "error" && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300"
        >
          {errorMessage}{" "}
          <span className="text-red-300/80">
            You can also call or email us directly.
          </span>
        </p>
      )}
    </form>
  );
}
