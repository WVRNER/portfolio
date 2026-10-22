"use client";

import { useState } from "react";

export interface BlurImageProps {
  src: string;
  alt: string;
  aspectRatio?: number | string;
  blurDataUrl?: string;
  className?: string;
  containerClassName?: string;
  loading?: "eager" | "lazy";
  priority?: boolean;
}

/**
 * BlurImage - Build-time blur-up placeholder with zero layout shift.
 *
 * Reserves real image aspect ratio via inline CSS before the sharp image loads.
 * Fades seamlessly from the build-time blurDataUrl to full resolution.
 * Fully compliant with prefers-reduced-motion.
 */
export function BlurImage({
  src,
  alt,
  aspectRatio,
  blurDataUrl,
  className = "",
  containerClassName = "",
  loading = "lazy",
  priority = false,
}: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-neutral-100 ${containerClassName}`}
      style={aspectRatio ? { aspectRatio: String(aspectRatio) } : undefined}
    >
      {/* Build-time blur-up placeholder */}
      {blurDataUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={blurDataUrl}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover filter blur-md scale-105 pointer-events-none transition-opacity duration-500 ease-out motion-reduce:transition-none ${
            isLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
      )}

      {/* Full sharp image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : loading}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none ${
          isLoaded ? "opacity-100" : blurDataUrl ? "opacity-0" : "opacity-100"
        } ${className}`}
      />
    </div>
  );
}
