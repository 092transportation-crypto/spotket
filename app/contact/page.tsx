import { Clock, MapPin, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { SUPPORT_EMAIL } from "@/lib/site";

const faqs = [
  { q: "Where is my order?", a: "You'll receive a tracking link by email as soon as your order ships — usually within 24-48 hours. Standard delivery takes 5-10 days depending on the product." },
  { q: "How do I return something?", a: "Email us within 30 days of delivery with your order number and we'll send a prepaid return label. Full details on the Returns page." },
  { q: "When will I get my refund?", a: "Refunds are issued to your original payment method within 3-5 business days of the return arriving back to us." },
  { q: "Do you ship internationally?", a: "We currently ship across the United States. International shipping is on the roadmap — join the newsletter to hear when your country is added." },
  { q: "Is checkout secure?", a: "Yes — payments are processed by Stripe with 256-bit SSL encryption. We never see or store your card details." },
  { q: "Can I change my order after placing it?", a: "If it hasn't shipped yet, usually yes. Email us as soon as possible with your order number and the change you need." },
  { q: "Are your reviews real?", a: "Yes. Reviews come from verified buyers of each product, and customer reviews earn a Verified Purchase badge only when tied to a real Spotket order." },
  { q: "How do I use my 10% welcome discount?", a: "Sign up for the newsletter and your code arrives by email — enter it at checkout on your first order." },
];

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Questions about an order, shipping, or returns? Contact the Spotket support team — we're here 24/7 and reply within 24 hours.",
};

const channels = [
  {
    title: "Email",
    value: "support@spotket.com",
    note: "Replies within 24 hours",
  },
  {
    title: "Support hours",
    value: "24 / 7",
    note: "Real people, around the clock",
  },
  {
    title: "Order help",
    value: "Include your order number",
    note: "So we can help you faster",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Contact
          </p>
          <h1 className="mt-2 text-4xl font-extrabold text-white sm:text-5xl">
            We&apos;re here to help
          </h1>
          <p className="mt-4 leading-relaxed text-slate-400">
            Questions about an order, shipping, returns, or a product? Send us
            a message and our support team will get back to you within 24
            hours — usually much faster.
          </p>

          <dl className="mt-8 space-y-5">
            {channels.map((channel) => (
              <div key={channel.title} className="rounded-2xl border border-navy-700/60 bg-navy-800/60 p-4">
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {channel.title}
                </dt>
                <dd className="mt-1 font-semibold text-white">{channel.value}</dd>
                <dd className="mt-0.5 text-xs text-slate-500">{channel.note}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>

      {/* Chat + response time */}
      <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl border border-navy-700/60 bg-navy-900 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-4">
          <MessageCircle className="h-8 w-8 shrink-0 text-gold" aria-hidden="true" />
          <div>
            <p className="font-semibold text-white">Prefer to chat?</p>
            <p className="flex items-center gap-1.5 text-sm text-slate-400">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              We respond within 24 hours — usually much faster.
            </p>
          </div>
        </div>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=Chat%20with%20Spotket`}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-8 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Start a Conversation
        </a>
      </div>

      {/* FAQ */}
      <section className="mt-14" aria-labelledby="contact-faq">
        <h2 id="contact-faq" className="text-3xl font-bold text-white">Common questions</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.q} className="group rounded-2xl border border-navy-700/60 bg-navy-900 px-5 py-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-white marker:hidden">
                {faq.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="mt-14 overflow-hidden rounded-3xl border border-navy-700/60" aria-label="Our location">
        <div
          className="flex min-h-56 flex-col items-center justify-center gap-2 bg-navy-900 px-6 py-12 text-center"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 40%, rgba(99,102,241,0.12), transparent 60%)",
          }}
        >
          <MapPin className="h-8 w-8 text-gold" aria-hidden="true" />
          <p className="text-lg font-semibold text-white">Maryland, USA</p>
          <p className="text-sm text-slate-400">Proudly operated from the Old Line State — shipping nationwide.</p>
        </div>
      </section>
    </div>
  );
}
