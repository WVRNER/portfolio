"use client";

import React, { useEffect, useRef } from "react";

export function StoryScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      vec2  L = vec2(0.30*S.x, min(0.42*S.y, 0.54*S.x)) * spread;
      vec2  d = (p - c) / L;
      float r2 = dot(d,d);
      float s = (abs(p.x-c.x) - abs(p.y-c.y)) * 0.012;
      float wob = 1. + 0.13*sin(s*1.1 - 2.*w*t + ph) + 0.05*sin(s*2.3 + 3.*w*t);
      float Tmax = clamp(0.135*min(S.x,S.y), 48., 145.);
      return Tmax * breathe * wob * exp(-r2*1.85);
    }

    void main(){
      vec2 S  = uRes / uDpr;
      vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
      float edge  = -sdRoundRect(px - S*0.5, S*0.5, uRad);
      float bigR  = 0.28*min(S.x,S.y);
      float depth = -sdRoundRect(px - S*0.5, S*0.5, bigR);

      float t = uTime;
      float T = max(pool(px, vec2(S.x, 0.), S, t, 0.), pool(px, vec2(0., S.y), S, t, 3.14159));
      vec3 ink = hex(5.,12.,26.);

      if(edge < 0.){
        float g = smoothstep(0., 14., -edge);
        vec3  c = mix(hex(255.,45.,61.), hex(255.,106.,61.), g);
        float a = (1. - g*0.85) * smoothstep(3., 10., T);
        gl_FragColor = vec4(c*a, a); return;
      }
      if(T < 0.5){ gl_FragColor = vec4(0.); return; }

      float rimW = clamp(T*0.22, 3., 16.);
      float rimT = edge / rimW;
      vec3 rimCol = grad(rimT,
        hex(255.,106.,61.),
        hex(255.,45.,61.),
        hex(255.,31.,122.),
        hex(255.,79.,176.),
        hex(42.,31.,168.),
        ink);

      float fw = clamp(T*0.55, 10., 46.);
      float x  = (depth - T) / fw;
      vec3 inCol = grad(x,
        hex(26.,18.,64.),
        hex(47.,75.,255.),
        hex(30.,139.,255.),
        hex(0.,200.,255.),
        hex(127.,243.,255.),
        hex(255.,255.,255.));

      vec3 col;
      float alpha;
      if(depth <= T){
        col   = (edge < rimW) ? rimCol : ink;
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

    const radius = 28.0;
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
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uDpr, dpr);
      gl.uniform1f(uRad, radius);
      gl.uniform1f(uTime, t);
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
        borderRadius: "28px 0 28px 0",
        background: "radial-gradient(ellipse at 50% 48%, #F2F2F4 0%, #E2E2E6 100%)",
      }}
    >
      {/* Faint repeating ripple rings with radial mask */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-radial-gradient(circle at 50% 46%, transparent 0 96px, rgba(0,0,0,0.016) 97px 98.5px, transparent 100px 190px)",
          WebkitMaskImage: "radial-gradient(circle at 50% 46%, #000 0 55%, transparent 80%)",
          maskImage: "radial-gradient(circle at 50% 46%, #000 0 55%, transparent 80%)",
        }}
      />

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

      {/* Text lines with sequential show up */}
      <div className="relative text-center z-10 px-4 mt-[clamp(36px,6vh,72px)]">
        <p className="text-[15px] sm:text-[18px] font-normal text-[#5E5E66] tracking-[-0.01em]">
          <span
            className="inline-block opacity-0 translate-y-[6px] mr-[0.3em] motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:animate-none"
            style={{
              animation: "wvFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards",
            }}
          >
            you didn&apos;t notice anything.
          </span>
          <span
            className="inline-block opacity-0 translate-y-[6px] motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:animate-none"
            style={{
              animation: "wvFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.5s forwards",
            }}
          >
            that was the job.
          </span>
        </p>
        <p className="font-mono text-[9.5px] sm:text-[11px] font-normal text-[#9A9AA3] tracking-[0.18em] uppercase mt-[28px]">
          THIS PAGE REACHED YOU IN 997 MS FROM FRA
        </p>
      </div>

      <style jsx>{`
        @keyframes wvFadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
