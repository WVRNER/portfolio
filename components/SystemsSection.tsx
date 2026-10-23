"use client";

import { SYSTEMS_AND_TOOLS } from "@/lib/systemsData";

/**
 * SYSTEMS & DISCIPLINES
 * 
 * Clean, high-readability architectural register.
 * Large prominent typography, grounded minimal structure,
 * zero pulsing or dots, zero em dashes.
 */
export function CompleteStaticRegister() {
  return (
    <section
      id="systems"
      className="relative w-full bg-[#08090C] text-white py-24 sm:py-32 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-white/10"
      aria-label="Systems and Disciplines"
    >
      <div className="max-w-[1560px] mx-auto space-y-16 sm:space-y-20">
        
        {/* Section Header */}
        <header className="space-y-4 max-w-4xl">
          <h2 className="font-[family-name:var(--font-inter-tight),var(--font-plus-jakarta),sans-serif] text-[clamp(2.6rem,6.5vw,4.8rem)] font-extrabold leading-[1.0] tracking-[-0.04em] text-white select-none">
            Systems &amp; Disciplines<span className="text-[#00C8FF]">.</span>
          </h2>

          <p className="text-[16px] sm:text-[18px] text-white/70 leading-relaxed font-sans font-normal max-w-[62ch]">
            Six codified operational domains engineered from first principles: bridging declarative cloud topology, immutable container runtimes, and automated zero-downtime delivery.
          </p>
        </header>

        {/* Operational Ledger: 6 Clean Rows */}
        <div className="border-t border-white/15 divide-y divide-white/10">
          {SYSTEMS_AND_TOOLS.map((item) => {
            const allTools = item.category === "OPERATIONS" ? [...item.tools, "Python"] : item.tools;
            const categoryTitle = item.category.charAt(0) + item.category.slice(1).toLowerCase();

            return (
              <div
                key={item.category}
                className="group py-7 sm:py-8 lg:py-9 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-8 items-start lg:items-center hover:bg-white/[0.02] transition-colors -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-2xl"
              >
                {/* Left Domain Column */}
                <div className="lg:col-span-4 flex items-center">
                  <h3 className="font-[family-name:var(--font-plus-jakarta),var(--font-inter-tight),sans-serif] text-[18px] sm:text-[20px] md:text-[22px] font-bold text-white/80 tracking-tight">
                    {categoryTitle}
                  </h3>
                </div>

                {/* Right Stack Column: Bold, Large, Legible Tools */}
                <div className="lg:col-span-8 flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-3">
                  {allTools.map((tool, idx) => (
                    <span
                      key={tool}
                      className="inline-flex items-center gap-4 sm:gap-5"
                    >
                      <span className="font-[family-name:var(--font-inter-tight),var(--font-plus-jakarta),sans-serif] text-[22px] sm:text-[26px] md:text-[28px] font-bold text-white tracking-[-0.02em]">
                        {tool}
                      </span>
                      {idx < allTools.length - 1 && (
                        <span className="text-white/20 select-none font-mono text-[18px] sm:text-[22px] font-light">
                          /
                        </span>
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
