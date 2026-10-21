"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

/**
 * StoryScrollSequence - Awwwards Site of the Day Theatrical Typography Sequence
 * 
 * Strict User Requirements:
 * - REMOVED all extra copy (Core Stack, bullet points, Law of Invisible Systems, paragraphs)
 * - REMOVED the 3D canvas animation
 * - ONLY the two key sentences and identity:
 *   1. "You didn't notice anything."
 *   2. "That was the job."
 *   3. "Nima Hosseini"
 * - Replaced with a theatrical, cinematic scroll-driven kinetic typography transition
 * - DONT USE BLACK COLORS (Warm sunlit ivory ground #FAF6F0, deep warm espresso ink #1E1612)
 * - ZERO BOXES (No bordered rectangles, no outlined cards, no card grids, no 1px divider lines)
 * - ZERO EM DASHES (Strictly enforced)
 * - Alive and responsive: smooth 60fps lerped scroll scrub, cursor parallax tilt, chapter navigation
 */

export function StoryScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Active chapter state: 0 -> "You didn't notice anything.", 1 -> "That was the job.", 2 -> "Nima Hosseini"
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
      
      // Update state when change is noticeable
      setProgress(tracker.currentProgress);

      tracker.rafId = requestAnimationFrame(loop);
    };

    trackerLoop: {
      scrollTrackerRef.current.rafId = requestAnimationFrame(loop);
    }

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

  // Clickable Chapter Navigation
  const scrollToChapter = (chapterIndex: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const currentScrollY = window.scrollY;
    const containerTop = currentScrollY + rect.top;
    const totalDistance = rect.height - window.innerHeight;

    // Targets: chapter 0 -> 0.15, chapter 1 -> 0.50, chapter 2 -> 0.85
    const targetNormalized = chapterIndex === 0 ? 0.12 : chapterIndex === 1 ? 0.50 : 0.88;
    const destination = containerTop + targetNormalized * totalDistance;

    window.scrollTo({
      top: destination,
      behavior: "smooth",
    });
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

  // Determine active indicator (0, 1, or 2)
  const activeChapter = progress < 0.38 ? 0 : progress < 0.68 ? 1 : 2;

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
        className="sticky top-0 h-[100dvh] w-full flex flex-col justify-between items-center px-6 sm:px-12 md:px-16 lg:px-24 py-12 sm:py-16 overflow-hidden"
      >
        
        {/* Top Minimal Stage Eyebrow */}
        <div className="w-full max-w-[1440px] flex items-center justify-between text-xs sm:text-sm font-semibold tracking-wider text-[#63483D]">
          <span className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full transition-colors duration-500"
              style={{ backgroundColor: activeChapter === 1 ? "#D94B26" : "#2B1D16" }}
            />
            <span>THE MANIFESTO</span>
          </span>
          <span className="font-mono text-xs opacity-60">
            0{activeChapter + 1} / 03
          </span>
        </div>

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

        {/* ========================================================================= */}
        {/* BOTTOM THEATRICAL CHAPTER NAVIGATION                                      */}
        {/* Smooth clickable pills to scrub directly between the 3 moments            */}
        {/* ========================================================================= */}
        <div className="w-full max-w-[1440px] flex items-center justify-between pt-4">
          
          <div className="text-xs font-semibold tracking-wider text-[#75574A] hidden sm:block">
            Scroll to experience &bull; Click to jump
          </div>

          {/* Chapter Selector Dots */}
          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            {[
              { label: "Silence", index: 0 },
              { label: "Standard", index: 1 },
              { label: "Identity", index: 2 },
            ].map((ch) => (
              <button
                key={ch.label}
                type="button"
                onClick={() => scrollToChapter(ch.index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                  activeChapter === ch.index
                    ? "bg-[#1E1612] text-white shadow-sm scale-105"
                    : "bg-[#FFFFFF]/60 hover:bg-[#FFFFFF] text-[#63483D]"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full transition-transform duration-300"
                  style={{
                    backgroundColor: activeChapter === ch.index ? "#D94B26" : "#A88E82",
                  }}
                />
                <span>{ch.label}</span>
              </button>
            ))}
          </div>

          <div className="text-xs font-semibold tracking-wider text-[#75574A] hidden sm:block">
            {Math.round(progress * 100)}%
          </div>

        </div>

      </div>
    </section>
  );
}
