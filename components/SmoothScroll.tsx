"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    // High responsiveness: tight duration and direct wheel multiplier
    const lenis = new Lenis({
      duration: 0.75,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;
    if (typeof window !== "undefined") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      if (typeof window !== "undefined") {
        delete (window as unknown as { __lenis?: Lenis }).__lenis;
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}

export function scrollToTarget(
  target: string | HTMLElement | number,
  options?: { duration?: number; offset?: number; easing?: (t: number) => number }
) {
  if (typeof window === "undefined") return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const defaultOffset = options?.offset ?? -80;
  const defaultDuration = options?.duration ?? 1.15;
  const defaultEasing =
    options?.easing ??
    ((t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)));

  if (prefersReduced) {
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "auto" });
    } else if (typeof target === "string") {
      const el = document.querySelector(target);
      if (el) {
        const top =
          el.getBoundingClientRect().top + window.scrollY + defaultOffset;
        window.scrollTo({ top, behavior: "auto" });
      }
    } else if (target instanceof HTMLElement) {
      const top =
        target.getBoundingClientRect().top + window.scrollY + defaultOffset;
      window.scrollTo({ top, behavior: "auto" });
    }
    return;
  }

  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;

  if (lenis) {
    lenis.scrollTo(target, {
      duration: defaultDuration,
      offset: defaultOffset,
      easing: defaultEasing,
      lock: false,
    });
  } else {
    if (typeof target === "string") {
      const el = document.querySelector(target);
      if (el) {
        const top =
          el.getBoundingClientRect().top + window.scrollY + defaultOffset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    } else if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "smooth" });
    } else if (target instanceof HTMLElement) {
      const top =
        target.getBoundingClientRect().top + window.scrollY + defaultOffset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }
}
