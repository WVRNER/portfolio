"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";

// Safe isomorphic layout effect for Next.js SSR/export
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Single-run per refresh / page load tracker
let hasAnimatedOnce = false;

/**
 * EditorialStatement / StoryScrollSequence
 * High-end Swiss Minimalist & Editorial Typography design.
 * 
 * Runs the cinematic scroll sequence ONCE per page refresh:
 * - Beat 1: Nima Hosseini holds with monumental typography.
 * - Beat 2: "You didn't notice anything. That was the job." illuminates.
 * - Once scrolled past: The sentence is removed completely, collapsing
 *   into a static, permanent Nima Hosseini section with zero replay interruption.
 */
export function StoryScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heightDiffRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(hasAnimatedOnce);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track scroll progress through this responsive sequence track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth out progress for 120Hz liquid response on mobile & trackpads
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    mass: 0.2,
  });

  /* ---------------- BEAT 1: Identity (Nima Hosseini) ---------------- */
  // Generous Apple-style dwell: holds rock-solid for 44% of the track before dissolving
  const identityOpacity = useTransform(smoothProgress, [0.0, 0.44, 0.55], [1, 1, 0]);
  const identityY = useTransform(smoothProgress, [0.0, 0.44, 0.55], [0, 0, -24]);
  const identityScale = useTransform(smoothProgress, [0.0, 0.44, 0.55], [1, 1, 0.985]);

  /* ---------------- BEAT 2: The Unified Punchline ---------------- */
  // "You didn't notice anything. That was the job."
  // Enters as Beat 1 exits and holds with dynamic illumination
  const manifestoOpacity = useTransform(smoothProgress, [0.48, 0.58, 0.88, 0.98], [0, 1, 1, 0]);
  const manifestoY = useTransform(smoothProgress, [0.48, 0.58, 0.88, 0.98], [24, 0, 0, -20]);

  // Kinetic Text Illumination (Words light up as user scrolls)
  // Line 1: "You didn't notice anything."
  const line1Color = useTransform(
    smoothProgress,
    [0.52, 0.68],
    ["rgba(10, 10, 10, 0.32)", "rgba(10, 10, 10, 0.95)"]
  );
  const line1X = useTransform(smoothProgress, [0.50, 0.68], [-10, 0]);

  // Line 2: "That was the job."
  const line2Color = useTransform(
    smoothProgress,
    [0.62, 0.78],
    ["rgba(10, 10, 10, 0.25)", "rgba(10, 10, 10, 1.0)"]
  );
  const line2Scale = useTransform(smoothProgress, [0.62, 0.78], [0.985, 1.0]);

  // Bottom sequence progress indicator
  const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Transition to permanent static mode once the user scrolls past the animation
  const completeSequence = () => {
    if (hasAnimatedOnce) return;
    hasAnimatedOnce = true;

    const el = containerRef.current;
    if (el) {
      const oldHeight = el.offsetHeight;
      const newHeight = window.innerHeight;
      const diff = oldHeight - newHeight;
      heightDiffRef.current = diff > 0 ? diff : 0;
    }

    setHasCompleted(true);
  };

  // Monitor motion scroll progress to trigger completion at the end of the track
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!hasCompleted && latest >= 0.98) {
      completeSequence();
    }
  });

  // Fallback scroll listener in case of fast wheel/touch scroll jumps
  useEffect(() => {
    if (hasCompleted) return;

    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.bottom <= window.innerHeight + 20) {
        completeSequence();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasCompleted]);

  // Instantly compensate document scroll offset when collapsing track height so the viewport never jumps
  useIsomorphicLayoutEffect(() => {
    if (hasCompleted && heightDiffRef.current > 0) {
      const diff = heightDiffRef.current;
      heightDiffRef.current = 0;
      window.scrollBy({ top: -diff, behavior: "instant" });
      const lenis = (window as unknown as { __lenis?: { resize: () => void; scroll: number; scrollTo: (target: number, opts?: { immediate?: boolean }) => void } }).__lenis;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(lenis.scroll - diff, { immediate: true });
      }
    }
  }, [hasCompleted]);

  // STATIC MODE: Rendered once the user scrolls past the animation (sentence is gone)
  if (hasCompleted) {
    return (
      <section
        ref={containerRef}
        id="nima-hosseini"
        aria-label="Editorial Narrative Sequence"
        className="relative w-full h-[100dvh] min-h-[640px] flex items-center justify-center bg-white border-t border-[#0A0A0A]/10 px-6 sm:px-12 md:px-16 lg:px-24"
      >
        <div id="story" className="absolute top-0 left-0" />

        {/* Ambient Top & Bottom Vignettes */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent z-20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent z-20" />

        {/* Static Nima Hosseini Presentation */}
        <div className="relative w-full max-w-[1440px] mx-auto z-10 flex items-center justify-center">
          <div className="w-full max-w-[1280px]">
            <div className="space-y-4 sm:space-y-6">
              
              {/* Clean Discipline Descriptor */}
              <div className="font-mono text-[11px] sm:text-xs tracking-[0.24em] uppercase text-black/50 font-medium">
                SYSTEMS ARCHITECT &bull; CLOUD INFRASTRUCTURE
              </div>

              {/* Monumental Name */}
              <h2 className="font-display text-[clamp(3.6rem,9.5vw,8.8rem)] font-medium leading-[0.88] tracking-[-0.045em] text-[#0A0A0A] select-none">
                Nima Hosseini
              </h2>

              {/* Focus & Architecture Description */}
              <div className="space-y-3 max-w-[58ch] pt-1">
                <div className="text-[18px] sm:text-[23px] md:text-[26px] text-[#222222] font-normal tracking-tight">
                  Infrastructure as Code &bull; Systems Reliability
                </div>
                <p className="text-[14.5px] sm:text-[16.5px] text-[#5A5A5A] leading-relaxed font-normal">
                  Building resilient architectures from first principles &mdash; with an emphasis on clarity, security boundaries, and reproducible cloud state across AWS and modern container environments.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }

  // ACTIVE SEQUENCE: Runs once per refresh
  return (
    <section
      ref={containerRef}
      id="nima-hosseini"
      aria-label="Editorial Narrative Sequence"
      className="relative w-full h-[280vh] sm:h-[300vh] bg-white border-t border-[#0A0A0A]/10"
    >
      <div id="story" className="absolute top-0 left-0" />
      {/* Sticky Stage Viewport: Locked for a tight, buttery sequence */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-white px-6 sm:px-12 md:px-16 lg:px-24">
        
        {/* Ambient Top & Bottom Vignettes */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent z-20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent z-20" />

        {/* Content Wrapper */}
        <div className="relative w-full max-w-[1440px] mx-auto z-10 flex items-center justify-center min-h-[440px]">
          
          {/* ======================================================== */}
          {/* BEAT 1: IDENTITY (Nima Hosseini)                          */}
          {/* ======================================================== */}
          <motion.div
            style={{ opacity: identityOpacity, y: identityY, scale: identityScale }}
            className="absolute inset-0 flex flex-col justify-center max-w-[1280px] pointer-events-none"
          >
            <div className="space-y-4 sm:space-y-6">
              
              {/* Clean Discipline Descriptor */}
              <div className="font-mono text-[11px] sm:text-xs tracking-[0.24em] uppercase text-black/50 font-medium">
                SYSTEMS ARCHITECT &bull; CLOUD INFRASTRUCTURE
              </div>

              {/* Monumental Name */}
              <h2 className="font-display text-[clamp(3.6rem,9.5vw,8.8rem)] font-medium leading-[0.88] tracking-[-0.045em] text-[#0A0A0A] select-none">
                Nima Hosseini
              </h2>

              {/* Focus & Architecture Description */}
              <div className="space-y-3 max-w-[58ch] pt-1">
                <div className="text-[18px] sm:text-[23px] md:text-[26px] text-[#222222] font-normal tracking-tight">
                  Infrastructure as Code &bull; Systems Reliability
                </div>
                <p className="text-[14.5px] sm:text-[16.5px] text-[#5A5A5A] leading-relaxed font-normal">
                  Building resilient architectures from first principles &mdash; with an emphasis on clarity, security boundaries, and reproducible cloud state across AWS and modern container environments.
                </p>
              </div>

            </div>
          </motion.div>

          {/* ======================================================== */}
          {/* BEAT 2: THE UNIFIED DUAL MANIFESTO                        */}
          {/* "You didn't notice anything. That was the job."          */}
          {/* ======================================================== */}
          <motion.div
            style={{ opacity: manifestoOpacity, y: manifestoY }}
            className="absolute inset-0 flex flex-col justify-center max-w-[1280px]"
          >
            <div className="space-y-6 sm:space-y-8">
              
              {/* Unified Close Typography Lockup */}
              <div className="space-y-2 sm:space-y-3">
                
                {/* Line 1: Italian Editorial Serif Italic */}
                <motion.p
                  style={{ color: line1Color, x: line1X }}
                  className="font-serif italic font-normal text-[clamp(2.8rem,7.5vw,7.6rem)] leading-[0.98] tracking-[-0.03em] select-none will-change-transform"
                >
                  You didn’t notice anything.
                </motion.p>

                {/* Line 2: Monumental Architectural Sans-Serif */}
                <motion.h3
                  style={{ color: line2Color, scale: line2Scale }}
                  className="font-display font-medium text-[clamp(3.4rem,9.2vw,9.2rem)] leading-[0.88] tracking-[-0.045em] select-none will-change-transform text-[#0A0A0A]"
                >
                  That was the job.
                </motion.h3>

              </div>
            </div>
          </motion.div>

        </div>

        {/* Minimal Progress Bar at bottom (Responsive & sleek) */}
        {mounted && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
            <div className="w-24 sm:w-32 h-[1.5px] bg-black/10 rounded-full overflow-hidden">
              <motion.div
                style={{ width: progressWidth }}
                className="h-full bg-black rounded-full"
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
