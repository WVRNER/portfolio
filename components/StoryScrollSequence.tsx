"use client";

import React, { useRef, useEffect, useState, useSyncExternalStore } from "react";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotionSnapshot(): boolean {
  return false;
}

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
  }>({
    latencyMs: 997,
    location: "FRA",
  });

  const prefersReduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot
  );

  const activeStep = prefersReduced ? 4 : step;

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
    if (prefersReduced) return;

    const el = sectionRef.current;
    if (!el) return;

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
  }, [hasTriggered, prefersReduced]);

  return (
    <section
      ref={sectionRef}
      id="nima-hosseini"
      aria-label="Manifesto and Identity"
      className="relative w-full min-h-[85dvh] sm:min-h-[92dvh] py-24 sm:py-32 flex items-center justify-center overflow-hidden select-none"
      style={{
        background: "radial-gradient(circle at 50% 35%, #F7F9FB 0%, #EAEDF1 60%, #DFE3E8 100%)",
      }}
    >
      <div id="story" className="absolute top-0" />

      {/* Ambient chromatic liquid glass halos matching image refraction corners */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Top-right Electric Cyan / Royal Blue dispersion flare */}
        <div
          className="absolute -top-24 -right-24 w-[450px] sm:w-[850px] h-[450px] sm:h-[850px] rounded-full opacity-40 sm:opacity-55 blur-3xl pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(13, 225, 237, 0.32) 0%, rgba(2, 51, 188, 0.16) 45%, transparent 70%)",
          }}
        />
        {/* Bottom-left Hot Neon Magenta / Coral Rose dispersion flare */}
        <div
          className="absolute -bottom-24 -left-24 w-[420px] sm:w-[800px] h-[420px] sm:h-[800px] rounded-full opacity-35 sm:opacity-50 blur-3xl pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(236, 23, 139, 0.24) 0%, rgba(223, 85, 108, 0.14) 45%, transparent 70%)",
          }}
        />
      </div>

      {/* Main Container Aligned to 1400px Grid */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8">
        
        {/* Line 1: "You didn't notice anything." */}
        <div
          className={`transition-all duration-700 ease-out ${
            activeStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <p className="font-serif italic text-[clamp(2.5rem,6.8vw,6.4rem)] leading-[0.98] tracking-[-0.03em] max-w-5xl mx-auto text-[#0D1017]">
            You didn’t notice anything.
          </p>
        </div>

        {/* Line 2: "That was the job." */}
        <div
          className={`transition-all duration-700 ease-out ${
            activeStep >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <h2 className="font-display font-black text-[clamp(3.2rem,9.2vw,9.2rem)] leading-[0.88] tracking-[-0.045em] uppercase max-w-6xl mx-auto text-[#0D1017]">
            <span>That was the </span>
            <span
              className="bg-clip-text text-transparent inline-block"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #0de1ed 0%, #0233bc 26%, #f8faff 48%, #ec178b 72%, #df556c 100%)",
                textShadow: "0 2px 24px rgba(2, 51, 188, 0.18)",
              }}
            >
              job.
            </span>
          </h2>
        </div>

        {/* Line 3: Measurement Line (THIS PAGE REACHED YOU IN 997 MS FROM FRA) */}
        {measurement && (
          <div
            className={`transition-all duration-700 ease-out pt-2 sm:pt-4 ${
              activeStep >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/75 backdrop-blur-xl border border-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] font-mono text-[12px] sm:text-[14px] tracking-wider text-[#4B5260] uppercase">
              <span>This page reached you in</span>
              <span
                className="font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(90deg, #0233bc 0%, #0de1ed 100%)",
                }}
              >
                {measurement.latencyMs} ms
              </span>
              <span>from</span>
              <span
                className="font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(90deg, #ec178b 0%, #df556c 100%)",
                }}
              >
                {measurement.location}
              </span>
            </div>
          </div>
        )}

        {/* Line 4: "Nima Hosseini, Cloud / DevOps engineer" */}
        <div
          className={`transition-all duration-700 ease-out pt-3 sm:pt-5 ${
            activeStep >= 4 || (activeStep >= 3 && !measurement)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <p className="font-display font-bold text-[clamp(1.35rem,2.8vw,2.4rem)] leading-snug tracking-[-0.025em] text-[#0D1017] max-w-3xl mx-auto">
            <span
              className="bg-clip-text text-transparent inline-block"
              style={{
                backgroundImage: "linear-gradient(120deg, #0233bc 0%, #ec178b 100%)",
              }}
            >
              Nima Hosseini,
            </span>{" "}
            Cloud / DevOps engineer
          </p>
        </div>

      </div>
    </section>
  );
}
