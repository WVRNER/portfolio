"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

/**
 * StoryScrollSequence - Awwwards Site of the Day Theatrical Typography Sequence
 * 
 * Mobile-Optimized & 120 FPS Performance:
 * - Idle-aware RAF loop: stops re-renders when scroll is settled or offscreen
 * - Absolute localized ambient halos (no fixed viewport blurs causing mobile GPU stalls)
 * - Hardware-accelerated translate3d transforms with will-change
 * - Pointer-fine only for 3D tilt (disabled on mobile touch to preserve high framerates)
 * - Zero UI clutter: pure theatrical typography
 * - Non-black warm ivory ground (#FAF6F0) with deep warm espresso ink (#1E1612)
 * - Zero em dashes
 */

export function StoryScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Smooth lerp tracking for 60/120fps fluid transitions
  const scrollTrackerRef = useRef({
    currentProgress: 0,
    targetProgress: 0,
    isVisible: false,
    isSettled: false,
    rafId: 0,
  });

  const updateScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || !scrollTrackerRef.current.isVisible) return;

    const rect = container.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalDistance = rect.height - windowH;

    if (totalDistance <= 0) return;

    const raw = -rect.top / totalDistance;
    const clamped = Math.max(0, Math.min(1, raw));
    
    if (Math.abs(scrollTrackerRef.current.targetProgress - clamped) > 0.0005) {
      scrollTrackerRef.current.targetProgress = clamped;
      scrollTrackerRef.current.isSettled = false;
    }
  }, []);

  useEffect(() => {
    // Detect touch capability to skip expensive 3D perspective tilts on mobile
    const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(hasCoarsePointer);

    const container = containerRef.current;
    if (!container) return;

    // Visibility Observer to pause updates completely when section is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        scrollTrackerRef.current.isVisible = entry.isIntersecting;
        if (entry.isIntersecting) {
          updateScroll();
        }
      },
      { threshold: 0.02 }
    );

    observer.observe(container);

    const handleScroll = () => {
      updateScroll();
    };

    const handleResize = () => {
      updateScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    updateScroll();

    // High-performance Lerp Loop: only updates state when motion is actually happening
    const loop = () => {
      const tracker = scrollTrackerRef.current;

      if (tracker.isVisible && !tracker.isSettled) {
        const delta = tracker.targetProgress - tracker.currentProgress;

        if (Math.abs(delta) > 0.0005) {
          tracker.currentProgress += delta * 0.16;
          setProgress(tracker.currentProgress);
        } else if (tracker.currentProgress !== tracker.targetProgress) {
          tracker.currentProgress = tracker.targetProgress;
          setProgress(tracker.targetProgress);
          tracker.isSettled = true;
        }
      }

      tracker.rafId = requestAnimationFrame(loop);
    };

    scrollTrackerRef.current.rafId = requestAnimationFrame(loop);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(scrollTrackerRef.current.rafId);
    };
  }, [updateScroll]);

  // Pointer move: enabled only on desktop fine pointers
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const normX = (clientX / innerWidth - 0.5) * 2;
    const normY = (clientY / innerHeight - 0.5) * 2;

    setTilt({
      x: normX * 6,
      y: -normY * 6,
    });
  };

  const handlePointerLeave = () => {
    if (isTouchDevice) return;
    setTilt({ x: 0, y: 0 });
  };

  // Chapter 1 Transition Dynamics: "You didn't notice anything."
  // Prominent in 0.0 -> 0.35, fades out 0.35 -> 0.45
  const ch1Opacity = Math.max(0, Math.min(1, 1 - (progress - 0.28) / 0.15));
  const ch1TranslateY = progress > 0.28 ? -(progress - 0.28) * 200 : 0;
  const ch1Scale = 1 + progress * 0.1;

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
    ? (0.46 - progress) * 140
    : progress > 0.62
    ? -(progress - 0.62) * 180
    : 0;
  const ch2Scale = progress < 0.46
    ? 0.95 + (progress - 0.32) * 0.36
    : 1 + (progress - 0.46) * 0.07;

  // Chapter 3 Transition Dynamics: "Nima Hosseini"
  // Enters 0.64 -> 0.78, fully present 0.78 -> 1.0
  const ch3Opacity = Math.max(0, Math.min(1, (progress - 0.64) / 0.16));
  const ch3TranslateY = progress < 0.78 ? (0.78 - progress) * 150 : 0;
  const ch3Scale = 0.95 + Math.min(0.05, Math.max(0, (progress - 0.64) * 0.18));

  return (
    <section
      ref={containerRef}
      id="nima-hosseini"
      aria-label="Manifesto and Identity"
      className="relative w-full h-[240vh] sm:h-[260vh] select-none"
      style={{ backgroundColor: "#FAF6F0" }}
    >
      <div id="story" className="absolute top-0" />

      {/* AMBIENT ORGANIC WARM HALOS (ABSOLUTE & CLIPPED - NO FIXED MOBILE JANK) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/4 -left-32 w-[350px] sm:w-[850px] h-[350px] sm:h-[850px] rounded-full opacity-30 sm:opacity-40 blur-2xl sm:blur-3xl"
          style={{
            background: "radial-gradient(circle, #E87A5D33 0%, transparent 70%)",
            transform: !isTouchDevice ? `translate3d(${tilt.x * 2}px, ${tilt.y * 2}px, 0)` : undefined,
          }}
        />
        <div
          className="absolute bottom-1/4 -right-32 w-[320px] sm:w-[800px] h-[320px] sm:h-[800px] rounded-full opacity-25 sm:opacity-35 blur-2xl sm:blur-3xl"
          style={{
            background: "radial-gradient(circle, #D9532F24 0%, transparent 70%)",
            transform: !isTouchDevice ? `translate3d(${-tilt.x * 2}px, ${-tilt.y * 2}px, 0)` : undefined,
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
        {/* CENTER TRANSITION STAGE                                                   */}
        {/* ========================================================================= */}
        <div
          className="relative w-full max-w-[1400px] flex-1 flex items-center justify-center"
          style={{
            perspective: !isTouchDevice ? 1000 : undefined,
            transform: !isTouchDevice ? `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)` : undefined,
            transition: !isTouchDevice ? "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)" : undefined,
          }}
        >

          {/* ======================================================================= */}
          {/* CHAPTER 1: "You didn't notice anything."                                */}
          {/* ======================================================================= */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none will-change-transform"
            style={{
              opacity: ch1Opacity,
              transform: `translate3d(0, ${ch1TranslateY}px, 0) scale(${ch1Scale})`,
              visibility: ch1Opacity <= 0.01 ? "hidden" : "visible",
            }}
          >
            <p
              className="font-serif italic text-[clamp(2.7rem,9vw,10.5rem)] leading-[0.92] tracking-[-0.03em] max-w-6xl mx-auto"
              style={{ color: "#2B1D16" }}
            >
              You didn’t notice anything.
            </p>
          </div>

          {/* ======================================================================= */}
          {/* CHAPTER 2: "That was the job."                                          */}
          {/* ======================================================================= */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none will-change-transform"
            style={{
              opacity: ch2Opacity,
              transform: `translate3d(0, ${ch2TranslateY}px, 0) scale(${ch2Scale})`,
              visibility: ch2Opacity <= 0.01 ? "hidden" : "visible",
            }}
          >
            <h2
              className="font-display font-black text-[clamp(3.6rem,12vw,13.5rem)] leading-[0.84] tracking-[-0.05em] uppercase max-w-6xl mx-auto"
              style={{ color: "#1E1612" }}
            >
              <span>That was the </span>
              <span style={{ color: "#D94B26" }}>job.</span>
            </h2>
          </div>

          {/* ======================================================================= */}
          {/* CHAPTER 3: "Nima Hosseini"                                              */}
          {/* ======================================================================= */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none will-change-transform"
            style={{
              opacity: ch3Opacity,
              transform: `translate3d(0, ${ch3TranslateY}px, 0) scale(${ch3Scale})`,
              visibility: ch3Opacity <= 0.01 ? "hidden" : "visible",
            }}
          >
            <h2
              className="font-display font-black text-[clamp(3.8rem,13.5vw,15.5rem)] leading-[0.82] tracking-[-0.05em] uppercase max-w-7xl mx-auto"
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
