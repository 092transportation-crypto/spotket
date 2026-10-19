import { NEW_SITE_NAME, NEW_SITE_URL, SITE_NAME } from "@/lib/site";

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        {SITE_NAME} has closed
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {SITE_NAME} is now {NEW_SITE_NAME}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-neutral-400">
        We&apos;ve shut down the {SITE_NAME} store. You can find us at our new
        home, {NEW_SITE_NAME}.
      </p>
      <a
        href={NEW_SITE_URL}
        className="mt-10 inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-95"
      >
        Visit {NEW_SITE_NAME}
      </a>
    </div>
  );
}
