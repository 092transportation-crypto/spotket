import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import { LayoutGrid } from "lucide-react";

const pills = [
  "Health & Wellness",
  "Home & Garden",
  "Electronics",
  "Toys",
  "Sports",
];

export default function CategoryPills() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6" aria-label="Shop by category">
      <div className="flex gap-2.5 overflow-x-auto pb-2">
        <Link
          href="/products"
          className="flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          All
        </Link>
        {pills.map((category) => (
          <Link
            key={category}
            href={`/products?category=${encodeURIComponent(category)}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-navy-600 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-gold hover:text-gold"
          >
            <CategoryIcon category={category} className="h-4 w-4 text-gold" />
            {category}
          </Link>
        ))}
      </div>
    </section>
  );
}
