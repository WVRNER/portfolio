"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { useCallback, type ComponentPropsWithoutRef } from "react";
import { shouldPrefetch } from "@/lib/prefetch";
import { usePageTransition } from "@/components/PageTransition";

export type InstantLinkProps = Omit<ComponentPropsWithoutRef<"a">, keyof LinkProps> &
  LinkProps & {
    children: React.ReactNode;
    className?: string;
    transitionTitle?: string;
    transitionSubtitle?: string;
    viewTransition?: boolean;
  };

/**
 * InstantLink - Network-aware hover and touch-start prefetching Link.
 *
 * Disables aggressive viewport prefetch to save battery and mobile bandwidth.
 * Pre-warms the destination route on mouse hover or touch start (100-300ms before click),
 * enabling instantaneous navigation while respecting Save-Data and slow connections.
 * Automatically leverages View Transitions API for blog post card-to-article fluid morphing.
 */
export function InstantLink({
  href,
  onClick,
  onMouseEnter,
  onTouchStart,
  transitionTitle,
  transitionSubtitle,
  viewTransition,
  children,
  ...props
}: InstantLinkProps) {
  const router = useRouter();
  const transitionRouter = useTransitionRouter();
  const { triggerTransition } = usePageTransition();

  const handleWarmup = useCallback(() => {
    const target = typeof href === "string" ? href : href.pathname;
    if (target && shouldPrefetch(target)) {
      router.prefetch(target);
    }
  }, [href, router]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        e.shiftKey
      ) {
        return;
      }

      const target = typeof href === "string" ? href : href.pathname;
      if (!target || !target.startsWith("/")) {
        return;
      }

      // Card-to-article fluid morphing using View Transitions API
      const isBlogArticle =
        viewTransition ?? (target.startsWith("/blog/") && target !== "/blog");

      if (isBlogArticle) {
        e.preventDefault();
        transitionRouter.push(target);
        return;
      }

      // Top-level routing screen transition (for navbar buttons: Work, Writing, About, Contact)
      e.preventDefault();
      const displayTitle =
        transitionTitle ||
        (typeof props["aria-label"] === "string" && props["aria-label"]) ||
        (typeof props.title === "string" && props.title) ||
        (target === "/blog" ? "Writing" : "WVRNER");
      const displaySubtitle =
        transitionSubtitle || "systems, cloud infrastructure, and technical field notes";

      triggerTransition(displayTitle, displaySubtitle, target);
    },
    [href, onClick, props, transitionTitle, transitionSubtitle, triggerTransition, transitionRouter, viewTransition]
  );

  return (
    <Link
      href={href}
      prefetch={false}
      onClick={handleClick}
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
