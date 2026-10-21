"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

/**
 * StoryScrollSequence - Awwwards Site of the Day Theatrical Typography Sequence
 * 
 * Strict User Requirements:
 * - Pure typography without UI chrome (No top bar, no bottom navigation, no percentages, no counters)
 * - ONLY the key sentences and identity:
 *   1. "You didn't notice anything."
 *   2. "That was the job."
 *   3. "Nima Hosseini"
 * - Theatrical, cinematic scroll-driven kinetic typography transition
 * - DONT USE BLACK COLORS (Warm sunlit ivory ground #FAF6F0, deep warm espresso ink #1E1612)
 * - ZERO BOXES (No bordered rectangles, no outlined cards, no card grids, no 1px divider lines)
 * - ZERO EM DASHES (Strictly enforced)
 * - Alive and responsive: smooth 60fps lerped scroll scrub, cursor parallax tilt
 */

export function StoryScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Smooth lerp tracking for 60/120fps fluid transitions
  const scrollTrackerRef = useRef({
    currentProgress: 0,
    targetProgress: 0,
    rafId: 0,
  });

  const updateScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalDistance = rect.height - windowH;

    if (totalDistance <= 0) return;

    const raw = -rect.top / totalDistance;
    const clamped = Math.max(0, Math.min(1, raw));
    scrollTrackerRef.current.targetProgress = clamped;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      updateScroll();
    };

    const handleResize = () => {
      updateScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    updateScroll();

    // 60fps Lerp Loop for organic fluid motion between scroll states
    const loop = () => {
      const tracker = scrollTrackerRef.current;
      tracker.currentProgress += (tracker.targetProgress - tracker.currentProgress) * 0.12;
      
      setProgress(tracker.currentProgress);

      tracker.rafId = requestAnimationFrame(loop);
    };

    scrollTrackerRef.current.rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(scrollTrackerRef.current.rafId);
    };
  }, [updateScroll]);

  // Subtle interactive pointer parallax tilt for tactile depth
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const normX = (clientX / innerWidth - 0.5) * 2;
    const normY = (clientY / innerHeight - 0.5) * 2;

    setTilt({
      x: normX * 8, // max 8 deg tilt
      y: -normY * 8,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Chapter 1 Transition Dynamics: "You didn't notice anything."
  // Prominent in 0.0 -> 0.35, fades out 0.35 -> 0.45
  const ch1Opacity = Math.max(0, Math.min(1, 1 - (progress - 0.28) / 0.15));
  const ch1TranslateY = progress > 0.28 ? -(progress - 0.28) * 240 : 0;
  const ch1Scale = 1 + progress * 0.12;

  // Chapter 2 Transition Dynamics: "That was the job."
  // Enters 0.32 -> 0.44, peaks at 0.50, exits 0.62 -> 0.74
  let ch2Opacity = 0;
  if (progress < 0.32) {
    ch2Opacity = 0;
  } else if (progress <= 0.46) {
    ch2Opacity = (progress - 0.32) / 0.14;
  } else if (progress <= 0.62) {
    ch2Opacity = 1;
  } else if (progress <= 0.74) {
    ch2Opacity = 1 - (progress - 0.62) / 0.12;
  }
  const ch2TranslateY = progress < 0.46
    ? (0.46 - progress) * 160
    : progress > 0.62
    ? -(progress - 0.62) * 220
    : 0;
  const ch2Scale = progress < 0.46
    ? 0.94 + (progress - 0.32) * 0.45
    : 1 + (progress - 0.46) * 0.08;

  // Chapter 3 Transition Dynamics: "Nima Hosseini"
  // Enters 0.64 -> 0.78, fully present 0.78 -> 1.0
  const ch3Opacity = Math.max(0, Math.min(1, (progress - 0.64) / 0.16));
  const ch3TranslateY = progress < 0.78 ? (0.78 - progress) * 180 : 0;
  const ch3Scale = 0.94 + Math.min(0.06, Math.max(0, (progress - 0.64) * 0.2));

  return (
    <section
      ref={containerRef}
      id="nima-hosseini"
      aria-label="Manifesto and Identity"
      className="relative w-full h-[280vh] select-none"
      style={{ backgroundColor: "#FAF6F0" }}
    >
      <div id="story" className="absolute top-0" />

      {/* AMBIENT ORGANIC WARM HALOS (NO GRIDS, NO DOT PATTERNS) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/4 -left-40 w-[650px] sm:w-[900px] h-[650px] sm:h-[900px] rounded-full opacity-40 blur-3xl transition-transform duration-1000"
          style={{
            background: "radial-gradient(circle, #E87A5D33 0%, transparent 70%)",
            transform: `translate(${tilt.x * 2}px, ${tilt.y * 2}px)`,
          }}
        />
        <div
          className="absolute bottom-1/4 -right-40 w-[600px] sm:w-[850px] h-[600px] sm:h-[850px] rounded-full opacity-35 blur-3xl transition-transform duration-1000"
          style={{
            background: "radial-gradient(circle, #D9532F24 0%, transparent 70%)",
            transform: `translate(${-tilt.x * 2}px, ${-tilt.y * 2}px)`,
          }}
        />
      </div>

      {/* STICKY FULL-VIEWPORT THEATRICAL STAGE */}
      <div
        ref={stageRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="sticky top-0 h-[100dvh] w-full flex items-center justify-center px-6 sm:px-12 md:px-16 lg:px-24 overflow-hidden"
      >

        {/* ========================================================================= */}
        {/* CENTER TRANSITION STAGE (PARALLAX TILT + SEAMLESS TRANSITIONS)            */}
        {/* ========================================================================= */}
        <div
          className="relative w-full max-w-[1440px] flex-1 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            perspective: 1000,
            transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          }}
        >

          {/* ======================================================================= */}
          {/* CHAPTER 1: "You didn't notice anything."                                */}
          {/* ======================================================================= */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-100 pointer-events-none"
            style={{
              opacity: ch1Opacity,
              transform: `translateY(${ch1TranslateY}px) scale(${ch1Scale})`,
              visibility: ch1Opacity <= 0 ? "hidden" : "visible",
            }}
          >
            <p
              className="font-serif italic text-[clamp(3.2rem,9.5vw,10.5rem)] leading-[0.92] tracking-[-0.03em] max-w-6xl mx-auto"
              style={{ color: "#2B1D16" }}
            >
              You didn’t notice anything.
            </p>
          </div>

          {/* ======================================================================= */}
          {/* CHAPTER 2: "That was the job."                                          */}
          {/* ======================================================================= */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-100 pointer-events-none"
            style={{
              opacity: ch2Opacity,
              transform: `translateY(${ch2TranslateY}px) scale(${ch2Scale})`,
              visibility: ch2Opacity <= 0 ? "hidden" : "visible",
            }}
          >
            <h2
              className="font-display font-black text-[clamp(4.2rem,12.5vw,13.5rem)] leading-[0.84] tracking-[-0.05em] uppercase max-w-6xl mx-auto"
              style={{ color: "#1E1612" }}
            >
              <span>That was the </span>
              <span
                className="inline-block transition-transform duration-300 hover:scale-105"
                style={{ color: "#D94B26" }}
              >
                job.
              </span>
            </h2>
          </div>

          {/* ======================================================================= */}
          {/* CHAPTER 3: "Nima Hosseini"                                              */}
          {/* ======================================================================= */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-100 pointer-events-none"
            style={{
              opacity: ch3Opacity,
              transform: `translateY(${ch3TranslateY}px) scale(${ch3Scale})`,
              visibility: ch3Opacity <= 0 ? "hidden" : "visible",
            }}
          >
            <h2
              className="font-display font-black text-[clamp(4.6rem,14vw,15.5rem)] leading-[0.82] tracking-[-0.05em] uppercase max-w-7xl mx-auto"
              style={{ color: "#1E1612" }}
            >
              Nima Hosseini
            </h2>
          </div>

        </div>

      </div>
    </section>
  );
}
