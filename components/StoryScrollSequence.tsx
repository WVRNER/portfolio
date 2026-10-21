"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

/**
 * StoryScrollSequence - Awwwards Site of the Day Redesign
 * 
 * Concept: "The Silent Equilibrium"
 * Infrastructure as mathematical continuity. When cloud systems run without state drift,
 * absence is the highest art.
 * 
 * STRICT RULES ENFORCED:
 * - NO JELLY (No squishy cartoon jelly organisms, no gummy blobs)
 * - NO BLACK COLORS (Sunlit warm ivory ground #FAF6F0, deep warm espresso ink #1F1612)
 * - NO BOXES (No bordered rectangles, no outlined cards, no card grids, no 1px dividing lines)
 * - NO MONOSPACE outside code
 * - NO FAKE LABELS, IDS, or DASHBOARD TELEMETRY
 * - NO GRID OR DOT BACKGROUND PATTERNS
 * - NO PURPLE/BLUE NEON GLOWS OR GLASSMORPHISM
 * - ZERO EM DASHES (no unicode em dashes anywhere)
 * - Stack shown as huge fluid typography and moving shapes, not cards in a grid
 * - Asymmetric, monumental, editorial layout
 */

interface KineticTheme {
  name: string;
  knotColor: string;
  knotEmissive: string;
  accentColor: string;
  bgColor: string;
  ambientLight: number;
  rimColor: number;
  pebbleColors: string[];
}

const KINETIC_THEMES: KineticTheme[] = [
  {
    name: "Terracotta Clay",
    knotColor: "#E06648",
    knotEmissive: "#9E341B",
    accentColor: "#D14D2A",
    bgColor: "#FAF5EE",
    ambientLight: 0xfff5ea,
    rimColor: 0xffeedd,
    pebbleColors: ["#F59E0B", "#10B981", "#3B82F6", "#E06648", "#EC4899"],
  },
  {
    name: "Warm Porcelain",
    knotColor: "#D8C7B5",
    knotEmissive: "#8C735D",
    accentColor: "#A35C3A",
    bgColor: "#F7F3EC",
    ambientLight: 0xfff9f2,
    rimColor: 0xffeedb,
    pebbleColors: ["#D14D2A", "#B45309", "#059669", "#4338CA", "#D97706"],
  },
  {
    name: "Sunlit Amber",
    knotColor: "#E59E27",
    knotEmissive: "#995C05",
    accentColor: "#C27803",
    bgColor: "#FCF8ED",
    ambientLight: 0xfef9c3,
    rimColor: 0xfef08a,
    pebbleColors: ["#E06648", "#059669", "#2563EB", "#D97706", "#DB2777"],
  },
  {
    name: "Satin Olive",
    knotColor: "#3F8265",
    knotEmissive: "#1B4734",
    accentColor: "#2A664E",
    bgColor: "#F3F7F2",
    ambientLight: 0xf0fdf4,
    rimColor: 0xdcfce7,
    pebbleColors: ["#E06648", "#D97706", "#2A664E", "#3B82F6", "#F59E0B"],
  },
];

const STACK_ITEMS = [
  { name: "Terraform", role: "Deterministic State & Ephemeral Stacks", accent: "#E06648" },
  { name: "AWS Architecture", role: "Multi-Region Resilient Topology", accent: "#D97706" },
  { name: "Kubernetes", role: "Dynamic Self-Healing Workloads", accent: "#2563EB" },
  { name: "Docker", role: "Hermetic Immutable Containers", accent: "#059669" },
  { name: "GitHub OIDC", role: "Keyless Cryptographic IAM", accent: "#DB2777" },
  { name: "Zero Downtime", role: "Statistical Traffic Canaries", accent: "#16A34A" },
];

export function StoryScrollSequence() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [themeIdx, setThemeIdx] = useState(0);
  const [activeStackIndex, setActiveStackIndex] = useState<number | null>(null);
  const theme = KINETIC_THEMES[themeIdx];

  // Communication bridge to the Three.js 60fps render loop
  const sceneBridgeRef = useRef({
    targetColor: new THREE.Color(theme.knotColor),
    targetEmissive: new THREE.Color(theme.knotEmissive),
    targetRim: new THREE.Color(theme.rimColor),
    spinImpulse: 0,
    pointerX: 0,
    pointerY: 0,
    isDragging: false,
    dragVelX: 0,
    dragVelY: 0,
    activeScaleMultiplier: 1,
  });

  const handleSelectTheme = (index: number) => {
    setThemeIdx(index);
    const chosen = KINETIC_THEMES[index];
    sceneBridgeRef.current.targetColor = new THREE.Color(chosen.knotColor);
    sceneBridgeRef.current.targetEmissive = new THREE.Color(chosen.knotEmissive);
    sceneBridgeRef.current.targetRim = new THREE.Color(chosen.rimColor);
    sceneBridgeRef.current.spinImpulse = 4.0;
  };

  const handleStackActivate = (index: number | null) => {
    setActiveStackIndex(index);
    if (index !== null) {
      sceneBridgeRef.current.spinImpulse = 2.8;
      sceneBridgeRef.current.activeScaleMultiplier = 1.08;
    } else {
      sceneBridgeRef.current.activeScaleMultiplier = 1.0;
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 650;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // --- SUNLIT STUDIO LIGHTING ---
    const ambientLight = new THREE.AmbientLight(theme.ambientLight, 2.2);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xfff7ed, 3.2);
    mainSun.position.set(6, 8, 7);
    scene.add(mainSun);

    const fillSun = new THREE.DirectionalLight(0xfef3c7, 1.4);
    fillSun.position.set(-6, -4, 5);
    scene.add(fillSun);

    const rimLight = new THREE.PointLight(theme.rimColor, 3.5, 14);
    rimLight.position.set(0, 4, 3);
    scene.add(rimLight);

    // --- SCULPTURAL KINETIC TORUS KNOT (THE TOY CENTERPIECE - NO JELLY) ---
    // A continuous, satin-smooth architectural sculpture with endless mathematical curvature
    const knotGeometry = new THREE.TorusKnotGeometry(1.5, 0.38, 160, 40, 2, 3);

    // Tactile, satin ceramic / matte polished sculpture material
    const knotMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(theme.knotColor),
      emissive: new THREE.Color(theme.knotEmissive),
      emissiveIntensity: 0.16,
      roughness: 0.22,
      metalness: 0.05,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
      reflectivity: 0.6,
      ior: 1.45,
    });

    const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
    scene.add(knotMesh);

    // --- ORBITING MAGNETIC PEBBLES (TACTILE POLISHED RIVER STONES) ---
    interface Pebble {
      mesh: THREE.Mesh;
      radius: number;
      speed: number;
      angle: number;
      orbitY: number;
      oscPhase: number;
      velY: number;
    }

    const pebbles: Pebble[] = theme.pebbleColors.map((hex, i) => {
      const stoneRadius = 0.22 + (i % 3) * 0.1;
      const geom = new THREE.SphereGeometry(stoneRadius, 32, 32);
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(hex),
        roughness: 0.18,
        clearcoat: 0.95,
        clearcoatRoughness: 0.1,
        reflectivity: 0.5,
      });
      const mesh = new THREE.Mesh(geom, mat);
      scene.add(mesh);

      return {
        mesh,
        radius: 2.7 + i * 0.35,
        speed: (0.01 + i * 0.003) * (i % 2 === 0 ? 1 : -1),
        angle: (i / theme.pebbleColors.length) * Math.PI * 2,
        orbitY: (i - 2) * 0.5,
        oscPhase: Math.random() * Math.PI * 2,
        velY: 0,
      };
    });

    // --- TOUCH, DRAG & INERTIA PHYSICS ---
    let isPointerDown = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let angularVelX = 0.004;
    let angularVelY = 0.008;
    let autoRotationX = 0;
    let autoRotationY = 0;
    const clock = new THREE.Clock();

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      sceneBridgeRef.current.pointerX = normX;
      sceneBridgeRef.current.pointerY = normY;

      if (isPointerDown) {
        const deltaX = clientX - prevPointerX;
        const deltaY = clientY - prevPointerY;

        angularVelY = deltaX * 0.009;
        angularVelX = deltaY * 0.009;

        // Scatter pebbles slightly under vigorous spin
        pebbles.forEach((p) => {
          p.velY += (Math.random() - 0.5) * 0.08;
        });
      }

      prevPointerX = clientX;
      prevPointerY = clientY;
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isPointerDown = true;
      sceneBridgeRef.current.isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevPointerX = clientX;
      prevPointerY = clientY;

      // Tap pulse
      sceneBridgeRef.current.spinImpulse = 2.2;
    };

    const onPointerUp = () => {
      isPointerDown = false;
      sceneBridgeRef.current.isDragging = false;
    };

    container.addEventListener("mousemove", onPointerMove);
    container.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mouseup", onPointerUp);
    container.addEventListener("touchmove", onPointerMove, { passive: true });
    container.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 650;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    // --- 60FPS SIMULATION LOOP ---
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth color interpolation on theme shift
      knotMaterial.color.lerp(sceneBridgeRef.current.targetColor, 0.08);
      knotMaterial.emissive.lerp(sceneBridgeRef.current.targetEmissive, 0.08);
      rimLight.color.lerp(sceneBridgeRef.current.targetRim, 0.08);

      // Kinetic momentum with soft air damping
      if (!isPointerDown) {
        angularVelX *= 0.965;
        angularVelY *= 0.965;

        // Base continuous ambient drift
        autoRotationX += 0.003;
        autoRotationY += 0.005;
      }

      // Handle spin impulse injection
      if (sceneBridgeRef.current.spinImpulse > 0) {
        angularVelY += sceneBridgeRef.current.spinImpulse * 0.015;
        sceneBridgeRef.current.spinImpulse *= 0.9;
        if (sceneBridgeRef.current.spinImpulse < 0.05) {
          sceneBridgeRef.current.spinImpulse = 0;
        }
      }

      // Apply rotations
      knotMesh.rotation.x += angularVelX + (!isPointerDown ? 0.003 : 0);
      knotMesh.rotation.y += angularVelY + (!isPointerDown ? 0.005 : 0);

      // Subtle dynamic tilt tracking mouse position smoothly
      const targetTiltZ = sceneBridgeRef.current.pointerX * 0.35;
      knotMesh.rotation.z += (targetTiltZ - knotMesh.rotation.z) * 0.05;

      // Scale breathing
      const targetScale = sceneBridgeRef.current.activeScaleMultiplier * (1 + Math.sin(time * 1.8) * 0.02);
      knotMesh.scale.set(targetScale, targetScale, targetScale);

      // Animate orbiting pebbles with spring damping
      pebbles.forEach((pebble, idx) => {
        pebble.angle += pebble.speed * (1 + Math.abs(angularVelY) * 20);
        const currentR = pebble.radius + Math.sin(time * 1.6 + idx) * 0.18;

        pebble.velY += (Math.sin(time * 2.5 + idx * 1.4) * 0.006 - pebble.velY * 0.05);
        pebble.velY *= 0.94;

        pebble.mesh.position.x = Math.cos(pebble.angle) * currentR;
        pebble.mesh.position.z = Math.sin(pebble.angle) * currentR;
        pebble.mesh.position.y = pebble.orbitY + pebble.velY;

        pebble.mesh.rotation.x += 0.01;
        pebble.mesh.rotation.y += 0.015;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onPointerMove);
      container.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mouseup", onPointerUp);
      container.removeEventListener("touchmove", onPointerMove);
      container.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchend", onPointerUp);
      renderer.dispose();
      knotGeometry.dispose();
      knotMaterial.dispose();
      pebbles.forEach((p) => {
        p.mesh.geometry.dispose();
        if (Array.isArray(p.mesh.material)) p.mesh.material.forEach((m) => m.dispose());
        else p.mesh.material.dispose();
      });
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      id="nima-hosseini"
      aria-label="Nima Hosseini - Cloud Infrastructure & Systems Architecture"
      className="relative w-full overflow-hidden transition-colors duration-1000 py-32 sm:py-44 lg:py-52 select-none"
      style={{ backgroundColor: theme.bgColor }}
    >
      <div id="story" className="absolute -top-16" />

      {/* AMBIENT ORGANIC WARM GRADIENT HALOS (NO GRIDS, NO DOT PATTERNS) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-40 -left-40 w-[700px] sm:w-[950px] h-[700px] sm:h-[950px] rounded-full opacity-55 blur-3xl transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${theme.knotColor}29 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[650px] sm:w-[900px] h-[650px] sm:h-[900px] rounded-full opacity-45 blur-3xl transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${theme.accentColor}24 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24">
        
        {/* ========================================================================= */}
        {/* 1. ASYMMETRIC MONUMENTAL EDITORIAL MANIFESTO                             */}
        {/* "You didn't notice anything. That was the job."                           */}
        {/* ========================================================================= */}
        <div className="max-w-5xl space-y-6 sm:space-y-8">
          
          <div className="flex items-center gap-3">
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: theme.accentColor }}
            />
            <span
              className="text-sm sm:text-base font-bold tracking-wider uppercase"
              style={{ color: "#4A3329" }}
            >
              The Law of Invisible Systems
            </span>
          </div>

          {/* Monumental Fluid Typography Lockup */}
          <div className="space-y-2 sm:space-y-4">
            
            {/* Fluid Italian Editorial Italic */}
            <p
              className="font-serif italic text-[clamp(2.8rem,7.8vw,8rem)] leading-[0.96] tracking-[-0.03em]"
              style={{ color: "#2B1D16" }}
            >
              You didn’t notice anything.
            </p>

            {/* Monumental Oversized Display Typography */}
            <h2
              className="font-display font-black text-[clamp(4rem,11.8vw,12.2rem)] leading-[0.86] tracking-[-0.05em] uppercase"
              style={{ color: "#1F1612" }}
            >
              <span>That was the </span>
              <span
                className="inline-block transition-transform duration-300 hover:scale-105 cursor-pointer"
                style={{ color: theme.accentColor }}
              >
                job.
              </span>
            </h2>

          </div>

          <p
            className="text-[20px] sm:text-[25px] md:text-[30px] font-medium leading-relaxed max-w-3xl"
            style={{ color: "#594034" }}
          >
            When cloud infrastructure is engineered with mathematical discipline, state never drifts, traffic shifts silently, and users experience effortless, uninterrupted continuity.
          </p>

        </div>

        {/* ========================================================================= */}
        {/* 2. THE TACTILE 3D KINETIC CENTERPIECE (NO JELLY)                          */}
        {/* Satin ceramic Torus Knot sculpture with touch physics & momentum inertia  */}
        {/* ========================================================================= */}
        <div className="my-16 sm:my-24 relative">
          
          {/* Subtle Interaction Guide & Tactile Material Swatches */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="text-sm font-semibold tracking-wide" style={{ color: "#6E5042" }}>
              Drag to spin with inertia &bull; Click to pulse &bull; Switch material:
            </div>

            {/* Material Swatches (Organic round pebble pills) */}
            <div className="flex flex-wrap items-center gap-3">
              {KINETIC_THEMES.map((t, idx) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => handleSelectTheme(idx)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                    themeIdx === idx
                      ? "bg-white shadow-[0_6px_20px_rgba(70,30,15,0.12)] scale-105"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                  style={{
                    color: themeIdx === idx ? t.accentColor : "#594034",
                  }}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full transition-transform duration-300"
                    style={{ backgroundColor: t.knotColor }}
                  />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3D WebGL Canvas Viewport (Seamlessly integrated into the section ground) */}
          <div
            ref={mountRef}
            className="w-full h-[460px] sm:h-[560px] lg:h-[660px] cursor-grab active:cursor-grabbing relative flex items-center justify-center rounded-[56px] overflow-hidden"
          >
            {/* Monumental Watermark Floating In Depth */}
            <div
              className="absolute pointer-events-none select-none text-[clamp(5rem,18vw,20rem)] font-black tracking-tighter opacity-10 transition-colors duration-700"
              style={{ color: theme.accentColor }}
            >
              EQUILIBRIUM
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. MONUMENTAL IDENTITY: NIMA HOSSEINI                                     */}
        {/* Colossal typography breaking across space                                 */}
        {/* ========================================================================= */}
        <div className="space-y-12 sm:space-y-16">
          
          <div className="space-y-4">
            
            <div
              className="text-sm sm:text-base font-bold tracking-wider uppercase"
              style={{ color: theme.accentColor }}
            >
              Systems Architect &bull; Cloud &amp; DevOps
            </div>

            {/* Monumental Nameplate */}
            <h3
              className="font-display font-black text-[clamp(4.4rem,13.5vw,14rem)] leading-[0.84] tracking-[-0.05em] uppercase"
              style={{ color: "#1F1612" }}
            >
              Nima Hosseini
            </h3>

          </div>

          {/* Editorial Philosophy Statement */}
          <div className="max-w-3xl">
            <p
              className="text-[20px] sm:text-[26px] md:text-[31px] font-medium leading-snug"
              style={{ color: "#453026" }}
            >
              Building cloud architectures from first principles - combining reproducible state, cryptographically verifiable security boundaries, and automated canary deployments across AWS and Kubernetes.
            </p>
          </div>

          {/* ======================================================================= */}
          {/* 4. SHOW MY STACK AS HUGE TYPOGRAPHY & MOVING SHAPES (NO CARD GRIDS!)     */}
          {/* ======================================================================= */}
          <div className="pt-6 space-y-6">
            
            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest" style={{ color: "#7A5A4C" }}>
              Core Stack &bull; Hover or Tap To Accelerate The Kinetic Centerpiece
            </div>

            {/* Asymmetric Fluid Kinetic Typography Flow */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {STACK_ITEMS.map((item, idx) => (
                <div
                  key={item.name}
                  onMouseEnter={() => handleStackActivate(idx)}
                  onMouseLeave={() => handleStackActivate(null)}
                  className="group relative cursor-pointer"
                >
                  <div
                    className="flex items-center gap-3 sm:gap-4 px-7 sm:px-9 py-4 sm:py-5 rounded-full transition-all duration-300 shadow-[0_4px_18px_rgba(70,30,15,0.06)] hover:shadow-[0_12px_32px_rgba(70,30,15,0.14)] hover:-translate-y-1.5 hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: activeStackIndex === idx ? theme.accentColor : "#FFFFFF",
                      color: activeStackIndex === idx ? "#FFFFFF" : "#1F1612",
                    }}
                  >
                    <span
                      className="w-3 h-3 rounded-full transition-transform duration-300 group-hover:scale-125"
                      style={{
                        backgroundColor: activeStackIndex === idx ? "#FFFFFF" : item.accent,
                      }}
                    />
                    <span className="font-display font-black text-xl sm:text-2xl md:text-3xl tracking-tight uppercase">
                      {item.name}
                    </span>
                    <span
                      className="text-xs sm:text-sm font-semibold transition-colors duration-300 hidden md:inline"
                      style={{
                        color: activeStackIndex === idx ? "rgba(255,255,255,0.85)" : "#7A5A4C",
                      }}
                    >
                      ({item.role})
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
