"use client";

import { useState, useRef, useEffect } from "react";

export interface BlurImageProps {
  src: string;
  alt: string;
  aspectRatio?: number | string;
  blurDataUrl?: string;
  className?: string;
  containerClassName?: string;
  loading?: "eager" | "lazy";
  priority?: boolean;
  sizes?: string;
}

/**
 * Builds responsive srcset for modern formats (AVIF/WebP) and adaptive sizing.
 * Automatically converts Unsplash URLs to responsive widths with auto=format.
 */
function getOptimizedSrcSet(url: string): string | undefined {
  if (!url || !url.includes("images.unsplash.com")) return undefined;
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("w");
    parsed.searchParams.set("auto", "format");
    parsed.searchParams.set("q", "75");

    const base = parsed.toString();
    const sep = base.includes("?") ? "&" : "?";

    return [
      `${base}${sep}w=360 360w`,
      `${base}${sep}w=640 640w`,
      `${base}${sep}w=960 960w`,
      `${base}${sep}w=1280 1280w`,
    ].join(", ");
  } catch {
    return undefined;
  }
}

/**
 * BlurImage - Build-time blur-up placeholder with zero layout shift.
 *
 * Reserves real image aspect ratio via inline CSS before the sharp image loads.
 * Fades seamlessly from the build-time blurDataUrl to full resolution.
 * Checks img.complete on mount to immediately show cached images without delay.
 * Fully compliant with prefers-reduced-motion. Zero em dashes.
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
  sizes,
}: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if image is already cached or completed
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, []);

  const srcSet = getOptimizedSrcSet(src);

  return (
    <div
      className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 ${containerClassName}`}
      style={aspectRatio ? { aspectRatio: String(aspectRatio) } : undefined}
    >
      {/* Build-time blur-up placeholder */}
      {blurDataUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={blurDataUrl}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover filter blur-md scale-105 pointer-events-none transition-opacity duration-300 ease-out motion-reduce:transition-none ${
            isLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
      )}

      {/* Full sharp image with modern format srcset and priority */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : loading}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          isLoaded ? "opacity-100" : blurDataUrl ? "opacity-0" : "opacity-100"
        } ${className}`}
      />
    </div>
  );
}
