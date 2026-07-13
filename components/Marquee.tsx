const items = [
  "Free shipping on orders over $35",
  "New arrivals weekly",
  "30-day returns",
  "Secure checkout",
];

/** Infinite scrolling ticker — content duplicated for a seamless loop. */
export default function Marquee() {
  const strip = [...items, ...items];
  return (
    <div
      className="overflow-hidden border-y border-navy-800 bg-navy-900/60 py-3.5"
      aria-label={items.join(" · ")}
    >
      <div
        className="flex w-max items-center gap-8 whitespace-nowrap"
        style={{ animation: "marquee-scroll 28s linear infinite" }}
        aria-hidden="true"
      >
        {strip.map((item, index) => (
          <span key={index} className="flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            {item}
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
