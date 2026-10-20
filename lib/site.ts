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
    image: {
      src: "https://images.unsplash.com/photo-1675865254433-6ba341f0f00b?q=75&w=1200&auto=format&fit=crop",
      alt: "An AI chatbot interface glowing on a dark screen, showing example questions and capabilities",
    },
  },
  {
    name: "Booking Automation",
    description:
      "Instant text alerts for every inquiry, so you or your team can respond in minutes instead of hours — before the customer books with someone else.",
    image: {
      src: "https://images.unsplash.com/photo-1649433391719-2e784576d044?q=75&w=1200&auto=format&fit=crop",
      alt: "A close-up of an online calendar interface used to schedule and manage bookings",
    },
  },
  {
    name: "Review Generation",
    description:
      "Automatic review requests after every service, sent at the right moment, so your Google rating grows on autopilot instead of relying on memory.",
    image: {
      src: "https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=75&w=1200&auto=format&fit=crop",
      alt: "Five yellow star icons lined up in a row, representing a five-star customer review",
    },
  },
  {
    name: "Custom Website",
    description:
      "A professional, mobile-optimized website built for your business — fast, clean, and designed to turn visitors into booked customers.",
    image: {
      src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=75&w=1200&auto=format&fit=crop",
      alt: "A laptop on a desk displaying lines of website code in an editor",
    },
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
