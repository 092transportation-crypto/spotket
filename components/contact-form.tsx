"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_EMAIL } from "@/lib/site";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const business = String(data.get("business") ?? "");
    const phone = String(data.get("phone") ?? "");
    const email = String(data.get("email") ?? "");

    const subject = `Free demo request — ${business || name}`;
    const body = [
      `Name: ${name}`,
      `Business name: ${business}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
    ].join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setStatus("sent");
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-neutral-300"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full rounded-xl border border-white/15 bg-navy-900/60 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-brand"
          placeholder="Jane Smith"
        />
      </div>

      <div>
        <label
          htmlFor="business"
          className="mb-1.5 block text-sm font-medium text-neutral-300"
        >
          Business name
        </label>
        <input
          id="business"
          name="business"
          type="text"
          required
          autoComplete="organization"
          className="w-full rounded-xl border border-white/15 bg-navy-900/60 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-brand"
          placeholder="Your business name"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-sm font-medium text-neutral-300"
        >
          Phone
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
          className="w-full rounded-xl border border-white/15 bg-navy-900/60 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-brand"
          placeholder="5551234567"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-neutral-300"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-white/15 bg-navy-900/60 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-brand"
          placeholder="jane@yourbusiness.com"
        />
      </div>

      <button
        type="submit"
        className="btn-shimmer w-full rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.01] active:scale-95"
      >
        Book a Free 10 Minute Call
      </button>

      {status === "sent" && (
        <p className="text-center text-sm text-brand-light">
          Opening your email client to send your request — we&apos;ll reply
          within one business day.
        </p>
      )}
    </form>
  );
}
