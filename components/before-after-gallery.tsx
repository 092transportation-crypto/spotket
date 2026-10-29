import { Reveal } from "@/components/reveal";
import { PHOTO_GALLERY_PLACEHOLDERS, PHOTO_GALLERY_PUBLISHED } from "@/lib/site";

/** Renders nothing until PHOTO_GALLERY_PUBLISHED is flipped to true with real samples. */
export function BeforeAfterGallery() {
  if (!PHOTO_GALLERY_PUBLISHED) return null;

  return (
    <div className="mx-auto mt-16 max-w-5xl">
      <Reveal className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          See The Difference
        </p>
        <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Before &amp; after
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PHOTO_GALLERY_PLACEHOLDERS.map((slot, i) => (
          <Reveal key={slot.id} delay={i * 80}>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-900/60">
              <div className="grid grid-cols-2">
                <div className="flex aspect-square items-center justify-center bg-neutral-800 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  Before
                </div>
                <div className="flex aspect-square items-center justify-center bg-neutral-700 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  After
                </div>
              </div>
              <p className="px-4 py-3 text-sm font-medium text-neutral-300">
                {slot.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
