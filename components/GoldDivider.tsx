/** Thin gold hairline separating major homepage sections. */
export default function GoldDivider() {
  return (
    <div aria-hidden="true" className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
    </div>
  );
}
