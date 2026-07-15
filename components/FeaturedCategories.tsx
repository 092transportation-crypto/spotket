import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

const cards = [
  {
    label: "Health & Wellness",
    category: "Health & Wellness",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900",
    blurb: "Feel-good essentials for recovery and self-care",
  },
  {
    label: "Electronics",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900",
    blurb: "Smart gadgets that earn their desk space",
  },
  {
    label: "Home & Garden",
    category: "Home & Garden",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900",
    blurb: "Cozy upgrades for every corner of home",
  },
  {
    label: "Beauty & Care",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900",
    blurb: "Glow-up essentials and self-care staples",
  },
  {
    label: "Kitchen",
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900",
    blurb: "Clever tools that make cooking effortless",
  },
  {
    label: "Toys",
    category: "Toys",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900",
    blurb: "Fidgets, squishies, and pure fun",
  },
  {
    label: "Sports",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900",
    blurb: "Gear that keeps up with every workout",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6" aria-labelledby="categories-heading">
      <Reveal>
        <h2 id="categories-heading" className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Shop by Category
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Reveal key={card.label} delay={index * 90}>
            <Link
              href={`/products?category=${encodeURIComponent(card.category)}`}
              className="group relative block h-56 overflow-hidden rounded-3xl border border-navy-700/60 sm:h-64"
            >
              <Image
                src={card.image}
                alt={card.label}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/40 to-transparent"
              />
              <span className="absolute inset-x-0 bottom-0 p-6">
                <span className="block font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.6rem" }}>
                  {card.label}
                </span>
                <span className="mt-1 block text-sm text-slate-300">{card.blurb}</span>
                <span className="mt-3 inline-block text-sm font-semibold text-gold transition-transform duration-300 group-hover:translate-x-1.5">
                  Explore →
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
        <Reveal delay={cards.length * 90}>
          <Link
            href="/products"
            className="group relative flex h-56 flex-col items-center justify-center overflow-hidden rounded-3xl border border-navy-700/60 bg-gradient-to-br from-navy-800 to-navy-900 sm:h-64"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(0,102,255,0.25), transparent 70%)",
              }}
            />
            <span className="relative block font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.6rem" }}>
              Shop All Products
            </span>
            <span className="relative mt-1 block text-sm text-slate-300">
              Browse the full catalog in one place
            </span>
            <span className="relative mt-3 inline-block text-sm font-semibold text-gold transition-transform duration-300 group-hover:translate-x-1.5">
              Explore →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
