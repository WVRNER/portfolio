"use client";

import { User, Terminal } from "lucide-react";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 md:py-36 px-6 sm:px-12 md:px-16 lg:px-24 max-w-[1400px] mx-auto border-t border-[#0A0A0A]/10 bg-white"
      aria-label="About Nima Hosseini"
    >
      {/* Anchor Header Row */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.04] text-[11.5px] font-mono tracking-wider uppercase text-[#6E6E73] font-medium w-fit mb-8 sm:mb-12">
        <User className="w-3.5 h-3.5 text-[#1D1D1F]" />
        <span>ABOUT / NIMA HOSSEINI</span>
      </div>

      {/* Main Grid: Portrait Anchor (Left) + Architectural Narrative (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Portrait & Identity Anchor (Cols 1-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#141416] border border-black/10 shadow-sm group">
            {/* Visual Portrait Surface */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-poster.jpg"
              alt="Nima Hosseini"
              className="w-full h-full object-cover grayscale contrast-110 group-hover:scale-[1.02] transition-transform duration-500 ease-out"
            />

            {/* Subtle dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            {/* Card Identity Details */}
            <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/70">
                  WVRNER
                </span>
              </div>
              <h3 className="font-display text-[22px] font-bold text-white tracking-tight leading-tight">
                Nima Hosseini
              </h3>
              <p className="text-[13px] font-sans text-neutral-300">
                Cloud / DevOps Engineer
              </p>
            </div>
          </div>

          {/* Quick Technical Footprint */}
          <div className="p-4 rounded-xl bg-[#F8F8F9] border border-black/[0.06] space-y-2.5 font-mono text-[12px] text-[#555555]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#888888] shrink-0">FOCUS</span>
              <span className="text-[#161617] font-semibold text-right">AWS &middot; Terraform &middot; Linux</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 border-t border-black/[0.04]">
              <span className="text-[#888888] shrink-0">STATE</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5 text-right text-[11.5px] sm:text-[12px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                Open to junior Cloud / DevOps roles remote
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative Canvas & Story (Cols 5-12) */}
        <div className="lg:col-span-8 space-y-12 sm:space-y-14">
          
          {/* Monumental Headline Idea */}
          <div>
            <h2 className="font-display text-[clamp(2.4rem,4.5vw,4.2rem)] font-normal text-[#0A0A0A] leading-[1.02] tracking-[-0.035em]">
              <div>
                <span>Good architecture is quiet.</span>
                <br />
                <span>Great infrastructure is</span>
              </div>

              <span className="inline-flex items-baseline flex-wrap gap-x-3 sm:gap-x-5 pt-2 sm:pt-3">
                <span className="font-serif italic font-normal text-[1.35em] text-[#0A0A0A] leading-none tracking-[-0.025em] select-none inline-block">
                  invisible.
                </span>
              </span>
            </h2>
          </div>

          {/* Narrative Story Progression: BACKGROUND -> NOW -> PROGRESSION */}
          <div className="border-t border-[#0A0A0A]/10 pt-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Background: IT Ops Grounding */}
            <div className="space-y-3">
              <div className="text-[11px] font-mono tracking-[0.24em] text-[#8A8A8A] uppercase font-semibold">
                BACKGROUND
              </div>
              <p className="text-[15px] sm:text-[16px] text-[#4A4A4A] leading-relaxed">
                My path started in hands-on IT and infrastructure operations: troubleshooting systems directly, diagnosing why environments break under load, and understanding the physical and operational reality beneath modern abstractions.
              </p>
            </div>

            {/* Now: Modern Cloud Infrastructure */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-[11px] font-mono tracking-[0.24em] text-[#8A8A8A] uppercase font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" />
                <span>NOW</span>
              </div>
              <p className="text-[15px] sm:text-[16px] text-[#4A4A4A] leading-relaxed">
                Translating that operational foundation into Cloud and DevOps engineering. I spend my time running structured architectural labs, writing declarative infrastructure with Terraform, and engineering automated deployment workflows.
              </p>
            </div>

          </div>

          {/* PROGRESSION: Systems -> Automation -> Cloud */}
          <div className="space-y-4 pt-6 border-t border-[#0A0A0A]/10">
            <div className="text-[11px] font-mono tracking-[0.24em] text-[#8A8A8A] uppercase font-semibold">
              ENGINEERING PROGRESSION
            </div>

            {/* Visual Vector / Growth Path */}
            <div className="inline-flex items-center gap-2.5 sm:gap-4 font-mono text-[12px] sm:text-[13.5px] tracking-[0.16em] uppercase text-[#0A0A0A] font-semibold py-3 px-4 border border-[#0A0A0A]/12 bg-[#F9F9F9] rounded-lg">
              <span>SYSTEMS</span>
              <span className="text-[#8A8A8A]">→</span>
              <span>AUTOMATION</span>
              <span className="text-[#8A8A8A]">→</span>
              <span>CLOUD</span>
            </div>

            <p className="text-[14px] sm:text-[15px] text-[#5A5A5A] leading-relaxed max-w-[620px]">
              A deliberate progression: understanding how single machines behave, encoding that behavior into automated CI/CD pipelines, and scaling it into resilient, self-healing cloud infrastructure.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
