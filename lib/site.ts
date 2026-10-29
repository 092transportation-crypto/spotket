export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.spotket.com";

export const SITE_NAME = "Spotket Digital";
export const SITE_TAGLINE =
  "AI automation for small business — AI chatbots, AI receptionists, and automated review requests that get you more bookings, 24/7.";
export const CONTACT_EMAIL = "hello@spotket.com";

/** The "Book a Call" link used in outbound emails. Set NEXT_PUBLIC_BOOKING_URL (a real Calendly link) to override — defaults to the contact page. */
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || `${SITE_URL}/contact`;

export const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/results", label: "Results" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

export const PRICING_TIERS = [
  {
    name: "Standard",
    price: 500,
    description:
      "The complete automation suite for local businesses — website, AI chatbot, AI receptionist, and ongoing SEO, all in one flat monthly plan.",
    features: [
      "Custom website built for your business",
      "AI chatbot that answers customer questions 24/7",
      "AI receptionist that answers calls and texts automatically",
      "Never miss an inquiry — instant alerts + automated follow up",
      "Monthly SEO — blog posts and landing pages to increase Google rankings",
      "No contracts — cancel anytime",
    ],
    featured: true,
    icon: "rocket",
  },
] as const;

export const FEATURE_HIGHLIGHTS = [
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
    name: "AI Chatbot",
    description:
      "Answers customer questions instantly, 24/7 — pricing, availability, hours, and more — so no inquiry ever goes unanswered.",
    image: {
      src: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=75&w=1200&auto=format&fit=crop",
      alt: "A sleek white robotic hand reaching outward, representing an AI assistant",
    },
  },
  {
    name: "AI Receptionist",
    description:
      "A dedicated AI voice receptionist that answers every call and text automatically — no more voicemail, no more missed walk-ins.",
    image: {
      src: "https://images.unsplash.com/photo-1758876204242-787309002a8f?q=75&w=1200&auto=format&fit=crop",
      alt: "A man talking on the phone at his desk while working on a laptop",
    },
  },
  {
    name: "Instant Alerts & Follow-Up",
    description:
      "The moment a customer reaches out, you get an instant alert — and automated follow-up makes sure no inquiry ever slips through the cracks.",
    image: {
      src: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=75&w=1200&auto=format&fit=crop",
      alt: "A laptop screen showing an email inbox with new message alerts",
    },
  },
  {
    name: "Monthly SEO",
    description:
      "Fresh blog posts and landing pages published every month, built to climb Google rankings and bring in new organic traffic.",
    image: {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=75&w=1200&auto=format&fit=crop",
      alt: "A laptop displaying website traffic and SEO analytics charts",
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
    icon: "audit",
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
    icon: "build",
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
    icon: "launch",
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
    icon: "support",
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

export const OFFICE_HERO_IMAGE = {
  src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=75&w=2000&auto=format&fit=crop",
  alt: "A modern tech workspace with a team working at monitors",
};

export const BUSINESS_PHOTO = {
  src: "https://images.unsplash.com/photo-1714624257449-b5495d1b8278?q=75&w=1400&auto=format&fit=crop",
  alt: "A black chauffeur car driving down a city street",
};

export const MISSED_INQUIRIES_STAT =
  "The average small business misses 40% of inquiries — we fix that.";

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

export const HOME_FAQ = [
  {
    question: "What does Spotket actually build for my business?",
    answer:
      "A custom website, an AI chatbot and AI receptionist that answer every customer instantly, instant alerts and automated follow-up the moment a lead comes in, and ongoing monthly SEO to grow your Google rankings — all in one flat monthly plan.",
  },
  {
    question: "How is this different from hiring a receptionist?",
    answer:
      "The AI never sleeps, never takes a break, and never misses a call — at a fraction of the cost of a full-time hire. It answers every inquiry 24/7, including nights, weekends, and holidays.",
  },
  {
    question: "How quickly can I get started?",
    answer:
      "Most businesses go live within 48 hours of signing up. We handle the setup — you just tell us about your business.",
  },
] as const;

export const PRICING_FAQ = [
  {
    question: "Is there a setup fee?",
    answer:
      "No hidden setup fees. Your monthly plan covers everything, including the initial build.",
  },
  {
    question: "Can I switch plans later?",
    answer:
      "Yes — you can upgrade or downgrade at any time as your business needs change.",
  },
  {
    question: "What happens if I want to cancel?",
    answer:
      "There are no long-term contracts on any plan. Cancel any time, no questions asked.",
  },
] as const;

export const CONTACT_FAQ = [
  {
    question: "What happens after I submit the form?",
    answer:
      "We'll reach out within one business day to learn about your business and walk you through exactly what automation would look like for you — no pressure, no obligation.",
  },
  {
    question: "Do I need to know which plan I want before reaching out?",
    answer:
      "No. Most people aren't sure which plan fits best until we talk through their business — we'll recommend the right one for you.",
  },
  {
    question: "Is the first call really free?",
    answer:
      "Yes, the 10-minute call and the automation audit that follows are both completely free, with no obligation to sign up.",
  },
] as const;

export const RESULTS_FAQ = [
  {
    question: "Are these real businesses?",
    answer:
      "Yes. 92 Transportation, DCA Limos, BWI Chauffeur, IAD Airport Limo, and MSY Limo Service are all real Spotket clients.",
  },
  {
    question: "Do you only work with limo and transportation companies?",
    answer:
      "No — those are simply our longest-running clients. The same AI chatbot, booking automation, and review system work for any local business that takes calls, messages, or bookings.",
  },
  {
    question: "How soon do businesses typically see a difference?",
    answer:
      "Most businesses notice the difference within the first week — inquiries that used to go to voicemail start getting answered instantly instead.",
  },
] as const;

/**
 * Programmatic SEO landing pages, served at /lp/[slug]. Each targets one
 * specific keyword with its own meta title/description, H1, and FAQ —
 * `relatedSlugs` cross-links a handful of other pages in this list so the
 * set forms an internally-linked cluster rather than 20 orphan pages.
 */
export const LANDING_PAGES = [
  {
    slug: "ai-automation-for-barbershops",
    keyword: "AI automation for barbershops",
    metaTitle: "AI Automation for Barbershops | Spotket Digital",
    metaDescription:
      "AI automation for barbershops — an AI chatbot and receptionist that answers every call and booking request, 24/7, so you never lose a walk-in. From $200/month.",
    h1: "AI Automation for Barbershops",
    heroSubheading:
      "Stop losing walk-ins and bookings to a phone that rings while you're mid-cut.",
    painPoints: [
      "Calls go to voicemail while you're mid-cut, and most callers never call back",
      "Walk-ins get turned away when no one knows real-time chair availability",
      "No one asks for a review after a good haircut, so your Google rating stalls",
      "You're running the shop and answering the phone at the same time",
    ],
    included: [
      "An AI chatbot that answers hours, pricing, and availability questions instantly",
      "Booking alerts sent to your phone the second a new request comes in",
      "Automatic review requests sent after every appointment",
    ],
    faq: [
      {
        question: "Can an AI chatbot handle booking requests for a barbershop?",
        answer:
          "Yes. It answers questions about hours, pricing, and availability instantly, and sends booking requests straight to your phone.",
      },
      {
        question: "What if a customer calls instead of texting?",
        answer:
          "Add the AI Receptionist plan and every call gets answered — no more voicemail, no more lost walk-ins.",
      },
      {
        question: "How fast can a barbershop get set up?",
        answer: "Most shops are fully live within 48 hours of signing up.",
      },
    ],
    relatedSlugs: [
      "ai-chatbot-for-salons-and-spas",
      "ai-automation-for-nail-salons",
      "booking-automation-for-small-business",
    ],
  },
  {
    slug: "ai-chatbot-for-limo-companies",
    keyword: "AI chatbot for limo companies",
    metaTitle: "AI Chatbot for Limo Companies | Spotket Digital",
    metaDescription:
      "An AI chatbot for limo companies that answers quote requests instantly, 24/7 — built for airport runs, weddings, and corporate accounts. From $200/month.",
    h1: "AI Chatbot for Limo Companies",
    heroSubheading:
      "Give every quote request an instant answer — even at 2am before an airport run.",
    painPoints: [
      "After-hours quote requests go to voicemail and get booked with a competitor instead",
      "Repeat questions about pricing, availability, and vehicle options eat up dispatcher time",
      "Drivers and dispatchers can't answer the phone and run routes at the same time",
      "Great rides rarely turn into Google reviews unless someone remembers to ask",
    ],
    included: [
      "An AI chatbot trained on your fleet, pricing, and service area",
      "Instant quote responses with booking alerts sent to your team",
      "Automatic review requests sent after every completed ride",
    ],
    faq: [
      {
        question: "Does the AI chatbot know our pricing and vehicle options?",
        answer:
          "Yes — it's trained on your specific services, rates, and fleet, so answers are accurate, not generic.",
      },
      {
        question: "Can it handle airport run requests outside business hours?",
        answer:
          "That's exactly what it's built for — instant answers 24/7, with a text alert to your team the moment a request comes in.",
      },
      {
        question: "Do you already work with limo and chauffeur companies?",
        answer:
          "Yes. Spotket built the automation behind DCA Limos, BWI Chauffeur, IAD Airport Limo, and MSY Limo Service — see their [results](/results).",
      },
    ],
    relatedSlugs: [
      "ai-receptionist-for-small-business",
      "booking-automation-for-small-business",
      "automated-review-requests-for-small-business",
    ],
  },
  {
    slug: "ai-automation-for-cleaning-companies",
    keyword: "AI automation for cleaning companies",
    metaTitle: "AI Automation for Cleaning Companies | Spotket Digital",
    metaDescription:
      "AI automation for cleaning companies — instant quote responses, booking alerts, and automatic review requests, 24/7. Plans from $200/month.",
    h1: "AI Automation for Cleaning Companies",
    heroSubheading:
      "Quote requests don't wait for business hours — now your response doesn't either.",
    painPoints: [
      "Quote requests come in at night and on weekends and sit unanswered until Monday",
      "Crews are out cleaning, so no one's available to answer the phone",
      "Recurring clients don't get reminders, leading to missed or late visits",
      "Happy clients rarely leave a review unless asked right after the job",
    ],
    included: [
      "An AI chatbot that answers pricing and scheduling questions instantly",
      "Booking automation that alerts your team the moment a quote request comes in",
      "Automatic review requests sent after every completed cleaning",
    ],
    faq: [
      {
        question: "Can this handle recurring client scheduling?",
        answer:
          "Yes — booking automation can route recurring and one-time requests to your team the moment they come in.",
      },
      {
        question: "Is there a contract?",
        answer: "No long-term contract on any plan. Cancel any time.",
      },
      {
        question: "How fast can a cleaning company get set up?",
        answer: "Most businesses are fully live within 48 hours of signing up.",
      },
    ],
    relatedSlugs: [
      "ai-automation-for-landscaping-companies",
      "booking-automation-for-small-business",
      "get-more-google-reviews-automatically",
    ],
  },
  {
    slug: "ai-receptionist-for-small-business",
    keyword: "AI receptionist for small business",
    metaTitle: "AI Receptionist for Small Business | Spotket Digital",
    metaDescription:
      "A dedicated AI receptionist for small business that answers every call, 24/7 — no hold music, no voicemail, no missed customers. From $200/month.",
    h1: "AI Receptionist for Small Business",
    heroSubheading:
      "A dedicated AI voice receptionist that answers every call, 24/7 — no hold music, no voicemail.",
    painPoints: [
      "Missed calls during busy hours mean missed business",
      "Hiring a full-time receptionist is expensive for a small team",
      "Most callers hang up rather than leave a voicemail",
      "After-hours calls go unanswered until the next business day",
    ],
    included: [
      "An AI voice receptionist that answers and screens every incoming call",
      "Instant call summaries and transcripts sent to your team",
      "Missed-call text-back so no caller is ever left hanging",
    ],
    faq: [
      {
        question: "How is this different from a human receptionist?",
        answer:
          "The AI receptionist never sleeps, takes a break, or calls in sick — and it costs a fraction of a full-time hire.",
      },
      {
        question: "Will it sound robotic to callers?",
        answer:
          "It's built with a custom greeting and FAQ script for your business, so it sounds natural and answers accurately.",
      },
      {
        question: "What happens to calls it can't fully resolve?",
        answer:
          "It takes a message, sends your team an instant summary and transcript, and makes sure nothing falls through the cracks.",
      },
    ],
    relatedSlugs: [
      "24-7-ai-receptionist-for-small-business",
      "booking-automation-for-small-business",
      "custom-website-for-small-business",
    ],
  },
  {
    slug: "automated-review-requests-for-small-business",
    keyword: "automated review requests for small business",
    metaTitle: "Automated Review Requests for Small Business | Spotket Digital",
    metaDescription:
      "Automated review requests for small business — turn every completed job into a 5-star Google review automatically. Plans from $200/month.",
    h1: "Automated Review Requests for Small Business",
    heroSubheading:
      "Turn every completed job into a 5-star Google review — without lifting a finger.",
    painPoints: [
      "Happy customers rarely leave a review unless someone remembers to ask",
      "Manually texting or emailing every customer for a review takes time you don't have",
      "Competitors with more reviews win the click, even with the same service quality",
      "There's no way to track which customers were actually asked for a review",
    ],
    included: [
      "An automatic review request sent right after every completed job",
      "Review tracking so you always know who's been asked",
      "Built-in alongside the AI chatbot and booking automation for a full front line",
    ],
    faq: [
      {
        question: "How does the review request go out?",
        answer:
          "Automatically by text or email right after a job is marked complete, while the experience is still fresh.",
      },
      {
        question: "Does it only work for Google reviews?",
        answer:
          "Google is the primary focus since it drives the most new customer trust, but requests can point wherever you want feedback.",
      },
      {
        question: "Do I have to remember to turn it on for each customer?",
        answer: "No — once it's set up, every completed job triggers the request automatically.",
      },
    ],
    relatedSlugs: [
      "get-more-google-reviews-automatically",
      "booking-automation-for-small-business",
      "ai-receptionist-for-small-business",
    ],
  },
  {
    slug: "website-and-ai-automation-maryland",
    keyword: "website and AI automation Maryland",
    metaTitle: "Website and AI Automation for Maryland Businesses | Spotket",
    metaDescription:
      "Website and AI automation for Maryland small businesses — a custom website plus a 24/7 AI chatbot that never misses an inquiry. Plans from $200/month.",
    h1: "Website and AI Automation for Maryland Small Businesses",
    heroSubheading:
      "A custom website plus a 24/7 AI chatbot — built for small businesses across Maryland.",
    painPoints: [
      "An outdated or missing website costs you credibility with local customers",
      "Maryland small business owners juggle calls, texts, and walk-ins with no central system",
      "Local competitors show up first on Google when their site and reviews are stronger",
      "No way to capture after-hours inquiries from your own website",
    ],
    included: [
      "A custom-built, mobile-optimized website designed to turn visitors into customers",
      "An AI chatbot on your site that answers questions and captures leads 24/7",
      "Booking automation and review requests layered on top",
    ],
    faq: [
      {
        question: "Do you work with businesses outside Maryland too?",
        answer:
          "Yes — Spotket works with small businesses anywhere, including several already serving the Maryland and D.C. area.",
      },
      {
        question: "Is the website included in every plan?",
        answer:
          "A custom website is included on the Standard and Premium plans. The Starter plan covers the AI chatbot alone.",
      },
      {
        question: "How long does the website build take?",
        answer: "Most builds are completed within 48 hours as part of the initial setup.",
      },
    ],
    relatedSlugs: [
      "custom-website-for-small-business",
      "ai-chatbot-for-limo-companies",
      "ai-receptionist-for-small-business",
    ],
  },
  {
    slug: "ai-automation-for-nail-salons",
    keyword: "AI automation for nail salons",
    metaTitle: "AI Automation for Nail Salons | Spotket Digital",
    metaDescription:
      "AI automation for nail salons — an AI chatbot that answers booking questions instantly so you stop losing clients to voicemail. From $200/month.",
    h1: "AI Automation for Nail Salons",
    heroSubheading: "Stop losing bookings to voicemail between appointments.",
    painPoints: [
      "Calls go unanswered while you're mid-appointment",
      "No-shows and late cancellations cost you chair time",
      "Clients don't know your real-time availability without calling",
      "Reviews pile up slower than they should without automatic requests",
    ],
    included: [
      "An AI chatbot that answers pricing and availability questions instantly",
      "Booking alerts sent to your phone the moment a request comes in",
      "Automatic review requests sent after every appointment",
    ],
    faq: [
      {
        question: "Can clients book directly through the chatbot?",
        answer:
          "The chatbot answers questions and captures the request instantly, then routes it to your team to confirm — so nothing slips through.",
      },
      {
        question: "Will it help with no-shows?",
        answer:
          "Booking automation includes reminders that cut down on missed appointments.",
      },
      {
        question: "How fast can a salon get set up?",
        answer: "Most salons are fully live within 48 hours of signing up.",
      },
    ],
    relatedSlugs: [
      "ai-chatbot-for-salons-and-spas",
      "ai-automation-for-barbershops",
      "get-more-google-reviews-automatically",
    ],
  },
  {
    slug: "get-more-google-reviews-automatically",
    keyword: "get more Google reviews automatically",
    metaTitle: "Get More Google Reviews Automatically | Spotket Digital",
    metaDescription:
      "Get more Google reviews automatically with a system that asks every customer right after their experience, while it's still fresh. From $200/month.",
    h1: "Get More Google Reviews Automatically",
    heroSubheading:
      "A system that asks every customer for a review right after their experience — while it's still fresh.",
    painPoints: [
      "Manually asking for reviews falls through the cracks on busy days",
      "Most happy customers need a nudge to actually leave a review",
      "A stale Google rating makes new customers choose a competitor instead",
      "No visibility into who's been asked for a review and who hasn't",
    ],
    included: [
      "An automatic review request triggered right after a job or appointment",
      "Tracking so you always know who's been asked",
      "Paired with the AI chatbot and booking automation for a full front line",
    ],
    faq: [
      {
        question: "How soon after a job does the request go out?",
        answer:
          "Right after the job is marked complete, while the experience is still fresh in the customer's mind.",
      },
      {
        question: "Does this replace asking customers in person?",
        answer:
          "No — it's a backup that makes sure every customer gets asked, even on your busiest days.",
      },
      {
        question: "Can I see which customers were asked?",
        answer: "Yes, review request activity is tracked as part of your monthly performance summary.",
      },
    ],
    relatedSlugs: [
      "automated-review-requests-for-small-business",
      "ai-automation-for-nail-salons",
      "booking-automation-for-small-business",
    ],
  },
  {
    slug: "ai-chatbot-for-restaurants",
    keyword: "AI chatbot for restaurants",
    metaTitle: "AI Chatbot for Restaurants | Spotket Digital",
    metaDescription:
      "An AI chatbot for restaurants that answers reservation and menu questions instantly — even during the dinner rush. Plans from $200/month.",
    h1: "AI Chatbot for Restaurants",
    heroSubheading:
      "Answer reservation and menu questions instantly — even during the dinner rush.",
    painPoints: [
      "Phones ring off the hook during peak hours and calls go unanswered",
      "Staff get pulled off the floor to answer the same questions about hours and menu",
      "Reservation requests outside business hours go straight to voicemail",
      "Wait times and online reviews suffer when the front desk is overwhelmed",
    ],
    included: [
      "An AI chatbot trained on your hours, menu, and reservation policy",
      "Instant answers to common questions so staff can stay on the floor",
      "Automatic review requests sent after a great visit",
    ],
    faq: [
      {
        question: "Can the chatbot take reservations directly?",
        answer:
          "It answers questions instantly and captures the request, routing it straight to your team to confirm.",
      },
      {
        question: "Will it know our current menu and hours?",
        answer: "Yes — it's trained on your specific menu, hours, and policies, not a generic script.",
      },
      {
        question: "How fast can a restaurant get set up?",
        answer: "Most restaurants are fully live within 48 hours of signing up.",
      },
    ],
    relatedSlugs: [
      "booking-automation-for-small-business",
      "ai-receptionist-for-small-business",
      "get-more-google-reviews-automatically",
    ],
  },
  {
    slug: "booking-automation-for-small-business",
    keyword: "booking automation for small business",
    metaTitle: "Booking Automation for Small Business | Spotket Digital",
    metaDescription:
      "Booking automation for small business — every request gets an instant response and an immediate alert to your team, 24/7. Plans from $200/month.",
    h1: "Booking Automation for Small Business",
    heroSubheading:
      "Every booking request gets an instant response and an immediate alert to your team.",
    painPoints: [
      "Slow replies to booking requests lose customers to faster competitors",
      "Manually checking texts, emails, and calls for new bookings wastes time",
      "There's no central place to see every inquiry that's come in",
      "Double-booked slots and missed follow-ups happen without automation",
    ],
    included: [
      "Instant booking alerts sent across text, chat, and email",
      "Lead routing to the right person on your team",
      "A monthly performance summary showing every inquiry logged",
    ],
    faq: [
      {
        question: "Which channels does booking automation cover?",
        answer: "Text, chat, and email — wherever your customers already reach out.",
      },
      {
        question: "Will I know if an inquiry gets missed?",
        answer: "No — that's the point. Every inquiry is logged and tracked so nothing is missed.",
      },
      {
        question: "Does this work alongside an AI chatbot?",
        answer: "Yes, booking automation and the AI chatbot are designed to work together as one system.",
      },
    ],
    relatedSlugs: [
      "ai-receptionist-for-small-business",
      "automated-review-requests-for-small-business",
      "custom-website-for-small-business",
    ],
  },
  {
    slug: "ai-automation-for-dentists",
    keyword: "AI automation for dentists",
    metaTitle: "AI Automation for Dental Practices | Spotket Digital",
    metaDescription:
      "AI automation for dentists — patients get instant answers on appointments and hours, any time of day, with automatic booking alerts. From $200/month.",
    h1: "AI Automation for Dental Practices",
    heroSubheading:
      "Patients get instant answers about appointments and office hours, any time of day.",
    painPoints: [
      "Front desk calls pile up during patient hours",
      "After-hours appointment requests go unanswered until the next morning",
      "Reminder calls and review requests take staff time away from patients",
      "New patient inquiries get lost when no one can pick up the phone",
    ],
    included: [
      "An AI chatbot that answers hours, insurance, and appointment questions instantly",
      "Booking alerts sent to your front desk the moment a request comes in",
      "Automatic review requests sent after every visit",
    ],
    faq: [
      {
        question: "Can it answer insurance-related questions?",
        answer: "It can answer general insurance and policy questions you provide, and route anything specific to your front desk.",
      },
      {
        question: "Will patients notice it's AI?",
        answer: "It's designed to answer naturally and accurately — and it always makes clear a staff member can follow up.",
      },
      {
        question: "How fast can a dental practice get set up?",
        answer: "Most practices are fully live within 48 hours of signing up.",
      },
    ],
    relatedSlugs: [
      "ai-receptionist-for-small-business",
      "booking-automation-for-small-business",
      "automated-review-requests-for-small-business",
    ],
  },
  {
    slug: "ai-automation-for-auto-repair-shops",
    keyword: "AI automation for auto repair shops",
    metaTitle: "AI Automation for Auto Repair Shops | Spotket Digital",
    metaDescription:
      "AI automation for auto repair shops — instant answers on estimates and appointment availability, 24/7, plus automatic review requests. From $200/month.",
    h1: "AI Automation for Auto Repair Shops",
    heroSubheading:
      "Give every customer an instant answer on estimates and appointment availability.",
    painPoints: [
      "Techs can't stop mid-repair to answer the phone",
      "Estimate requests sent after hours sit until the shop reopens",
      "Customers don't know your hours or services without calling",
      "Reviews rarely come in unless someone asks right after pickup",
    ],
    included: [
      "An AI chatbot that answers service and estimate questions instantly",
      "Booking alerts sent to your team the moment a request comes in",
      "Automatic review requests sent after every completed repair",
    ],
    faq: [
      {
        question: "Can it give customers an exact price quote?",
        answer: "It answers general pricing and service questions and routes specific estimate requests straight to your team.",
      },
      {
        question: "Does this help with after-hours drop-off requests?",
        answer: "Yes — every after-hours inquiry gets an instant response instead of waiting until you reopen.",
      },
      {
        question: "How fast can a shop get set up?",
        answer: "Most shops are fully live within 48 hours of signing up.",
      },
    ],
    relatedSlugs: [
      "ai-automation-for-hvac-companies",
      "ai-automation-for-plumbers",
      "booking-automation-for-small-business",
    ],
  },
  {
    slug: "ai-automation-for-hvac-companies",
    keyword: "AI automation for HVAC companies",
    metaTitle: "AI Automation for HVAC Companies | Spotket Digital",
    metaDescription:
      "AI automation for HVAC companies — never miss an emergency repair call again, even at 2am. Instant answers and booking alerts. From $200/month.",
    h1: "AI Automation for HVAC Companies",
    heroSubheading: "Never miss an emergency repair call again — even at 2am.",
    painPoints: [
      "Emergency HVAC calls at night go straight to voicemail",
      "Techs in the field can't answer new customer calls",
      "Scheduling requests pile up without a system to track them",
      "Competitors who answer first usually win the job",
    ],
    included: [
      "A 24/7 AI receptionist or chatbot that answers every emergency call",
      "Instant booking alerts sent to your dispatcher",
      "Automatic review requests sent after every completed job",
    ],
    faq: [
      {
        question: "Can it handle true after-hours emergencies?",
        answer: "Yes — that's exactly the gap it closes. Every call gets answered instantly, 24/7.",
      },
      {
        question: "Will my techs get notified immediately?",
        answer: "Yes, booking and emergency alerts are sent straight to your team the moment they come in.",
      },
      {
        question: "How fast can an HVAC company get set up?",
        answer: "Most companies are fully live within 48 hours of signing up.",
      },
    ],
    relatedSlugs: [
      "ai-automation-for-plumbers",
      "24-7-ai-receptionist-for-small-business",
      "ai-automation-for-auto-repair-shops",
    ],
  },
  {
    slug: "ai-automation-for-plumbers",
    keyword: "AI automation for plumbers",
    metaTitle: "AI Automation for Plumbers | Spotket Digital",
    metaDescription:
      "AI automation for plumbers — answer every leak, clog, and emergency call instantly, day or night, with automatic booking alerts. From $200/month.",
    h1: "AI Automation for Plumbers",
    heroSubheading: "Answer every leak, clog, and emergency call instantly — day or night.",
    painPoints: [
      "A burst pipe at midnight shouldn't go to voicemail",
      "Plumbers on a job site can't stop to answer new customer calls",
      "Missed emergency calls often go straight to the next plumber on Google",
      "There's no automatic way to request reviews after a completed job",
    ],
    included: [
      "A 24/7 AI receptionist that answers every emergency and routine call",
      "Instant booking alerts sent to your team the moment a job comes in",
      "Automatic review requests sent after every completed job",
    ],
    faq: [
      {
        question: "Can it triage true emergencies from routine requests?",
        answer: "Yes — it's set up with your service priorities so urgent calls get flagged for immediate follow-up.",
      },
      {
        question: "Does it work if I'm the only plumber on staff?",
        answer: "Yes, it's built for solo operators and crews of any size — it's your 24/7 front line either way.",
      },
      {
        question: "How fast can a plumbing business get set up?",
        answer: "Most businesses are fully live within 48 hours of signing up.",
      },
    ],
    relatedSlugs: [
      "ai-automation-for-hvac-companies",
      "24-7-ai-receptionist-for-small-business",
      "ai-automation-for-auto-repair-shops",
    ],
  },
  {
    slug: "ai-automation-for-real-estate-agents",
    keyword: "AI automation for real estate agents",
    metaTitle: "AI Automation for Real Estate Agents | Spotket Digital",
    metaDescription:
      "AI automation for real estate agents — instant answers for showing requests and listing questions, even while you're with another client. From $200/month.",
    h1: "AI Automation for Real Estate Agents",
    heroSubheading:
      "Instant answers for showing requests and listing questions, even while you're with another client.",
    painPoints: [
      "Showing requests come in while you're already with a client",
      "Buyers and renters expect a fast reply or they move to the next listing",
      "Following up on every lead manually takes hours each week",
      "There's no automated way to collect reviews after a closed deal",
    ],
    included: [
      "An AI chatbot that answers listing and showing questions instantly",
      "Booking alerts sent to your phone the moment a lead comes in",
      "Automatic review requests sent after every closed deal",
    ],
    faq: [
      {
        question: "Can it answer questions about specific listings?",
        answer: "Yes — it's trained on your current listings so answers stay accurate as your inventory changes.",
      },
      {
        question: "Will I lose personal touch with leads?",
        answer: "No — it handles the instant first response so you can focus your time on serious buyers and sellers.",
      },
      {
        question: "How fast can an agent get set up?",
        answer: "Most agents are fully live within 48 hours of signing up.",
      },
    ],
    relatedSlugs: [
      "custom-website-for-small-business",
      "booking-automation-for-small-business",
      "ai-receptionist-for-small-business",
    ],
  },
  {
    slug: "ai-chatbot-for-salons-and-spas",
    keyword: "AI chatbot for salons and spas",
    metaTitle: "AI Chatbot for Salons and Spas | Spotket Digital",
    metaDescription:
      "An AI chatbot for salons and spas that answers booking and service questions instantly, even when every stylist is with a client. From $200/month.",
    h1: "AI Chatbot for Salons and Spas",
    heroSubheading:
      "Answer booking and service questions instantly, even when every stylist is with a client.",
    painPoints: [
      "Calls go unanswered while staff are with clients",
      "Clients want instant answers on pricing and availability before booking",
      "No-shows cost you revenue without automated reminders",
      "Reviews need a nudge right after a great appointment",
    ],
    included: [
      "An AI chatbot that answers service and pricing questions instantly",
      "Booking alerts sent to your team the moment a request comes in",
      "Automatic review requests sent after every appointment",
    ],
    faq: [
      {
        question: "Can it describe our specific services and packages?",
        answer: "Yes — it's trained on your menu of services, pricing, and policies.",
      },
      {
        question: "Does it help reduce no-shows?",
        answer: "Booking automation includes reminders that help cut down on missed appointments.",
      },
      {
        question: "How fast can a salon or spa get set up?",
        answer: "Most businesses are fully live within 48 hours of signing up.",
      },
    ],
    relatedSlugs: [
      "ai-automation-for-nail-salons",
      "ai-automation-for-barbershops",
      "get-more-google-reviews-automatically",
    ],
  },
  {
    slug: "24-7-ai-receptionist-for-small-business",
    keyword: "24/7 AI receptionist for small business",
    metaTitle: "24/7 AI Receptionist for Small Business | Spotket Digital",
    metaDescription:
      "A 24/7 AI receptionist for small business — every call answered, every hour of every day, without hiring a night shift. Plans from $200/month.",
    h1: "24/7 AI Receptionist for Small Business",
    heroSubheading:
      "Every call answered, every hour of every day — without hiring a night shift.",
    painPoints: [
      "Nights, weekends, and holidays are when calls go unanswered most",
      "A missed call after hours often becomes a lost customer",
      "Hiring staff to cover round-the-clock phone coverage isn't realistic for most small businesses",
      "Voicemail boxes go unchecked for hours or days at a time",
    ],
    included: [
      "An AI receptionist that answers calls around the clock, including holidays",
      "Instant call summaries and transcripts sent to your team",
      "Missed-call text-back so no caller is ever left hanging",
    ],
    faq: [
      {
        question: "Does it really work at 3am on a Sunday?",
        answer: "Yes — it answers every call the same way, any hour, any day, with no staffing required.",
      },
      {
        question: "What if a call needs a human?",
        answer: "It takes a message, sends your team an instant summary, and makes sure the right person follows up.",
      },
      {
        question: "How fast can this be set up?",
        answer: "Most businesses are fully live within 48 hours of signing up.",
      },
    ],
    relatedSlugs: [
      "ai-receptionist-for-small-business",
      "ai-automation-for-hvac-companies",
      "ai-automation-for-plumbers",
    ],
  },
  {
    slug: "ai-automation-for-landscaping-companies",
    keyword: "AI automation for landscaping companies",
    metaTitle: "AI Automation for Landscaping Companies | Spotket Digital",
    metaDescription:
      "AI automation for landscaping companies — quote requests don't stop when your crew is out mowing, and now your response doesn't either. From $200/month.",
    h1: "AI Automation for Landscaping Companies",
    heroSubheading:
      "Quote requests don't stop when your crew is out mowing — now your response doesn't either.",
    painPoints: [
      "Crews in the field can't stop to answer new quote requests",
      "Seasonal rushes mean the phone rings faster than anyone can answer",
      "Recurring clients need reminders your team doesn't have time to send",
      "Reviews rarely come in without someone asking after the job",
    ],
    included: [
      "An AI chatbot that answers service and quote questions instantly",
      "Booking alerts sent to your team the moment a request comes in",
      "Automatic review requests sent after every completed job",
    ],
    faq: [
      {
        question: "Can it handle seasonal spikes in requests?",
        answer: "Yes — it answers every inquiry the same way whether it's one request a day or fifty during spring rush.",
      },
      {
        question: "Does it work for recurring maintenance clients?",
        answer: "Booking automation can route recurring requests just as easily as one-time quotes.",
      },
      {
        question: "How fast can a landscaping company get set up?",
        answer: "Most companies are fully live within 48 hours of signing up.",
      },
    ],
    relatedSlugs: [
      "ai-automation-for-cleaning-companies",
      "booking-automation-for-small-business",
      "get-more-google-reviews-automatically",
    ],
  },
  {
    slug: "custom-website-for-small-business",
    keyword: "custom website for small business",
    metaTitle: "Custom Website for Small Business | Spotket Digital",
    metaDescription:
      "A custom website for small business, built fast and mobile-optimized, paired with an AI chatbot that works while you don't. Plans from $300/month.",
    h1: "Custom Website for Small Business",
    heroSubheading:
      "A fast, mobile-optimized website built around your services — paired with an AI chatbot that works while you don't.",
    painPoints: [
      "An outdated website turns customers away before they even call",
      "A site with no AI chatbot misses every after-hours visitor",
      "DIY website builders rarely load fast or rank well on Google",
      "There's no way to capture leads directly from the site instead of just a phone number",
    ],
    included: [
      "A custom-built, mobile-optimized website designed to turn visitors into customers",
      "An AI chatbot built into the site that answers questions 24/7",
      "Ongoing website edits included on the Standard plan",
    ],
    faq: [
      {
        question: "Which plan includes the website?",
        answer: "A custom website is included on the Standard and Premium plans.",
      },
      {
        question: "Can I request changes after it's live?",
        answer: "Yes — ongoing website edits are included so your site keeps up with your business.",
      },
      {
        question: "How long does the build take?",
        answer: "Most website builds are completed within 48 hours as part of the initial setup.",
      },
    ],
    relatedSlugs: [
      "website-and-ai-automation-maryland",
      "booking-automation-for-small-business",
      "ai-receptionist-for-small-business",
    ],
  },
  {
    slug: "ai-automation-for-law-firms",
    keyword: "AI automation for law firms",
    metaTitle: "AI Automation for Law Firms | Spotket Digital",
    metaDescription:
      "AI automation for law firms — give every potential client an instant response before they call the next firm on the list. Plans from $200/month.",
    h1: "AI Automation for Law Firms",
    heroSubheading:
      "Give every potential client an instant response — before they call the next firm on the list.",
    painPoints: [
      "Consultation requests after hours go to voicemail and often never follow up",
      "Staff spend hours manually screening and routing new inquiries",
      "Slow response times lose leads to firms that answer first",
      "Client reviews rarely happen without a system to ask for them",
    ],
    included: [
      "An AI chatbot that answers general intake questions and screens new inquiries",
      "Instant alerts sent to your team the moment a consultation request comes in",
      "Automatic review requests sent after a case concludes",
    ],
    faq: [
      {
        question: "Can it screen leads by practice area?",
        answer: "Yes — it can be set up to ask qualifying questions and route inquiries to the right attorney.",
      },
      {
        question: "Is client information handled securely?",
        answer: "The chatbot is built to collect only what's needed to route an inquiry, which your team then follows up on directly.",
      },
      {
        question: "How fast can a firm get set up?",
        answer: "Most firms are fully live within 48 hours of signing up.",
      },
    ],
    relatedSlugs: [
      "ai-receptionist-for-small-business",
      "ai-automation-for-real-estate-agents",
      "booking-automation-for-small-business",
    ],
  },
] as const;

export const PHOTO_ENHANCEMENT = {
  name: "AI Listing Photo Enhancement",
  shortDescription:
    "Better photos for Airbnb, Zillow, and realtor listings, delivered in 24-48 hours.",
  disclaimer:
    "We only enhance lighting, color, and cleanup. We never alter the actual space.",
} as const;

export const PHOTO_ENHANCEMENT_PRICING = [
  {
    name: "5 Photos",
    price: 50,
    description: "Lighting, color, and cleanup enhancement for 5 listing photos.",
  },
  {
    name: "15 Photos",
    price: 120,
    description: "Lighting, color, and cleanup enhancement for 15 listing photos.",
  },
  {
    name: "Photos + Walkthrough Video",
    price: 200,
    description: "15 enhanced photos plus a polished walkthrough video for your listing.",
  },
] as const;

export const PHOTO_ENHANCEMENT_ADD_ON_NOTE =
  "Already on a Spotket monthly plan? Add AI Listing Photo Enhancement any time — just mention it on your next check-in and it's billed alongside your flat rate.";

export const PHOTO_ENHANCEMENT_FAQ = [
  {
    question: "Will the photos still look like my actual listing?",
    answer:
      "Yes. We only enhance lighting, color, and cleanup — we never alter the actual space.",
  },
  {
    question: "How fast will I get my photos back?",
    answer: "Within 24-48 hours of us receiving your originals.",
  },
  {
    question: "Can this be added to my monthly plan?",
    answer:
      "Yes — it's available as a one-time service or as an add-on to any Spotket monthly plan.",
  },
] as const;

/**
 * Before/after sample gallery for the photo enhancement page. Keep this
 * false until real client samples replace the placeholder slots — flip it
 * to true (and swap in real images) to publish the section.
 */
export const PHOTO_GALLERY_PUBLISHED = false;

export const PHOTO_GALLERY_PLACEHOLDERS = [
  { id: "sample-1", label: "Living Room" },
  { id: "sample-2", label: "Kitchen" },
  { id: "sample-3", label: "Exterior" },
] as const;

export type LandingPageSlug = (typeof LANDING_PAGES)[number]["slug"];

/** A handful of landing pages linked from the footer on every page for crawl depth. */
export const FOOTER_GUIDE_LINKS = [
  "ai-receptionist-for-small-business",
  "booking-automation-for-small-business",
  "get-more-google-reviews-automatically",
  "custom-website-for-small-business",
  "ai-chatbot-for-limo-companies",
  "website-and-ai-automation-maryland",
] as const;
