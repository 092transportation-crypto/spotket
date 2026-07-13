const badges = [
  {
    title: "SSL Secure",
    description: "256-bit encrypted checkout",
    icon: (
      <path d="M6 10V7a6 6 0 1 1 12 0v3m-13 0h14v10H5V10Zm7 4v3" />
    ),
  },
  {
    title: "30-Day Returns",
    description: "Hassle-free, no questions asked",
    icon: <path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4m3 4 2 2 4-4" />,
  },
  {
    title: "Free Shipping",
    description: "On orders over $35",
    icon: (
      <path d="M3 7h11v8H3V7Zm11 2h4l3 3v3h-7V9ZM7 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    ),
  },
  {
    title: "24/7 Support",
    description: "Real people, anytime",
    icon: (
      <path d="M4 13a8 8 0 1 1 16 0m-16 0v3a2 2 0 0 0 2 2h2v-5H4Zm16 0v3a2 2 0 0 1-2 2h-2v-5h4Zm-6 7h-4" />
    ),
  },
];

export default function TrustBadges() {
  return (
    <section aria-label="Why shop with Spotket" className="border-y border-navy-700/60 bg-navy-900">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-4 sm:px-6 sm:py-8 lg:grid-cols-4">
        {badges.map((badge) => (
          <div key={badge.title} className="group flex items-start gap-3">
            <span className="rounded-xl bg-brand/10 p-2.5 text-brand transition-colors group-hover:bg-brand/20">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {badge.icon}
              </svg>
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">{badge.title}</h3>
              <p className="mt-0.5 text-sm text-slate-400 sm:text-xs">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
