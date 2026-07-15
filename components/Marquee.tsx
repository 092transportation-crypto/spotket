import { RotateCcw, ShieldCheck, Sparkles, Truck } from "lucide-react";

const items = [
  { icon: Truck, label: "Free shipping on orders over $35" },
  { icon: Sparkles, label: "New arrivals weekly" },
  { icon: RotateCcw, label: "30-day returns" },
  { icon: ShieldCheck, label: "Secure checkout" },
];

/** Infinite scrolling ticker — content duplicated for a seamless loop. */
export default function Marquee() {
  const strip = [...items, ...items];
  return (
    <div
      className="relative overflow-hidden border-y border-navy-800 bg-navy-900/60 py-3.5"
      aria-label={items.map((item) => item.label).join(" · ")}
    >
      <div
        className="flex w-max items-center gap-8 whitespace-nowrap"
        style={{ animation: "marquee-scroll 28s linear infinite" }}
        aria-hidden="true"
      >
        {strip.map((item, index) => (
          <span
            key={index}
            className="flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.3em] text-gold"
          >
            <span className="flex items-center gap-2.5">
              <item.icon className="h-4 w-4 shrink-0 text-gold-light" aria-hidden="true" />
              {item.label}
            </span>
            <span className="text-brand-light">✦</span>
          </span>
        ))}
      </div>

      {/* Edge fades so items dissolve in and out of view */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-navy-950 to-transparent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-navy-950 to-transparent"
      />
    </div>
  );
}
