import { Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";

type CategoryCard = {
  label: string;
  /** Catalog category the card filters to; undefined renders the Deals icon. */
  category?: string;
  href: string;
  image: string;
  alt: string;
  blurb: string;
};

const cards: CategoryCard[] = [
  {
    label: "Electronics",
    category: "Electronics",
    href: "/products?category=Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
    alt: "Laptop, tablet, and gadgets arranged on a workspace",
    blurb: "Smart gadgets, audio, and accessories that make every day easier.",
  },
  {
    label: "Home & Garden",
    category: "Home & Garden",
    href: "/products?category=Home+%26+Garden",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400",
    alt: "Bright modern home interior with a cozy kitchen and living space",
    blurb: "Premium picks to upgrade every room — and the yard too.",
  },
  {
    label: "Health & Wellness",
    category: "Health & Wellness",
    href: "/products?category=Health+%26+Wellness",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    alt: "Dumbbells and wellness gear ready for a workout",
    blurb: "Feel-good essentials for recovery, sleep, and self-care.",
  },
  {
    label: "Beauty & Care",
    category: "Beauty",
    href: "/products?category=Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    alt: "Beauty and skincare products neatly arranged on a table",
    blurb: "Skincare, tools, and beauty tech that deliver real results.",
  },
  {
    label: "Sports & Outdoors",
    category: "Sports",
    href: "/products?category=Sports",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
    alt: "Athlete training with weights in a gym",
    blurb: "Gear that keeps up with every workout, trail, and game day.",
  },
  {
    label: "Kitchen",
    category: "Kitchen",
    href: "/products?category=Kitchen",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    alt: "Modern kitchen counter with cooking essentials",
    blurb: "Cook smarter with tools built for real home kitchens.",
  },
  {
    label: "Toys",
    category: "Toys",
    href: "/products?category=Toys",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    alt: "Colorful children's toys on a bright background",
    blurb: "Playtime favorites, tested for fun and built to last.",
  },
  {
    label: "Today's Deals",
    href: "/deals",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400",
    alt: "Wrapped gift box with a ribbon representing daily deals",
    blurb: "Limited-time prices on premium picks — refreshed every midnight.",
  },
];

export default function TopCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-14" aria-labelledby="top-categories-heading">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">
          Departments
        </p>
        <h2 id="top-categories-heading" className="mt-2 text-3xl font-bold text-white sm:text-4xl">
          Top categories
        </h2>
        <p className="mt-3 hidden text-sm leading-relaxed text-slate-400 sm:block">
          Curated departments, one standard: every product is researched,
          tested, and backed by our price match guarantee. Pick a category and
          shop with confidence.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group overflow-hidden rounded-2xl border border-navy-700/60 bg-navy-800/60 transition duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-lg hover:shadow-black/40"
          >
            {/* Photo header (desktop) — mobile cards are icon + label only */}
            <div className="relative hidden aspect-[4/3] overflow-hidden sm:block">
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col items-center gap-3 px-4 py-7 text-center sm:block sm:p-5 sm:text-left">
              <span className="text-brand sm:hidden">
                {card.category ? (
                  <CategoryIcon category={card.category} className="h-8 w-8" />
                ) : (
                  <Zap className="h-8 w-8" aria-hidden="true" />
                )}
              </span>
              <h3 className="flex items-center gap-2 font-bold text-white">
                <span className="hidden text-brand sm:inline">
                  {card.category ? (
                    <CategoryIcon category={card.category} className="h-4.5 w-4.5" />
                  ) : (
                    <Zap className="h-4.5 w-4.5" aria-hidden="true" />
                  )}
                </span>
                {card.label}
              </h3>
              <p className="mt-1.5 hidden line-clamp-2 text-sm leading-relaxed text-slate-400 sm:block">
                {card.blurb}
              </p>
              <span className="mt-3 hidden text-sm font-semibold text-brand transition-colors group-hover:text-white sm:inline-block">
                Shop now →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
