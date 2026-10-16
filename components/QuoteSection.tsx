export function QuoteSection() {

  return (
    <section
      id="quote"
      aria-label="Core Philosophy Statement"
      className="relative w-full py-32 sm:py-44 md:py-52 px-6 sm:px-12 md:px-16 lg:px-24 max-w-[1720px] mx-auto border-t border-[#0A0A0A]/10 bg-white"
    >
      <div className="space-y-8 sm:space-y-12 max-w-[1500px]">
        {/* LINE 1: Clean editorial statement with normal punctuation */}
        <p className="font-serif italic font-normal text-[clamp(3.6rem,9.5vw,9.5rem)] text-[#0A0A0A] leading-[1.0] tracking-[-0.03em] select-none">
          You didn’t notice anything.
        </p>

        {/* LINE 2: Clean, authoritative static typography */}
        <p className="font-display font-medium text-[clamp(4.2rem,11.5vw,11.5rem)] text-[#0A0A0A] leading-[0.88] tracking-[-0.045em] select-none sm:pl-8 md:pl-16 lg:pl-24 break-words">
          That was the job.
        </p>
      </div>
    </section>
  );
}
