"use client";

import { SYSTEMS_AND_TOOLS } from "@/lib/systemsData";

/**
 * SYSTEMS & DISCIPLINES:
 * Six codified operational domains engineered from first principles.
 * Clean, prominent typography without chip badges or boxed containers.
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
        <header className="space-y-4">
          <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-medium leading-[1.05] tracking-[-0.035em] text-white select-none">
            Systems &amp; Disciplines<span className="text-[#00C8FF]">.</span>
          </h2>

          <p className="text-[15px] sm:text-[17px] text-white/60 leading-relaxed font-normal max-w-[58ch]">
            Six codified operational domains engineered from first principles: bridging declarative cloud topology, immutable container runtimes, and automated zero-downtime delivery.
          </p>
        </header>

        {/* Assembled Architectural Ledger: All 6 Disciplines Unified */}
        <div className="border-t border-white/15 divide-y divide-white/10">
          {SYSTEMS_AND_TOOLS.map((item) => {
            const allTools = item.category === "OPERATIONS" ? [...item.tools, "Python"] : item.tools;

            return (
              <div
                key={item.category}
                className="py-6 sm:py-8 flex flex-col gap-3 sm:grid sm:grid-cols-12 sm:gap-6 lg:gap-8 sm:items-baseline"
              >
                {/* Discipline Category Label: Brighter readable grey, sitting above on mobile */}
                <div className="sm:col-span-4 lg:col-span-3 font-mono text-[13px] sm:text-[14px] text-white/75 tracking-[0.2em] uppercase font-semibold">
                  {item.category}
                </div>

                {/* Clean, Bright Scannable Skills without chips */}
                <div className="sm:col-span-8 lg:col-span-9 flex flex-wrap items-center gap-x-3.5 sm:gap-x-4 gap-y-2 text-[17px] sm:text-[19px] md:text-[21px] text-white font-medium tracking-tight">
                  {allTools.map((tool, idx) => (
                    <span key={tool} className="inline-flex items-center gap-3.5 sm:gap-4">
                      <span className="text-white hover:text-white/80 transition-colors">
                        {tool}
                      </span>
                      {idx < allTools.length - 1 && (
                        <span className="text-white/30 select-none font-light">/</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SystemsSection() {
  return <CompleteStaticRegister />;
}
