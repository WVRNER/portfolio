"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";

/**
 * StoryScrollSequence - Awwwards Site of the Day Redesign
 * Inspired by Noomo Labs (labs.noomoagency.com)
 * 
 * HARD CONSTRAINTS:
 * - DONT USE BLACK COLORS: Warm ivory ground (#FAF7F2), rich warm espresso ink (#241712)
 * - NO BOXES: No bordered rectangles, no outlined cards, no card grids, no 1px dividing lines, no status badge boxes
 * - NO MONOSPACE outside code
 * - NO FAKE LABELS, IDS, or DASHBOARD TELEMETRY
 * - NO GRID OR DOT BACKGROUND PATTERNS
 * - NO PURPLE/BLUE NEON GLOWS OR GLASSMORPHISM
 * - ZERO EM DASHES (no unicode em dashes anywhere)
 * - Tactile, interactive 3D jelly organism that feels like a toy you want to touch
 * - Stack presented as huge fluid typography and moving shapes, not cards in a grid
 */

interface JellyTheme {
  name: string;
  blobColor: string;
  blobEmissive: string;
  accentColor: string;
  bgColor: string;
  ambientLight: number;
  rimColor: number;
  particles: string[];
}

const THEMES: JellyTheme[] = [
  {
    name: "Sunlit Peach",
    blobColor: "#FF633E",
    blobEmissive: "#FF3815",
    accentColor: "#E8441F",
    bgColor: "#FAF5EE",
    ambientLight: 0xfff6ec,
    rimColor: 0xffedd5,
    particles: ["#FFA048", "#34D399", "#FB7185", "#FBBF24", "#38BDF8"],
  },
  {
    name: "Jelly Mint",
    blobColor: "#10B981",
    blobEmissive: "#059669",
    accentColor: "#047857",
    bgColor: "#F2FBF6",
    ambientLight: 0xecfdf5,
    rimColor: 0xd1fae5,
    particles: ["#34D399", "#6EE7B7", "#FBBF24", "#FF7854", "#38BDF8"],
  },
  {
    name: "Sweet Mango",
    blobColor: "#F59E0B",
    blobEmissive: "#D97706",
    accentColor: "#B45309",
    bgColor: "#FCF9EC",
    ambientLight: 0xfef9c3,
    rimColor: 0xfef08a,
    particles: ["#FBBF24", "#F472B6", "#34D399", "#FF633E", "#A78BFA"],
  },
  {
    name: "Candy Rose",
    blobColor: "#F43F5E",
    blobEmissive: "#E11D48",
    accentColor: "#BE123C",
    bgColor: "#FDF4F6",
    ambientLight: 0xffe4e6,
    rimColor: 0xfecdd3,
    particles: ["#FB7185", "#FDA4AF", "#FBBF24", "#34D399", "#FF7854"],
  },
];

const STACK_ITEMS = [
  { name: "Terraform", subtitle: "Deterministic Cloud State", accent: "#FF633E" },
  { name: "AWS Architecture", subtitle: "Resilient Multi-Region", accent: "#F59E0B" },
  { name: "Kubernetes", subtitle: "Dynamic Elastic Scaling", accent: "#3B82F6" },
  { name: "Docker", subtitle: "Immutable Containers", accent: "#0D9488" },
  { name: "GitHub OIDC", subtitle: "Keyless Cloud Auth", accent: "#EC4899" },
  { name: "Zero Downtime", subtitle: "Seamless Canaries", accent: "#10B981" },
];

export function StoryScrollSequence() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [themeIndex, setThemeIndex] = useState(0);
  const [hoveredStack, setHoveredStack] = useState<string | null>(null);
  const activeTheme = THEMES[themeIndex];

  // Dynamic state bridged to Three.js render loop
  const runtimeRef = useRef({
    targetColor: new THREE.Color(activeTheme.blobColor),
    targetEmissive: new THREE.Color(activeTheme.blobEmissive),
    triggerImpulse: 0,
    pointerNormX: 0,
    pointerNormY: 0,
    isPointerDown: false,
    dragDisplacementX: 0,
    dragDisplacementY: 0,
    hoverExcitement: 1,
  });

  const handleSelectTheme = (index: number) => {
    setThemeIndex(index);
    const chosen = THEMES[index];
    runtimeRef.current.targetColor = new THREE.Color(chosen.blobColor);
    runtimeRef.current.targetEmissive = new THREE.Color(chosen.blobEmissive);
    runtimeRef.current.triggerImpulse = 2.4;
  };

  const handleStackHover = (name: string | null) => {
    setHoveredStack(name);
    if (name) {
      runtimeRef.current.triggerImpulse = 1.6;
      runtimeRef.current.hoverExcitement = 1.8;
    } else {
      runtimeRef.current.hoverExcitement = 1.0;
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 650;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- SUNLIT STUDIO LIGHTING (WARM & ORGANIC) ---
    const ambientLight = new THREE.AmbientLight(activeTheme.ambientLight, 2.2);
    scene.add(ambientLight);

    const keySun = new THREE.DirectionalLight(0xfff7ed, 2.8);
    keySun.position.set(5, 7, 6);
    scene.add(keySun);

    const softFill = new THREE.DirectionalLight(0xfef3c7, 1.2);
    softFill.position.set(-6, -3, 4);
    scene.add(softFill);

    const rimLight = new THREE.PointLight(activeTheme.rimColor, 3.0, 15);
    rimLight.position.set(0, 5, 2);
    scene.add(rimLight);

    // --- CENTRAL SQUISHY 3D JELLY ORGANISM (NOOMO LABS STYLE) ---
    // High-tessellation sphere deformed with compound organic fluid waves
    const jellyGeometry = new THREE.SphereGeometry(1.9, 64, 64);
    const originalPositions = jellyGeometry.attributes.position.clone();

    // Tactile squishy gummy/clay physical material
    const jellyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activeTheme.blobColor),
      emissive: new THREE.Color(activeTheme.blobEmissive),
      emissiveIntensity: 0.22,
      roughness: 0.14,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.42,
      thickness: 1.6,
      ior: 1.38,
      reflectivity: 0.6,
    });

    const jellyMesh = new THREE.Mesh(jellyGeometry, jellyMaterial);
    scene.add(jellyMesh);

    // --- INNER NUCLEUS (ORGANIC GLOWING CORE) ---
    const coreGeometry = new THREE.IcosahedronGeometry(0.95, 20);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activeTheme.blobColor),
      emissive: new THREE.Color(activeTheme.blobEmissive),
      emissiveIntensity: 0.6,
      roughness: 0.3,
      transmission: 0.2,
      thickness: 0.5,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    jellyMesh.add(coreMesh);

    // --- SOFT DANCING TENDRILS (HANGING BENEATH THE ORGANISM) ---
    const tendrilCount = 7;
    const tendrils: { mesh: THREE.Mesh; phase: number; speed: number; baseAngle: number; length: number }[] = [];

    for (let i = 0; i < tendrilCount; i++) {
      const angle = (i / tendrilCount) * Math.PI * 2;
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(angle) * 0.2, -0.7, Math.sin(angle) * 0.2),
        new THREE.Vector3(Math.cos(angle) * 0.4, -1.5, Math.sin(angle) * 0.4),
        new THREE.Vector3(Math.cos(angle) * 0.15, -2.3, Math.sin(angle) * 0.15),
      ];
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeom = new THREE.TubeGeometry(curve, 28, 0.075, 12, false);
      const tubeMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(activeTheme.blobColor),
        roughness: 0.2,
        clearcoat: 0.9,
        transmission: 0.35,
        thickness: 0.6,
      });
      const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
      tubeMesh.position.set(Math.cos(angle) * 0.9, -0.9, Math.sin(angle) * 0.9);
      jellyMesh.add(tubeMesh);

      tendrils.push({
        mesh: tubeMesh,
        phase: i * 0.9,
        speed: 1.4 + (i % 3) * 0.35,
        baseAngle: angle,
        length: 2.3,
      });
    }

    // --- ORBITING SOFT GUMMY SATELLITES (PLAYFUL FLOATING CANDY SPHERES) ---
    interface BubbleSatellite {
      mesh: THREE.Mesh;
      orbitRadius: number;
      orbitSpeed: number;
      angle: number;
      orbitY: number;
      verticalPhase: number;
      bounceVelY: number;
    }

    const satellites: BubbleSatellite[] = activeTheme.particles.map((hex, i) => {
      const radius = 0.26 + (i % 3) * 0.12;
      const geom = new THREE.SphereGeometry(radius, 32, 32);
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(hex),
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.12,
        transmission: 0.3,
        thickness: 0.8,
      });
      const mesh = new THREE.Mesh(geom, mat);
      scene.add(mesh);

      return {
        mesh,
        orbitRadius: 2.7 + i * 0.38,
        orbitSpeed: (0.008 + (i * 0.003)) * (i % 2 === 0 ? 1 : -1),
        angle: (i / activeTheme.particles.length) * Math.PI * 2,
        orbitY: (i - 2) * 0.55,
        verticalPhase: Math.random() * Math.PI * 2,
        bounceVelY: 0,
      };
    });

    // --- INTERACTION & TOUCH/POINTER PHYSICS ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let impulse = 0;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragCurrentX = 0;
    let dragCurrentY = 0;
    let isDragging = false;
    const clock = new THREE.Clock();

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      runtimeRef.current.pointerNormX = mouseX;
      runtimeRef.current.pointerNormY = mouseY;

      if (isDragging) {
        dragCurrentX = clientX - dragStartX;
        dragCurrentY = clientY - dragStartY;
        targetRotationY += dragCurrentX * 0.0003;
        targetRotationX += dragCurrentY * 0.0003;
        impulse = Math.min(impulse + 0.08, 2.5);
      } else {
        targetRotationY = mouseX * 0.6;
        targetRotationX = -mouseY * 0.5;
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      runtimeRef.current.isPointerDown = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      dragStartX = clientX;
      dragStartY = clientY;
      impulse = 2.0;

      // Jiggle orbiting satellites
      satellites.forEach((s) => {
        s.bounceVelY += (Math.random() - 0.5) * 0.25;
      });
    };

    const handlePointerUp = () => {
      isDragging = false;
      runtimeRef.current.isPointerDown = false;
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mouseup", handlePointerUp);
    container.addEventListener("touchmove", handlePointerMove, { passive: true });
    container.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 650;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // --- ANIMATION / SIMULATION LOOP (60FPS+ TACTILE PHYSICS) ---
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smoothly interpolate material color on theme changes
      jellyMaterial.color.lerp(runtimeRef.current.targetColor, 0.09);
      jellyMaterial.emissive.lerp(runtimeRef.current.targetEmissive, 0.09);
      coreMaterial.color.lerp(runtimeRef.current.targetColor, 0.09);
      coreMaterial.emissive.lerp(runtimeRef.current.targetEmissive, 0.09);
      tendrils.forEach((t) => {
        (t.mesh.material as THREE.MeshPhysicalMaterial).color.lerp(runtimeRef.current.targetColor, 0.09);
      });

      // Handle triggered impulse
      if (runtimeRef.current.triggerImpulse > 0) {
        impulse = Math.max(impulse, runtimeRef.current.triggerImpulse);
        runtimeRef.current.triggerImpulse = 0;
      }

      // Smoothly dissipate impulse energy
      impulse *= 0.945;

      const excitement = runtimeRef.current.hoverExcitement;

      // Smooth rotational inertia
      jellyMesh.rotation.y += (targetRotationY - jellyMesh.rotation.y) * 0.075;
      jellyMesh.rotation.x += (targetRotationX - jellyMesh.rotation.x) * 0.075;

      // Compound Organic Wave Deformer on the Jelly Geometry
      const pos = jellyGeometry.attributes.position;
      const orig = originalPositions;
      const p = new THREE.Vector3();

      for (let i = 0; i < pos.count; i++) {
        p.fromBufferAttribute(orig, i);

        // Fluid 3D Harmonic squish waves
        const wave1 = Math.sin(p.x * 2.4 + time * 3.4 * excitement) * 0.18;
        const wave2 = Math.cos(p.y * 2.8 + time * 2.6 * excitement) * 0.15;
        const wave3 = Math.sin(p.z * 2.0 + time * 3.0 * excitement) * 0.12;

        // Interactive squish pulsation
        const squishMultiplier = 1 + Math.sin(time * 6.5 + p.y * 3.0) * (impulse * 0.28);
        const totalDisplacement = 1 + (wave1 + wave2 + wave3) * (0.8 + impulse * 1.5);

        p.multiplyScalar(totalDisplacement * squishMultiplier);
        pos.setXYZ(i, p.x, p.y, p.z);
      }
      pos.needsUpdate = true;
      jellyGeometry.computeVertexNormals();

      // Core pulsating glow
      const coreScale = 1 + Math.sin(time * 4) * 0.08 + impulse * 0.2;
      coreMesh.scale.set(coreScale, coreScale, coreScale);

      // Swimming Tendrils Motion
      tendrils.forEach((t) => {
        const sw = Math.sin(time * t.speed + t.phase) * (0.22 + impulse * 0.35);
        const cw = Math.cos(time * (t.speed * 0.8) + t.phase) * (0.22 + impulse * 0.35);
        t.mesh.rotation.z = sw;
        t.mesh.rotation.x = cw;
        const stretchY = 1 + Math.sin(time * 3.2 + t.phase) * 0.18;
        t.mesh.scale.set(1, stretchY, 1);
      });

      // Satellite Orbits & Soft Floating Physics
      satellites.forEach((sat, idx) => {
        sat.angle += sat.orbitSpeed * (1 + impulse * 0.8);
        const r = sat.orbitRadius + Math.sin(time * 1.5 + idx) * 0.2;

        // Soft elastic spring on Y axis
        sat.bounceVelY += Math.sin(time * 2.4 + idx * 1.2) * 0.007 - sat.mesh.position.y * 0.04;
        sat.bounceVelY *= 0.93;

        sat.mesh.position.x = Math.cos(sat.angle) * r;
        sat.mesh.position.z = Math.sin(sat.angle) * r;
        sat.mesh.position.y = sat.orbitY + sat.bounceVelY;

        // Toy-like subtle squash
        const squash = 1 + Math.sin(time * 3.6 + sat.verticalPhase) * 0.08;
        sat.mesh.scale.set(squash, squash, squash);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mouseup", handlePointerUp);
      container.removeEventListener("touchmove", handlePointerMove);
      container.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchend", handlePointerUp);
      renderer.dispose();
      jellyGeometry.dispose();
      jellyMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      satellites.forEach((s) => {
        s.mesh.geometry.dispose();
        if (Array.isArray(s.mesh.material)) s.mesh.material.forEach((m) => m.dispose());
        else s.mesh.material.dispose();
      });
      tendrils.forEach((t) => {
        t.mesh.geometry.dispose();
        if (Array.isArray(t.mesh.material)) t.mesh.material.forEach((m) => m.dispose());
        else t.mesh.material.dispose();
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
      className="relative w-full overflow-hidden transition-colors duration-1000 py-28 sm:py-40 lg:py-48 select-none"
      style={{ backgroundColor: activeTheme.bgColor }}
    >
      <div id="story" className="absolute -top-16" />

      {/* AMBIENT ORGANIC ATMOSPHERE (PURE GRADIENT BLOBS - NO GRIDS, NO DOT PATTERNS) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 -left-32 w-[650px] sm:w-[900px] h-[650px] sm:h-[900px] rounded-full opacity-60 blur-3xl transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${activeTheme.blobColor}33 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[600px] sm:w-[850px] h-[600px] sm:h-[850px] rounded-full opacity-50 blur-3xl transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${activeTheme.accentColor}26 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24">
        
        {/* ========================================================================= */}
        {/* 1. ASYMMETRIC SCULPTURAL MANIFESTO                                       */}
        {/* "You didn't notice anything. That was the job."                           */}
        {/* ========================================================================= */}
        <div className="max-w-5xl space-y-6 sm:space-y-8">
          
          {/* Subtle Organic Curvature Indicator (No boxes, pure soft round flow) */}
          <div className="flex items-center gap-3">
            <span
              className="w-3.5 h-3.5 rounded-full animate-pulse"
              style={{ backgroundColor: activeTheme.accentColor }}
            />
            <span
              className="text-sm sm:text-base font-semibold tracking-wide"
              style={{ color: "#54382D" }}
            >
              Silent Reliability (Invisible Infrastructure)
            </span>
          </div>

          {/* Monumental Fluid Typography Lockup */}
          <div className="space-y-3 sm:space-y-4">
            
            {/* Fluid Italian Editorial Italic */}
            <p
              className="font-serif italic text-[clamp(2.8rem,7.5vw,7.8rem)] leading-[0.98] tracking-[-0.03em]"
              style={{ color: "#3B261D" }}
            >
              You didn’t notice anything.
            </p>

            {/* Monumental Oversized Display Typography */}
            <h2
              className="font-display font-black text-[clamp(3.9rem,11.5vw,11.8rem)] leading-[0.88] tracking-[-0.05em] uppercase"
              style={{ color: "#241712" }}
            >
              <span>That was the </span>
              <span
                className="inline-block transition-transform duration-300 hover:scale-105 cursor-pointer"
                style={{ color: activeTheme.accentColor }}
              >
                job.
              </span>
            </h2>

          </div>

          <p
            className="text-[20px] sm:text-[25px] md:text-[29px] font-medium leading-relaxed max-w-3xl"
            style={{ color: "#5C4236" }}
          >
            When cloud architecture is built with disciplined precision, state never drifts, traffic transitions seamlessly, and continuous availability feels entirely natural.
          </p>

        </div>

        {/* ========================================================================= */}
        {/* 2. THE SIGNATURE 3D TACTILE TOY WORLD (Noomo Labs Inspired)               */}
        {/* Borderless, organic, full-bleed interactive 3D WebGL organism             */}
        {/* ========================================================================= */}
        <div className="my-14 sm:my-20 relative">
          
          {/* Floating Organic Tactile Mood Drops (Candy Swatches) */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="text-sm font-semibold tracking-wide" style={{ color: "#6B4F43" }}>
              Drag to stretch &bull; Click to ripple &bull; Switch toy mood:
            </div>

            {/* Organic Mood Drops */}
            <div className="flex flex-wrap items-center gap-3">
              {THEMES.map((t, idx) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => handleSelectTheme(idx)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                    themeIndex === idx
                      ? "bg-white shadow-[0_6px_20px_rgba(80,40,20,0.12)] scale-105"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                  style={{
                    color: themeIndex === idx ? t.accentColor : "#5C4236",
                  }}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full transition-transform duration-300"
                    style={{ backgroundColor: t.blobColor }}
                  />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3D WebGL Canvas Viewport (Seamlessly integrated into the section ground) */}
          <div
            ref={mountRef}
            className="w-full h-[450px] sm:h-[550px] lg:h-[650px] cursor-grab active:cursor-grabbing relative flex items-center justify-center rounded-[56px] overflow-hidden"
          >
            {/* Monumental Watermark Floating In Spatial Depth */}
            <div
              className="absolute pointer-events-none select-none text-[clamp(5rem,18vw,19rem)] font-black tracking-tighter opacity-10 transition-colors duration-700"
              style={{ color: activeTheme.accentColor }}
            >
              SILENT
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. MONUMENTAL IDENTITY: NIMA HOSSEINI                                     */}
        {/* Colossal typography breaking across space + Organic moving stack          */}
        {/* ========================================================================= */}
        <div className="space-y-10 sm:space-y-14">
          
          <div className="space-y-4">
            
            {/* Role indicator */}
            <div
              className="text-sm sm:text-base font-bold tracking-wider uppercase"
              style={{ color: activeTheme.accentColor }}
            >
              Cloud &bull; DevOps &bull; Systems Architecture
            </div>

            {/* Monumental Nameplate */}
            <h3
              className="font-display font-black text-[clamp(4.2rem,13vw,13.5rem)] leading-[0.85] tracking-[-0.05em] uppercase"
              style={{ color: "#241712" }}
            >
              Nima Hosseini
            </h3>

          </div>

          {/* Editorial Philosophy Statement */}
          <div className="max-w-3xl">
            <p
              className="text-[20px] sm:text-[26px] md:text-[30px] font-medium leading-snug"
              style={{ color: "#4A3329" }}
            >
              Architecting cloud infrastructure from first principles - combining immutable infrastructure, cryptographically verifiable auth, and statistically bounded deployment strategies.
            </p>
          </div>

          {/* ======================================================================= */}
          {/* 4. SHOW MY STACK AS HUGE TYPOGRAPHY & MOVING SHAPES (NO CARD GRIDS!)     */}
          {/* ======================================================================= */}
          <div className="pt-4">
            
            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest mb-6" style={{ color: "#785A4E" }}>
              Core Disciplines &amp; Toolchain (Hover to jiggle the 3D toy)
            </div>

            {/* Organic Fluid Flow of Massive Typography Shapes */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {STACK_ITEMS.map((item) => (
                <div
                  key={item.name}
                  onMouseEnter={() => handleStackHover(item.name)}
                  onMouseLeave={() => handleStackHover(null)}
                  className="group relative cursor-pointer"
                >
                  <div
                    className="flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all duration-300 shadow-[0_4px_16px_rgba(80,40,20,0.06)] hover:shadow-[0_12px_28px_rgba(80,40,20,0.12)] hover:-translate-y-1 hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: hoveredStack === item.name ? activeTheme.accentColor : "#FFFFFF",
                      color: hoveredStack === item.name ? "#FFFFFF" : "#241712",
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full transition-transform duration-300 group-hover:scale-125"
                      style={{
                        backgroundColor: hoveredStack === item.name ? "#FFFFFF" : item.accent,
                      }}
                    />
                    <span className="font-display font-black text-lg sm:text-2xl md:text-3xl tracking-tight">
                      {item.name}
                    </span>
                    <span
                      className="text-xs sm:text-sm font-medium transition-colors duration-300"
                      style={{
                        color: hoveredStack === item.name ? "rgba(255,255,255,0.85)" : "#785A4E",
                      }}
                    >
                      ({item.subtitle})
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
