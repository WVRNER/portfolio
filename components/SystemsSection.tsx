"use client";

import { useRef, useSyncExternalStore } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { SYSTEMS_AND_TOOLS } from "@/lib/systemsData";

interface StateRange {
  inStart: number;
  inEnd: number;
  outStart: number;
  outEnd: number;
}

// Strictly monotonic scroll ranges with calibrated dwell per discipline:
// 01 CLOUD: enters immediately, dwells 0.00 -> 0.12, exits 0.12 -> 0.16
// 02 CONTAINERS: enters 0.12 -> 0.16, dwells 0.16 -> 0.28, exits 0.28 -> 0.32
// 03 DELIVERY: enters 0.28 -> 0.32, dwells 0.32 -> 0.44, exits 0.44 -> 0.48
// 04 SYSTEMS: enters 0.44 -> 0.48, dwells 0.48 -> 0.60, exits 0.60 -> 0.64
// 05 NETWORKING: enters 0.60 -> 0.64, dwells 0.64 -> 0.76, exits 0.76 -> 0.80
// 06 OPERATIONS: enters 0.76 -> 0.80, extra dwell 0.80 -> 0.90, exits 0.90 -> 0.94
// ASSEMBLED REGISTER: emerges 0.90 -> 0.94, dwells 0.94 -> 1.00
const STATE_RANGES: StateRange[] = [
  { inStart: 0.00, inEnd: 0.01, outStart: 0.12, outEnd: 0.16 }, // CLOUD
  { inStart: 0.12, inEnd: 0.16, outStart: 0.28, outEnd: 0.32 }, // CONTAINERS
  { inStart: 0.28, inEnd: 0.32, outStart: 0.44, outEnd: 0.48 }, // DELIVERY
  { inStart: 0.44, inEnd: 0.48, outStart: 0.60, outEnd: 0.64 }, // SYSTEMS
  { inStart: 0.60, inEnd: 0.64, outStart: 0.76, outEnd: 0.80 }, // NETWORKING
  { inStart: 0.76, inEnd: 0.80, outStart: 0.90, outEnd: 0.94 }, // OPERATIONS (extra dwell)
];

function MechanicalPlate({
  index,
  item,
  progress,
}: {
  index: number;
  item: (typeof SYSTEMS_AND_TOOLS)[number];
  progress: MotionValue<number>;
}) {
  const range = STATE_RANGES[index];

  const initialY = index === 0 ? "0%" : "100%";
  const initialOpacity = index === 0 ? 1 : 0;

  const y = useTransform(
    progress,
    [range.inStart, range.inEnd, range.outStart, range.outEnd],
    [initialY, "0%", "0%", "-100%"]
  );

  const opacity = useTransform(
    progress,
    [range.inStart, range.inEnd, range.outStart, range.outEnd],
    [initialOpacity, 1, 1, 0]
  );

  return (
    <motion.div
      style={{ y, opacity }}
      className="absolute inset-0 flex flex-col justify-center py-4 pointer-events-none"
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Dominant Discipline Title */}
        <h3 className="font-display text-[clamp(3.4rem,10.5vw,9.5rem)] font-medium text-white leading-[0.9] tracking-[-0.04em] uppercase select-none">
          {item.category}
        </h3>

        {/* Factual Technologies directly below */}
        <div className="font-mono text-[13.5px] sm:text-[16px] md:text-[18px] text-white/90 tracking-wide uppercase flex flex-wrap items-center gap-x-3 gap-y-1">
          {item.tools.map((tool, idx) => (
            <span key={tool} className="inline-flex items-center gap-3">
              <span>{tool}</span>
              {idx < item.tools.length - 1 && (
                <span className="text-white/30 font-normal">/</span>
              )}
            </span>
          ))}
          {item.category === "OPERATIONS" && (
            <span className="inline-flex items-center gap-3 text-white/90">
              <span className="text-white/30">/</span>
              <span>PYTHON</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MechanicalTrackItem({
  index,
  item,
  progress,
}: {
  index: number;
  item: (typeof SYSTEMS_AND_TOOLS)[number];
  progress: MotionValue<number>;
}) {
  const range = STATE_RANGES[index];

  // Highlights active discipline; when assembly completes at >= 0.94, all items illuminate
  const color = useTransform(
    progress,
    [range.inStart, range.inEnd, range.outStart, range.outEnd, 0.90, 0.94],
    [
      "rgba(255, 255, 255, 0.3)",
      "#FFFFFF",
      "#FFFFFF",
      "rgba(255, 255, 255, 0.3)",
      "rgba(255, 255, 255, 0.3)",
      "#FFFFFF",
    ]
  );

  const indicatorOpacity = useTransform(
    progress,
    [range.inStart, range.inEnd, range.outStart, range.outEnd],
    [index === 0 ? 1 : 0, 1, 1, 0]
  );

  return (
    <motion.div
      style={{ color }}
      className="flex items-center gap-2 font-mono text-[10.5px] sm:text-[11.5px] tracking-[0.18em] uppercase transition-colors shrink-0"
    >
      <motion.span
        style={{ opacity: indicatorOpacity }}
        className="w-1.5 h-1.5 rounded-full bg-white"
      />
      <span>{item.category}</span>
    </motion.div>
  );
}

/**
 * THE COMPLETE ASSEMBLED REGISTER:
 * Displays all six domains assembled together in an architectural ledger.
 * Rendered for users with prefers-reduced-motion: reduce or explicit ?reduced-motion=true.
 */
export function CompleteStaticRegister() {
  return (
    <section
      id="systems"
      className="relative w-full bg-[#0A0A0A] text-white py-20 sm:py-28 px-6 sm:px-12 md:px-16 lg:px-24"
      aria-label="Systems and Disciplines"
    >
      <div className="max-w-[1720px] mx-auto space-y-12 sm:space-y-16">
        {/* Section Header: Systems & Disciplines (Apple / Notion Minimalist Restraint) */}
        <header className="space-y-4 pb-8 sm:pb-10 border-b border-white/10">
          <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-medium leading-[1.05] tracking-[-0.035em] text-white select-none">
            Systems &amp; Disciplines.
          </h2>

          <p className="text-[15px] sm:text-[17px] text-white/60 leading-relaxed font-normal max-w-[58ch]">
            Six codified operational domains engineered from first principles - bridging declarative cloud topology, immutable container runtimes, and automated zero-downtime delivery.
          </p>
        </header>

        {/* Assembled Architectural Ledger: All 6 Disciplines Unified */}
        <div className="border-t border-white/15 divide-y divide-white/10">
          {SYSTEMS_AND_TOOLS.map((item) => (
            <div
              key={item.category}
              className="py-7 sm:py-9 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-8 items-baseline"
            >
              {/* Discipline Title */}
              <div className="lg:col-span-5 font-display text-[clamp(2.2rem,4.4vw,4rem)] font-medium text-white tracking-[-0.035em] leading-[0.92]">
                {item.category}
              </div>

              {/* Factual Technologies */}
              <div className="lg:col-span-7 font-mono text-[13.5px] sm:text-[15px] text-white/85 uppercase tracking-wide flex flex-wrap items-center gap-x-2.5 gap-y-1">
                {item.tools.map((tool, idx) => (
                  <span key={tool} className="inline-flex items-center gap-2.5">
                    <span>{tool}</span>
                    {idx < item.tools.length - 1 && (
                      <span className="text-white/30 font-normal">/</span>
                    )}
                  </span>
                ))}
                {item.category === "OPERATIONS" && (
                  <span className="inline-flex items-center gap-2.5 text-white/85">
                    <span className="text-white/30">/</span>
                    <span>PYTHON</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * ONE-TIME INTRODUCTION STAGE (Desktop & Mobile):
 * Full-viewport black takeover, progressive mechanical replacement through 6 domains,
 * followed by assembled register dwell. Monotonic progress prevents backward reversal.
 * Once completed, scrolling upward shows the assembled register without replaying.
 */
function AnimatedSystemsIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const maxProgressRef = useRef(0);
  const monotonicProgress = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track progress monotonically: upward scrolling NEVER runs the animation backward
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > maxProgressRef.current) {
      maxProgressRef.current = latest;
      monotonicProgress.set(latest);
    }
  });

  // Assembly layer emerges as Operations concludes (0.90 -> 0.94)
  const assemblyOpacity = useTransform(monotonicProgress, [0.90, 0.94], [0, 1]);
  const singleStateOpacity = useTransform(monotonicProgress, [0.90, 0.94], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="systems"
      className="relative w-full h-[220vh] md:h-[300vh] bg-[#0A0A0A]"
      aria-label="Systems and Disciplines"
    >
      {/* Sticky Viewport Stage — 100% Pure Black Full-Viewport Enclosure */}
      <div className="sticky top-0 h-[100dvh] w-full bg-[#0A0A0A] text-white flex flex-col justify-between px-6 sm:px-12 md:px-16 lg:px-24 py-8 sm:py-10 md:py-12 overflow-hidden">
        
        {/* Tactile printed grain on Syscore's black field — matching the preceding monolith */}
        <div className="absolute inset-0 grain-level-2 opacity-40 pointer-events-none z-0" aria-hidden="true" />

        {/* Subtle internal architectural coordinate lines */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-20 z-0">
          <svg
            viewBox="0 0 1600 900"
            className="w-full h-full fill-none stroke-white/20"
            strokeWidth="0.75"
          >
            <line x1="200" y1="0" x2="200" y2="900" strokeDasharray="3 6" />
            <line x1="800" y1="0" x2="800" y2="900" strokeDasharray="2 4" strokeOpacity="0.4" />
            <line x1="1400" y1="0" x2="1400" y2="900" strokeDasharray="3 6" />
            <circle cx="800" cy="450" r="380" strokeDasharray="4 8" strokeOpacity="0.3" />
            <circle cx="800" cy="450" r="140" strokeDasharray="2 4" strokeOpacity="0.5" />
          </svg>
        </div>

        {/* Section Header: Systems & Disciplines (Apple / Notion Minimalist Restraint) */}
        <div className="relative z-10 w-full border-b border-white/10 pb-4 sm:pb-5">
          <h2 className="font-display text-[clamp(1.9rem,4.2vw,3rem)] font-medium tracking-[-0.035em] text-white leading-tight">
            Systems &amp; Disciplines.
          </h2>
        </div>

        {/* Central Stage: Single Mechanical Aperture transforms into Complete Assembly */}
        <div className="relative z-10 w-full flex-1 min-h-[280px] sm:min-h-[360px] md:min-h-[420px] max-h-[640px] my-auto overflow-hidden">
          
          {/* Progressive Single-State Plates (CLOUD -> CONTAINERS -> DELIVERY -> SYSTEMS -> NETWORKING -> OPERATIONS) */}
          <motion.div
            style={{ opacity: singleStateOpacity }}
            className="absolute inset-0"
          >
            {SYSTEMS_AND_TOOLS.map((item, index) => (
              <MechanicalPlate
                key={item.category}
                index={index}
                item={item}
                progress={monotonicProgress}
              />
            ))}
          </motion.div>

          {/* Final Assembled Register (All 6 Assemble Together) */}
          <motion.div
            style={{ opacity: assemblyOpacity }}
            className="absolute inset-0 flex flex-col justify-center py-2 pointer-events-none"
          >
            <div className="border-t border-white/15 divide-y divide-white/10">
              {SYSTEMS_AND_TOOLS.map((item) => (
                <div
                  key={item.category}
                  className="py-2.5 sm:py-3.5 grid grid-cols-12 gap-3 sm:gap-4 items-baseline"
                >
                  <div className="col-span-5 sm:col-span-4 font-display text-[clamp(1.25rem,2.6vw,2.2rem)] font-medium text-white leading-none">
                    {item.category}
                  </div>
                  <div className="col-span-7 sm:col-span-8 font-mono text-[11px] sm:text-[13px] text-white/80 uppercase tracking-wide truncate">
                    {item.tools.join(" / ")}
                    {item.category === "OPERATIONS" && " / PYTHON"}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Bottom Mechanical Register Bar */}
        <div className="relative z-10 w-full pt-4 sm:pt-5 border-t border-white/10">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
            {SYSTEMS_AND_TOOLS.map((item, index) => (
              <MechanicalTrackItem
                key={item.category}
                index={index}
                item={item}
                progress={monotonicProgress}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;

  const search = window.location.search;

  // 1. Explicit query parameter overrides
  if (search.includes("reduced-motion=true") || search.includes("static=true")) {
    return true;
  }
  if (search.includes("motion=true") || search.includes("animated=true")) {
    return false;
  }

  // 2. In local development / testing:
  // macOS has a system-wide reduceMotion = 1 preference (in com.apple.universalaccess)
  // which causes Chromium and Safari to report matchMedia("(prefers-reduced-motion: reduce)").matches = true.
  // On localhost, we default to running the signature sequence so it is visibly interactive
  // and verifiable on desktop and Brave DevTools mobile emulation.
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.endsWith(".local");

  if (isLocalhost) {
    return false;
  }

  // 3. For production users: check genuine prefers-reduced-motion media query
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotionSnapshot(): boolean {
  return false;
}

export function SystemsSection() {
  return <CompleteStaticRegister />;
}
