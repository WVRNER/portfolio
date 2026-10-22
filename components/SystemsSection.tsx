"use client";

import { SYSTEMS_AND_TOOLS } from "@/lib/systemsData";

/**
 * SYSTEMS & DISCIPLINES:
 * Six codified operational domains engineered from first principles.
 * Prioritizes prominent, bright recruiter-scannable skill chips with refined category labels.
 * Zero em dashes.
 */
export function CompleteStaticRegister() {
  return (
    <section
      id="systems"
      className="relative w-full bg-[#0A0A0A] text-white py-20 sm:py-28 px-6 sm:px-12 md:px-16 lg:px-24"
      aria-label="Systems and Disciplines"
    >
      <div className="max-w-[1720px] mx-auto space-y-12 sm:space-y-16">
        {/* Section Header */}
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
              {/* Discipline Category Label */}
              <div className="lg:col-span-4 font-mono text-[12px] sm:text-[13px] text-white/50 tracking-[0.2em] uppercase font-medium">
                {item.category}
              </div>

              {/* Prominent, Bright Scannable Skills */}
              <div className="lg:col-span-8 flex flex-wrap items-center gap-2.5 sm:gap-3">
                {item.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-white font-sans font-semibold text-[15px] sm:text-[17px] tracking-tight transition-colors shadow-sm"
                  >
                    {tool}
                  </span>
                ))}
                {item.category === "OPERATIONS" && (
                  <span className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-white font-sans font-semibold text-[15px] sm:text-[17px] tracking-tight transition-colors shadow-sm">
                    PYTHON
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

export function SystemsSection() {
  return <CompleteStaticRegister />;
}
