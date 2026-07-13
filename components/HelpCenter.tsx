"use client";

import {
  CreditCard,
  Package,
  RotateCcw,
  Search,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SUPPORT_EMAIL } from "@/lib/site";

const categories = [
  { icon: ShoppingBag, name: "Orders", blurb: "Placing, changing, and canceling orders" },
  { icon: Truck, name: "Shipping", blurb: "Delivery times, tracking, and costs" },
  { icon: RotateCcw, name: "Returns & Refunds", blurb: "30-day returns and refund timelines" },
  { icon: CreditCard, name: "Payments", blurb: "Cards, security, and receipts" },
  { icon: UserRound, name: "Account", blurb: "Sign-in, profile, and order history" },
  { icon: Package, name: "Products", blurb: "Reviews, stock, and product questions" },
];

const articles = [
  { category: "Orders", q: "How do I change or cancel my order?", a: "If your order hasn't shipped yet, email us with your order number and the change you need — we can usually update it. Once shipped, use the 30-day return policy instead.", popular: true },
  { category: "Orders", q: "I didn't get a confirmation email", a: "Check your spam folder first. Still nothing after 30 minutes? Email us with the name and email used at checkout and we'll resend it." },
  { category: "Shipping", q: "How long does delivery take?", a: "Standard delivery takes 5-10 days depending on the product. Every product page shows its own delivery window before you buy.", popular: true },
  { category: "Shipping", q: "How do I track my package?", a: "A tracking link arrives by email within 24-48 hours of ordering. Multi-item orders may ship as separate tracked packages.", popular: true },
  { category: "Shipping", q: "My package is late or lost", a: "Every shipment is insured. If tracking looks stuck, contact us — lost packages are reshipped or refunded in full, and some products include an automatic late-delivery coupon." },
  { category: "Returns & Refunds", q: "How do I return an item?", a: "Email us within 30 days of delivery with your order number. We send a prepaid label within 1 business day — full steps on the Returns page.", popular: true },
  { category: "Returns & Refunds", q: "When will I get my refund?", a: "Within 3-5 business days of your return arriving back to us, refunded to your original payment method." },
  { category: "Returns & Refunds", q: "My item arrived damaged", a: "Send a photo within 48 hours of delivery and we'll ship a free replacement or refund you in full — your choice. Damaged items never need to be returned first." },
  { category: "Payments", q: "Is my payment secure?", a: "Yes — payments are processed by Stripe with 256-bit SSL encryption. Spotket never sees or stores your card details.", popular: true },
  { category: "Payments", q: "What payment methods do you accept?", a: "All major credit and debit cards via Stripe. Your receipt arrives by email right after checkout." },
  { category: "Account", q: "Do I need an account to order?", a: "No — guest checkout works fine. An account adds order history, saved addresses, and faster checkout." },
  { category: "Account", q: "I forgot my password", a: "Use the sign-in form's email field and contact support if you're locked out — we'll help you reset securely." },
  { category: "Products", q: "Are the reviews real?", a: "Yes. Product reviews come from verified buyers, and customer reviews earn a Verified Purchase badge only when tied to a real Spotket order.", popular: true },
  { category: "Products", q: "Will out-of-stock items return?", a: "Usually, yes. Join the newsletter and we'll announce restocks — popular items return within a few weeks." },
];

export default function HelpCenter() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((article) => {
      if (category && article.category !== category) return false;
      if (q && !`${article.q} ${article.a}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, category]);

  const popular = articles.filter((article) => article.popular);
  const filtering = query.trim() !== "" || category !== null;

  return (
    <div>
      {/* Search */}
      <div className="relative mx-auto max-w-2xl">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search help articles…"
          aria-label="Search help articles"
          className="min-h-13 w-full rounded-full border border-navy-600 bg-navy-900 pl-13 pr-5 text-sm text-white placeholder:text-slate-500 focus:border-brand focus:outline-none"
        />
      </div>

      {/* Categories */}
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {categories.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setCategory(category === item.name ? null : item.name)}
            aria-pressed={category === item.name}
            className={`rounded-2xl border p-5 text-left transition-colors ${
              category === item.name
                ? "border-brand bg-brand/10"
                : "border-navy-700/60 bg-navy-900 hover:border-gold/50"
            }`}
          >
            <item.icon className="h-6 w-6 text-gold" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-white">{item.name}</p>
            <p className="mt-1 hidden text-xs text-slate-400 sm:block">{item.blurb}</p>
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-white">
          {filtering ? `Articles (${visible.length})` : "Popular articles"}
        </h2>
        <div className="mt-4 space-y-3">
          {(filtering ? visible : popular).map((article) => (
            <details key={article.q} className="rounded-2xl border border-navy-700/60 bg-navy-900 px-5 py-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-white">
                {article.q}
                <span className="ml-2 text-xs font-normal text-slate-500">{article.category}</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{article.a}</p>
            </details>
          ))}
          {filtering && visible.length === 0 && (
            <p className="rounded-2xl border border-dashed border-navy-600 p-8 text-center text-sm text-slate-400">
              No articles match — try different words or contact us below.
            </p>
          )}
        </div>
      </div>

      {/* Contact support */}
      <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-navy-700/60 bg-navy-900 p-8 text-center">
        <p className="font-semibold text-white">Still stuck? We're here 24/7.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-8 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Contact Support
          </Link>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-navy-600 px-8 text-sm font-semibold text-slate-200 transition-colors hover:border-gold hover:text-gold"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}
