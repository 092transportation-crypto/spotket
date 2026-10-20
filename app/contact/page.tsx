import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a free 10 minute call with Spotket Digital and see what AI automation could do for your business.",
};

export default function ContactPage() {
  return (
    <div className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          Contact
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Book a Free 10 Minute Call
        </h1>
        <p className="mt-4 text-base leading-relaxed text-neutral-400">
          Tell us a bit about your business and we&apos;ll show you exactly
          what automation could do for it. No pressure, no obligation.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-md rounded-2xl border border-white/10 bg-navy-900/60 p-7 sm:p-8">
        <ContactForm />
      </div>

      <p className="mx-auto mt-8 max-w-md text-center text-sm text-neutral-500">
        Prefer email? Reach us directly at{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-brand-light hover:text-white"
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}
