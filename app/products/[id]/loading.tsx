export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-14">
      <div className="h-4 w-64 max-w-full animate-pulse rounded bg-navy-800/70" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square animate-pulse rounded-3xl bg-navy-800" />
          <div className="mt-4 flex gap-3">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-20 w-20 animate-pulse rounded-xl bg-navy-800/70" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-8 w-full animate-pulse rounded-lg bg-navy-800" />
          <div className="h-8 w-3/4 animate-pulse rounded-lg bg-navy-800/70" />
          <div className="h-5 w-48 animate-pulse rounded bg-navy-800/70" />
          <div className="h-10 w-40 animate-pulse rounded-lg bg-navy-800" />
          <div className="h-24 w-full animate-pulse rounded-2xl bg-navy-800/60" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-navy-800" />
          <div className="space-y-2 pt-4">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="h-4 w-full animate-pulse rounded bg-navy-800/60" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
