/**
 * Press-style logo strip. These are placeholder wordmarks (not real outlets)
 * — swap them for actual publication logos as coverage lands.
 */
const outlets = [
  { name: "TrendWire", style: "font-serif italic" },
  { name: "GADGETSCOPE", style: "font-mono tracking-widest text-xs sm:text-sm" },
  { name: "HomeMuse", style: "font-serif" },
  { name: "DAILY FINDS", style: "tracking-[0.3em] text-xs sm:text-sm" },
  { name: "StyleBeat", style: "italic" },
];

export default function AsSeenOn() {
  return (
    <section className="border-y border-navy-800 bg-navy-900/30 px-4 py-7 sm:px-6" aria-label="Featured in">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          As seen on
        </p>
        {outlets.map((outlet) => (
          <span
            key={outlet.name}
            className={`text-lg font-bold text-slate-500 transition-colors hover:text-slate-300 sm:text-xl ${outlet.style}`}
          >
            {outlet.name}
          </span>
        ))}
      </div>
    </section>
  );
}
