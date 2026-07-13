import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

const cards = [
  {
    label: "Health & Wellness",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900",
    blurb: "Feel-good essentials for recovery and self-care",
  },
  {
    label: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900",
    blurb: "Smart gadgets that earn their desk space",
  },
  {
    label: "Toys",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900",
    blurb: "Fidgets, squishies, and pure fun",
  },
  {
    label: "Sports",
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
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {cards.map((card, index) => (
          <Reveal key={card.label} delay={index * 120}>
            <Link
              href={`/products?category=${encodeURIComponent(card.label)}`}
              className="group relative block h-64 overflow-hidden rounded-3xl border border-navy-700/60 sm:h-80"
            >
              <Image
                src={card.image}
                alt={card.label}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/40 to-transparent"
              />
              <span className="absolute inset-x-0 bottom-0 p-7">
                <span className="block font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.9rem" }}>
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
      </div>
    </section>
  );
}
