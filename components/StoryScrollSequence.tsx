"use client";

import React, { useEffect, useRef } from "react";

export function StoryScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 12 spectral color stops in order from tail outward:
    const stopsHex = [
      "#1A1240", // indigo
      "#2A1FA8", // violet-blue
      "#2F4BFF", // blue
      "#1E8BFF", // azure
      "#00C8FF", // cyan
      "#7FF3FF", // ice
      "#FFFFFF", // white (narrow)
      "#FFC2E6", // pale pink
      "#FF4FB0", // hot pink
      "#FF1F7A", // magenta
      "#FF2D3D", // red
      "#FF6A3D", // coral
    ];

    function hexToRgb(h: string): [number, number, number] {
      return [
        parseInt(h.slice(1, 3), 16),
        parseInt(h.slice(3, 5), 16),
        parseInt(h.slice(5, 7), 16),
      ];
    }

    const stopsRgb = stopsHex.map(hexToRgb);

    // Interpolate to 32 continuous saturated colors
    const palette32: string[] = [];
    for (let i = 0; i < 32; i++) {
      const t = (i / 31.0) * 11.0;
      const idx = Math.min(10, Math.floor(t));
      const f = t - idx;
      const c0 = stopsRgb[idx];
      const c1 = stopsRgb[idx + 1];
      const r = Math.round(c0[0] + (c1[0] - c0[0]) * f);
      const g = Math.round(c0[1] + (c1[1] - c0[1]) * f);
      const b = Math.round(c0[2] + (c1[2] - c0[2]) * f);
      palette32.push(`rgb(${r},${g},${b})`);
    }

    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      if (!container || !canvas || !ctx) return;
      width = container.clientWidth;
      height = container.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    resize();

    function renderFrame(breath = 0) {
      if (!ctx || width === 0 || height === 0) return;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.48;
      const targetRatio = width < 600 ? 0.80 : 0.58;
      const targetWidth = width * targetRatio;

      let fontSize = Math.round(width * 0.16);
      ctx.font = `900 ${fontSize}px "Nunito", "SF Pro Rounded", -apple-system, sans-serif`;
      const measured = ctx.measureText("wvrner");
      fontSize = Math.round(fontSize * (targetWidth / measured.width));
      const fontStr = `900 ${fontSize}px "Nunito", "SF Pro Rounded", -apple-system, sans-serif`;
      ctx.font = fontStr;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const wordWidth = ctx.measureText("wvrner").width;
      const leftX = centerX - wordWidth * 0.5;
      const rightX = centerX + wordWidth * 0.5;

      const strokeW = fontSize * 0.175;
      const startHalfW = strokeW * 0.5;

      // Tail A: starts INSIDE the bottom of the first stroke of 'w'
      // Overlap by ~15px so there is no visible join
      const w_apex_x = leftX + wordWidth * 0.072;
      const w_apex_y = centerY + fontSize * 0.285;
      const p0_A = {
        x: w_apex_x - 5.0,
        y: w_apex_y - 14.0,
      };
      // Ends exactly at bottom-left corner of the section
      const p2_A = { x: 0, y: height };

      // Control point A: bow slightly toward center (offset ~12% height, animated ±8px)
      const mid_A = { x: (p0_A.x + p2_A.x) * 0.5, y: (p0_A.y + p2_A.y) * 0.5 };
      const chord_A = { x: p2_A.x - p0_A.x, y: p2_A.y - p0_A.y };
      const chord_A_len = Math.hypot(chord_A.x, chord_A.y) || 1.0;
      const n_chord_A = { x: -chord_A.y / chord_A_len, y: chord_A.x / chord_A_len };
      if (n_chord_A.x * (centerX - mid_A.x) + n_chord_A.y * (centerY - mid_A.y) < 0) {
        n_chord_A.x = -n_chord_A.x;
        n_chord_A.y = -n_chord_A.y;
      }
      const offset_A = height * 0.12 + breath * 8.0;
      const p1_A = {
        x: mid_A.x + n_chord_A.x * offset_A,
        y: mid_A.y + n_chord_A.y * offset_A,
      };

      // Tail B: starts INSIDE the arm of the last 'r'
      // Overlap by ~15px inside arm
      const r_arm_x = rightX - 2.0;
      const r_arm_y = centerY - fontSize * 0.20;
      const p0_B = {
        x: r_arm_x - 14.0,
        y: r_arm_y + 4.0,
      };
      // Ends exactly at top-right corner of the section
      const p2_B = { x: width, y: 0 };

      // Control point B: bow slightly toward center
      const mid_B = { x: (p0_B.x + p2_B.x) * 0.5, y: (p0_B.y + p2_B.y) * 0.5 };
      const chord_B = { x: p2_B.x - p0_B.x, y: p2_B.y - p0_B.y };
      const chord_B_len = Math.hypot(chord_B.x, chord_B.y) || 1.0;
      const n_chord_B = { x: -chord_B.y / chord_B_len, y: chord_B.x / chord_B_len };
      if (n_chord_B.x * (centerX - mid_B.x) + n_chord_B.y * (centerY - mid_B.y) < 0) {
        n_chord_B.x = -n_chord_B.x;
        n_chord_B.y = -n_chord_B.y;
      }
      const offset_B = height * 0.12 + breath * 8.0;
      const p1_B = {
        x: mid_B.x + n_chord_B.x * offset_B,
        y: mid_B.y + n_chord_B.y * offset_B,
      };

      // Helper to build 120 sampled points along quadratic Bezier curve
      function buildTailData(
        p0: { x: number; y: number },
        p1: { x: number; y: number },
        p2: { x: number; y: number },
        startW: number
      ) {
        const outerPoints: { x: number; y: number }[] = [];
        const innerPoints: { x: number; y: number }[] = [];
        const normalsOut: { x: number; y: number }[] = [];

        for (let k = 0; k < 120; k++) {
          const t = k / 119.0;
          const inv = 1.0 - t;
          const bx = inv * inv * p0.x + 2 * inv * t * p1.x + t * t * p2.x;
          const by = inv * inv * p0.y + 2 * inv * t * p1.y + t * t * p2.y;

          const tx = 2 * inv * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
          const ty = 2 * inv * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
          const tLen = Math.hypot(tx, ty) || 1.0;
          const ux = tx / tLen;
          const uy = ty / tLen;

          let nx = -uy;
          let ny = ux;
          // Outward normal points away from section center
          if (nx * (bx - centerX) + ny * (by - centerY) < 0) {
            nx = -nx;
            ny = -ny;
          }

          // Width: w(t) = startHalfWidth * (1 - t)^1.6 + 0.5px
          const w = startW * Math.pow(1.0 - t, 1.6) + 0.5;

          outerPoints.push({ x: bx + nx * w, y: by + ny * w });
          innerPoints.push({ x: bx - nx * w, y: by - ny * w });
          normalsOut.push({ x: nx, y: ny });
        }
        return { outerPoints, innerPoints, normalsOut };
      }

      const tailA = buildTailData(p0_A, p1_A, p2_A, startHalfW);
      const tailB = buildTailData(p0_B, p1_B, p2_B, startHalfW * 0.9);

      const fringeScale = 1.0 + breath * 0.10;

      // STEP 1: Fringe lines (spectrum on the outer side of each tail's curve)
      ctx.save();
      ctx.filter = "blur(0.6px)";
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 1.4;

      const tails = [tailA, tailB];
      for (const tail of tails) {
        for (let i = 0; i < 32; i++) {
          const d_i = i * 0.55 * fringeScale;
          ctx.strokeStyle = palette32[i];
          ctx.beginPath();
          for (let k = 0; k < 120; k++) {
            const t = k / 119.0;
            const envelope = Math.sin(Math.PI * t);
            const px = tail.outerPoints[k].x + tail.normalsOut[k].x * (d_i * envelope);
            const py = tail.outerPoints[k].y + tail.normalsOut[k].y * (d_i * envelope);
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }
      ctx.restore();

      // STEP 2: Tails (filled black #0B0B12 polygons, no rectangles or flat zones)
      ctx.fillStyle = "#0B0B12";
      for (const tail of tails) {
        ctx.beginPath();
        ctx.moveTo(tail.outerPoints[0].x, tail.outerPoints[0].y);
        for (let k = 1; k < 120; k++) {
          ctx.lineTo(tail.outerPoints[k].x, tail.outerPoints[k].y);
        }
        for (let k = 119; k >= 0; k--) {
          ctx.lineTo(tail.innerPoints[k].x, tail.innerPoints[k].y);
        }
        ctx.closePath();
        ctx.fill();
      }

      // STEP 3: Wordmark text "wvrner" (filled black #0B0B12, fusing seamlessly)
      ctx.font = fontStr;
      ctx.fillStyle = "#0B0B12";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("wvrner", centerX, centerY);

      ctx.restore();
    }

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        renderFrame(0);
      });
    }

    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animId: number;
    const startTime = performance.now();

    function loop(time: number) {
      if (!isReduced) {
        const elapsed = (time - startTime) / 1000;
        // 8-second smooth ease-in-out breathing loop
        const breath = Math.sin((elapsed * 2 * Math.PI) / 8);
        renderFrame(breath);
        animId = requestAnimationFrame(loop);
      } else {
        renderFrame(0);
      }
    }

    if (!isReduced) {
      animId = requestAnimationFrame(loop);
    } else {
      renderFrame(0);
    }

    function handleResize() {
      resize();
      renderFrame(0);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      id="story"
      ref={containerRef}
      aria-label="wvrner wordmark identity"
      className="relative w-full min-h-[100vh] h-[100vh] overflow-hidden select-none"
      style={{
        background: "radial-gradient(circle at 50% 50%, #F2F2F4 0%, #E2E2E6 100%)",
      }}
    >
      {/* 5 Faint Concentric Ripple Rings behind wordmark */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(135,135,145,0.08)] blur-[1.5px]"
          style={{ width: "500px", height: "500px" }}
        />
        <div
          className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(135,135,145,0.08)] blur-[1.5px]"
          style={{ width: "720px", height: "720px" }}
        />
        <div
          className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(135,135,145,0.08)] blur-[1.5px]"
          style={{ width: "940px", height: "940px" }}
        />
        <div
          className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(135,135,145,0.08)] blur-[1.5px]"
          style={{ width: "1160px", height: "1160px" }}
        />
        <div
          className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(135,135,145,0.08)] blur-[1.5px]"
          style={{ width: "1380px", height: "1380px" }}
        />
      </div>

      {/* 2D Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-[1] pointer-events-none"
      />

      {/* HTML Overlay Text (Centered cleanly below wordmark, no background box, no pill) */}
      <div className="absolute bottom-[8vh] sm:bottom-[12vh] left-0 right-0 z-[2] text-center flex flex-col items-center pointer-events-auto px-4">
        <p className="font-['Nunito',sans-serif] font-normal text-[15.3px] sm:text-[18px] text-[#5E5E66] tracking-[-0.01em] leading-[1.3]">
          you didn&apos;t notice anything. that was the job.
        </p>
        <p className="font-['Nunito',sans-serif] font-semibold text-[13.6px] sm:text-[16px] text-[#2A2A31] mt-[8.5px] sm:mt-[10px] tracking-[-0.01em] leading-[1.3]">
          nima hosseini
        </p>
        <p className="font-mono text-[9.35px] sm:text-[11px] font-normal text-[#9A9AA3] tracking-[0.18em] uppercase mt-[24px] sm:mt-[28px] leading-[1.3]">
          THIS PAGE REACHED YOU IN 997 MS FROM FRA
        </p>
      </div>
    </section>
  );
}
