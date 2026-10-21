"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

/**
 * StoryScrollSequence - Awwwards Site of the Day 3D Kinetic Typographic Drum
 * 
 * Strict User Requirements:
 * - REMOVED: "Scroll to experience • Click to jump"
 * - REMOVED: "Silence", "Standard", "100%"
 * - REMOVED: "THE MANIFESTO", "01 / 03"
 * - ZERO UI clutter, badges, or pill buttons
 * - ONLY the three core items:
 *   1. "You didn't notice anything."
 *   2. "That was the job."
 *   3. "Nima Hosseini"
 * - TRANSITION: Not boring! Smooth 3D cylindrical drum / kinetic wheel with infinite loop
 *   seamlessly rotating from top to bottom and bottom to top.
 * - DONT USE BLACK COLORS: Warm ivory ground (#FAF6F0), deep warm espresso ink (#1E1612), warm terracotta (#D94B26)
 * - ZERO BOXES, ZERO CARDS, ZERO 1px LINES
 * - ZERO EM DASHES
 */

interface SlideItem {
  type: "silence" | "standard" | "identity";
}

const DRUM_FACES: SlideItem[] = [
  { type: "silence" },
  { type: "standard" },
  { type: "identity" },
  { type: "silence" },
  { type: "standard" },
  { type: "identity" },
];

export function StoryScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [drumRadius, setDrumRadius] = useState(280);

  // Velocity, drag, and scroll tracking
  const physicsRef = useRef({
    currentAngle: 0,
    targetAngle: 0,
    dragStartY: 0,
    isDragging: false,
    dragVelocity: 0,
    rafId: 0,
  });

  // Calculate drum radius based on viewport height
  const updateDimensions = useCallback(() => {
    const h = window.innerHeight;
    // Radius dynamically calibrated to viewport
    if (h < 640) {
      setDrumRadius(160);
    } else if (h < 900) {
      setDrumRadius(220);
    } else {
      setDrumRadius(280);
    }
  }, []);

  // Update target angle based on scroll position
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || physicsRef.current.isDragging) return;

    const rect = container.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalDistance = rect.height - windowH;

    if (totalDistance <= 0) return;

    // Progress from 0.0 to 1.0 through the track
    const progress = Math.max(0, Math.min(1, -rect.top / totalDistance));

    // Full 360 degree rotation over the track (smooth loop back to origin)
    physicsRef.current.targetAngle = progress * 360;
  }, []);

  useEffect(() => {
    updateDimensions();
    handleScroll();

    window.addEventListener("resize", updateDimensions);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 60/120fps Smooth Lerp Physics Loop
    const loop = () => {
      const p = physicsRef.current;

      if (p.isDragging) {
        p.currentAngle += (p.targetAngle - p.currentAngle) * 0.25;
      } else {
        // Smooth continuous approach with inertial easing
        p.currentAngle += (p.targetAngle - p.currentAngle) * 0.1;
      }

      setRotationAngle(p.currentAngle);
      p.rafId = requestAnimationFrame(loop);
    };

    physicsRef.current.rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(physicsRef.current.rafId);
    };
  }, [updateDimensions, handleScroll]);

  // Touch and Pointer Drag Physics for Direct Tactile Interaction
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = physicsRef.current;
    p.isDragging = true;
    p.dragStartY = e.clientY;
    p.dragVelocity = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = physicsRef.current;
    if (!p.isDragging) return;

    const deltaY = e.clientY - p.dragStartY;
    p.dragStartY = e.clientY;

    // Convert pixel delta to angular rotation (drag down moves wheel down)
    const angularDelta = deltaY * 0.45;
    p.targetAngle -= angularDelta;
    p.dragVelocity = angularDelta;
  };

  const handlePointerUp = () => {
    const p = physicsRef.current;
    p.isDragging = false;
    // Add residual flick momentum
    p.targetAngle -= p.dragVelocity * 4;
  };

  return (
    <section
      ref={containerRef}
      id="nima-hosseini"
      aria-label="Manifesto and Identity"
      className="relative w-full h-[320vh] select-none cursor-grab active:cursor-grabbing"
      style={{ backgroundColor: "#FAF6F0" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div id="story" className="absolute top-0" />

      {/* AMBIENT WARM ORGANIC BACKGROUND HALOS (NO GRIDS, NO DOTS) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1100px] h-[700px] sm:h-[1100px] rounded-full opacity-35 blur-3xl transition-opacity duration-1000"
          style={{
            background: "radial-gradient(circle, #E87A5D33 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] rounded-full opacity-25 blur-3xl transition-opacity duration-1000"
          style={{
            background: "radial-gradient(circle, #D9532F22 0%, transparent 70%)",
          }}
        />
      </div>

      {/* STICKY 3D THEATRICAL VIEWPORT */}
      <div className="sticky top-0 h-[100dvh] w-full flex items-center justify-center overflow-hidden">
        
        {/* 3D PERSPECTIVE STAGE */}
        <div
          className="relative w-full max-w-[1440px] h-[400px] sm:h-[500px] flex items-center justify-center"
          style={{
            perspective: 1400,
            perspectiveOrigin: "50% 50%",
          }}
        >
          
          {/* ROTATING 3D CYLINDRICAL DRUM */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {DRUM_FACES.map((face, index) => {
              // Base angle for face index (6 faces = 60 deg each)
              const baseAngle = index * 60;

              // Normalized relative angle in [-180, 180]
              const totalAngle = (baseAngle - rotationAngle) % 360;
              const normAngle = totalAngle > 180 ? totalAngle - 360 : totalAngle < -180 ? totalAngle + 360 : totalAngle;

              // Back-face culling for clean 3D look
              const isVisible = Math.abs(normAngle) <= 85;

              // Smooth opacity curve: 1 at 0 deg, falls smoothly to 0 at 80 deg
              const opacity = Math.max(0, Math.min(1, Math.cos((normAngle * Math.PI) / 180) ** 1.6));

              // Spatial depth blur as face curves away
              const blur = Math.max(0, (Math.abs(normAngle) - 15) * 0.08);

              return (
                <div
                  key={index}
                  className="absolute inset-0 flex items-center justify-center text-center px-4 sm:px-8"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `rotateX(${normAngle}deg) translateZ(${drumRadius}px)`,
                    opacity: isVisible ? opacity : 0,
                    filter: blur > 0.5 ? `blur(${blur}px)` : "none",
                    visibility: isVisible ? "visible" : "hidden",
                    backfaceVisibility: "hidden",
                    pointerEvents: Math.abs(normAngle) < 25 ? "auto" : "none",
                  }}
                >
                  {/* FACE 1: "You didn't notice anything." */}
                  {face.type === "silence" && (
                    <p
                      className="font-serif italic text-[clamp(2.8rem,8.5vw,9.5rem)] leading-[0.92] tracking-[-0.03em] max-w-6xl mx-auto"
                      style={{ color: "#2B1D16" }}
                    >
                      You didn’t notice anything.
                    </p>
                  )}

                  {/* FACE 2: "That was the job." */}
                  {face.type === "standard" && (
                    <h2
                      className="font-display font-black text-[clamp(3.8rem,11.5vw,12.5rem)] leading-[0.84] tracking-[-0.05em] uppercase max-w-6xl mx-auto"
                      style={{ color: "#1E1612" }}
                    >
                      <span>That was the </span>
                      <span style={{ color: "#D94B26" }}>job.</span>
                    </h2>
                  )}

                  {/* FACE 3: "Nima Hosseini" */}
                  {face.type === "identity" && (
                    <h2
                      className="font-display font-black text-[clamp(4.2rem,13.5vw,15rem)] leading-[0.82] tracking-[-0.05em] uppercase max-w-7xl mx-auto"
                      style={{ color: "#1E1612" }}
                    >
                      Nima Hosseini
                    </h2>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
