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
      "Instant email alerts for every inquiry",
      "Basic FAQ + business hours setup",
      "Monthly performance summary",
    ],
    featured: false,
  },
  {
    name: "Standard",
    price: 500,
    description: "The full automation suite plus a website — our most popular plan.",
    features: [
      "Everything in Starter",
      "Custom built website included",
      "Booking automation across text, chat, and email",
      "Automatic review requests after every service",
      "Lead routing to the right person",
      "Ongoing website edits",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: 1000,
    description: "The full growth stack — deeper automation and a dedicated strategist.",
    features: [
      "Everything in Standard",
      "Advanced automations (reminders, follow-ups, re-engagement)",
      "Dedicated monthly strategy call",
      "Full AI system management",
    ],
    featured: false,
  },
] as const;

export const HERO_IMAGE = {
  src: "https://images.unsplash.com/photo-1694903089438-bf28d4697d9a?q=75&w=1200&auto=format&fit=crop",
  alt: "A robotic hand and a human hand reaching toward glowing glass letters that spell AI",
};

export const RESULTS_IMAGE = {
  src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=75&w=1400&auto=format&fit=crop",
  alt: "A laptop screen displaying analytics graphs and performance dashboards",
};

export const CONTACT_IMAGE = {
  src: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?q=75&w=1200&auto=format&fit=crop",
  alt: "A small business team smiling and collaborating around a laptop in a modern office",
};

export const STATS = [
  { value: 24, suffix: "/7", label: "AI Response" },
  { value: 0, suffix: "", label: "Missed Bookings" },
  { value: 5, suffix: "x", label: "More Google Reviews" },
] as const;

export const TRUST_BADGES = [
  "Trusted by Limo Companies",
  "24/7 AI Support",
  "Results-Driven",
] as const;
