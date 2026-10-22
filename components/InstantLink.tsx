"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, type ComponentPropsWithoutRef } from "react";
import { shouldPrefetch } from "@/lib/prefetch";

export type InstantLinkProps = Omit<ComponentPropsWithoutRef<"a">, keyof LinkProps> &
  LinkProps & {
    children: React.ReactNode;
    className?: string;
  };

/**
 * InstantLink - Network-aware hover and touch-start prefetching Link.
 *
 * Disables aggressive viewport prefetch to save battery and mobile bandwidth.
 * Pre-warms the destination route on mouse hover or touch start (100-300ms before click),
 * enabling instantaneous navigation while respecting Save-Data and slow connections.
 */
export function InstantLink({
  href,
  onMouseEnter,
  onTouchStart,
  children,
  ...props
}: InstantLinkProps) {
  const router = useRouter();

  const handleWarmup = useCallback(() => {
    const target = typeof href === "string" ? href : href.pathname;
    if (target && shouldPrefetch(target)) {
      router.prefetch(target);
    }
  }, [href, router]);

  return (
    <Link
      href={href}
      prefetch={false}
      onMouseEnter={(e) => {
        handleWarmup();
        onMouseEnter?.(e);
      }}
      onTouchStart={(e) => {
        handleWarmup();
        onTouchStart?.(e);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
