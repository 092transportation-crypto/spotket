import Link from "next/link";
import { Reveal } from "@/components/reveal";

interface LinkItem {
  href: string;
  label: string;
}

export function ExploreLinks({
  eyebrow = "Explore",
  heading,
  items,
}: {
  eyebrow?: string;
  heading: string;
  items: readonly LinkItem[];
}) {
  return (
    <div className="mx-auto mt-20 max-w-5xl">
      <Reveal className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          {heading}
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-white/10 bg-navy-900/60 px-5 py-4 text-sm font-medium text-neutral-300 transition-colors hover:border-brand/40 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
