import type { Metadata } from "next";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Spotket collects, uses, and protects your personal information — and the choices and rights you have.",
};

const sections = [
  {
    title: "1. Information we collect",
    body: [
      "Order information: your name, shipping address, email address, phone number, and the items you purchase, so we can fulfill and deliver your order.",
      "Payment information: processed securely by PCI-DSS compliant payment providers. Spotket never stores your full card number.",
      "Usage information: pages visited, device and browser type, and general location, collected through cookies and similar technologies to improve the store.",
      "Communications: messages you send to support and your newsletter subscription status.",
    ],
  },
  {
    title: "2. How we use your information",
    body: [
      "To process orders, arrange delivery, and provide tracking updates.",
      "To respond to support requests and honor returns, refunds, and price-match claims.",
      "To send the newsletter and promotional offers you opted into — every email includes a one-click unsubscribe.",
      "To detect fraud, secure the site, and comply with legal obligations.",
      "To understand how the store is used so we can improve products, pages, and performance.",
    ],
  },
  {
    title: "3. Sharing your information",
    body: [
      "We share data only with service providers who need it to operate the store: payment processors, shipping carriers, fulfillment partners, email providers, and analytics services.",
      "We never sell your personal information, and we never share it with third parties for their own marketing.",
      "We may disclose information when required by law or to protect our rights, customers, or the public.",
    ],
  },
  {
    title: "4. Cookies",
    body: [
      "We use essential cookies to keep your cart working and remember your preferences, plus analytics cookies to understand site usage.",
      "You can block or delete cookies in your browser settings; the cart and checkout may not function correctly without essential cookies.",
    ],
  },
  {
    title: "5. Data retention & security",
    body: [
      "Order records are kept as long as required for accounting, warranty, and legal purposes, then deleted or anonymized.",
      "All traffic to Spotket is encrypted with TLS (256-bit SSL). Access to personal data is limited to staff who need it.",
    ],
  },
  {
    title: "6. Your rights",
    body: [
      "You can request a copy of the personal data we hold about you, ask us to correct it, or ask us to delete it.",
      "You can unsubscribe from marketing at any time via the link in any email.",
      `To exercise any of these rights, email ${SUPPORT_EMAIL} — we respond within 30 days.`,
    ],
  },
  {
    title: "7. Children's privacy",
    body: [
      "Spotket is not directed at children under 13, and we do not knowingly collect personal information from them.",
    ],
  },
  {
    title: "8. Changes to this policy",
    body: [
      "We may update this policy as the store evolves. Material changes will be announced on this page with an updated effective date.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">
        Legal
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-xs text-slate-500">Effective date: July 11, 2026</p>
      <p className="mt-5 leading-relaxed text-slate-300">
        Your trust is the foundation of Spotket. This policy explains what
        information we collect, why we collect it, and the choices you have.
        The short version: we collect only what we need to run the store, we
        protect it carefully, and we never sell it.
      </p>

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-bold text-white">{section.title}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300 marker:text-brand">
              {section.body.map((paragraph) => (
                <li key={paragraph}>{paragraph}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-10 rounded-2xl border border-navy-700/60 bg-navy-800/60 p-6 text-sm text-slate-300">
        Questions about privacy? Email{" "}
        <span className="font-semibold text-brand">{SUPPORT_EMAIL}</span>.
      </p>
    </div>
  );
}
