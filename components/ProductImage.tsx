"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * next/image with a graceful fallback: when the source is missing, from an
 * unconfigured host, or fails to load, it renders the brand placeholder
 * instead of the browser's broken-image icon.
 */
export default function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "object-cover",
}: {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className="flex h-full w-full items-center justify-center text-4xl font-extrabold italic text-navy-600">
        SK
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
