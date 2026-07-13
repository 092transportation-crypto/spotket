import type { Metadata } from "next";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of the Spotket store: ordering, pricing, shipping, returns, and acceptable use.",
};

const sections = [
  {
    title: "1. Using Spotket",
    body: "By browsing or ordering from Spotket you agree to these terms. You must be at least 18 years old (or the age of majority where you live) to place an order. You agree to provide accurate order and contact information.",
  },
  {
    title: "2. Products & pricing",
    body: "We work hard to display products, descriptions, and prices accurately, but errors can happen. If we discover a pricing or listing error affecting your order, we'll contact you with the option to confirm at the correct price or cancel for a full refund. All prices are in US dollars. Promotional discounts cannot be combined unless stated otherwise.",
  },
  {
    title: "3. Orders & payment",
    body: "Your order is an offer to purchase; it's accepted when we send a shipping confirmation. We may cancel orders for suspected fraud, stock errors, or pricing mistakes — you'll always receive a full refund. Payments are processed by secure third-party providers; Spotket does not store full card details.",
  },
  {
    title: "4. Shipping & delivery",
    body: "Delivery estimates are shown on product pages and at checkout. Estimates are made in good faith but aren't guarantees; carrier delays can occur. Risk of loss passes to you on delivery, and every shipment is insured — lost packages are reshipped or refunded in full. See our Shipping page for details.",
  },
  {
    title: "5. Returns & refunds",
    body: "Most items can be returned within 30 days of delivery under our hassle-free policy. Full details, including the few exceptions, are on our Returns page, which forms part of these terms.",
  },
  {
    title: "6. Price match guarantee",
    body: "If you find an identical, in-stock item at a lower price from a major retailer, contact us before purchase or within 7 days after and we'll match it. The guarantee excludes marketplace sellers, clearance, and limited-time flash sales.",
  },
  {
    title: "7. Acceptable use",
    body: "You agree not to misuse the site: no scraping at disruptive volume, no attempting to breach security, no fraudulent orders or abusive chargebacks, and no infringing the site's content, design, or trademarks. \"Spotket\" and the SpotKet logo are our marks.",
  },
  {
    title: "8. Disclaimers & liability",
    body: "The site is provided \"as is.\" To the fullest extent permitted by law, Spotket's total liability for any claim related to an order is limited to the amount you paid for that order. Nothing in these terms limits rights you have under applicable consumer protection law.",
  },
  {
    title: "9. Changes to these terms",
    body: "We may update these terms from time to time. The version posted at the time you place an order applies to that order. Material changes will be announced on this page with an updated effective date.",
  },
  {
    title: "10. Contact",
    body: `Questions about these terms? Email ${SUPPORT_EMAIL} — our team is available 24/7.`,
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">
        Legal
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-2 text-xs text-slate-500">Effective date: July 11, 2026</p>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-bold text-white">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
