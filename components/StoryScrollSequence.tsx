"use client";

import React, { useEffect, useRef } from "react";

export function StoryScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  // Entrance animation for tagline
  useEffect(() => {
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReduced) {
      if (numRef.current) numRef.current.textContent = "997";
      if (linesRef.current) linesRef.current.classList.add("wv-animate");
      return;
    }

    if (numRef.current) numRef.current.textContent = "0";

    // Split Line 1 into words
    if (line1Ref.current) {
      const originalText = line1Ref.current.textContent || "you didn't notice anything,";
      const words = originalText.trim().split(/\s+/);
      line1Ref.current.innerHTML = words
        .map((w, i) => {
          const delay = 0.15 + i * 0.06;
          return `<span class="wv-word" style="transition-delay: ${delay}s">${w}</span>`;
        })
        .join(" ");
    }

    // Wait for fonts ready then trigger animation
    let countTimeout: NodeJS.Timeout;
    let animFrame: number;

    const startAnimation = () => {
      if (linesRef.current) linesRef.current.classList.add("wv-animate");

      // Count up from 0 to 997 starting 0.2s after line 2 starts (at 0.88s)
      countTimeout = setTimeout(() => {
        const start = performance.now();
        const duration = 1000;
        function tick(now: number) {
          const p = Math.min(1, (now - start) / duration);
          // Ease-out cubic
          const ease = 1 - Math.pow(1 - p, 3);
          if (numRef.current) {
            numRef.current.textContent = String(Math.round(997 * ease));
          }
          if (p < 1) {
            animFrame = requestAnimationFrame(tick);
          } else if (numRef.current) {
            numRef.current.textContent = "997";
          }
        }
        animFrame = requestAnimationFrame(tick);
      }, 880);
    };

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(startAnimation);
    } else {
      startAnimation();
    }

    return () => {
      clearTimeout(countTimeout);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, []);

  // WebGL Corner Pools Shader
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: true,
      antialias: false,
      alpha: true,
    });
    if (!gl) return;

    const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;

    const FRAG = `
    precision highp float;
    uniform vec2  uRes;
    uniform float uDpr;
    uniform float uRad;
    uniform float uTime;
    uniform vec3  uPageDark;

    float sdRoundRect(vec2 p, vec2 b, float r){
      vec2 q = abs(p) - b + r;
      return length(max(q,0.)) + min(max(q.x,q.y),0.) - r;
    }

    vec3 grad(float t, vec3 a, vec3 b, vec3 c, vec3 d, vec3 e, vec3 f){
      t = clamp(t,0.,1.)*5.;
      if(t<1.) return mix(a,b,t);
      if(t<2.) return mix(b,c,t-1.);
      if(t<3.) return mix(c,d,t-2.);
      if(t<4.) return mix(d,e,t-3.);
      return mix(e,f,t-4.);
    }
    vec3 hex(float r,float g,float b){ return vec3(r,g,b)/255.; }

    const float LOOP = 10.0;
    float pool(vec2 p, vec2 c, vec2 S, float t, float ph){
      float w = 6.2831853 / LOOP;
      float breathe = 1. + 0.28*sin(w*t + ph);
      float spread  = 1. + 0.14*sin(w*t + ph + 1.2);
      // Responsive pool scaling for desktop and mobile
      vec2  L = vec2(max(0.30*S.x, 0.40*S.x), min(0.42*S.y, 0.54*S.x)) * spread;
      vec2  d = (p - c) / L;
      float r2 = dot(d,d);
      float s = (abs(p.x-c.x) - abs(p.y-c.y)) * 0.012;
      float wob = 1. + 0.13*sin(s*1.1 - 2.*w*t + ph) + 0.05*sin(s*2.3 + 3.*w*t);
      float Tmax = clamp(max(0.135*min(S.x,S.y), 0.16*S.x), 48., 145.);
      return Tmax * breathe * wob * exp(-r2*1.85);
    }

    // Polynomial smooth minimum (Quilez)
    float smin(float a, float b, float k){
      float h = max(k - abs(a - b), 0.0) / k;
      return min(a, b) - h * h * k * 0.25;
    }

    void main(){
      vec2 S  = uRes / uDpr;
      vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
      float edge = min(min(px.x, S.x - px.x), min(px.y, S.y - px.y));

      float bigR = 0.28*min(S.x,S.y);
      float depth = -sdRoundRect(px - S*0.5, S*0.5, bigR);

      float t = uTime;
      float w = 6.2831853 / LOOP;

      // 1. Top-right corner pool (untouched)
      float poolTR = pool(px, vec2(S.x, 0.), S, t, 0.);

      // 2. Bottom-left corner pool
      float poolBL = pool(px, vec2(0., S.y), S, t, 3.14159);

      // 3. Liquid floor band along entire bottom edge
      // 2 gentle sine waves: wavelength ~40-60% of width, amplitude ~2-3% of section height
      float k1 = 6.2831853 / (0.50 * S.x);
      float k2 = 6.2831853 / (0.36 * S.x);
      float w1 = sin(k1 * px.x + w * t);
      float w2 = sin(k2 * px.x - 2.0 * w * t + 1.2);
      float waveNorm = 0.55 * (w1 * 0.5 + 0.5) + 0.45 * (w2 * 0.5 + 0.5);

      float floorAmp  = clamp(0.025 * S.y, 10., 26.);
      float floorBase = clamp(0.08 * S.y, 44., 88.);
      float floorH    = floorBase + waveNorm * floorAmp;

      // Distance from bottom edge
      float pxBottom = S.y - px.y;
      float dFloor   = pxBottom - floorH;
      float dBL      = depth - poolBL;

      // Merge bottom-left pool and floor smoothly with smin
      float kBlend = clamp(0.06 * S.y, 28., 58.);
      float dBottom = smin(dBL, dFloor, kBlend);

      // Top-right pool distance
      float dTR = depth - poolTR;

      // Full screen liquid distance: smooth union of TR pool and bottom liquid
      float dLiquid = min(dTR, dBottom);

      // Liquid thickness T at this pixel
      float floorWeight = smoothstep(floorH + 70.0, floorH - 10.0, pxBottom);
      float localFloorH = floorH * floorWeight;
      float T = max(poolTR, max(poolBL, localFloorH));

      // Red rim: ONLY left edge of bottom-left pool and top/right edges of top-right pool
      // Strictly NO red rim along the bottom edge
      float rimDist = 9999.0;
      if(px.x > S.x * 0.4 && px.y < S.y * 0.6){
        rimDist = min(px.y, S.x - px.x);
      }
      if(px.x < S.x * 0.4 && px.y > S.y * 0.35){
        rimDist = px.x;
      }

      vec3 ink = uPageDark;

      // Outside section boundary: strictly no corner glow on the bottom
      if(edge < 0.){
        if(px.y >= S.y || px.y > S.y * 0.5) { gl_FragColor = vec4(0.); return; }
        float g = smoothstep(0., 14., -edge);
        vec3  c = mix(hex(255.,45.,61.), hex(255.,106.,61.), g);
        float a = (1. - g*0.85) * smoothstep(3., 10., T);
        gl_FragColor = vec4(c*a, a); return;
      }
      if(T < 0.5){ gl_FragColor = vec4(0.); return; }

      float rimW = clamp(T*0.22, 3., 16.);
      float rimT = rimDist / rimW;
      vec3 rimCol = grad(rimT,
        hex(255.,106.,61.),
        hex(255.,45.,61.),
        hex(255.,31.,122.),
        hex(255.,79.,176.),
        hex(42.,31.,168.),
        ink);

      // Inner rainbow fringe on liquid wave surface
      float fw = clamp(T*0.55, 10., 46.);
      float x  = dLiquid / fw;
      vec3 inCol = grad(x,
        hex(26.,18.,64.),
        hex(47.,75.,255.),
        hex(30.,139.,255.),
        hex(0.,200.,255.),
        hex(127.,243.,255.),
        hex(255.,255.,255.));

      vec3 col;
      float alpha;
      if(dLiquid <= 0.){
        bool isRim = (rimDist < rimW);
        col   = isRim ? rimCol : ink;
        alpha = 1.;
        alpha *= smoothstep(0.5, 6., T);
      } else {
        col   = inCol;
        float fade = 1. - smoothstep(0.55, 1.0, x);
        alpha = fade * smoothstep(2., 14., T);
      }
      gl_FragColor = vec4(col*alpha, alpha);
    }`;

    const glCtx = gl;

    function createShader(type: number, src: string) {
      const s = glCtx.createShader(type);
      if (!s) return null;
      glCtx.shaderSource(s, src);
      glCtx.compileShader(s);
      if (!glCtx.getShaderParameter(s, glCtx.COMPILE_STATUS)) {
        console.error(glCtx.getShaderInfoLog(s));
      }
      return s;
    }

    const vertShader = createShader(gl.VERTEX_SHADER, VERT);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAG);
    if (!vertShader || !fragShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (name: string) => gl.getUniformLocation(prog, name);
    const uRes = U("uRes");
    const uDpr = U("uDpr");
    const uRad = U("uRad");
    const uTime = U("uTime");
    const uPageDark = U("uPageDark");

    function getPageDarkRgb(): [number, number, number] {
      if (typeof window !== "undefined") {
        const val = getComputedStyle(document.documentElement)
          .getPropertyValue("--page-dark")
          .trim();
        const m = val.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        if (m) {
          return [
            parseInt(m[1], 16) / 255,
            parseInt(m[2], 16) / 255,
            parseInt(m[3], 16) / 255,
          ];
        }
      }
      return [11 / 255, 11 / 255, 18 / 255];
    }

    // Sharp rectangular corners
    const radius = 0.0;
    let dpr = 1;

    function resize() {
      if (!section || !canvas || !gl) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = section.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function draw(t: number) {
      if (!canvas || !gl) return;
      const [r, g, b] = getPageDarkRgb();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uDpr, dpr);
      gl.uniform1f(uRad, radius);
      gl.uniform1f(uTime, t);
      if (uPageDark) gl.uniform3f(uPageDark, r, g, b);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ro = new ResizeObserver(() => {
      resize();
      if (still) draw(0);
    });
    ro.observe(section);
    resize();

    let animId: number;
    if (still) {
      draw(0);
    } else {
      const t0 = performance.now();
      const loop = () => {
        draw((performance.now() - t0) / 1000);
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      ro.disconnect();
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
    };
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      aria-label="Nima Hosseini identity"
      className="relative w-full h-[100vh] min-h-[560px] overflow-hidden flex flex-col items-center justify-center select-none"
      style={{
        borderRadius: "0px",
        background: "#E2E2E6",
      }}
    >
      {/* WebGL corner pools canvas */}
      <canvas
        ref={canvasRef}
        id="wv-pools"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Title: Nima Hosseini in bold Plus Jakarta Sans */}
      <h1
        className="relative font-extrabold text-[#050c1a] leading-[0.9] tracking-[-0.03em] whitespace-nowrap z-10 select-none"
        style={{
          color: "#050c1a",
          fontFamily: "var(--font-plus-jakarta), -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: "clamp(40px, 11.5vw, 220px)",
        }}
      >
        Nima Hosseini
      </h1>

      {/* Tagline lines: Line 1 & Line 2 on separate lines */}
      <div
        ref={linesRef}
        className="relative text-center z-10 px-4 mt-[clamp(36px,6vh,72px)] transition-none"
      >
        {/* Line 1: Word by word entrance */}
        <p className="wv-l1 text-[15px] sm:text-[18px] font-normal text-[#5E5E66] leading-[1.4]" aria-label="you didn't notice anything,">
          <span ref={line1Ref} className="wv-l1-text">
            you didn&apos;t notice anything,
          </span>
        </p>

        {/* Line 2: Single unit quiet conclusion */}
        <p
          className="wv-l2 text-[15px] sm:text-[18px] font-normal text-[#5E5E66] leading-[1.4] mt-[4px]"
          aria-label="that was the job."
          style={{ transitionDelay: "0.68s" }}
        >
          that was the job.
        </p>

        {/* Line 3: Fades in and counts up 0 to 997 with tabular-nums */}
        <p
          className="wv-l3 font-mono text-[9.5px] sm:text-[11px] font-normal text-[#9A9AA3] tracking-[0.18em] uppercase mt-[28px]"
          style={{
            fontVariantNumeric: "tabular-nums",
            transitionDelay: "0.88s",
          }}
        >
          THIS PAGE REACHED YOU IN <span ref={numRef} className="wv-num">997</span> MS FROM FRA
        </p>
      </div>

      <style jsx global>{`
        .wv-num {
          font-variant-numeric: tabular-nums;
          display: inline-block;
        }

        /* Initial state before entrance animation */
        .wv-word {
          display: inline-block;
          opacity: 0;
          filter: blur(6px);
          transform: translateY(0.25em);
          transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                      filter 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, filter, transform;
        }

        .wv-l2 {
          opacity: 0;
          filter: blur(4px);
          transform: translateY(0.25em);
          transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                      filter 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, filter, transform;
        }

        .wv-l3 {
          opacity: 0;
          transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity;
        }

        /* Active entrance state */
        .wv-animate .wv-word {
          opacity: 1;
          filter: blur(0);
          transform: translateY(0);
        }

        .wv-animate .wv-l2 {
          opacity: 1;
          filter: blur(0);
          transform: translateY(0);
        }

        .wv-animate .wv-l3 {
          opacity: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .wv-word,
          .wv-l2,
          .wv-l3 {
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
