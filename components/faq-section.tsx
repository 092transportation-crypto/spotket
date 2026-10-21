import { Reveal } from "@/components/reveal";
import { faqSchema } from "@/lib/seo";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection({
  eyebrow = "FAQ",
  heading,
  items,
}: {
  eyebrow?: string;
  heading: string;
  items: readonly FaqItem[];
}) {
  return (
    <div className="mx-auto mt-20 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(items)) }}
      />
      <Reveal className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          {heading}
        </h2>
      </Reveal>

      <div className="mt-10 space-y-4">
        {items.map((item, i) => (
          <Reveal key={item.question} delay={i * 80}>
            <div className="rounded-2xl border border-white/10 bg-navy-900/60 p-6">
              <h3 className="text-base font-semibold text-white">
                {item.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                {item.answer}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
