export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-12">
      <div className="h-9 w-56 animate-pulse rounded-xl bg-navy-800" />
      <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded-lg bg-navy-800/70" />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-navy-700/60 bg-navy-900/60"
          >
            <div className="aspect-square animate-pulse bg-navy-800" />
            <div className="space-y-2.5 p-4">
              <div className="h-4 w-full animate-pulse rounded bg-navy-800" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-navy-800/70" />
              <div className="h-6 w-20 animate-pulse rounded bg-navy-800" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-navy-800/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
