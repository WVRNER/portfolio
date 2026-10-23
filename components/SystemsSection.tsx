"use client";

import { SYSTEMS_AND_TOOLS } from "@/lib/systemsData";

/**
 * SYSTEMS & DISCIPLINES
 * 
 * Bold, high-character engineering ledger.
 * Large high-readability typography, grounded tactile structure,
 * and subtle responsive feedback.
 * Zero em dashes.
 */
export function CompleteStaticRegister() {
  return (
    <section
      id="systems"
      className="relative w-full bg-[#08090C] text-white py-24 sm:py-32 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-white/10"
      aria-label="Systems and Disciplines"
    >
      <div className="max-w-[1560px] mx-auto space-y-16 sm:space-y-20">
        
        {/* Section Header: Bold, Charismatic, Landing-grade */}
        <header className="space-y-5 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 font-mono text-[11px] sm:text-[12px] tracking-[0.2em] uppercase text-[#00C8FF] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C8FF] animate-pulse" />
            <span>OPERATIONAL BLUEPRINT</span>
          </div>

          <h2 className="font-[family-name:var(--font-inter-tight),var(--font-plus-jakarta),sans-serif] text-[clamp(2.6rem,6.5vw,4.8rem)] font-extrabold leading-[1.0] tracking-[-0.04em] text-white select-none">
            Systems &amp; Disciplines<span className="text-[#00C8FF]">.</span>
          </h2>

          <p className="text-[16px] sm:text-[19px] text-white/70 leading-relaxed font-sans font-normal max-w-[62ch]">
            Six codified operational domains engineered from first principles: bridging declarative cloud topology, immutable container runtimes, and automated zero-downtime delivery.
          </p>
        </header>

        {/* Tactical Ledger: 6 Heavyweight Operational Rows */}
        <div className="border-t border-white/15 divide-y divide-white/10">
          {SYSTEMS_AND_TOOLS.map((item) => {
            const allTools = item.category === "OPERATIONS" ? [...item.tools, "Python"] : item.tools;

            return (
              <div
                key={item.category}
                className="group py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start hover:bg-white/[0.02] transition-colors -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-2xl"
              >
                {/* Left Index Column: Domain Index & Description */}
                <div className="lg:col-span-5 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[14px] sm:text-[15px] font-bold text-[#00C8FF] tracking-wider transition-colors group-hover:text-[#38D8FF]">
                      // {item.number}
                    </span>
                    <h3 className="font-mono text-[15px] sm:text-[16px] font-bold text-white tracking-[0.16em] uppercase">
                      {item.category}
                    </h3>
                  </div>

                  <p className="text-[13.5px] sm:text-[14.5px] text-white/55 font-sans leading-normal max-w-[42ch]">
                    {item.description}
                  </p>
                </div>

                {/* Right Primary Stack Column: Bold, Large, Legible Tools */}
                <div className="lg:col-span-7 flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-3 pt-1 lg:pt-0">
                  {allTools.map((tool, idx) => (
                    <span
                      key={tool}
                      className="inline-flex items-center gap-4 sm:gap-5"
                    >
                      <span className="font-[family-name:var(--font-inter-tight),var(--font-plus-jakarta),sans-serif] text-[22px] sm:text-[26px] md:text-[28px] font-bold text-white tracking-[-0.02em] group-hover:text-white transition-colors">
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
