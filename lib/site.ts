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
    icon: "chatbot",
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
    icon: "rocket",
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
    icon: "crown",
  },
  {
    name: "AI Receptionist",
    price: 200,
    description: "A dedicated AI voice receptionist that answers every call, 24/7.",
    features: [
      "AI answers and screens every incoming call",
      "Call summaries & transcripts sent instantly",
      "Custom greeting and FAQ script",
      "Missed-call text-back",
    ],
    featured: false,
    icon: "phone",
  },
] as const;

export const FEATURE_HIGHLIGHTS = [
  {
    name: "AI Chatbot",
    description:
      "Answers customer questions instantly, 24/7 — pricing, availability, hours, and more — so no inquiry ever goes unanswered.",
    image: {
      src: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=75&w=1200&auto=format&fit=crop",
      alt: "A sleek white robotic hand reaching outward, representing an AI assistant",
    },
  },
  {
    name: "Booking Automation",
    description:
      "Instant alerts and scheduling the moment a customer reaches out, so you respond in minutes instead of hours.",
    image: {
      src: "https://images.unsplash.com/photo-1649433391719-2e784576d044?q=75&w=1200&auto=format&fit=crop",
      alt: "A close-up of an online calendar interface used to schedule and manage bookings",
    },
  },
  {
    name: "Review Generation",
    description:
      "Automatic review requests sent after every service, turning happy customers into 5-star ratings on autopilot.",
    image: {
      src: "https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=75&w=1200&auto=format&fit=crop",
      alt: "A row of yellow five-star ratings representing a glowing customer review",
    },
  },
  {
    name: "Custom Website",
    description:
      "A fast, mobile-optimized website built for your business — designed to turn visitors into booked customers.",
    image: {
      src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=75&w=1200&auto=format&fit=crop",
      alt: "A laptop on a desk displaying lines of website code in an editor",
    },
  },
  {
    name: "AI Receptionist",
    description:
      "A dedicated AI voice receptionist that answers every call, books appointments, and never puts a customer on hold.",
    image: {
      src: "https://images.unsplash.com/photo-1758876204242-787309002a8f?q=75&w=1200&auto=format&fit=crop",
      alt: "A man talking on the phone at his desk while working on a laptop",
    },
  },
] as const;

export const SERVICES_FAQ = [
  {
    question: "How long does setup take?",
    answer: "Most businesses are fully up and running within 48 hours of signing up.",
  },
  {
    question: "Do I need a contract?",
    answer: "No. There are no long-term contracts — you can cancel any time.",
  },
  {
    question: "What businesses do you work with?",
    answer:
      "Any local business that takes inbound calls, messages, or bookings — from service providers to retail.",
  },
  {
    question: "What if I want to cancel?",
    answer: "Cancel any time, no questions asked. There are no cancellation fees or lock-in periods.",
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
