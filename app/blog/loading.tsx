export default function BlogLoading() {
  return (
    <div
      aria-label="Loading Writing"
      className="fixed inset-0 z-50 bg-[#e2e2e6] flex flex-col items-center justify-center text-[#020d15] select-none pointer-events-none"
    >
      {/* Corner liquid ambient pools using verified Nima Hosseini pool spectrum */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 100% 0%, #020d15 0%, #1A1240 22%, rgba(47,75,255,0.45) 42%, rgba(0,200,255,0.35) 60%, rgba(127,243,255,0.20) 72%, transparent 85%), radial-gradient(ellipse 65% 55% at 0% 100%, #020d15 0%, #1A1240 22%, rgba(47,75,255,0.45) 42%, rgba(0,200,255,0.35) 60%, rgba(127,243,255,0.20) 72%, transparent 85%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        <h1
          className="text-[clamp(48px,11vw,110px)] font-[900] tracking-[-0.04em] text-[#020d15] leading-[0.92]"
          style={{
            fontFamily: "var(--font-inter-tight), 'Inter Tight', var(--font-inter), sans-serif",
          }}
        >
          Writing
        </h1>
      </div>
    </div>
  );
}
