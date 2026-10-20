"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingCta() {
  const pathname = usePathname();

  if (pathname === "/contact") return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
      <Link
        href="/contact"
        className="btn-shimmer btn-pulse flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/40"
      >
        Get a Free Demo
      </Link>
    </div>
  );
}
