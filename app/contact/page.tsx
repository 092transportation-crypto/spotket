import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { CONTACT_EMAIL, CONTACT_IMAGE } from "@/lib/site";

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

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
        <Reveal className="rounded-2xl border border-white/10 bg-navy-900/60 p-7 sm:p-8">
          <ContactForm />
          <p className="mt-8 text-center text-sm text-neutral-500">
            Prefer email? Reach us directly at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-brand-light hover:text-white"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Reveal>

        <Reveal delay={150} className="relative hidden overflow-hidden rounded-2xl border border-white/10 lg:block">
          <Image
            src={CONTACT_IMAGE.src}
            alt={CONTACT_IMAGE.alt}
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 0vw, 500px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7">
            <p className="text-lg font-semibold text-white">
              We respond within one business day.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-300">
              No sales pressure — just a straight answer about what
              automation would look like for your business.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
