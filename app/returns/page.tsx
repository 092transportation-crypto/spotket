import { CheckCircle2, Clock, Mail, PackageOpen, XCircle } from "lucide-react";
import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description:
    "Spotket's 30-day hassle-free return policy: how to start a return, what's eligible, and when your refund arrives.",
};

const steps = [
  { title: "Email us", text: `Contact ${SUPPORT_EMAIL} (or use the form below) with your order number within 30 days of delivery. We reply with a prepaid return label within 1 business day.` },
  { title: "Pack it up", text: "Place the item back in its original packaging with all accessories and manuals. Attach the prepaid label to the box." },
  { title: "Drop it off", text: "Hand the package to any carrier location or schedule a pickup. Keep the drop-off receipt until your refund lands." },
  { title: "Get refunded", text: "Once the return arrives and passes a quick check, your refund is issued to the original payment method within 3-5 business days." },
];

const eligible = [
  "Items returned within 30 days of delivery",
  "Unused items in original packaging with all accessories",
  "Damaged or defective items (always free — send a photo within 48 hours)",
  "Wrong item received",
];

const notEligible = [
  "Items returned more than 30 days after delivery",
  "Used or damaged-by-wear items (unless defective)",
  "Items missing major parts or packaging",
  "Free promotional items",
];

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">Returns</p>
      <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">30 days. No hassle.</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-slate-400">
        If something isn&apos;t right, you have <strong className="text-white">30 days from delivery</strong> to
        return it — no questions asked. Returns are free with our prepaid label, and every
        shipment is insured, so damaged or lost items are always replaced or refunded in full.
      </p>

      {/* Step-by-step */}
      <section className="mt-12" aria-labelledby="return-steps">
        <h2 id="return-steps" className="flex items-center gap-2 text-2xl font-bold text-white">
          <PackageOpen className="h-6 w-6 text-gold" aria-hidden="true" />
          How to return an item
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-navy-700/60 bg-navy-900 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gold">Step {index + 1}</p>
              <h3 className="mt-1 font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Refund timeline */}
      <section className="mt-12 rounded-3xl border border-navy-700/60 bg-navy-900 p-6" aria-labelledby="refund-timeline">
        <h2 id="refund-timeline" className="flex items-center gap-2 text-2xl font-bold text-white">
          <Clock className="h-6 w-6 text-gold" aria-hidden="true" />
          Refund timeline
        </h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-300">
          <li><strong className="text-white">Label sent:</strong> within 1 business day of your request</li>
          <li><strong className="text-white">Return transit:</strong> typically 3-7 days back to our facility</li>
          <li><strong className="text-white">Inspection:</strong> within 48 hours of arrival</li>
          <li><strong className="text-white">Refund issued:</strong> 3-5 business days to your original payment method (bank posting times vary)</li>
        </ul>
      </section>

      {/* Eligible / not eligible */}
      <section className="mt-12 grid gap-6 md:grid-cols-2" aria-label="Return eligibility">
        <div className="rounded-3xl border border-navy-700/60 bg-navy-900 p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            Eligible for return
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {eligible.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
        <div className="rounded-3xl border border-navy-700/60 bg-navy-900 p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            Not eligible
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {notEligible.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
      </section>

      {/* Returns contact form */}
      <section className="mt-14" aria-labelledby="start-return">
        <h2 id="start-return" className="flex items-center gap-2 text-2xl font-bold text-white">
          <Mail className="h-6 w-6 text-gold" aria-hidden="true" />
          Start a return
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Include your order number and the reason for the return — we&apos;ll take it from there.
        </p>
        <div className="mt-6">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
