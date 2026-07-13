import { ChevronUp } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";
import PaymentIcons from "@/components/PaymentIcons";
import {
  FREE_SHIPPING_THRESHOLD,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_TEL,
} from "@/lib/site";

const columns = [
  {
    title: "Get to Know Us",
    links: [
      { href: "/about", label: "About Spotket" },
      { href: "/trending", label: "What's Trending" },
      { href: "/about", label: "Careers" },
      { href: "/about", label: "Press" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Make Money with Us",
    links: [
      { href: "/contact", label: "Sell on Spotket" },
      { href: "/contact", label: "Affiliate Program" },
      { href: "/contact", label: "Advertise Your Products" },
      { href: "/contact", label: "Become a Supplier" },
    ],
  },
  {
    title: "Payment Products",
    links: [
      { href: "/help", label: "Cards We Accept" },
      { href: "/help", label: "PayPal & Apple Pay" },
      { href: "/help", label: "Secure Checkout" },
      { href: "/help", label: "Currency & Pricing" },
    ],
  },
  {
    title: "Let Us Help You",
    links: [
      { href: "/account", label: "Your Account" },
      { href: "/account", label: "Your Orders" },
      { href: "/trending", label: "Trending Now" },
      { href: "/shipping", label: "Shipping Info" },
      { href: "/returns", label: "Returns & Refunds" },
      { href: "/help", label: "Help Center" },
    ],
  },
];

const socialLinks = [
  {
    name: "TikTok",
    href: "https://tiktok.com/@spotketllc.5",
    icon: (
      <path d="M16.6 3c.4 2.2 1.8 3.7 4 4v3c-1.6 0-3-.5-4-1.3v6.6c0 3.4-2.5 5.7-5.7 5.7A5.6 5.6 0 0 1 5.4 15c0-3.2 2.6-5.7 6-5.5v3.1c-1.7-.3-3 .8-3 2.4a2.6 2.6 0 0 0 2.6 2.6c1.6 0 2.6-1.1 2.6-2.9V3h3Z" />
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/spotket.llc",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" fill="none" strokeWidth="2" stroke="currentColor" />
        <circle cx="12" cy="12" r="4" fill="none" strokeWidth="2" stroke="currentColor" />
        <circle cx="17.2" cy="6.8" r="1.3" />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-navy-700/60 bg-navy-900">
      {/* Back to top */}
      <a
        href="#"
        className="flex min-h-11 items-center justify-center gap-1.5 bg-navy-800 py-3 text-center text-xs font-semibold text-slate-300 transition-colors hover:bg-navy-700 hover:text-white"
      >
        <ChevronUp className="h-4 w-4" aria-hidden="true" />
        Back to top
      </a>

      {/* Brand + link columns */}
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 sm:py-12 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Logo withTagline />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
            Spotket exists so you can shop smarter. We research, test, and
            hand-pick premium products from verified suppliers, then back every
            order with free shipping over ${FREE_SHIPPING_THRESHOLD}, 30-day
            hassle-free returns, a price match guarantee, and support that
            never sleeps.
          </p>
          <p className="mt-4 text-sm text-slate-400">
            <a href={SUPPORT_PHONE_TEL} className="font-semibold text-brand hover:underline">
              {SUPPORT_PHONE}
            </a>
            <span className="mx-2 text-navy-600">·</span>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-brand hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </p>

          {/* Social */}
          <ul className="mt-5 flex gap-3" aria-label="Spotket on social media">
            {socialLinks.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-600 text-slate-300 transition-all hover:border-brand hover:bg-brand/10 hover:text-brand"
                >
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    {social.icon}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {columns.map((column) => (
          <nav
            key={column.title}
            aria-label={column.title}
            className="border-t border-navy-800 pt-6 lg:border-0 lg:pt-0"
          >
            <h3 className="text-sm font-bold text-white">{column.title}</h3>
            <ul className="mt-3 space-y-0.5 sm:mt-4 sm:space-y-1">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="block py-1.5 text-base text-slate-400 transition-colors hover:text-brand hover:underline sm:py-0.5 sm:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Secure shopping + payments */}
      <div className="border-t border-navy-700/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-4 sm:px-6 sm:py-7 md:flex-row md:justify-between">
          <div className="flex items-center gap-3 rounded-2xl border border-navy-700/60 bg-navy-800/60 px-4 py-3">
            <svg
              className="h-8 w-8 shrink-0 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2 4.5 5v6c0 5 3.2 8.7 7.5 10 4.3-1.3 7.5-5 7.5-10V5L12 2Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <div>
              <p className="text-sm font-bold text-white">100% Secure Shopping</p>
              <p className="text-xs text-slate-400">
                256-bit SSL encryption · PCI-DSS compliant payments
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 md:items-end">
            <p className="text-sm text-slate-500 sm:text-xs">We accept</p>
            <PaymentIcons />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-700/60 bg-navy-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-slate-500 sm:flex-row sm:px-6 sm:text-xs">
          <p>
            © {new Date().getFullYear()} Spotket. All rights reserved.
            <span className="ml-2">Made with <span aria-label="love" className="text-red-400">♥</span> in Maryland</span>
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <li>
              <Link href="/privacy" className="inline-block py-1.5 transition-colors hover:text-brand sm:py-0.5">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="inline-block py-1.5 transition-colors hover:text-brand sm:py-0.5">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/returns" className="inline-block py-1.5 transition-colors hover:text-brand sm:py-0.5">
                Returns
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="inline-block py-1.5 transition-colors hover:text-brand sm:py-0.5">
                Shipping
              </Link>
            </li>
            <li>
              <Link href="/contact" className="inline-block py-1.5 transition-colors hover:text-brand sm:py-0.5">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
