"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import { Cloud, Layers, ShieldCheck, Sparkles, Activity } from "lucide-react";

// Global in-memory flag so the animation runs ONCE per page refresh
let hasAnimatedOnce = false;

/**
 * EditorialStatement / StoryScrollSequence
 * High-end Contemporary Editorial & High-Tech Color Systems.
 * 
 * Choreography (runs ONCE per page refresh):
 * 1. Beat 1: Initial entrance & hold of Nima Hosseini with colorful ambient atmosphere
 * 2. Beat 2: Cinematic reveal of "You didn't notice anything. That was the job." with warm vibrant illumination
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
    [0, 0, -28, 28, 0, 0]
  );
  const identityScaleRaw = useTransform(
    smoothProgress,
    [0.0, 0.18, 0.30, 0.60, 0.80, 1.0],
    [1, 1, 0.985, 0.985, 1, 1]
  );
  const identityFilterRaw = useTransform(
    smoothProgress,
    [0.0, 0.18, 0.30, 0.60, 0.80, 1.0],
    ["blur(0px)", "blur(0px)", "blur(8px)", "blur(8px)", "blur(0px)", "blur(0px)"]
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
    [32, 0, 0, -28]
  );
  const manifestoScale = useTransform(
    smoothProgress,
    [0.28, 0.38, 0.58, 0.70],
    [0.98, 1, 1, 0.98]
  );
  const manifestoFilter = useTransform(
    smoothProgress,
    [0.28, 0.38, 0.58, 0.70],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]
  );

  // Kinetic color illumination & slide for line 1
  const line1X = useTransform(smoothProgress, [0.32, 0.48], [-12, 0]);
  const line2Scale = useTransform(smoothProgress, [0.44, 0.58], [0.98, 1.0]);

  // Dynamic ambient aura opacity
  const ambientGlowOpacity = useTransform(
    smoothProgress,
    [0.25, 0.45, 0.65, 0.85],
    [0.4, 0.85, 0.85, 0.6]
  );

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
      className="relative w-full h-[220vh] sm:h-[240vh] bg-[#FCFCFD] border-t border-[#0A0A0A]/10 overflow-hidden"
    >
      <div id="story" className="absolute top-0 left-0" />

      {/* Sticky Stage Viewport: Locked for buttery sequence */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex items-center justify-center px-6 sm:px-12 md:px-16 lg:px-24">
        
        {/* ======================================================== */}
        {/* AMBIENT CHROMATIC COLOR LIGHTING (Rich Depth & Atmosphere) */}
        {/* ======================================================== */}
        <motion.div
          style={{ opacity: hasCompleted ? 0.65 : ambientGlowOpacity }}
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden="true"
        >
          {/* Top-Right Warm Amber & Coral Light Pool */}
          <div className="absolute -top-24 -right-24 sm:-top-32 sm:-right-32 w-[340px] sm:w-[620px] h-[340px] sm:h-[620px] rounded-full bg-gradient-to-br from-amber-400/20 via-orange-500/15 to-transparent blur-3xl" />
          
          {/* Bottom-Left Electric Indigo & Violet Aura */}
          <div className="absolute -bottom-24 -left-24 sm:-bottom-32 sm:-left-32 w-[360px] sm:w-[680px] h-[360px] sm:h-[680px] rounded-full bg-gradient-to-tr from-indigo-500/18 via-violet-500/12 to-cyan-400/10 blur-3xl" />
          
          {/* Center Luminous Rose & Champagne Bloom */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[840px] h-[280px] sm:h-[520px] rounded-full bg-gradient-to-r from-rose-400/10 via-amber-300/10 to-indigo-400/10 blur-3xl" />

          {/* Precision Architectural Gridlines with Subtle Colored Nodes */}
          <div className="absolute inset-0 bg-subtle-grid opacity-60" />
          <div className="absolute top-12 left-12 hidden lg:flex items-center gap-2 font-mono text-[10px] tracking-widest text-indigo-900/40 uppercase">
            <span>[ SYSTEM_01 // HIGH-RELIABILITY TOPOLOGY ]</span>
          </div>
          <div className="absolute bottom-12 right-12 hidden lg:flex items-center gap-2 font-mono text-[10px] tracking-widest text-amber-900/40 uppercase">
            <span>[ 0.00ms DELTA // 100% STEADY STATE ]</span>
          </div>
        </motion.div>

        {/* Ambient Top & Bottom Vignettes */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FCFCFD] via-[#FCFCFD]/70 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FCFCFD] via-[#FCFCFD]/70 to-transparent z-20" />

        {/* Content Wrapper */}
        <div className="relative w-full max-w-[1360px] mx-auto z-10 flex items-center justify-center min-h-[480px]">
          
          {/* ======================================================== */}
          {/* BEAT 1 & 3: IDENTITY (Nima Hosseini)                      */}
          {/* Completely redesigned with rich color, badges, and telemetry */}
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
            <div className="space-y-6 sm:space-y-8">
              
              {/* Discipline Pill with Pulsing Live Status & Colored Accents */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-indigo-500/20 shadow-[0_2px_12px_rgba(79,70,229,0.06)] text-[11px] sm:text-xs font-mono font-medium tracking-[0.18em] uppercase text-indigo-950">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>SYSTEMS ARCHITECT &bull; CLOUD &amp; DEVOPS</span>
                </div>

                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[11px] font-mono font-semibold tracking-wider text-amber-800">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>AWS &bull; TERRAFORM</span>
                </div>
              </div>

              {/* Monumental Name with Deep Midnight to Royal Indigo Tone */}
              <div className="relative">
                <h2 className="font-display text-[clamp(3.6rem,9.6vw,9.2rem)] font-extrabold leading-[0.88] tracking-[-0.045em] bg-gradient-to-br from-[#0A0A0A] via-[#1E1B4B] to-[#312E81] bg-clip-text text-transparent select-none">
                  Nima Hosseini
                </h2>
              </div>

              {/* Focus & Architecture Dual-Tone Statement */}
              <div className="space-y-3.5 max-w-[62ch]">
                <div className="text-[19px] sm:text-[24px] md:text-[27px] font-semibold tracking-tight text-[#0F172A] flex flex-wrap items-center gap-2">
                  <span className="text-indigo-900">Infrastructure as Code</span>
                  <span className="text-amber-500">&bull;</span>
                  <span className="text-emerald-800">Systems Reliability</span>
                </div>

                <p className="text-[15px] sm:text-[17px] text-[#475569] leading-relaxed font-normal">
                  Building resilient architectures from first principles - with an emphasis on clarity, security boundaries, and reproducible cloud state across AWS and modern container environments.
                </p>
              </div>

              {/* 3 Colorful Interactive Engineering Telemetry Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 max-w-3xl">
                
                {/* 1. AWS Multi-Region Card */}
                <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-amber-500/25 shadow-[0_2px_10px_rgba(245,158,11,0.05)] hover:border-amber-500/50 transition-colors group">
                  <div className="flex items-center gap-2 mb-1.5 text-amber-700">
                    <Cloud className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-[11px] font-bold tracking-wider uppercase">Cloud Topology</span>
                  </div>
                  <div className="text-[12.5px] font-medium text-[#1E293B]">
                    Multi-Region &bull; Zero-Drift IaC
                  </div>
                </div>

                {/* 2. Container Mesh Card */}
                <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-indigo-500/25 shadow-[0_2px_10px_rgba(99,102,241,0.05)] hover:border-indigo-500/50 transition-colors group">
                  <div className="flex items-center gap-2 mb-1.5 text-indigo-700">
                    <Layers className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-[11px] font-bold tracking-wider uppercase">Immutable Mesh</span>
                  </div>
                  <div className="text-[12.5px] font-medium text-[#1E293B]">
                    Docker &bull; Canary Mesh Rollouts
                  </div>
                </div>

                {/* 3. Security Boundary Card */}
                <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-emerald-500/25 shadow-[0_2px_10px_rgba(16,185,129,0.05)] hover:border-emerald-500/50 transition-colors group">
                  <div className="flex items-center gap-2 mb-1.5 text-emerald-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-[11px] font-bold tracking-wider uppercase">Zero Static Keys</span>
                  </div>
                  <div className="text-[12.5px] font-medium text-[#1E293B]">
                    GitHub OIDC &bull; Ephemeral STS
                  </div>
                </div>

              </div>

            </div>
          </motion.div>

          {/* ======================================================== */}
          {/* BEAT 2: THE UNIFIED DUAL MANIFESTO                        */}
          {/* "You didn't notice anything. That was the job."          */}
          {/* Completely redesigned with fiery gradient and color depth */}
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
                
                {/* Active Silent Reliability Indicator Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-amber-500/30 shadow-[0_4px_16px_rgba(245,158,11,0.08)] w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-amber-950">
                    THE INVISIBLE PRINCIPLE &bull; 99.999% STEADY STATE
                  </span>
                </div>

                {/* Unified Typography Lockup with Rich Color Grading */}
                <div className="space-y-3 sm:space-y-4">
                  
                  {/* Line 1: Fluid Italian Editorial Serif in Rich Royal Indigo to Deep Terracotta */}
                  <motion.p
                    style={{ x: line1X }}
                    className="font-serif italic font-normal text-[clamp(2.8rem,7.8vw,7.8rem)] leading-[0.98] tracking-[-0.03em] select-none will-change-transform bg-gradient-to-r from-[#0F172A] via-[#3730A3] to-[#B45309] bg-clip-text text-transparent"
                  >
                    You didn’t notice anything.
                  </motion.p>

                  {/* Line 2: Monumental Architectural Sans with Fiery Sunset Accent */}
                  <motion.h3
                    style={{ scale: line2Scale }}
                    className="font-display font-extrabold text-[clamp(3.4rem,9.4vw,9.5rem)] leading-[0.88] tracking-[-0.045em] select-none will-change-transform text-[#0A0A0A]"
                  >
                    <span>That was </span>
                    <span className="bg-gradient-to-r from-[#E11D48] via-[#EA580C] to-[#F59E0B] bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(234,88,12,0.25)]">
                      the job.
                    </span>
                  </motion.h3>

                </div>

                {/* Subtitle Telemetry Insight Row */}
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-[#475569]">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 font-semibold">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>0.00% PACKET LOSS</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-800 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>SELF-HEALING CLUSTER</span>
                  </div>
                  <span className="text-[#64748B] hidden md:inline">
                    When infrastructure is engineered correctly, failures resolve before anyone notices.
                  </span>
                </div>

              </div>
            </motion.div>
          )}

        </div>

        {/* Sleek Chromatic Progress Bar at bottom */}
        {mounted && !hasCompleted && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 pointer-events-none">
            <div className="w-28 sm:w-36 h-[2px] bg-black/10 rounded-full overflow-hidden">
              <motion.div
                style={{ width: progressWidth }}
                className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]"
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
