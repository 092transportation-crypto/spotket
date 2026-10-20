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

export const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/refund-policy", label: "Refund Policy" },
] as const;

export const RESULTS_STATS = [
  { value: "5+", label: "Businesses Automated" },
  { value: "0", label: "Missed Inquiries" },
  { value: "24/7", label: "AI Coverage" },
] as const;

export const CASE_STUDIES = [
  {
    business: "DCA Limos",
    location: "Washington, D.C.",
    problem:
      "After-hours inquiries went straight to voicemail, and the team had no way to respond to quote requests outside business hours.",
    built:
      "An AI chatbot for instant quotes and FAQs, booking automation across text and email, and automatic review requests after every ride.",
    results: [
      "Every inquiry gets an instant response, day or night",
      "No more after-hours leads lost to voicemail",
      "A steady stream of new Google reviews without manual follow-up",
    ],
    quote:
      "Before Spotket, after-hours inquiries went to voicemail and were often lost. Now every inquiry gets an instant AI response, and the team gets a text the moment a lead comes in.",
    quoteAttribution: "Owner, DCA Limos",
  },
  {
    business: "BWI Chauffeur",
    location: "Baltimore, MD",
    problem:
      "Every quote request had to be answered manually, which meant slow replies during the busiest travel days.",
    built:
      "A custom-built website paired with an AI chatbot that answers quote and availability questions instantly, plus automated booking alerts.",
    results: [
      "Customers get instant answers at any hour",
      "New booking requests get routed to the team immediately",
      "Reviews now come in automatically after every trip",
    ],
    quote:
      "We used to lose rides because we couldn't answer fast enough during our busiest hours. Now the AI handles it instantly, day or night.",
    quoteAttribution: "Owner, BWI Chauffeur",
  },
  {
    business: "IAD Airport Limo",
    location: "Dulles / Northern Virginia",
    problem:
      "The team spent time answering the same repeat questions instead of focusing on customers who were ready to book.",
    built:
      "An AI chatbot that handles FAQs and initial screening, automatic lead routing, and a rebuilt, mobile-optimized website.",
    results: [
      "Repeat questions are now answered automatically",
      "The team can focus on bookings that are ready to close",
      "A faster, cleaner website experience for every visitor",
    ],
    quote:
      "The AI chatbot answers the questions we used to repeat all day, so our team can focus on the bookings that matter.",
    quoteAttribution: "Owner, IAD Airport Limo",
  },
  {
    business: "MSY Limo Service",
    location: "New Orleans, LA",
    problem:
      "Happy customers rarely left a review unless someone remembered to ask them personally after the ride.",
    built:
      "An automatic post-ride review request system, booking automation, and an AI chatbot for instant customer questions.",
    results: [
      "Review requests go out automatically after every completed ride",
      "A steady increase in new reviews with zero manual follow-up",
      "Faster responses to every incoming inquiry",
    ],
    quote:
      "We don't have to remember to ask for reviews anymore — it just happens after every ride.",
    quoteAttribution: "Owner, MSY Limo Service",
  },
] as const;

export const RESULTS_COMPARISON = [
  {
    label: "Response time",
    before: "Hours, or next business day",
    after: "Instant, 24/7",
  },
  {
    label: "After-hours inquiries",
    before: "Missed or sent to voicemail",
    after: "Answered automatically by AI",
  },
  {
    label: "Reviews",
    before: "Only when someone remembered to ask",
    after: "Requested automatically after every job",
  },
  {
    label: "Lead visibility",
    before: "No way to know what was missed",
    after: "Every inquiry logged and tracked",
  },
  {
    label: "Website",
    before: "Outdated, or no website at all",
    after: "Custom-built and mobile-optimized",
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    title: "Free Audit",
    summary: "We analyze your current setup.",
    description:
      "We review how customers reach your business today — your website, phone line, texts, and socials — and find exactly where inquiries get missed, delayed, or lost. No cost, no obligation.",
    faq: [
      {
        question: "Is the audit really free?",
        answer:
          "Yes. There's no cost and no obligation — we'll walk you through what we find either way.",
      },
      {
        question: "How long does the audit take?",
        answer:
          "Usually a day or two, depending on how many channels — phone, web, socials — we need to review.",
      },
    ],
  },
  {
    title: "Custom Build",
    summary: "We build everything in 48 hours.",
    description:
      "We set up your AI chatbot, booking automation, and website, tuned to how your business actually runs. No generic templates — it's built around your services, hours, and pricing.",
    faq: [
      {
        question: "How long does the build take?",
        answer: "Most builds are completed within 48 hours of the audit.",
      },
      {
        question: "Will it match my branding?",
        answer:
          "Yes — everything is customized to your business, services, hours, and pricing, not a generic template.",
      },
    ],
  },
  {
    title: "Go Live",
    summary: "Your AI system starts working immediately.",
    description:
      "Your AI chatbot, booking alerts, and review automation go live and start working the moment they're switched on — answering inquiries and notifying your team around the clock.",
    faq: [
      {
        question: "Do I need to do anything to launch?",
        answer:
          "No — we handle the full rollout and let you know the moment it's live.",
      },
      {
        question: "What if something needs adjusting after launch?",
        answer:
          "We fine-tune it in the first few days based on real customer interactions.",
      },
    ],
  },
  {
    title: "Ongoing Support",
    summary: "We monitor and improve every month.",
    description:
      "We monitor performance every month, make improvements, and keep your system tuned as your business grows — so it keeps getting better, not stale.",
    faq: [
      {
        question: "What does ongoing support include?",
        answer:
          "Monitoring, a monthly performance summary, and ongoing adjustments to your chatbot, automations, and website.",
      },
      {
        question: "Can I upgrade my plan later?",
        answer: "Yes — you can move to a higher plan at any time as your needs grow.",
      },
    ],
  },
] as const;

export const WHAT_YOU_GET = [
  "A custom AI chatbot trained on your business",
  "Instant booking and inquiry automation",
  "Automatic review requests after every job",
  "A professional, mobile-optimized website (Standard & Premium)",
  "Monthly performance reporting",
  "Ongoing support and improvements",
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
