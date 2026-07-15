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
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Work with Us",
    links: [
      { href: "/contact", label: "Partner with Us" },
      { href: "/contact", label: "Refer a Friend" },
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
    <footer className="relative mt-10 border-t border-navy-700/60 bg-gradient-to-b from-navy-900 via-navy-950 to-black">
      {/* Purple ambience behind the columns */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(124,58,237,0.10), transparent 70%)",
        }}
      />

      {/* Back to top — floating pill over the footer's top edge */}
      <a
        href="#"
        className="absolute left-1/2 top-0 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/40 transition-all hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/50 active:scale-95"
      >
        <ChevronUp className="h-4 w-4" aria-hidden="true" />
        Back to top
      </a>

      {/* Secure shopping banner */}
      <div className="border-b border-navy-800/80 px-4 pb-5 pt-10 text-center sm:px-6">
        <p className="text-sm font-bold tracking-wide text-white">
          🔒 Secure Shopping Guaranteed
        </p>
        <p className="mt-1 text-xs text-slate-400">
          256-bit SSL encryption · PCI-DSS compliant payments · 30-day money-back guarantee
        </p>
      </div>

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

      {/* Payments */}
      <div className="border-t border-navy-700/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-5 sm:px-6">
          <p className="text-sm text-slate-500 sm:text-xs">We accept</p>
          <PaymentIcons />
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
