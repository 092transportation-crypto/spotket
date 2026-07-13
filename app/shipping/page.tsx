import { Globe, MapPin, Package, Truck } from "lucide-react";
import type { Metadata } from "next";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping Info",
  description:
    "Spotket shipping: free on orders over $35, flat $4.99 otherwise, 10-20 business day estimated delivery, and real-time tracking on every order.",
};

const faqs = [
  { q: "How long does delivery take?", a: "Estimated delivery is 10-20 business days depending on the product and destination — every product page shows its own delivery window before you buy." },
  { q: "How do I track my order?", a: "You'll get a tracking link by email within 24-48 hours of ordering. Click it any time for live status; if the link hasn't arrived, check spam or email us." },
  { q: "What if my package is late?", a: "Some products include a late-delivery coupon automatically. Either way, if a package looks stuck, contact us and we'll chase the carrier for you." },
  { q: "What if my package is lost or damaged?", a: "Every shipment is insured. Lost packages are reshipped or refunded in full, and damaged items are replaced free — just send a photo within 48 hours." },
  { q: "Do you ship to PO boxes?", a: "Yes, for most items. If a specific product can't ship to a PO box, we'll contact you before it ships." },
];

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">Shipping</p>
      <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">Fast, tracked, insured</h1>

      {/* Methods */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2" aria-label="Shipping methods">
        <div className="rounded-3xl border border-navy-700/60 bg-navy-900 p-6">
          <Truck className="h-6 w-6 text-gold" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-bold text-white">Standard Shipping</h2>
          <p className="mt-1 text-sm text-slate-400">10-20 business days · tracked &amp; insured</p>
          <p className="mt-3 text-2xl font-bold text-white">
            {`$${STANDARD_SHIPPING_COST}`}
            <span className="ml-2 text-sm font-normal text-slate-400">
              — free over ${FREE_SHIPPING_THRESHOLD}
            </span>
          </p>
        </div>
        <div className="rounded-3xl border border-gold/40 bg-navy-900 p-6">
          <Package className="h-6 w-6 text-gold" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-bold text-white">Free Shipping</h2>
          <p className="mt-1 text-sm text-slate-400">Every order over ${FREE_SHIPPING_THRESHOLD} ships free</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Many items also ship free individually — look for the &ldquo;Free
            shipping on this item&rdquo; note on product pages.
          </p>
        </div>
      </section>

      {/* Coverage */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="Shipping coverage">
        <div className="rounded-3xl border border-navy-700/60 bg-navy-900 p-6">
          <MapPin className="h-6 w-6 text-gold" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-bold text-white">United States</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            We ship worldwide from verified suppliers, with estimated delivery of
            10-20 business days. Every product page shows its own delivery
            window plus where the item ships from.
          </p>
        </div>
        <div className="rounded-3xl border border-navy-700/60 bg-navy-900 p-6">
          <Globe className="h-6 w-6 text-gold" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-bold text-white">International</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            International shipping is rolling out soon. Join the newsletter and
            we&apos;ll email you the moment your country is added.
          </p>
        </div>
      </section>

      {/* Tracking */}
      <section className="mt-8 rounded-3xl border border-navy-700/60 bg-navy-900 p-6" aria-labelledby="tracking">
        <h2 id="tracking" className="text-2xl font-bold text-white">Tracking your order</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-300">
          <li>Place your order — you&apos;ll get an instant confirmation email.</li>
          <li>Within 24-48 hours your shipping confirmation arrives with a live tracking link.</li>
          <li>Click the link any time for real-time status; multi-item orders may ship in separate tracked packages.</li>
          <li>Signed-in customers can also see order status on the Account page.</li>
        </ol>
      </section>

      {/* FAQ */}
      <section className="mt-12" aria-labelledby="shipping-faq">
        <h2 id="shipping-faq" className="text-3xl font-bold text-white">Shipping FAQ</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.q} className="group rounded-2xl border border-navy-700/60 bg-navy-900 px-5 py-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-white">{faq.q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
