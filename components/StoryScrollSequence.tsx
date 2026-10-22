"use client";

import React, { useRef, useEffect, useSyncExternalStore } from "react";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotionSnapshot(): boolean {
  return false;
}

/**
 * StoryScrollSequence
 *
 * Full-viewport manifesto section with the glass tile and liquid 'wvrner' wordmark.
 * - Glass tile (squircle continuous-curvature corners, clear glass, subtle white lift, near-white rim)
 * - Deep near-black wordmark 'wvrner' with thick liquid melt into bottom-left and top-right corners
 * - 13-stop continuous spectral dispersion color fringe (indigo to blue to cyan to white to pink to red)
 * - Middle letters v, r, n, e stay crisp and undistorted
 * - Subtle 8-second breathing animation respecting prefers-reduced-motion
 * - Cool off-white background with 5 faint concentric water ripple rings
 * - Three static lines of text below the tile exactly to spec
 * - Zero em dashes
 */
export function StoryScrollSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 13 continuous spectral gradient stops
    const stops = [
      "#0B0B12", // 1. black core
      "#1A1240", // 2. deep indigo
      "#2A1FA8", // 3. violet-blue
      "#2F4BFF", // 4. electric royal blue
      "#1E8BFF", // 5. azure
      "#00C8FF", // 6. bright cyan
      "#7FF3FF", // 7. pale ice cyan
      "#FFFFFF", // 8. thin white hot highlight
      "#FFC2E6", // 9. pale pink
      "#FF4FB0", // 10. hot pink
      "#FF1F7A", // 11. magenta-rose
      "#FF2D3D", // 12. red
      "#FF6A3D", // 13. coral-orange
    ];

    const drawTile = (breathScale: number) => {
      ctx.clearRect(0, 0, 720, 720);

      // Core wordmark gradient: deep near-black (#0B0B12 to #14141C)
      const coreGrad = ctx.createLinearGradient(0, 260, 0, 460);
      coreGrad.addColorStop(0, "#0B0B12");
      coreGrad.addColorStop(1, "#14141C");

      // 1. Continuous spectral gradient fringe along the liquid rim
      // Stacked progressive offset lines with smooth blur
      for (let i = stops.length - 1; i >= 0; i--) {
        const t = i / (stops.length - 1);
        const offset = t * 15.5 * breathScale;

        ctx.save();
        ctx.strokeStyle = stops[i];
        ctx.lineWidth = (13.5 - i * 0.45) * breathScale;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.filter = i === 7 ? "blur(1.2px)" : "blur(2.2px)";
        ctx.globalAlpha = i === stops.length - 1 ? 0.68 : 0.95;

        // Bottom-left liquid convex rim (anchors from bottom-left of 'w')
        ctx.beginPath();
        ctx.moveTo(68 - offset * 0.4, 412 - offset * 0.1);
        ctx.bezierCurveTo(
          42 - offset * 0.7, 480 + offset * 0.2,
          32 - offset, 555 + offset * 0.4,
          58 - offset * 0.8, 620 + offset * 0.6
        );
        ctx.bezierCurveTo(
          78 - offset * 0.6, 660 + offset * 0.6,
          135 - offset * 0.3, 678 + offset * 0.6,
          235 + offset * 0.2, 675 + offset * 0.6
        );
        ctx.stroke();

        // Top-right liquid convex rim (anchors from top-right of 'r')
        ctx.beginPath();
        ctx.moveTo(652 + offset * 0.4, 328 + offset * 0.1);
        ctx.bezierCurveTo(
          678 + offset * 0.7, 260 - offset * 0.2,
          688 + offset, 185 - offset * 0.4,
          662 + offset * 0.8, 120 - offset * 0.6
        );
        ctx.bezierCurveTo(
          642 + offset * 0.6, 80 - offset * 0.6,
          585 + offset * 0.3, 62 - offset * 0.6,
          485 - offset * 0.2, 65 - offset * 0.6
        );
        ctx.stroke();

        ctx.restore();
      }

      // 2. Solid near-black liquid core bodies
      ctx.save();
      ctx.fillStyle = coreGrad;

      // Bottom-left liquid body (molten pull towards corner with fluid surface tension)
      ctx.beginPath();
      ctx.moveTo(68, 412);
      ctx.bezierCurveTo(42, 480, 32, 555, 58, 620);
      ctx.bezierCurveTo(78, 660, 135, 678, 235, 675);
      // Fluid return curve back into the w
      ctx.bezierCurveTo(185, 665, 120, 635, 95, 575);
      ctx.bezierCurveTo(72, 515, 85, 455, 110, 415);
      ctx.lineTo(68, 412);
      ctx.closePath();
      ctx.fill();

      // Top-right liquid body (molten pull towards corner with fluid surface tension)
      ctx.beginPath();
      ctx.moveTo(652, 328);
      ctx.bezierCurveTo(678, 260, 688, 185, 662, 120);
      ctx.bezierCurveTo(642, 80, 585, 62, 485, 65);
      // Fluid return curve back into the r
      ctx.bezierCurveTo(535, 75, 600, 105, 625, 165);
      ctx.bezierCurveTo(648, 225, 635, 285, 610, 325);
      ctx.lineTo(652, 328);
      ctx.closePath();
      ctx.fill();

      // 3. Central crisp wordmark 'wvrner' (solid near-black, fills approx 80% of tile width)
      ctx.font = "900 172px -apple-system, BlinkMacSystemFont, 'SF Pro Rounded', 'Nunito', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = coreGrad;
      ctx.fillText("wvrner", 360, 360);

      ctx.restore();
    };

    if (prefersReduced) {
      drawTile(1.0);
      return;
    }

    let animId: number;
    const startTime = performance.now();

    const loop = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      // 8-second smooth breathing loop (2 * PI / 8 = Math.PI / 4 ≈ 0.785398)
      const breath = 1.0 + 0.1 * Math.sin(elapsed * 0.785398);
      drawTile(breath);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [prefersReduced]);

  return (
    <section
      id="nima-hosseini"
      aria-label="wvrner identity"
      className="relative w-full min-h-screen py-16 px-4 flex flex-col items-center justify-center select-none overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 50%, #F2F2F4 0%, #E2E2E6 100%)",
      }}
    >
      <div id="story" className="absolute top-0" />

      {/* Very faint concentric ripple rings centered behind the tile */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-0 -mt-10 sm:-mt-12"
        aria-hidden="true"
      >
        <div className="absolute rounded-full border-[1.5px] border-[#8A8A96]/[0.08] blur-[1.5px] w-[440px] h-[440px]" />
        <div className="absolute rounded-full border-[1.5px] border-[#8A8A96]/[0.08] blur-[1.5px] w-[620px] h-[620px]" />
        <div className="absolute rounded-full border-[1.5px] border-[#8A8A96]/[0.08] blur-[1.5px] w-[800px] h-[800px]" />
        <div className="absolute rounded-full border-[1.5px] border-[#8A8A96]/[0.08] blur-[1.5px] w-[980px] h-[980px]" />
        <div className="absolute rounded-full border-[1.5px] border-[#8A8A96]/[0.08] blur-[1.5px] w-[1160px] h-[1160px]" />
      </div>

      {/* Main Content: Glass Tile + 3 Lines of Text */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* The Glass Tile */}
        <div
          className="relative w-[70vw] h-[70vw] sm:w-[360px] sm:h-[360px] rounded-[calc(70vw*0.22)] sm:rounded-[79px] overflow-hidden flex items-center justify-center"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            border: "1.5px solid rgba(255, 255, 255, 0.9)",
            boxShadow:
              "inset 0 1.5px 2px rgba(255, 255, 255, 0.9), inset 0 -1.5px 2px rgba(0, 0, 0, 0.04), 0 20px 40px -15px rgba(0, 0, 0, 0.06), 0 0 0 1.5px rgba(255, 255, 255, 0.9)",
          }}
        >
          <canvas
            ref={canvasRef}
            width={720}
            height={720}
            className="w-[70vw] h-[70vw] sm:w-[360px] sm:h-[360px] pointer-events-none"
          />
        </div>

        {/* Text Block ~56px below the tile */}
        <div className="mt-12 sm:mt-[56px] text-center flex flex-col items-center">
          {/* Line 1 */}
          <p
            className="text-[15.3px] sm:text-[18px] font-normal leading-snug tracking-[-0.01em]"
            style={{
              color: "#5E5E66",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'SF Pro Rounded', 'Nunito', system-ui, sans-serif",
            }}
          >
            you didn&apos;t notice anything. that was the job.
          </p>

          {/* Line 2 */}
          <p
            className="mt-[8.5px] sm:mt-[10px] text-[13.6px] sm:text-[16px] font-medium leading-snug tracking-[-0.01em]"
            style={{
              color: "#2A2A31",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'SF Pro Rounded', 'Nunito', system-ui, sans-serif",
            }}
          >
            nima hosseini
          </p>

          {/* Line 3 */}
          <p
            className="mt-[24px] sm:mt-[28px] text-[9.35px] sm:text-[11px] font-normal leading-snug tracking-[0.18em] uppercase font-mono"
            style={{
              color: "#9A9AA3",
              fontFamily:
                "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            }}
          >
            THIS PAGE REACHED YOU IN 997 MS FROM FRA
          </p>
        </div>
      </div>
    </section>
  );
}
