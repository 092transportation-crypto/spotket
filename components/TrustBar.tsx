import { Lock, RotateCcw, Truck } from "lucide-react";

const items = [
  { icon: Truck, label: "Free Shipping", note: "On orders over $35" },
  { icon: RotateCcw, label: "Easy Returns", note: "30-day hassle-free" },
  { icon: Lock, label: "Secure Checkout", note: "Stripe-powered payments" },
];

export default function TrustBar() {
  return (
    <section className="border-t border-navy-800 bg-navy-900/60" aria-label="Why shop with us">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-center gap-3 text-center sm:text-left">
            <item.icon className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-white">{item.label}</p>
              <p className="text-xs text-slate-400">{item.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
