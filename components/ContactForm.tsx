"use client";

import { CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";

const inputClasses =
  "min-h-11 w-full rounded-xl border border-navy-600 bg-navy-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-brand/40 bg-brand/10 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-brand" aria-hidden="true" />
        <h2 className="mt-4 text-xl font-bold text-white">Message sent!</h2>
        <p className="mt-2 text-sm text-slate-300">
          Thanks for reaching out. Our team will get back to you within 24
          hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-slate-300">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-slate-300">
          Subject
        </label>
        <select id="contact-subject" name="subject" className={inputClasses}>
          <option>Order question</option>
          <option>Shipping & delivery</option>
          <option>Returns & refunds</option>
          <option>Product question</option>
          <option>Something else</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-slate-300">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="How can we help?"
          className={inputClasses}
        />
      </div>

      <button
        type="submit"
        className="min-h-11 w-full rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/30 active:scale-95 sm:w-auto sm:px-10"
      >
        Send Message
      </button>
    </form>
  );
}
