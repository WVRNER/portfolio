"use client";

import React, { useRef, useEffect, useState } from "react";

/**
 * StoryScrollSequence - Unpinned Normal Viewport Section
 * 
 * - Normal one-screen section that never blocks scrolling
 * - Sequence reveals 4 lines in place (~0.6s apart) upon entering viewport
 * - Real performance measurement line from Navigation Timing API + Cloudflare colo
 *   (Skipped entirely if values are unavailable; never shows fake numbers)
 * - Plays sequence once; stays permanently visible when scrolling
 * - Immediate display for prefers-reduced-motion
 * - Zero em dashes
 */
export function StoryScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [measurement, setMeasurement] = useState<{
    latencyMs: number;
    location: string;
  } | null>(null);

  // 1. Fetch real Navigation Timing and Cloudflare data center location
  useEffect(() => {
    if (typeof window === "undefined") return;

    let latency: number | null = null;
    try {
      if (window.performance) {
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0) {
          const nav = navEntries[0] as PerformanceNavigationTiming;
          const t = Math.round(nav.responseEnd || nav.duration);
          if (t > 0 && t < 10000) {
            latency = t;
          }
        }
      }
    } catch {
      // Ignore
    }

    // Check Cloudflare trace for real data center code (colo)
    fetch("/cdn-cgi/trace")
      .then((res) => {
        if (!res.ok) throw new Error("Trace unavailable");
        return res.text();
      })
      .then((text) => {
        const match = text.match(/colo=([A-Z0-9]+)/);
        if (match && match[1] && latency) {
          setMeasurement({
            latencyMs: latency,
            location: match[1],
          });
        }
      })
      .catch(() => {
        // Fallback: check HEAD response cf-ray header
        fetch(window.location.href, { method: "HEAD" })
          .then((res) => {
            const ray = res.headers.get("cf-ray");
            if (ray && ray.includes("-") && latency) {
              const colo = ray.split("-").pop()?.trim();
              if (colo) {
                setMeasurement({
                  latencyMs: latency,
                  location: colo,
                });
              }
            }
          })
          .catch(() => {
            // Neither is available: line will be safely skipped
          });
      });
  }, []);

  // 2. Viewport entrance listener with prefers-reduced-motion check
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Check prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setStep(4);
      setHasTriggered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);

          // Step 1: "You didn't notice anything."
          setStep(1);

          // Step 2: "That was the job." (+0.6s)
          const timer2 = setTimeout(() => {
            setStep(2);

            // Step 3: Measurement line (or direct jump to 4 if unavailable) (+0.6s)
            const timer3 = setTimeout(() => {
              setStep(3);

              // Step 4: "Nima Hosseini, Cloud / DevOps engineer" (+0.6s)
              const timer4 = setTimeout(() => {
                setStep(4);
              }, 600);

              return () => clearTimeout(timer4);
            }, 600);

            return () => clearTimeout(timer3);
          }, 600);

          return () => clearTimeout(timer2);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [hasTriggered]);

  return (
    <section
      ref={sectionRef}
      id="nima-hosseini"
      aria-label="Manifesto and Identity"
      className="relative w-full min-h-[85dvh] sm:min-h-[92dvh] py-24 sm:py-32 flex items-center justify-center bg-[#FAF6F0] overflow-hidden select-none"
    >
      <div id="story" className="absolute top-0" />

      {/* Ambient warm halos (Absolute & clipped) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/4 -left-32 w-[350px] sm:w-[850px] h-[350px] sm:h-[850px] rounded-full opacity-30 sm:opacity-40 blur-2xl sm:blur-3xl"
          style={{
            background: "radial-gradient(circle, #E87A5D33 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 -right-32 w-[320px] sm:w-[800px] h-[320px] sm:h-[800px] rounded-full opacity-25 sm:opacity-35 blur-2xl sm:blur-3xl"
          style={{
            background: "radial-gradient(circle, #D9532F24 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Main Container Aligned to 1400px Grid */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8">
        
        {/* Line 1: "You didn't notice anything." */}
        <div
          className={`transition-all duration-700 ease-out ${
            step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <p className="font-serif italic text-[clamp(2.5rem,6.8vw,6.4rem)] leading-[0.98] tracking-[-0.03em] max-w-5xl mx-auto text-[#2B1D16]">
            You didn’t notice anything.
          </p>
        </div>

        {/* Line 2: "That was the job." */}
        <div
          className={`transition-all duration-700 ease-out ${
            step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <h2 className="font-display font-black text-[clamp(3.2rem,9.2vw,9.2rem)] leading-[0.88] tracking-[-0.045em] uppercase max-w-6xl mx-auto text-[#1E1612]">
            <span>That was the </span>
            <span style={{ color: "#D94B26" }}>job.</span>
          </h2>
        </div>

        {/* Line 3: Real Measurement Line (Shown ONLY if both latency and location are verified) */}
        {measurement && (
          <div
            className={`transition-all duration-700 ease-out pt-2 sm:pt-4 ${
              step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.04] border border-black/[0.06] font-mono text-[12px] sm:text-[14px] tracking-wide text-[#7C6C62] uppercase">
              <span>This page reached you in</span>
              <span className="text-[#1E1612] font-bold">{measurement.latencyMs} ms</span>
              <span>from</span>
              <span className="text-[#1E1612] font-bold">{measurement.location}</span>
            </div>
          </div>
        )}

        {/* Line 4: "Nima Hosseini, Cloud / DevOps engineer" */}
        <div
          className={`transition-all duration-700 ease-out pt-3 sm:pt-5 ${
            step >= 4 || (step >= 3 && !measurement)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <p className="font-display font-bold text-[clamp(1.35rem,2.8vw,2.4rem)] leading-snug tracking-[-0.025em] text-[#1E1612] max-w-3xl mx-auto">
            Nima Hosseini, Cloud / DevOps engineer
          </p>
        </div>

      </div>
    </section>
  );
}
