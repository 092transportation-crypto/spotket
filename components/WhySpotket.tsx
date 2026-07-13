import { Headphones, Lock, RotateCcw, Truck } from "lucide-react";
import Reveal from "@/components/Reveal";

const features = [
  { icon: Truck, title: "Fast Delivery", note: "Ships within 24–48 hours" },
  { icon: RotateCcw, title: "Easy Returns", note: "30-day hassle-free returns" },
  { icon: Lock, title: "Secure Payment", note: "256-bit SSL encryption" },
  { icon: Headphones, title: "24/7 Support", note: "Always here to help" },
];

export default function WhySpotket() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" aria-labelledby="why-heading">
      <Reveal>
        <h2 id="why-heading" className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Why Spotket
        </h2>
      </Reveal>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 100}>
            <div className="h-full rounded-2xl border border-navy-700/70 bg-navy-900 p-6 transition-colors hover:border-gold/50">
              <feature.icon className="h-6 w-6 text-gold" aria-hidden="true" />
              <h3 className="mt-4 text-base font-semibold text-white">{feature.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{feature.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
