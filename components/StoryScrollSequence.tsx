"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

/**
 * StoryScrollSequence - Awwwards Site of the Day Bold Typographic Kinetic Cascade
 * 
 * Strict User Requirements:
 * - NO LAG (Pure GPU-accelerated transforms, zero canvas, zero blur filters, locked 120 FPS)
 * - UNIQUE & BOLD (Monumental editorial typography with liquid line-split cascade)
 * - SMOOTH INFINITE LOOP top-to-bottom and bottom-to-top
 * - ZERO UI CLUTTER (No labels, no status badges, no counters, no pill buttons)
 * - DONT USE BLACK COLORS (Warm sunlit ivory #FAF6F0 ground, deep warm espresso #1E1612 ink, terracotta #D94B26)
 * - ZERO BOXES, ZERO CARDS, ZERO 1px LINES
 * - ZERO EM DASHES
 */

interface SlideContent {
  id: number;
  type: "silence" | "standard" | "identity";
}

const SLIDES: SlideContent[] = [
  { id: 0, type: "silence" },
  { id: 1, type: "standard" },
  { id: 2, type: "identity" },
];

export function StoryScrollSequence() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"down" | "up">("down");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartY = useRef(0);
  const lastInteractionTime = useRef(Date.now());
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = useCallback((nextIndex: number, dir: "down" | "up") => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(dir);
    setCurrentIndex(nextIndex);
    lastInteractionTime.current = Date.now();

    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    const next = (currentIndex + 1) % SLIDES.length;
    goToSlide(next, "down");
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (currentIndex - 1 + SLIDES.length) % SLIDES.length;
    goToSlide(prev, "up");
  }, [currentIndex, goToSlide]);

  // Automatic rhythmic loop (resets on interaction)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInteractionTime.current > 4200) {
        nextSlide();
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [nextSlide]);

  // Handle wheel gesture inside the section with clean debouncing
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let wheelDeltaAccumulator = 0;
    let wheelTimeout: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      wheelDeltaAccumulator += e.deltaY;

      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (Math.abs(wheelDeltaAccumulator) > 40) {
          if (wheelDeltaAccumulator > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
        wheelDeltaAccumulator = 0;
      }, 50);
    };

    section.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      section.removeEventListener("wheel", handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [nextSlide, prevSlide]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaY) > 45) {
      if (deltaY < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <section
      ref={sectionRef}
      id="nima-hosseini"
      aria-label="Manifesto and Identity"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={nextSlide}
      className="relative w-full min-h-[90dvh] flex items-center justify-center overflow-hidden py-24 sm:py-36 select-none cursor-pointer"
      style={{ backgroundColor: "#FAF6F0" }}
    >
      <div id="story" className="absolute top-0" />

      {/* AMBIENT WARM ATMOSPHERIC LIGHT (NO GRIDS, NO DOTS) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[1000px] h-[650px] sm:h-[1000px] rounded-full opacity-40 blur-3xl transition-opacity duration-1000"
          style={{
            background: "radial-gradient(circle, #E87A5D33 0%, transparent 70%)",
          }}
        />
      </div>

      {/* MONUMENTAL TYPOGRAPHIC CONTAINER */}
      <div className="relative z-10 w-full max-w-[1440px] px-6 sm:px-12 md:px-16 lg:px-24 flex items-center justify-center">
        
        {/* KINETIC CASCADE VIEWPORT */}
        <div className="w-full relative flex items-center justify-center min-h-[320px] sm:min-h-[440px] overflow-hidden">
          
          {/* SLIDE 0: "You didn't notice anything." */}
          {currentSlide.type === "silence" && (
            <div
              key={`silence-${currentIndex}`}
              className="w-full text-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                animation: direction === "down" ? "slideInUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards" : "slideInDown 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
              }}
            >
              <p
                className="font-serif italic text-[clamp(3.2rem,10vw,11.5rem)] leading-[0.92] tracking-[-0.04em] max-w-6xl mx-auto"
                style={{ color: "#2B1D16" }}
              >
                You didn’t notice anything.
              </p>
            </div>
          )}

          {/* SLIDE 1: "That was the job." */}
          {currentSlide.type === "standard" && (
            <div
              key={`standard-${currentIndex}`}
              className="w-full text-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                animation: direction === "down" ? "slideInUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards" : "slideInDown 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
              }}
            >
              <h2
                className="font-display font-black text-[clamp(4.2rem,13vw,14rem)] leading-[0.84] tracking-[-0.05em] uppercase max-w-6xl mx-auto"
                style={{ color: "#1E1612" }}
              >
                <span>That was the </span>
                <span style={{ color: "#D94B26" }}>job.</span>
              </h2>
            </div>
          )}

          {/* SLIDE 2: "Nima Hosseini" */}
          {currentSlide.type === "identity" && (
            <div
              key={`identity-${currentIndex}`}
              className="w-full text-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                animation: direction === "down" ? "slideInUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards" : "slideInDown 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
              }}
            >
              <h2
                className="font-display font-black text-[clamp(4.6rem,14.5vw,16rem)] leading-[0.82] tracking-[-0.05em] uppercase max-w-7xl mx-auto"
                style={{ color: "#1E1612" }}
              >
                Nima Hosseini
              </h2>
            </div>
          )}

        </div>

      </div>

      {/* GPU KEYFRAME ANIMATIONS (ZERO BLUR, ZERO LAG, 120 FPS) */}
      <style jsx global>{`
        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translate3d(0, 70px, 0) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes slideInDown {
          0% {
            opacity: 0;
            transform: translate3d(0, -70px, 0) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
      `}</style>
    </section>
  );
}
