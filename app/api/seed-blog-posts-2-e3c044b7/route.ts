import { NextRequest, NextResponse } from "next/server";
import { insertBlogPost } from "@/lib/supabase";

// One-time route to seed the second batch of SEO blog posts. Protected by a
// key set as a Vercel env var (never hardcoded) and deleted after use.
const POSTS = [
  {
    slug: "ai-automation-small-businesses-more-customers-2026",
    title: "How AI Automation Gets Small Businesses More Customers in 2026",
    excerpt:
      "AI automation helps small businesses answer every inquiry instantly, book more customers, and stop losing leads to slow response times.",
    topic: "AI automation overview",
    content: `Small businesses lose customers every day for one simple reason: they can't answer fast enough. A call goes unanswered during a busy afternoon, a text sits in an inbox overnight, a website visitor leaves because no one replies — and that customer books with whoever responds first.

## What "AI automation" actually means for a small business

It's not one big complicated system. It's a few specific tools working together:

- An AI chatbot that answers questions about pricing, hours, and availability instantly
- Booking automation that alerts your team the moment a new inquiry comes in
- Automatic review requests sent after every completed job
- A fast, mobile-optimized website that captures leads instead of losing them

## Why this matters more in 2026

Customers now expect an instant response, whether they're texting a barbershop or requesting a quote from a [cleaning company](/lp/ai-automation-for-cleaning-companies). Businesses that reply in minutes consistently win more bookings than ones that reply the next day — even when their service quality is identical.

## Where most businesses lose the most ground

The biggest gap is almost always after-hours inquiries. Nights, weekends, and holidays are when phones go unanswered most — and when competitors who do answer pick up the business instead. A [24/7 AI receptionist](/lp/24-7-ai-receptionist-for-small-business) closes that gap without hiring a night shift.

## Getting started

Most businesses can have an AI chatbot and booking automation live within 48 hours. See how it works on our [how it works](/how-it-works) page, or [get a free automation audit](/contact) to see exactly where your business is losing inquiries today.`,
  },
  {
    slug: "why-small-businesses-lose-40-percent-of-inquiries",
    title: "Why Small Businesses Lose 40% of Inquiries (And How to Fix It)",
    excerpt:
      "The average small business misses a huge share of its inquiries. Here's why it happens and the automation that fixes it.",
    topic: "missed inquiries",
    content: `The average small business misses a significant share of its inquiries — not because the business isn't good at what it does, but because no one was available the moment a customer reached out.

## Where inquiries actually get lost

- **After hours.** A call or message that comes in at 9pm sits until the next business day, by which point the customer has already booked elsewhere.
- **During busy periods.** When staff are with a customer, on a job, or mid-service, the phone rings and no one can answer.
- **Through repeat questions.** The same questions about pricing and availability take up time that could go toward bookings that are ready to close.
- **With no tracking.** Many businesses have no way of knowing how many inquiries they actually missed last month.

## The fix: a 24/7 front line

This is exactly what [AI receptionist](/lp/ai-receptionist-for-small-business) and AI chatbot tools solve. Every inquiry — call, text, or website message — gets an instant response, any hour of the day. Your team gets an alert the moment a real lead comes in, so follow-up happens in minutes instead of the next morning.

## It's not just about answering faster

Booking automation also means every inquiry gets logged, so you can finally see how many leads were coming in that you didn't know about. Pair that with [automated review requests](/lp/automated-review-requests-for-small-business) and the same system that captures more leads also turns completed jobs into new reviews automatically.

## See it in action

[DCA Limos](/results) used to lose after-hours quote requests to voicemail. After automation, every inquiry gets an instant response — read the full breakdown on our [results page](/results), or [book a free audit](/contact) to see where your business stands.`,
  },
  {
    slug: "ai-chatbot-vs-human-receptionist-small-business",
    title: "AI Chatbot vs Human Receptionist — Which is Better for Small Business?",
    excerpt:
      "AI chatbot or human receptionist? Here's an honest comparison of cost, coverage, and what actually fits a small business.",
    topic: "AI chatbot vs receptionist",
    content: `Hiring a receptionist is one option for handling the flood of calls and messages a small business gets. An AI chatbot or [AI receptionist](/lp/ai-receptionist-for-small-business) is another. Here's how they actually compare.

## Coverage

A human receptionist works set hours — typically 8-10 hours a day, 5 days a week. An AI chatbot or AI receptionist works 24/7, including nights, weekends, and holidays, which is exactly when a lot of inquiries come in.

## Cost

A full-time receptionist is a significant monthly expense once you factor in salary, benefits, and training. Plans for AI automation start much lower and don't require hiring, onboarding, or covering sick days and vacations.

## Consistency

A human receptionist might have an off day, forget to log a lead, or be out sick. An AI chatbot answers the same way, accurately, every single time — and every inquiry gets logged automatically.

## What a human still does better

Complex, emotionally sensitive conversations and highly specific judgment calls are still better handled by a person. That's why the goal usually isn't to replace every human interaction — it's to make sure no inquiry goes unanswered while your team handles the conversations that need a human touch.

## The practical answer for most small businesses

Many businesses use both: an AI chatbot or receptionist handles the instant first response and routes serious leads to staff immediately. See the [full automation stack](/services) or [compare plans](/pricing) to find the right fit.`,
  },
  {
    slug: "get-more-google-reviews-automatically-guide",
    title: "How to Get More Google Reviews Automatically",
    excerpt:
      "A step-by-step look at automating Google review requests so every happy customer gets asked, without manual follow-up.",
    topic: "Google reviews",
    content: `More Google reviews mean more trust, higher local rankings, and more customers choosing your business over a competitor with a lower rating. Most businesses know this — the problem is actually getting the reviews.

## Why manual review requests don't work

Asking every customer for a review takes time most small business owners don't have on a busy day. It gets forgotten, skipped, or only happens for the customers someone happens to remember.

## How automated review requests work

1. A job or appointment is marked complete
2. A review request is automatically sent by text or email
3. The request goes out immediately, while the experience is still fresh
4. Every request is tracked, so you always know who's been asked

See the full breakdown on our [automated review requests](/lp/automated-review-requests-for-small-business) page.

## What kind of results to expect

Businesses using automatic review requests see a steady, consistent flow of new reviews instead of the occasional one that comes in when someone happens to ask in person. [MSY Limo Service](/results) stopped needing anyone to remember to ask — review requests simply go out after every completed ride.

## Pairing reviews with the rest of your front line

Review automation works best alongside an [AI chatbot](/services) and booking automation, so the same system that answers new inquiries also turns completed jobs into reviews. [Get a free automation audit](/contact) to see what this would look like for your business.`,
  },
  {
    slug: "best-ai-tools-limo-companies-2026",
    title: "The Best AI Tools for Limo Companies in 2026",
    excerpt:
      "The AI tools limo and chauffeur companies are using in 2026 to answer quote requests instantly and win more bookings.",
    topic: "limo industry AI tools",
    content: `Limo and chauffeur companies run on fast response times — a quote request that sits unanswered for an hour is often a lost ride. Here's what's actually working for limo companies in 2026.

## AI chatbots trained on your fleet and pricing

A generic chatbot isn't enough. The most effective setups use an [AI chatbot for limo companies](/lp/ai-chatbot-for-limo-companies) trained on your specific vehicles, rates, and service area, so answers are accurate instead of generic.

## Booking automation across text, chat, and email

Quote requests come in through every channel — a missed one on any of them is a missed ride. Booking automation makes sure every channel gets covered and every request gets routed to dispatch immediately.

## Automatic review requests after every ride

Happy riders rarely leave a review unless asked right after the trip. Automating that request means a steady stream of new Google reviews without anyone on your team remembering to ask.

## A 24/7 AI receptionist for after-hours calls

Airport runs and late-night requests don't stop when your office closes. A [24/7 AI receptionist](/lp/24-7-ai-receptionist-for-small-business) means every call gets answered, any hour.

## Real results in the limo industry

Spotket built this exact stack for DCA Limos, BWI Chauffeur, IAD Airport Limo, and MSY Limo Service — see the [full results](/results) or [get a free automation audit](/contact) for your fleet.`,
  },
  {
    slug: "never-miss-a-customer-inquiry-again-guide",
    title: "How to Never Miss a Customer Inquiry Again",
    excerpt:
      "A practical guide to making sure every call, text, and website inquiry gets an instant response — no exceptions.",
    topic: "missed inquiries fix",
    content: `Every missed inquiry is a customer who may have booked with a competitor instead. Here's a practical breakdown of how to make sure that stops happening.

## Step 1: Cover every channel

Customers reach out by phone, text, website chat, and email — sometimes all four for the same business. Make sure each channel has a way to respond instantly, not just the one you check most often.

## Step 2: Cover every hour

A huge share of missed inquiries happen outside business hours. A [24/7 AI receptionist](/lp/24-7-ai-receptionist-for-small-business) or AI chatbot closes that gap without anyone working a night shift.

## Step 3: Alert your team instantly

Answering the inquiry is only half the job — your team still needs to follow up. [Booking automation](/lp/booking-automation-for-small-business) sends an instant alert the moment a real lead comes in, so follow-up happens in minutes.

## Step 4: Track what's coming in

Most businesses have no visibility into how many inquiries they're actually getting, let alone how many get missed. Automation logs every inquiry so nothing slips through unnoticed.

## Step 5: Review it monthly

A monthly performance summary shows what's working and where there's still room to improve.

## Put it all together

This is the exact system Spotket builds for every client — see the [full stack](/services) or [book a free 10 minute call](/contact) to find out where your business stands today.`,
  },
  {
    slug: "ai-automation-for-barbershops-complete-guide",
    title: "AI Automation for Barbershops — Complete Guide",
    excerpt:
      "A complete guide to AI automation for barbershops — chatbots, booking alerts, and review requests built for busy shops.",
    topic: "barbershop automation",
    content: `Barbershops run on walk-ins and quick turnarounds — which also means the phone rings constantly while you're mid-cut and can't answer. Here's how AI automation fixes that.

## The core problem

Every call that goes to voicemail while you're working is a potential customer who calls the next shop instead. Multiply that by a full day of appointments and it adds up fast.

## What AI automation looks like for a barbershop

- An **AI chatbot** that answers questions about hours, pricing, and availability instantly, even when you can't pick up
- **Booking alerts** sent to your phone the moment a new request comes in, so you can respond between cuts
- **Automatic review requests** sent after every appointment, so your Google rating keeps growing without extra effort
- Optionally, a **custom website** that looks professional and captures bookings directly

Read the full breakdown on our [AI automation for barbershops](/lp/ai-automation-for-barbershops) page.

## What setup actually looks like

Most shops are fully live within 48 hours. There's no need to change how you run the shop day-to-day — the automation runs in the background and routes everything to you.

## Is it worth it for a single-chair shop?

Yes — the math works the same whether you're a solo barber or a multi-chair shop. Every missed call is a missed customer, and the cost of automation is far lower than the cost of lost bookings.

## Next step

[Get a free automation audit](/contact) to see exactly how many inquiries your shop might be missing right now.`,
  },
  {
    slug: "92-transportation-extra-bookings-with-ai",
    title: "How 92 Transportation Got 5 Extra Bookings Per Month with AI",
    excerpt:
      "How 92 Transportation used AI chatbots and booking automation to catch inquiries that used to go to voicemail.",
    topic: "92 Transportation case study",
    content: `92 Transportation was losing after-hours inquiries the same way most transportation companies do — calls and messages that came in outside office hours went to voicemail and often never got a callback in time.

## The problem

Before automation, every inquiry that arrived after hours was a coin flip: answered the next morning if the team got to it in time, or lost to a competitor who responded faster overnight.

## What changed

92 Transportation rolled out an [AI chatbot](/lp/ai-chatbot-for-limo-companies) for instant quotes and FAQs, along with booking automation that alerts the team the moment a new inquiry comes in. Every lead now gets an instant response, day or night, and staff get a text the second it happens.

## The result

Since going live, the team estimates the business is now picking up roughly 5 extra bookings a month that previously would have gone to voicemail and been lost — inquiries that used to slip through the cracks are now answered automatically before a customer has the chance to call someone else.

## Reviews improved too

Automatic review requests after every completed ride mean the business no longer relies on staff remembering to ask — see the full case study on our [results page](/results).

## Want results like this?

The same system is already running for DCA Limos, BWI Chauffeur, IAD Airport Limo, and MSY Limo Service. [Book a free automation audit](/contact) to see what it could do for your business.`,
  },
  {
    slug: "website-and-ai-automation-why-small-business-needs-both",
    title: "Website + AI Automation — Why Every Small Business Needs Both",
    excerpt:
      "A website brings customers to your door. AI automation makes sure none of them get lost once they're there.",
    topic: "website plus automation",
    content: `A lot of small businesses treat their website and their customer response system as two separate problems. They're actually the same problem, and solving only one leaves money on the table.

## A website without automation loses visitors

A visitor lands on your site, has a question, and leaves because there's no way to get an instant answer. No chatbot, no way to request a quote outside business hours — just a phone number that may or may not get picked up.

## Automation without a strong website undersells your business

An AI chatbot and booking automation are powerful, but if the website behind them is outdated, slow, or hard to use on a phone, visitors bounce before they ever reach the automation that would have helped them.

## Why they work better together

A [custom website](/lp/custom-website-for-small-business) built around your services, paired with an AI chatbot that answers instantly, turns visitors into booked customers instead of lost ones. Add booking automation and automatic review requests, and the same system that captures the lead also follows up and asks for a review once the job is done.

## What this looks like for a Maryland business

Spotket builds this exact combination for small businesses across Maryland and beyond — see our [website and AI automation](/lp/website-and-ai-automation-maryland) page for details.

## Getting started

A custom website is included on the Standard and Premium plans — see [pricing](/pricing) or [get a free automation audit](/contact) to find the right fit.`,
  },
  {
    slug: "automate-your-small-business-in-48-hours",
    title: "How to Automate Your Small Business in 48 Hours",
    excerpt:
      "What actually happens during a 48-hour AI automation setup, from the free audit to going live.",
    topic: "fast setup",
    content: `"48 hours" sounds fast for a full automation setup — here's what actually happens during that window.

## Hour 0: The free audit

Before anything is built, we review how customers currently reach your business — phone, website, text, and socials — and find exactly where inquiries get missed, delayed, or lost. No cost, no obligation.

## Hours 1–24: The custom build

Your AI chatbot, booking automation, and website (if included in your plan) get built around how your business actually runs — your services, hours, and pricing, not a generic template. See the full process on our [how it works](/how-it-works) page.

## Hours 24–48: Testing and fine-tuning

Before going live, the system is tested against real scenarios your customers are likely to ask about, so answers are accurate from day one.

## Hour 48: Go live

Your AI chatbot, booking alerts, and review automation switch on and start working immediately — answering inquiries and notifying your team around the clock from that point forward.

## After launch

The system gets fine-tuned in the first few days based on real customer interactions, and ongoing support keeps it improving every month. See [what you get](/how-it-works) with every plan.

## Start your 48-hour clock

[Book a free 10 minute call](/contact) and we'll walk you through exactly what the first 48 hours would look like for your business.`,
  },
];

export async function GET(req: NextRequest) {
  const key = req.headers.get("x-seed-key");
  if (!key || key !== process.env.SEED_KEY) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, string> = {};
  for (const post of POSTS) {
    const ok = await insertBlogPost(post);
    results[post.slug] = ok ? "inserted" : "failed";
  }

  return NextResponse.json({ results });
}
