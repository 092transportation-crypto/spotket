import { TRUST_BADGES } from "@/lib/site";

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {TRUST_BADGES.map((badge) => (
        <span
          key={badge}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-navy-900/60 px-4 py-2 text-xs font-medium text-neutral-300"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-light" />
          {badge}
        </span>
      ))}
    </div>
  );
}
