"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";

/**
 * ReliefTransition - Architectural Tension-to-Relief Conduit
 *
 * Bridges the technical narrative of AboutSection into the open clarity
 * of ContactSection. Inspired by harmonic equilibrium, Apple physics, and Emil Kowalski craft.
 * Complies with prefers-reduced-motion and strictly zero em dashes.
 */
export function ReliefTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Scroll tracking through this transition zone
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth out scroll value with a physical spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Animated properties mapped from smoothed progress
  const conduitScaleY = useTransform(smoothProgress, [0.15, 0.65], [0, 1]);
  const haloOpacity = useTransform(smoothProgress, [0.25, 0.55, 0.85], [0.1, 0.5, 0.1]);
  const haloScale = useTransform(smoothProgress, [0.2, 0.6], [0.85, 1.15]);

  const handleGlideToContact = () => {
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      aria-label="Transition to contact"
      className="relative w-full max-w-[1400px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24 py-16 sm:py-24 overflow-hidden select-none"
    >
      {/* Ambient Relief Halo (Deep breath of atmospheric warmth) */}
      {!prefersReduced ? (
        <motion.div
          style={{ opacity: haloOpacity, scale: haloScale }}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[560px] h-[220px] sm:h-[300px] rounded-full bg-gradient-to-b from-neutral-200/50 via-neutral-100/30 to-transparent blur-3xl -z-10"
        />
      ) : (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[220px] rounded-full bg-neutral-100/30 blur-2xl -z-10" />
      )}

      {/* Central Kinetic Conduit Architecture */}
      <div className="relative flex flex-col items-center justify-center">
        
        {/* Top Connecting Line from About Section */}
        <div className="relative w-px h-12 sm:h-16 bg-neutral-200 overflow-hidden">
          {!prefersReduced && (
            <motion.div
              style={{ scaleY: conduitScaleY, originY: 0 }}
              className="absolute inset-0 bg-gradient-to-b from-[#242424]/40 via-[#242424] to-[#242424]/40"
            />
          )}
        </div>

        {/* Centerpiece: Equilibrium Relief Beacon */}
        <div className="my-3 sm:my-4">
          <motion.button
            type="button"
            onClick={handleGlideToContact}
            whileHover={!prefersReduced ? { scale: 1.03, y: -2 } : {}}
            whileTap={!prefersReduced ? { scale: 0.97 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group relative flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2.5 rounded-full bg-white/95 border border-black/10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:border-black/20 backdrop-blur-md transition-all duration-200 cursor-pointer text-left"
          >
            {/* Steady State Status Indicator */}
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>

            {/* Pill Labels */}
            <div className="flex items-center gap-2 text-[11px] sm:text-[12px] font-mono tracking-[0.16em] uppercase">
              <span className="font-semibold text-[#242424]">EQUILIBRIUM ACHIEVED</span>
              <span className="text-black/25 font-light">&bull;</span>
              <span className="text-[#6E6E73] group-hover:text-[#242424] transition-colors hidden xs:inline">
                READY TO CONNECT
              </span>
            </div>

            {/* Kinetic Downward Affordance */}
            <div className="w-5 h-5 rounded-full bg-black/[0.04] group-hover:bg-[#242424] group-hover:text-white flex items-center justify-center transition-all duration-200 text-[#6E6E73] shrink-0 ml-1">
              <ArrowDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform duration-200" />
            </div>
          </motion.button>
        </div>

        {/* Bottom Conduit Descending into Contact Section */}
        <div className="relative w-px h-12 sm:h-16 bg-neutral-200 overflow-hidden">
          {!prefersReduced && (
            <motion.div
              style={{ scaleY: conduitScaleY, originY: 0 }}
              className="absolute inset-0 bg-gradient-to-b from-[#242424] via-[#242424]/40 to-transparent"
            />
          )}
        </div>

      </div>

      {/* Harmonic Waveform: Represents high-frequency tension calming into horizontal silence */}
      <div className="relative w-full max-w-[680px] mx-auto mt-2 pointer-events-none opacity-40">
        <svg
          viewBox="0 0 680 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto text-neutral-300"
        >
          {/* Background Hairline */}
          <line
            x1="0"
            y1="20"
            x2="680"
            y2="20"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          {/* Dampened Harmonic Curve settling into calm equilibrium */}
          <path
            d="M0,20 C100,20 180,6 240,20 C300,34 330,12 340,20 C350,28 380,6 440,20 C500,34 580,20 680,20"
            stroke="#242424"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="opacity-60"
          />
        </svg>
      </div>
    </section>
  );
}
