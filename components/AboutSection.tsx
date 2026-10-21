export function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 md:py-36 px-6 sm:px-12 md:px-16 lg:px-24 max-w-[1720px] mx-auto border-t border-[#0A0A0A]/15 bg-white"
      aria-label="About Nima Hosseini"
    >
      {/* Opening Idea: Monumental Sans with Oversized Instrument Serif "invisible" */}
      <div className="pb-16 sm:pb-24 lg:pb-28">
        <h2 className="font-display text-[clamp(2.4rem,5.2vw,4.8rem)] font-normal text-[#0A0A0A] leading-[0.98] tracking-[-0.035em] max-w-[1280px]">
          <div>
            <span>Good architecture is quiet.</span>
            <br />
            <span>Great infrastructure is</span>
          </div>

          <span className="inline-flex items-baseline flex-wrap gap-x-3 sm:gap-x-5 pt-2 sm:pt-3.5">
            <span className="font-serif italic font-normal text-[1.4em] text-[#0A0A0A] leading-none tracking-[-0.025em] select-none inline-block">
              invisible.
            </span>
          </span>
        </h2>
      </div>

      {/* Narrative Canvas: WHERE I COME FROM -> NOW -> DIRECTION */}
      <div className="border-t border-[#0A0A0A]/15 pt-12 sm:pt-16 lg:pt-20 grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-y-16 gap-x-12 items-start">
        {/* Where I Come From: Grounded Infrastructure Roots (Cols 1-5) */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="text-[11px] font-mono tracking-[0.24em] text-[#8A8A8A] uppercase">
            BACKGROUND
          </div>
          <p className="text-[15px] sm:text-[16px] text-[#4A4A4A] leading-relaxed max-w-[480px]">
            My path started in hands-on IT and infrastructure operations - troubleshooting systems directly, seeing where environments break, and understanding the physical and operational reality beneath modern abstractions.
          </p>
        </div>

        {/* Where I Am Now & Direction (Cols 6-12) */}
        <div className="lg:col-span-7 space-y-12 sm:space-y-14 lg:pl-6 xl:pl-10">
          {/* NOW: Grounded Hands-on Reality */}
          <div className="space-y-3.5 border-t lg:border-t-0 border-[#0A0A0A]/10 pt-8 lg:pt-0">
            <div className="flex items-center gap-2.5 text-[11px] font-mono tracking-[0.24em] text-[#8A8A8A] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" />
              <span>NOW</span>
            </div>
            <p className="text-[14.5px] sm:text-[15.5px] text-[#4A4A4A] leading-relaxed max-w-[520px]">
              Translating that operational foundation into Cloud and DevOps engineering. I spend my time running structured architectural labs, writing declarative infrastructure, and building reproducible deployment workflows.
            </p>
          </div>

          {/* DIRECTION: Systems -> Automation -> Cloud */}
          <div className="space-y-4 pt-4 border-t border-[#0A0A0A]/10">
            <div className="text-[11px] font-mono tracking-[0.24em] text-[#8A8A8A] uppercase">
              PROGRESSION
            </div>

            {/* Visual Vector / Growth Path */}
            <div className="inline-flex items-center gap-2.5 sm:gap-4 font-mono text-[12.5px] sm:text-[14px] tracking-[0.16em] uppercase text-[#0A0A0A] font-medium py-3 px-4 border border-[#0A0A0A]/15 bg-[#F9F9F9]">
              <span>SYSTEMS</span>
              <span className="text-[#8A8A8A]">→</span>
              <span>AUTOMATION</span>
              <span className="text-[#8A8A8A]">→</span>
              <span>CLOUD</span>
            </div>

            <p className="text-[13.5px] sm:text-[14.5px] text-[#5A5A5A] leading-relaxed max-w-[500px]">
              A deliberate progression: understanding how single machines behave, encoding that behavior into automated pipelines, and scaling it into resilient cloud infrastructure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
