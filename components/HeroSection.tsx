"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);

    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d");
    let textTexture: THREE.CanvasTexture | null = null;

    const p_w = new THREE.Vector2(0.22, 0.45);
    const p_r = new THREE.Vector2(0.78, 0.55);

    function updateTextTexture() {
      if (!textCtx) return;
      const texW = Math.round(width * dpr);
      const texH = Math.round(height * dpr);
      textCanvas.width = texW;
      textCanvas.height = texH;

      textCtx.clearRect(0, 0, texW, texH);

      const targetRatio = width < 600 ? 0.80 : 0.58;
      const targetWidth = texW * targetRatio;

      let fontSize = Math.round(texW * 0.16);
      textCtx.font = `900 ${fontSize}px "Nunito", -apple-system, BlinkMacSystemFont, sans-serif`;
      textCtx.textAlign = "center";
      textCtx.textBaseline = "middle";

      const m = textCtx.measureText("wvrner");
      fontSize = Math.round(fontSize * (targetWidth / m.width));
      textCtx.font = `900 ${fontSize}px "Nunito", -apple-system, BlinkMacSystemFont, sans-serif`;

      const centerY = texH * 0.48;
      const centerX = texW * 0.5;

      textCtx.fillStyle = "#FFFFFF";
      textCtx.fillText("wvrner", centerX, centerY);

      const fullWidth = textCtx.measureText("wvrner").width;
      const wWidth = textCtx.measureText("w").width;
      const leftX = centerX - fullWidth * 0.5;
      const rightX = centerX + fullWidth * 0.5;

      // Bottom-left corner of 'w' first stroke
      p_w.set((leftX + wWidth * 0.16) / texW, 1.0 - (centerY + fontSize * 0.32) / texH);
      // Top-right tip of 'r' arm
      p_r.set((rightX - 6) / texW, 1.0 - (centerY - fontSize * 0.22) / texH);

      if (!textTexture) {
        textTexture = new THREE.CanvasTexture(textCanvas);
        textTexture.minFilter = THREE.LinearFilter;
        textTexture.magFilter = THREE.LinearFilter;
        textTexture.wrapS = THREE.ClampToEdgeWrapping;
        textTexture.wrapT = THREE.ClampToEdgeWrapping;
      } else {
        textTexture.needsUpdate = true;
      }
    }

    updateTextTexture();

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        updateTextTexture();
      });
    }

    // 12-color spectral dispersion stops in order from black core outward
    // #1A1240 -> #2A1FA8 -> #2F4BFF -> #1E8BFF -> #00C8FF -> #7FF3FF -> #FFFFFF -> #FFC2E6 -> #FF4FB0 -> #FF1F7A -> #FF2D3D -> #FF6A3D
    const spectralColors = [
      new THREE.Vector4(0.102, 0.071, 0.251, 1.0), // #1A1240
      new THREE.Vector4(0.165, 0.122, 0.659, 1.0), // #2A1FA8
      new THREE.Vector4(0.184, 0.294, 1.000, 1.0), // #2F4BFF
      new THREE.Vector4(0.118, 0.545, 1.000, 1.0), // #1E8BFF
      new THREE.Vector4(0.000, 0.784, 1.000, 1.0), // #00C8FF
      new THREE.Vector4(0.498, 0.953, 1.000, 1.0), // #7FF3FF
      new THREE.Vector4(1.000, 1.000, 1.000, 1.0), // #FFFFFF (narrow)
      new THREE.Vector4(1.000, 0.761, 0.902, 1.0), // #FFC2E6
      new THREE.Vector4(1.000, 0.310, 0.690, 1.0), // #FF4FB0
      new THREE.Vector4(1.000, 0.122, 0.478, 1.0), // #FF1F7A
      new THREE.Vector4(1.000, 0.176, 0.239, 1.0), // #FF2D3D
      new THREE.Vector4(1.000, 0.416, 0.239, 1.0), // #FF6A3D
    ];

    const uniforms = {
      u_texture: { value: textTexture },
      u_resolution: { value: new THREE.Vector2(width, height) },
      u_time: { value: 0 },
      u_pw: { value: p_w },
      u_pr: { value: p_r },
      u_aspect: { value: width / height },
      u_breath: { value: 1.0 },
      u_spectral: { value: spectralColors },
    };

    const vertexShader = `
      varying vec2 v_uv;
      void main() {
        v_uv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      varying vec2 v_uv;

      uniform sampler2D u_texture;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_pw;
      uniform vec2 u_pr;
      uniform float u_aspect;
      uniform float u_breath;
      uniform vec4 u_spectral[12];

      vec4 sampleSpectrum(float t) {
        t = clamp(t, 0.0, 1.0) * 11.0;
        int idx = int(floor(t));
        float f = fract(t);
        for (int i = 0; i < 11; i++) {
          if (i == idx) {
            return mix(u_spectral[i], u_spectral[i + 1], f);
          }
        }
        return u_spectral[11];
      }

      vec2 evalBezier(vec2 p0, vec2 p1, vec2 p2, float t) {
        float inv = 1.0 - t;
        return inv * inv * p0 + 2.0 * inv * t * p1 + t * t * p2;
      }

      float projectBezier(vec2 p, vec2 p0, vec2 p1, vec2 p2, out float out_t) {
        float min_d = 1e5;
        float best_t = 0.0;
        const int STEPS = 36;
        for (int i = 0; i <= STEPS; i++) {
          float t = float(i) / float(STEPS);
          vec2 pt = evalBezier(p0, p1, p2, t);
          vec2 diff = (p - pt);
          diff.x *= u_aspect;
          float d = length(diff);
          if (d < min_d) {
            min_d = d;
            best_t = t;
          }
        }
        float dt = 1.0 / float(STEPS);
        float t_a = max(0.0, best_t - dt);
        float t_b = min(1.0, best_t + dt);
        for (int i = 0; i <= 8; i++) {
          float t = mix(t_a, t_b, float(i) / 8.0);
          vec2 pt = evalBezier(p0, p1, p2, t);
          vec2 diff = (p - pt);
          diff.x *= u_aspect;
          float d = length(diff);
          if (d < min_d) {
            min_d = d;
            best_t = t;
          }
        }
        out_t = best_t;
        return min_d;
      }

      void main() {
        vec2 uv = v_uv;

        // Bottom-left curve: from u_pw to corner (0.0, 0.0)
        vec2 bl_p0 = u_pw;
        vec2 bl_p1 = vec2(0.04, 0.18);
        vec2 bl_p2 = vec2(0.00, 0.00);

        // Top-right curve: from u_pr to corner (1.0, 1.0)
        vec2 tr_p0 = u_pr;
        vec2 tr_p1 = vec2(0.96, 0.82);
        vec2 tr_p2 = vec2(1.00, 1.00);

        float bl_t = 0.0;
        float bl_d = projectBezier(uv, bl_p0, bl_p1, bl_p2, bl_t);

        float tr_t = 0.0;
        float tr_d = projectBezier(uv, tr_p0, tr_p1, tr_p2, tr_t);

        float base_mask = texture2D(u_texture, uv).r;
        vec3 coreColor = mix(vec3(0.043, 0.043, 0.071), vec3(0.078, 0.078, 0.110), 1.0 - uv.y);

        float breath = u_breath;

        float zone_t = 0.0;
        float zone_d = 1.0;
        bool in_zone = false;

        if (uv.x < u_pw.x + 0.02 && uv.y < u_pw.y + 0.04) {
          zone_t = bl_t;
          zone_d = bl_d;
          in_zone = true;
        } else if (uv.x > u_pr.x - 0.02 && uv.y > u_pr.y - 0.04) {
          zone_t = tr_t;
          zone_d = tr_d;
          in_zone = true;
        }

        // Clean middle letters (v, middle r, n, e)
        if (!in_zone) {
          if (base_mask > 0.02) {
            gl_FragColor = vec4(coreColor, base_mask);
          } else {
            discard;
          }
          return;
        }

        float core_w = mix(0.022, 0.003, pow(zone_t, 0.8)) * breath;
        float curve_factor = sin(zone_t * 3.14159);
        float fringe_w = (mix(0.006, 0.022, curve_factor) + 0.003 * zone_t) * breath;

        float outer_limit = core_w + fringe_w * 1.5;

        if (zone_d > outer_limit && base_mask < 0.02) {
          discard;
        }

        // Spectral dispersion: N = 32 samples across fringe
        const int N = 32;
        vec4 spectral_accum = vec4(0.0);
        float fringe_alpha_accum = 0.0;

        for (int i = 0; i < N; i++) {
          float lambda = float(i) / float(N - 1);
          float sample_radius = core_w + lambda * fringe_w;
          float sample_mask = 1.0 - smoothstep(sample_radius - 0.003, sample_radius + 0.003, zone_d);
          vec4 col = sampleSpectrum(lambda);

          spectral_accum += col * sample_mask;
          fringe_alpha_accum += sample_mask;
        }

        spectral_accum /= float(N);
        float avg_fringe_alpha = fringe_alpha_accum / float(N);

        float core_mask = 1.0 - smoothstep(core_w - 0.002, core_w + 0.002, zone_d);
        core_mask = max(core_mask, base_mask);

        vec3 final_color = mix(spectral_accum.rgb, coreColor, core_mask);
        float final_alpha = max(core_mask, smoothstep(0.04, 0.85, avg_fringe_alpha));

        float edge_fade = smoothstep(0.998, 0.96, zone_t);
        final_alpha *= edge_fade;

        if (zone_t > 0.85 && core_mask < 0.3) {
          final_color = mix(final_color, spectral_accum.rgb * 1.25, smoothstep(0.85, 0.98, zone_t));
        }

        if (final_alpha < 0.01) {
          discard;
        }

        gl_FragColor = vec4(final_color, final_alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animId: number;
    const startTime = performance.now();
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function animate(time: number) {
      if (!isReduced) {
        const elapsed = (time - startTime) / 1000;
        // 8 seconds breathing loop
        uniforms.u_breath.value = 1.0 + 0.10 * Math.sin(elapsed * 0.7854);
        uniforms.u_time.value = elapsed;
      }
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    }
    animId = requestAnimationFrame(animate);

    function handleResize() {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setSize(width, height);
      renderer.setPixelRatio(dpr);
      uniforms.u_resolution.value.set(width, height);
      uniforms.u_aspect.value = width / height;
      updateTextTexture();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      textTexture?.dispose();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-screen h-[100vh] overflow-hidden select-none"
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

      {/* Fullscreen Three.js WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-[1] pointer-events-none"
      />

      {/* HTML Overlay Text (Centered below wordmark, no background box, no pill) */}
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
