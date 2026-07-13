import {
  BadgeCheck,
  Headset,
  Lock,
  RotateCcw,
  Tag,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/site";

const reasons: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Truck,
    title: `Free shipping over $${FREE_SHIPPING_THRESHOLD}`,
    description: "Fast, tracked delivery on every qualifying order — no codes needed.",
  },
  {
    icon: RotateCcw,
    title: "30-day hassle-free returns",
    description: "Changed your mind? Send it back within 30 days, no questions asked.",
  },
  {
    icon: Lock,
    title: "Secure encrypted checkout",
    description: "Your payment details are protected with 256-bit SSL encryption.",
  },
  {
    icon: Headset,
    title: "24/7 customer support",
    description: "Real people ready to help, any hour of the day, every day.",
  },
  {
    icon: Tag,
    title: "Price match guarantee",
    description: "Found it cheaper elsewhere? We'll match the price — just ask.",
  },
  {
    icon: BadgeCheck,
    title: "Authentic products only",
    description: "Every item is sourced from verified suppliers and quality-checked.",
  },
];

export default function WhyShop() {
  return (
    <section className="border-y border-navy-700/60 bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            The Spotket Promise
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Why shop at Spotket
          </h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex gap-4 rounded-2xl border border-navy-700/60 bg-navy-800/60 p-5 transition duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-lg hover:shadow-black/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <reason.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-white">{reason.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
