export default function BlogLoading() {
  return (
    <div
      aria-label="Loading Writing & Architecture"
      className="fixed inset-0 z-50 bg-[#E2E2E6] flex flex-col items-center justify-center text-[#010c14] select-none pointer-events-none"
    >
      {/* Corner liquid ambient pools with blue inner spectral fringe */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 100% 0%, #010c14 0%, #1A1240 28%, rgba(47,75,255,0.32) 48%, rgba(0,200,255,0.16) 68%, transparent 84%), radial-gradient(ellipse 55% 55% at 0% 100%, #010c14 0%, #1A1240 28%, rgba(47,75,255,0.32) 48%, rgba(127,243,255,0.18) 68%, transparent 84%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-3 text-center px-6">
        <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#9A9AA3]">
          LOADING FIELD NOTES
        </span>
        <h1
          className="text-[clamp(32px,6vw,64px)] font-[900] tracking-[-0.035em] text-[#010c14] leading-[0.95]"
          style={{
            fontFamily: "var(--font-inter-tight), 'Inter Tight', var(--font-inter), sans-serif",
          }}
        >
          Writing &amp; Architecture
        </h1>
        <p className="text-[14px] sm:text-[16px] text-[#5E5E66] font-normal tracking-[-0.01em]">
          systems, cloud infrastructure, and technical field notes
        </p>
      </div>
    </div>
  );
}
