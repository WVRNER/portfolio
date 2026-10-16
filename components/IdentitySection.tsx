export function IdentitySection() {
  return (
    <section
      id="identity"
      aria-label="Nima Hosseini"
      className="relative w-full py-24 sm:py-32 md:py-36 px-6 sm:px-12 md:px-16 lg:px-24 max-w-[1720px] mx-auto border-t border-[#0A0A0A]/10 bg-white"
    >
      <div className="space-y-6 sm:space-y-8 max-w-[1400px]">
        {/* NIMA HOSSEINI: Remains visually strong and stable */}
        <h2 className="font-display text-[clamp(4.2rem,12vw,11rem)] font-medium leading-[0.88] tracking-[-0.045em] text-[#0A0A0A] select-none">
          Nima Hosseini
        </h2>

        <div className="space-y-3.5 max-w-[56ch]">
          <div className="text-[20px] sm:text-[26px] md:text-[30px] text-[#5A5A5A] font-normal tracking-tight">
            Infrastructure as Code &bull; Systems Reliability
          </div>
          <p className="text-[15px] sm:text-[16.5px] text-[#6A6A6A] leading-relaxed font-normal pt-1">
            Building resilient architectures from first principles &mdash; with an emphasis on clarity, security boundaries, and reproducible cloud state across AWS and modern container environments.
          </p>
        </div>
      </div>
    </section>
  );
}
