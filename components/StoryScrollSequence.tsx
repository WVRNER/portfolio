"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";

// Global in-memory flag so the animation runs ONCE per page refresh
let hasAnimatedOnce = false;

/**
 * EditorialStatement / StoryScrollSequence
 * High-end Swiss Minimalist & Editorial Typography design.
 * 
 * Choreography (runs ONCE per page refresh):
 * 1. Beat 1: Initial entrance & hold of Nima Hosseini
 * 2. Beat 2: Cinematic reveal of "You didn't notice anything. That was the job."
 * 3. Beat 3: Nima Hosseini smoothly replaces Beat 2 with motion graphics (rising, de-blurring, settling)
 * 4. Completion: Once scrolled past, the sentence is gone forever and it becomes a static Nima Hosseini section.
 */
export function StoryScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(hasAnimatedOnce);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track scroll progress through this sequence track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth out progress with liquid physics for 120Hz trackpads & mobile
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 30,
    mass: 0.2,
  });

  /* ---------------- BEAT 1 & 3: Identity (Nima Hosseini) ---------------- */
  // 1. Initial dwell (0.0 -> 0.18), dissolves out (0.18 -> 0.30)
  // 2. Hidden while Beat 2 plays (0.30 -> 0.60)
  // 3. Flawlessly replaces Beat 2 with motion graphics (0.60 -> 0.80)
  // 4. Settles permanently at opacity 1 (0.80 -> 1.0)
  const identityOpacityRaw = useTransform(
    smoothProgress,
    [0.0, 0.18, 0.30, 0.60, 0.80, 1.0],
    [1, 1, 0, 0, 1, 1]
  );
  const identityYRaw = useTransform(
    smoothProgress,
    [0.0, 0.18, 0.30, 0.60, 0.80, 1.0],
    [0, 0, -24, 28, 0, 0]
  );
  const identityScaleRaw = useTransform(
    smoothProgress,
    [0.0, 0.18, 0.30, 0.60, 0.80, 1.0],
    [1, 1, 0.985, 0.985, 1, 1]
  );
  const identityFilterRaw = useTransform(
    smoothProgress,
    [0.0, 0.18, 0.30, 0.60, 0.80, 1.0],
    ["blur(0px)", "blur(0px)", "blur(6px)", "blur(6px)", "blur(0px)", "blur(0px)"]
  );

  /* ---------------- BEAT 2: The Punchline ---------------- */
  // "You didn't notice anything. That was the job."
  // Enters (0.28 -> 0.38), holds & illuminates (0.38 -> 0.58),
  // then dissolves out (0.58 -> 0.70) as Nima Hosseini replaces it.
  const manifestoOpacity = useTransform(
    smoothProgress,
    [0.28, 0.38, 0.58, 0.70],
    [0, 1, 1, 0]
  );
  const manifestoY = useTransform(
    smoothProgress,
    [0.28, 0.38, 0.58, 0.70],
    [24, 0, 0, -24]
  );
  const manifestoScale = useTransform(
    smoothProgress,
    [0.28, 0.38, 0.58, 0.70],
    [0.985, 1, 1, 0.985]
  );
  const manifestoFilter = useTransform(
    smoothProgress,
    [0.28, 0.38, 0.58, 0.70],
    ["blur(6px)", "blur(0px)", "blur(0px)", "blur(6px)"]
  );

  // Kinetic Text Illumination
  const line1Color = useTransform(
    smoothProgress,
    [0.34, 0.48],
    ["rgba(10, 10, 10, 0.28)", "rgba(10, 10, 10, 0.95)"]
  );
  const line1X = useTransform(smoothProgress, [0.32, 0.48], [-10, 0]);

  const line2Color = useTransform(
    smoothProgress,
    [0.44, 0.58],
    ["rgba(10, 10, 10, 0.20)", "rgba(10, 10, 10, 1.0)"]
  );
  const line2Scale = useTransform(smoothProgress, [0.44, 0.58], [0.985, 1.0]);

  // Bottom sequence progress indicator
  const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Lock to completed static state once user scrolls past the sequence
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!hasCompleted && latest >= 0.98) {
      hasAnimatedOnce = true;
      setHasCompleted(true);
    }
  });

  // Fallback scroll listener for fast wheel / touch swipes
  useEffect(() => {
    if (hasCompleted) return;

    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.bottom <= window.innerHeight + 10) {
        hasAnimatedOnce = true;
        setHasCompleted(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasCompleted]);

  // Active transforms vs locked static values once completed
  const identityOpacity = hasCompleted ? 1 : identityOpacityRaw;
  const identityY = hasCompleted ? 0 : identityYRaw;
  const identityScale = hasCompleted ? 1 : identityScaleRaw;
  const identityFilter = hasCompleted ? "blur(0px)" : identityFilterRaw;

  return (
    <section
      ref={containerRef}
      id="nima-hosseini"
      aria-label="Editorial Narrative Sequence"
      className="relative w-full h-[220vh] sm:h-[240vh] bg-white border-t border-[#0A0A0A]/10"
    >
      <div id="story" className="absolute top-0 left-0" />
      {/* Sticky Stage Viewport: Locked for buttery sequence */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-white px-6 sm:px-12 md:px-16 lg:px-24">
        
        {/* Ambient Top & Bottom Vignettes */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent z-20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent z-20" />

        {/* Content Wrapper */}
        <div className="relative w-full max-w-[1440px] mx-auto z-10 flex items-center justify-center min-h-[440px]">
          
          {/* ======================================================== */}
          {/* BEAT 1 & 3: IDENTITY (Nima Hosseini)                      */}
          {/* Starts visible -> dissolves -> smoothly replaces Beat 2   */}
          {/* ======================================================== */}
          <motion.div
            style={{
              opacity: identityOpacity,
              y: identityY,
              scale: identityScale,
              filter: identityFilter,
            }}
            className="absolute inset-0 flex flex-col justify-center max-w-[1280px]"
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
          {/* (Permanently removed from DOM once user scrolls past)    */}
          {/* ======================================================== */}
          {!hasCompleted && (
            <motion.div
              style={{
                opacity: manifestoOpacity,
                y: manifestoY,
                scale: manifestoScale,
                filter: manifestoFilter,
              }}
              className="absolute inset-0 flex flex-col justify-center max-w-[1280px] pointer-events-none"
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
          )}

        </div>

        {/* Minimal Progress Bar at bottom (Responsive & sleek) */}
        {mounted && !hasCompleted && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 pointer-events-none">
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
