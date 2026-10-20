import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { insertBlogPost, getBlogPost } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// One-time seed route for 5 hand-written SEO blog posts, gated by the
// SEED_KEY env var (set directly on Vercel, never committed). Safe to
// delete once the posts are confirmed live.

const POSTS = [
  {
    slug: "ai-automation-small-business-more-customers",
    title: "How AI Automation Gets Small Businesses More Customers",
    excerpt:
      "AI automation for small business means faster replies, more bookings, and no more missed inquiries. Here's how it actually works.",
    topic: "AI automation for small businesses",
    content: `Every small business loses customers the same way: someone reaches out — a call, a text, a form on your website — and by the time you get back to them, they've already booked with someone else. AI automation for small business exists to close that gap, and it's one of the highest-leverage changes you can make this year.

## The Problem: Missed Inquiries Cost You Customers

Most small businesses don't lose customers because of bad service. They lose them because of slow response time. A customer messages after hours, or during a busy shift, and the reply doesn't come until the next morning — by then, they've moved on to a competitor who answered first.

This isn't a small leak. It's one of the biggest, quietest reasons small businesses plateau: not a lack of demand, but a lack of speed in capturing it.

## What AI Automation Actually Does

AI automation for small business isn't about replacing your team — it's about covering the gaps your team can't realistically cover. A well-built system can:

- Answer common questions instantly, any time of day
- Collect the details you need (name, service, timing) before a human ever gets involved
- Send your team an instant alert the moment a real lead comes in
- Follow up automatically if a lead goes quiet

None of this requires a customer to wait. That's the whole point.

## Getting More Bookings With AI

Businesses that install this kind of system typically see the same pattern: more inquiries convert into actual bookings, simply because fewer of them go unanswered. Getting more bookings with AI isn't about tricking people into buying — it's about showing up the moment they're ready to.

### Speed Is the Entire Game

Studies on lead response time consistently find that the business that responds first wins the booking far more often than the business with the better price or the better reviews. An AI system makes "first" the default, not the exception.

## What This Looks Like in Practice

A typical setup includes a chatbot on your website that can answer FAQs and collect contact details, automated text or email alerts the moment a new inquiry comes in, and a simple way to route hot leads straight to whoever on your team should handle them. None of it needs to look robotic — done well, it feels like your business is simply always available.

## Getting Started

If your business is missing inquiries after hours, during busy periods, or just because no one got to the message in time, AI automation is the fix. [Get a free automation audit](/contact) and we'll show you exactly where your business is leaking leads — and how to stop it.`,
  },
  {
    slug: "why-limo-companies-miss-bookings",
    title: "Why Limo Companies Miss 40% of Their Bookings",
    excerpt:
      "Limo and chauffeur companies lose a huge share of bookings to slow responses. Here's how an AI chatbot for limo companies fixes it.",
    topic: "limo company marketing",
    content: `Limo and chauffeur companies run on inquiries that come in at the worst possible times — a driver is mid-trip, the office is closed, or the phone is simply busy with another customer. For an industry built on punctuality, it's a strange irony that so many bookings are lost to slow replies.

## Why Limo Companies Lose Bookings

Airport transportation and chauffeur services get a huge share of their inquiries outside normal business hours — late flights, early pickups, last-minute changes. If a request comes in at 11pm and doesn't get a reply until the morning, the customer has usually already booked with whichever company answered first.

## The 40% Problem

Across small service businesses, it's common for a large share of inbound inquiries — often as much as 40% — to go unanswered long enough that the customer books elsewhere. For limo companies specifically, this is worse than most industries, because the decision window is so short: airport pickups and event transportation are booked in a hurry, by customers comparing several companies at once.

## How an AI Chatbot for Limo Companies Helps

An AI chatbot for limo companies solves this by being available exactly when human staff can't be:

- Answering pricing, availability, and service-area questions instantly, 24/7
- Collecting pickup details (date, time, location, flight number) without a phone call
- Alerting your team the second a real booking request comes in
- Following up automatically with quote requests that haven't converted yet

The customer gets an instant answer. Your team gets a qualified lead instead of a cold voicemail.

## Real Example

This is exactly the kind of system we've built for chauffeur and airport transportation companies — instant quote responses, automated booking alerts, and review requests sent automatically after every ride, so the business keeps running smoothly even when no one is sitting by the phone.

## Getting Started

If your limo or chauffeur business is losing bookings to slow response times, an AI chatbot can close that gap in days, not months. [Get a free automation audit](/contact) and see exactly where your bookings are slipping away.`,
  },
  {
    slug: "get-more-google-reviews-automatically",
    title: "How to Get More Google Reviews Automatically",
    excerpt:
      "Automated review requests turn every happy customer into a Google review — without you lifting a finger. Here's how to set it up.",
    topic: "how to get more Google reviews",
    content: `Most happy customers never leave a review — not because they don't want to, but because nobody asked them at the right moment. Automated review requests fix this by making the ask part of your process instead of something you have to remember.

## Why Reviews Matter

Google reviews are one of the few things that directly affect both how many new customers find you and how many of them trust you enough to book. A business with 150 reviews and a 4.9 rating will consistently out-convert a nearly identical competitor with 12 reviews — reviews are, in a very real sense, inventory you're leaving on the shelf if you're not collecting them.

## The Problem With Asking Manually

Asking for a review manually depends on someone on your team remembering to do it, at the right time, for every single customer. In practice, that happens for a fraction of jobs — usually only when someone is especially happy or an employee happens to think of it. The result: a trickle of reviews instead of a steady stream.

## How Automated Review Requests Work

An automated system removes the "remembering" part entirely:

- The moment a job or booking is marked complete, a review request goes out automatically — by text or email
- The message links straight to your Google review page, removing friction
- Requests can be timed to go out when customer satisfaction is highest (right after service, not days later)
- You can filter so only clearly satisfied customers are prompted, protecting your rating

None of this requires manual follow-up. It just runs in the background, every time.

## Results You Can Expect

Businesses that switch from "ask when we remember" to automated review requests typically see a steady, compounding increase in new reviews — not a one-time spike, but a consistent flow that keeps building month over month, with zero extra effort from staff.

## Getting Started

If your Google review count has been flat for months, the fix usually isn't your service quality — it's that nobody's asking consistently. [Get a free automation audit](/contact) and we'll show you how automated review requests can fit into your business in a matter of days.`,
  },
  {
    slug: "ai-chatbot-vs-hiring-a-receptionist",
    title: "AI Chatbot vs Hiring a Receptionist — Which Is Better?",
    excerpt:
      "Comparing an AI receptionist for small business against hiring a human — cost, coverage, and which one actually makes sense for you.",
    topic: "chatbot benefits",
    content: `Every growing small business hits the same wall: inquiries are piling up, and someone needs to answer them. The traditional answer is to hire a receptionist. Increasingly, the better answer is an AI receptionist for small business. Here's an honest comparison.

## The Cost Comparison

A full-time receptionist, even at a modest wage, typically costs a small business several thousand dollars a month once you include payroll taxes, benefits, and training time. An AI receptionist for small business costs a small fraction of that — often a few hundred dollars a month — and starts working within days of setup, not weeks.

## Coverage: 24/7 vs 9-to-5

A human receptionist, however good, works one shift. Evenings, weekends, lunch breaks, sick days, and holidays are all gaps where inquiries go unanswered. An AI receptionist doesn't have shifts — it answers every call and message the moment it comes in, around the clock, including the after-hours window where a large share of inquiries actually arrive.

## What an AI Receptionist Can (and Can't) Do

An AI receptionist is excellent at answering common questions (hours, pricing, availability), collecting customer details, booking or scheduling straightforward requests, and alerting your team instantly when a human needs to step in. It's not a replacement for a skilled human handling a genuinely complex, high-stakes conversation — but the vast majority of inbound inquiries at a small business are routine, not complex, which is exactly where automation shines.

### The Hybrid Approach

Most businesses get the best results from a hybrid: the AI receptionist handles the first response and routine questions, and instantly loops in a real person for anything that needs a human touch. You get 24/7 coverage without needing a human on call around the clock.

## Which Should You Choose?

If your business is small enough that a full-time receptionist isn't realistic, or you already have staff who shouldn't be tied to the phone all day, an AI receptionist for small business is almost always the better starting point — lower cost, faster to set up, and available every hour a customer might reach out.

## Getting Started

Curious what this would look like for your business? [Get a free automation audit](/contact) and we'll walk you through exactly how an AI receptionist would handle your real call and message volume.`,
  },
  {
    slug: "never-miss-a-customer-inquiry-again",
    title: "How to Never Miss a Customer Inquiry Again",
    excerpt:
      "A practical guide to AI automation for small business — website, automation, and AI receptionist, all in one system.",
    topic: "AI automation for small businesses",
    content: `Most small businesses don't have a lead problem — they have a response problem. Customers are reaching out already: through your website, by text, by phone, through Google. The question is whether those inquiries ever actually get answered in time. Here's how to build a system that never misses one.

## Where Inquiries Get Lost

Inquiries fall through the cracks in a few predictable places: after-hours messages that sit until morning, phone calls that go to voicemail during busy periods, website visitors who leave without a way to easily get in touch, and leads that get a first reply but no follow-up after that. Each of these is a small leak — but together, they add up to a large share of lost business.

## Building a System That Never Sleeps

The fix isn't working harder — it's building a system that handles the routine parts automatically:

- A chatbot on your website that answers common questions and collects contact details instantly
- An AI receptionist that picks up calls and messages when your team can't
- Automatic alerts to your team the moment a real booking opportunity comes in
- Automated follow-up for leads that haven't converted yet

This is the core of AI automation for small business: not replacing your team, but making sure nothing reaches them late.

## Website and Automation in Maryland

For local businesses — including the Maryland small businesses we work with directly — this matters even more, because so much local competition comes down to who responds first. A modern, mobile-optimized website paired with automation in Maryland's service and transportation industries (chauffeur services, local retail, home services) consistently outperforms an outdated site with no automation behind it, simply because customers get an instant answer instead of a dead end.

## Putting It All Together

A complete system combines a fast, modern website, an AI chatbot or receptionist that's always on, automated booking and review requests, and ongoing monitoring so the system keeps improving. None of these pieces work as well alone as they do together.

## Getting Started

If you're ready to stop losing customers to slow responses, [get a free automation audit](/contact) and we'll show you exactly where your business is missing inquiries — and how fast it can be fixed.`,
  },
];

export async function GET(request: NextRequest) {
  const expected = process.env.SEED_KEY;
  const key = request.headers.get("x-seed-key");
  if (!expected || key !== expected) {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }

  const results: Array<{ slug: string; status: string }> = [];
  for (const post of POSTS) {
    const existing = await getBlogPost(post.slug);
    if (existing) {
      results.push({ slug: post.slug, status: "already exists, skipped" });
      continue;
    }
    const ok = await insertBlogPost({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      topic: post.topic,
    });
    results.push({ slug: post.slug, status: ok ? "inserted" : "insert failed" });
  }

  return NextResponse.json({ results });
}
