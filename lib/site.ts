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
    description: "The full automation suite plus a website — our most popular plan.",
    features: [
      "Everything in Starter",
      "Custom-built, mobile-optimized website included",
      "Booking automation across text, chat, and email",
      "Automatic review requests after every service",
      "Lead routing to the right person on your team",
      "Ongoing website edits and improvements",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: 1000,
    description: "The full growth stack — SEO, deeper automation, and a dedicated strategist.",
    features: [
      "Everything in Standard",
      "Ongoing SEO management (keyword, content & technical)",
      "Automated invoice & payment reminders",
      "Advanced lead scoring and re-engagement automation",
      "Priority development queue for new requests",
      "Dedicated monthly strategy call",
    ],
    featured: false,
  },
] as const;

export const SERVICES = [
  {
    name: "Inbox & Email Management",
    description:
      "Never miss a booking or important message. We set up AI that filters your emails, auto-routes inquiries, and sends instant replies to customers 24/7.",
    price: "Starting at $300/month",
    image: {
      src: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=75&w=1200&auto=format&fit=crop",
      alt: "A Gmail inbox open on a laptop screen, showing the compose button and message list",
    },
  },
  {
    name: "Meeting Administration",
    description:
      "Every call automatically recorded, transcribed, and summarized. Action items tracked and sent to your team instantly after every meeting.",
    price: "Starting at $200/month",
    image: {
      src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=75&w=1200&auto=format&fit=crop",
      alt: "A hand holding three sticky notes labeled To Do, Doing, and Done, representing tracked action items",
    },
  },
  {
    name: "Data Entry & Document Processing",
    description:
      "We extract data from PDFs, invoices, and forms automatically and map it directly into your Google Sheets, Airtable, or CRM. Zero manual entry.",
    price: "Starting at $400/month",
    image: {
      src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=75&w=1200&auto=format&fit=crop",
      alt: "Two people reviewing handwritten notes and spreadsheets next to open laptops",
    },
  },
  {
    name: "Invoice & Payment Tracking",
    description:
      "Automated escalating reminders for overdue invoices. Never chase a payment manually again. Get paid faster on autopilot.",
    price: "Starting at $250/month",
    image: {
      src: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=75&w=1200&auto=format&fit=crop",
      alt: "A close-up of a hand tapping a credit card against a card reader to complete a payment",
    },
  },
  {
    name: "Content Repurposing",
    description:
      "Turn your videos, podcasts, and long form content into social media posts, captions, and graphics automatically. Post everywhere in minutes.",
    price: "Starting at $300/month",
    image: {
      src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=75&w=1200&auto=format&fit=crop",
      alt: "A person posting social content from a laptop and phone at the same time",
    },
  },
  {
    name: "Lead Qualification",
    description:
      "AI scores every incoming lead, prioritizes hot prospects, and automatically updates your CRM pipeline so your team focuses on the right people.",
    price: "Starting at $400/month",
    image: {
      src: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=75&w=1200&auto=format&fit=crop",
      alt: "Two people working at desks with a sales pipeline dashboard open on a laptop screen",
    },
  },
  {
    name: "Custom Website Design",
    description:
      "A professional, mobile-optimized website built for your business — fast, clean, and designed to turn visitors into booked customers.",
    price: "Starting at $1,500 one time",
    image: {
      src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=75&w=1200&auto=format&fit=crop",
      alt: "A laptop on a desk displaying lines of website code in an editor",
    },
  },
  {
    name: "SEO Management",
    description:
      "Ongoing keyword, content, and technical SEO work that keeps your site ranking — so new customers keep finding you without paying for every click.",
    price: "Starting at $500/month",
    image: {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=75&w=1200&auto=format&fit=crop",
      alt: "A laptop displaying a performance dashboard with traffic and ranking charts",
    },
  },
  {
    name: "AI Chatbot Setup",
    description:
      "Answers customer questions 24/7 — pricing, availability, hours, and more — so no inquiry ever goes unanswered, even at 2am.",
    price: "Starting at $500/month",
    image: {
      src: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=75&w=1200&auto=format&fit=crop",
      alt: "A sleek white robotic hand reaching outward, representing an AI assistant",
    },
  },
  {
    name: "Booking Automation",
    description:
      "Instant text alerts for every inquiry, so you or your team can respond in minutes instead of hours — before the customer books with someone else.",
    price: "Starting at $500/month",
    image: {
      src: "https://images.unsplash.com/photo-1649433391719-2e784576d044?q=75&w=1200&auto=format&fit=crop",
      alt: "A close-up of an online calendar interface used to schedule and manage bookings",
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
