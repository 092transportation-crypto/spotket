import { Zap } from "lucide-react";
import Link from "next/link";

/** Bold promo strip below the hero — WELCOME10 front and center. */
export default function FlashSaleBanner() {
  return (
    <Link
      href="/products"
      className="group relative block overflow-hidden border-y border-gold/25 bg-gradient-to-r from-navy-950 via-[#141019] to-navy-950 px-4 py-4 text-center transition-colors hover:border-gold/50"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 120% at 50% 50%, rgba(201,168,76,0.10), transparent 70%)",
        }}
      />
      <span className="relative inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-bold tracking-wide text-gold sm:text-base">
        <Zap
          className="h-5 w-5 shrink-0 fill-gold-light text-gold-light"
          style={{ animation: "zap-pulse 1.6s ease-in-out infinite" }}
          aria-hidden="true"
        />
        FLASH SALE
        <span aria-hidden="true" className="hidden text-gold/50 sm:inline">
          —
        </span>
        <span className="font-semibold text-gold-light">
          Use code{" "}
          <span className="mx-1 rounded-md border border-gold/40 bg-gold/10 px-2 py-0.5 font-mono text-sm tracking-widest">
            WELCOME10
          </span>{" "}
          for 10% off your first order
        </span>
        <span className="ml-1 hidden text-sm font-semibold text-slate-400 transition-colors group-hover:text-gold sm:inline">
          Shop now →
        </span>
      </span>
    </Link>
  );
}
