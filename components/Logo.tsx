import Image from "next/image";
import Link from "next/link";

function LogoMark({ className }: { className: string }) {
  return (
    <Image
      src="/logo-mark.png"
      alt="Spotket logo"
      width={620}
      height={480}
      priority
      className={`${className} rounded-md object-contain`}
    />
  );
}

export default function Logo({
  withTagline = true,
  size = "md",
}: {
  withTagline?: boolean;
  size?: "md" | "lg";
}) {
  const large = size === "lg";
  return (
    <Link
      href="/"
      className="group inline-flex shrink-0 items-center gap-2.5"
      aria-label="Spotket — Shop Smarter — home"
    >
      <LogoMark
        className={`${large ? "h-12 w-[62px]" : "h-9 w-[46px]"} transition-transform duration-300 group-hover:-translate-y-0.5`}
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-extrabold italic tracking-tight ${large ? "text-[27px]" : "text-xl"}`}
        >
          <span className="text-white">Spot</span>
          <span className="text-brand">Ket</span>
        </span>
        {withTagline && (
          <span
            className={`mt-1 font-semibold uppercase tracking-[0.28em] text-slate-400 ${large ? "text-[9.5px]" : "text-[8px]"}`}
          >
            Shop Smarter.
          </span>
        )}
      </span>
    </Link>
  );
}
