"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function StoryScrollSequence() {
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
    const textCtx = textCanvas.getContext("2d", { willReadFrequently: true });
    let textTexture: THREE.CanvasTexture | null = null;

    const p_w = new THREE.Vector2(0.237, 0.432);
    const p_r = new THREE.Vector2(0.787, 0.585);
    let w_stroke_r = 18.0;
    let r_stroke_r = 17.0;

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

      // Scan exact bottom pixel of w's first stroke and top of r's arm
      try {
        const imgData = textCtx.getImageData(0, 0, texW, texH);
        const d = imgData.data;
        let minX = texW;
        let maxX = 0;
        for (let y = 0; y < texH; y += 2) {
          for (let x = 0; x < texW; x += 2) {
            if (d[(y * texW + x) * 4 + 3] > 128) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
            }
          }
        }
        const wWidth = (maxX - minX) * 0.22;
        let bl_x = 0;
        let bl_y = 0;
        for (let x = minX; x < minX + wWidth * 0.35; x++) {
          for (let y = Math.round(centerY); y < texH; y++) {
            if (d[(y * texW + x) * 4 + 3] > 128 && y > bl_y) {
              bl_y = y;
              bl_x = x;
            }
          }
        }

        let tr_x = 0;
        let tr_y = texH;
        for (let x = maxX - Math.round(wWidth * 0.45); x <= maxX; x++) {
          for (let y = Math.round(centerY - fontSize * 0.5); y < centerY; y++) {
            if (d[(y * texW + x) * 4 + 3] > 128 && x > tr_x) {
              tr_x = x;
              tr_y = y;
            }
          }
        }

        if (bl_x > 0 && bl_y > 0) {
          p_w.set(bl_x / texW, 1.0 - bl_y / texH);
          w_stroke_r = (fontSize * 0.17) / dpr;
        }
        if (tr_x > 0 && tr_y < texH) {
          p_r.set(tr_x / texW, 1.0 - tr_y / texH);
          r_stroke_r = (fontSize * 0.15) / dpr;
        }
      } catch {
        // Fallback to geometric estimates if pixel scan fails
        const fullW = textCtx.measureText("wvrner").width;
        const wW = textCtx.measureText("w").width;
        const leftX = centerX - fullW * 0.5;
        const rightX = centerX + fullW * 0.5;
        p_w.set((leftX + wW * 0.16) / texW, 1.0 - (centerY + fontSize * 0.32) / texH);
        p_r.set((rightX - 6) / texW, 1.0 - (centerY - fontSize * 0.22) / texH);
        w_stroke_r = (fontSize * 0.17) / dpr;
        r_stroke_r = (fontSize * 0.15) / dpr;
      }

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
        updateUniforms();
      });
    }

    // 12 saturated spectral colors in exact order from black core outward:
    // indigo #1A1240 -> violet-blue #2A1FA8 -> blue #2F4BFF -> azure #1E8BFF
    // -> cyan #00C8FF -> ice #7FF3FF -> white #FFFFFF (narrow) -> pale pink #FFC2E6
    // -> hot pink #FF4FB0 -> magenta #FF1F7A -> red #FF2D3D -> coral #FF6A3D
    const spectralColors = [
      new THREE.Vector3(0.102, 0.071, 0.251), // 0: #1A1240 indigo
      new THREE.Vector3(0.165, 0.122, 0.659), // 1: #2A1FA8 violet-blue
      new THREE.Vector3(0.184, 0.294, 1.000), // 2: #2F4BFF blue
      new THREE.Vector3(0.118, 0.545, 1.000), // 3: #1E8BFF azure
      new THREE.Vector3(0.000, 0.784, 1.000), // 4: #00C8FF cyan
      new THREE.Vector3(0.498, 0.953, 1.000), // 5: #7FF3FF ice
      new THREE.Vector3(1.000, 1.000, 1.000), // 6: #FFFFFF white (narrow)
      new THREE.Vector3(1.000, 0.761, 0.902), // 7: #FFC2E6 pale pink
      new THREE.Vector3(1.000, 0.310, 0.690), // 8: #FF4FB0 hot pink
      new THREE.Vector3(1.000, 0.122, 0.478), // 9: #FF1F7A magenta
      new THREE.Vector3(1.000, 0.176, 0.239), // 10: #FF2D3D red
      new THREE.Vector3(1.000, 0.416, 0.239), // 11: #FF6A3D coral
    ];

    // Curve control points: bowing slightly toward section center (0.5, 0.5)
    const bl_p0 = p_w;
    const bl_p2 = new THREE.Vector2(0.0, 0.0);
    const bl_p1 = bl_p0.clone().add(bl_p2).multiplyScalar(0.5).lerp(new THREE.Vector2(0.5, 0.5), 0.18);

    const tr_p0 = p_r;
    const tr_p2 = new THREE.Vector2(1.0, 1.0);
    const tr_p1 = tr_p0.clone().add(tr_p2).multiplyScalar(0.5).lerp(new THREE.Vector2(0.5, 0.5), 0.18);

    const uniforms = {
      u_texture: { value: textTexture },
      u_res: { value: new THREE.Vector2(width, height) },
      u_bl_p0: { value: bl_p0 },
      u_bl_p1: { value: bl_p1 },
      u_bl_p2: { value: bl_p2 },
      u_tr_p0: { value: tr_p0 },
      u_tr_p1: { value: tr_p1 },
      u_tr_p2: { value: tr_p2 },
      u_w_r: { value: w_stroke_r },
      u_r_r: { value: r_stroke_r },
      u_spectral: { value: spectralColors },
      u_breath: { value: 1.0 },
    };

    function updateUniforms() {
      bl_p0.copy(p_w);
      bl_p1.copy(bl_p0).add(bl_p2).multiplyScalar(0.5).lerp(new THREE.Vector2(0.5, 0.5), 0.18);
      tr_p0.copy(p_r);
      tr_p1.copy(tr_p0).add(tr_p2).multiplyScalar(0.5).lerp(new THREE.Vector2(0.5, 0.5), 0.18);
      uniforms.u_w_r.value = w_stroke_r;
      uniforms.u_r_r.value = r_stroke_r;
    }

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
      uniform vec2 u_res;
      uniform vec2 u_bl_p0;
      uniform vec2 u_bl_p1;
      uniform vec2 u_bl_p2;
      uniform vec2 u_tr_p0;
      uniform vec2 u_tr_p1;
      uniform vec2 u_tr_p2;
      uniform float u_w_r;
      uniform float u_r_r;
      uniform vec3 u_spectral[12];
      uniform float u_breath;

      vec3 sampleSpectrum(float u) {
        u = clamp(u, 0.0, 1.0);
        float t = u * 11.0;
        int idx = int(floor(t));
        float f = fract(t);
        for (int i = 0; i < 11; i++) {
          if (i == idx) {
            return mix(u_spectral[i], u_spectral[i + 1], f);
          }
        }
        return u_spectral[11];
      }

      vec2 bezierPt(vec2 p0, vec2 p1, vec2 p2, float t) {
        float inv = 1.0 - t;
        return inv * inv * p0 + 2.0 * inv * t * p1 + t * t * p2;
      }

      vec2 bezierTang(vec2 p0, vec2 p1, vec2 p2, float t) {
        float inv = 1.0 - t;
        return normalize(2.0 * inv * (p1 - p0) + 2.0 * t * (p2 - p1));
      }

      float projectCurve(vec2 p_px, vec2 p0, vec2 p1, vec2 p2, out float out_t, out vec2 out_tang, out vec2 out_pt) {
        float min_d = 1e6;
        float best_t = 0.0;
        const int N = 48;
        for (int i = 0; i <= N; i++) {
          float t = float(i) / float(N);
          vec2 pt_px = bezierPt(p0, p1, p2, t) * u_res;
          float d = length(p_px - pt_px);
          if (d < min_d) {
            min_d = d;
            best_t = t;
          }
        }
        float dt = 1.0 / float(N);
        float t_a = max(0.0, best_t - dt);
        float t_b = min(1.0, best_t + dt);
        for (int i = 0; i <= 10; i++) {
          float t = mix(t_a, t_b, float(i) / 10.0);
          vec2 pt_px = bezierPt(p0, p1, p2, t) * u_res;
          float d = length(p_px - pt_px);
          if (d < min_d) {
            min_d = d;
            best_t = t;
          }
        }
        out_t = best_t;
        out_tang = bezierTang(p0, p1, p2, best_t);
        out_pt = bezierPt(p0, p1, p2, best_t) * u_res;
        return min_d;
      }

      void main() {
        vec2 p_px = v_uv * u_res;
        vec2 center_px = u_res * 0.5;

        // Base text sample
        float base_mask = texture2D(u_texture, v_uv).r;

        // Core near-black color: #0B0B12 to #14141C
        vec3 coreColor = mix(vec3(0.043, 0.043, 0.071), vec3(0.078, 0.078, 0.110), 1.0 - v_uv.y);

        // Untouched letters (v, middle r, n, e) stay crisp and perfectly clean
        bool check_bl = (v_uv.x < u_bl_p0.x + 0.03 && v_uv.y < u_bl_p0.y + 0.05);
        bool check_tr = (v_uv.x > u_tr_p0.x - 0.03 && v_uv.y > u_tr_p0.y - 0.05);

        if (!check_bl && !check_tr) {
          if (base_mask > 0.02) {
            gl_FragColor = vec4(coreColor, base_mask);
          } else {
            discard;
          }
          return;
        }

        float t = 0.0;
        vec2 tang = vec2(0.0);
        vec2 curve_pt = vec2(0.0);
        float start_r = 18.0;

        if (check_bl) {
          projectCurve(p_px, u_bl_p0, u_bl_p1, u_bl_p2, t, tang, curve_pt);
          start_r = u_w_r;
        } else {
          projectCurve(p_px, u_tr_p0, u_tr_p1, u_tr_p2, t, tang, curve_pt);
          start_r = u_r_r;
        }

        // Outward normal: points away from section center
        vec2 normA = vec2(-tang.y, tang.x);
        vec2 normB = vec2(tang.y, -tang.x);
        vec2 n_out = (dot(normA, curve_pt - center_px) > 0.0) ? normA : normB;

        // Signed distance along outward normal in screen pixels
        float s_perp = dot(p_px - curve_pt, n_out);

        // 2. Taper: starts as thick as stroke (start_r), thins smoothly to 1-2px hairline (0.75px)
        float core_r = mix(start_r, 0.75, pow(t, 0.85)) * u_breath;

        // 7. Fringe runs along OUTER side (s_perp > core_r), widest (~18px) in middle of curve, fading at both ends
        float curve_factor = sin(t * 3.14159265);
        float fringe_w = 18.0 * curve_factor * u_breath;

        // A. Deep Black Liquid Core
        float core_alpha = 0.0;
        if (s_perp <= core_r) {
          if (s_perp < -core_r) {
            core_alpha = 1.0 - smoothstep(-core_r - 1.2, -core_r, s_perp);
          } else {
            core_alpha = 1.0;
          }
        }

        // Merge base letter mask into core seamlessly: no gap, no seam, no rounded cap
        if (base_mask > 0.0) {
          core_alpha = max(core_alpha, base_mask);
        }

        // B. Spectral Dispersion Fringe on OUTER side
        vec3 fringe_col = vec3(0.0);
        float fringe_alpha = 0.0;

        if (s_perp > core_r - 0.5 && fringe_w > 0.5) {
          float d_out = s_perp - core_r;
          if (d_out <= fringe_w + 1.5) {
            // 4. Sample offset outward: sample 0 at 0px, sample 31 at ~18px
            float u = clamp(d_out / fringe_w, 0.0, 1.0);
            fringe_col = sampleSpectrum(u);

            // Saturated alpha over light background, fading at outer edge
            float edge_fade = 1.0 - smoothstep(fringe_w - 1.5, fringe_w + 0.5, d_out);
            fringe_alpha = edge_fade * smoothstep(0.0, 0.05, curve_factor);
          }
        }

        // Edge fade right at the corner (last 1% of curve)
        float corner_fade = 1.0 - smoothstep(0.99, 1.0, t);
        core_alpha *= corner_fade;
        fringe_alpha *= corner_fade;

        // 6. Normal alpha blending composite:
        // Black core blends in front of fringe
        vec3 final_color = mix(fringe_col, coreColor, core_alpha);
        float final_alpha = max(core_alpha, fringe_alpha);

        if (final_alpha < 0.005) {
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
        uniforms.u_breath.value = 1.0 + 0.10 * Math.sin(elapsed * 0.7854);
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
      uniforms.u_res.value.set(width, height);
      updateTextTexture();
      updateUniforms();
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

      {/* Full-Section WebGL Canvas (tails touch the edges of THIS section only) */}
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
