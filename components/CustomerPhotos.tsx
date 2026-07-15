import Image from "next/image";
import Reveal from "@/components/Reveal";

/** Lifestyle inspiration shots — products like ours, in real spaces. */
const photos = [
  {
    src: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
    caption: "Ambient lighting, instant calm",
    tag: "Home & Garden",
  },
  {
    src: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800",
    caption: "A desk setup that earns the overtime",
    tag: "Electronics",
  },
  {
    src: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
    caption: "Self-care Sundays, upgraded",
    tag: "Beauty & Care",
  },
  {
    src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
    caption: "Home workouts that actually stick",
    tag: "Sports",
  },
];

export default function CustomerPhotos() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-9" aria-labelledby="photos-heading">
      <Reveal>
        <h2 id="photos-heading" className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Styled in Real Homes
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          The looks our products live in — get inspired, then get the goods.
        </p>
      </Reveal>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <Reveal key={photo.src} delay={index * 90}>
            <figure className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-navy-700/60">
              <Image
                src={photo.src}
                alt={photo.caption}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#1e1038]/95 via-transparent to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-4">
                <span className="block text-sm font-semibold leading-snug text-white">
                  {photo.caption}
                </span>
                <span className="mt-1 inline-block rounded-full bg-navy-950/70 px-2.5 py-0.5 text-[11px] font-semibold text-gold backdrop-blur">
                  {photo.tag}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
