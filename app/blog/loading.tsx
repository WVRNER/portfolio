export default function BlogLoading() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#E2E2E6] flex flex-col items-center justify-center text-[#050c1a]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 45% 45% at 100% 0%, rgba(255,45,61,0.18) 0%, rgba(42,31,168,0.12) 40%, transparent 75%), radial-gradient(ellipse 55% 55% at 0% 100%, rgba(0,200,255,0.2) 0%, rgba(47,75,255,0.14) 40%, rgba(26,18,64,0.08) 65%, transparent 80%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-2 select-none">
        <span className="font-mono text-[11px] tracking-[0.3em] uppercase font-bold text-[#5E5E66]">
          LOADING FIELD NOTES
        </span>
        <span className="font-display font-extrabold text-[28px] text-[#050c1a] tracking-tight">
          Writing &amp; Architecture
        </span>
      </div>
    </div>
  );
}
