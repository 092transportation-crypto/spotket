export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.spotket.com";

export const SITE_NAME = "Spotket Digital";
export const SITE_TAGLINE =
  "AI automation and web design for small businesses that don't want to miss another customer.";
export const CONTACT_EMAIL = "hello@spotket.com";

export const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/results", label: "Results" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

export const PRICING_TIERS = [
  {
    name: "Starter",
    price: 300,
    description: "A 24/7 front line for businesses that just need to stop missing leads.",
    features: [
      "AI chatbot on your website",
      "Instant text alerts for every inquiry",
      "Basic FAQ + business hours setup",
      "Monthly performance summary",
    ],
    featured: false,
  },
  {
    name: "Standard",
    price: 500,
    description: "The full automation suite — our most popular plan.",
    features: [
      "Everything in Starter",
      "Booking automation across text, chat, and email",
      "Automatic review requests after every service",
      "Lead routing to the right person on your team",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: 1000,
    description: "A full AI system plus a custom website built to convert.",
    features: [
      "Everything in Standard",
      "Custom-built, mobile-optimized website",
      "Ongoing website edits and improvements",
      "Advanced automation (reminders, follow-ups, re-engagement)",
      "Dedicated monthly strategy call",
    ],
    featured: false,
  },
] as const;

export const SERVICES = [
  {
    name: "AI Chatbot",
    description:
      "Answers customer questions 24/7 — pricing, availability, hours, and more — so no inquiry ever goes unanswered, even at 2am.",
  },
  {
    name: "Booking Automation",
    description:
      "Instant text alerts for every inquiry, so you or your team can respond in minutes instead of hours — before the customer books with someone else.",
  },
  {
    name: "Review Generation",
    description:
      "Automatic review requests after every service, sent at the right moment, so your Google rating grows on autopilot instead of relying on memory.",
  },
  {
    name: "Custom Website",
    description:
      "A professional, mobile-optimized website built for your business — fast, clean, and designed to turn visitors into booked customers.",
  },
] as const;
