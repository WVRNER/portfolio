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
              className="py-6 sm:py-8 flex flex-col gap-3 sm:grid sm:grid-cols-12 sm:gap-6 lg:gap-8 sm:items-baseline"
            >
              {/* Discipline Category Label: Brighter readable grey, sitting above on mobile */}
              <div className="sm:col-span-4 lg:col-span-3 font-mono text-[13px] sm:text-[14px] text-white/75 tracking-[0.2em] uppercase font-semibold">
                {item.category}
              </div>

              {/* Prominent, Bright Scannable Skills: Generous span preventing awkward wrapping on laptop/tablet */}
              <div className="sm:col-span-8 lg:col-span-9 flex flex-wrap items-center gap-2 sm:gap-3">
                {item.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-white font-sans font-semibold text-[14.5px] sm:text-[16.5px] tracking-tight transition-colors shadow-sm"
                  >
                    {tool}
                  </span>
                ))}
                {item.category === "OPERATIONS" && (
                  <span className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-white font-sans font-semibold text-[14.5px] sm:text-[16.5px] tracking-tight transition-colors shadow-sm">
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
