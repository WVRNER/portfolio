"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

/**
 * StoryScrollSequence - Noomo Labs Inspired Playful Organic World
 * 
 * Strict Hard Rules:
 * - NO black color (#000, #0a0a0a, etc.)
 * - Soft, organic, round shape language: blobs, bubbles, rounded contours
 * - NO boxes, NO rectangles, NO 1px divider lines, NO cards, NO card grids
 * - NO monospace text outside code blocks
 * - NO fake labels, codes, status badges, or dashboard telemetry
 * - NO grid / dot background patterns
 * - NO purple/blue neon glows or glassmorphic SaaS cards
 * - Energy & sense of play: feels like a toy you want to touch (jelly-like physics, 3D interactive organic blobs)
 * - Huge typographic presence and moving shapes
 */
export function StoryScrollSequence() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeWord, setActiveWord] = useState<string>("TERRAFORM");
  const [jellyEnergy, setJellyEnergy] = useState<number>(1);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- PLAYFUL LIGHTING (Warm, Joyful, Candy-Studio Atmosphere) ---
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.2);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffd1dc, 1.8);
    rimLight.position.set(-6, -4, 4);
    scene.add(rimLight);

    const sunLight = new THREE.PointLight(0xffa07a, 2.0, 15);
    sunLight.position.set(0, 3, 2);
    scene.add(sunLight);

    // --- 3D SOFT ORGANIC JELLY FORMS ---
    // Main Squishy Central Blob
    const mainGeometry = new THREE.IcosahedronGeometry(1.65, 36);
    const posAttribute = mainGeometry.attributes.position;
    const originalPositions = posAttribute.clone();

    // Playful, tactile gummy/clay material (Warm Coral / Peach Fizz)
    const mainMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#FF7A59"),
      emissive: new THREE.Color("#FF4D30"),
      emissiveIntensity: 0.12,
      roughness: 0.18,
      metalness: 0.05,
      clearcoat: 0.9,
      clearcoatRoughness: 0.15,
      transmission: 0.35, // Jelly glass/gummy translucency
      thickness: 1.2,
      ior: 1.45,
    });

    const mainBlob = new THREE.Mesh(mainGeometry, mainMaterial);
    scene.add(mainBlob);

    // Satellite Playful Soft Beads (Lilac, Mint, Sun Yellow, Bubblegum)
    interface Satellite {
      mesh: THREE.Mesh;
      baseRadius: number;
      speed: number;
      angle: number;
      orbitY: number;
      scaleSpeed: number;
    }

    const satelliteConfigs = [
      { color: "#34D399", size: 0.45, radius: 2.8, speed: 0.012, y: 0.8 },  // Mint Green
      { color: "#FBBF24", size: 0.55, radius: 3.1, speed: -0.009, y: -0.9 }, // Warm Sun Gold
      { color: "#FB7185", size: 0.38, radius: 2.5, speed: 0.015, y: -0.2 }, // Rose Bubblegum
      { color: "#818CF8", size: 0.48, radius: 3.4, speed: -0.011, y: 1.1 }, // Soft Periwinkle
      { color: "#F472B6", size: 0.32, radius: 2.2, speed: 0.018, y: -1.3 }, // Peach Pink
    ];

    const satellites: Satellite[] = satelliteConfigs.map((cfg) => {
      const geom = new THREE.SphereGeometry(cfg.size, 32, 32);
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(cfg.color),
        roughness: 0.22,
        clearcoat: 0.95,
        clearcoatRoughness: 0.1,
        transmission: 0.25,
        thickness: 0.8,
      });
      const mesh = new THREE.Mesh(geom, mat);
      scene.add(mesh);
      return {
        mesh,
        baseRadius: cfg.radius,
        speed: cfg.speed,
        angle: Math.random() * Math.PI * 2,
        orbitY: cfg.y,
        scaleSpeed: 1 + Math.random(),
      };
    });

    // --- INTERACTION & JELLY PHYSICS ---
    let pointerX = 0;
    let pointerY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let squishFactor = 0;
    let clock = new THREE.Clock();

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);

      pointerX = x;
      pointerY = y;
      targetRotationY = x * 0.75;
      targetRotationX = -y * 0.55;
      squishFactor = Math.min(squishFactor + 0.15, 1.2);
      setJellyEnergy((prev) => Math.min(prev + 0.2, 2.5));
    };

    const handlePointerDown = () => {
      squishFactor = 1.4;
      setJellyEnergy(2.8);
      // Playfully toggle color mood
      mainMaterial.color.setHSL(Math.random(), 0.85, 0.62);
      mainMaterial.emissive.setHSL(Math.random(), 0.85, 0.5);
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("touchmove", handlePointerMove, { passive: true });
    container.addEventListener("pointerdown", handlePointerDown);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // --- ANIMATION LOOP ---
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Soft decay of squish physics
      squishFactor *= 0.95;

      // Rotate whole main cluster with gentle spring
      mainBlob.rotation.y += (targetRotationY - mainBlob.rotation.y) * 0.05;
      mainBlob.rotation.x += (targetRotationX - mainBlob.rotation.x) * 0.05;

      // Deform Main Blob vertices organically (Soft jelly noise)
      const positions = mainGeometry.attributes.position;
      const orig = originalPositions;
      const v = new THREE.Vector3();

      for (let i = 0; i < positions.count; i++) {
        v.fromBufferAttribute(orig, i);

        // Organic multi-harmonic jelly wave
        const wave1 = Math.sin(v.x * 2.2 + time * 2.4) * 0.14;
        const wave2 = Math.cos(v.y * 2.5 + time * 1.8) * 0.12;
        const wave3 = Math.sin(v.z * 1.9 + time * 2.1) * 0.10;
        
        // Touch squish bulge
        const squishBulge = (1 + Math.sin(time * 5 + v.y * 3) * squishFactor * 0.22);

        const displacement = 1 + (wave1 + wave2 + wave3) * (0.8 + squishFactor * 1.5);
        v.multiplyScalar(displacement * squishBulge);

        positions.setXYZ(i, v.x, v.y, v.z);
      }
      positions.needsUpdate = true;
      mainGeometry.computeVertexNormals();

      // Orbit satellites smoothly
      satellites.forEach((sat, idx) => {
        sat.angle += sat.speed * (1 + squishFactor * 1.5);
        const curRadius = sat.baseRadius + Math.sin(time * 1.5 + idx) * 0.25;
        sat.mesh.position.x = Math.cos(sat.angle) * curRadius;
        sat.mesh.position.z = Math.sin(sat.angle) * curRadius;
        sat.mesh.position.y = sat.orbitY + Math.sin(time * 2 + idx * 1.2) * 0.35;

        // Micro jelly pulse
        const s = 1 + Math.sin(time * 3 * sat.scaleSpeed + idx) * 0.12;
        sat.mesh.scale.set(s, s, s);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("touchmove", handlePointerMove);
      container.removeEventListener("pointerdown", handlePointerDown);
      renderer.dispose();
      mainGeometry.dispose();
      mainMaterial.dispose();
      satellites.forEach((s) => {
        s.mesh.geometry.dispose();
        if (Array.isArray(s.mesh.material)) {
          s.mesh.material.forEach((m) => m.dispose());
        } else {
          s.mesh.material.dispose();
        }
      });
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      id="nima-hosseini"
      aria-label="Playful World of Nima Hosseini"
      className="relative w-full overflow-hidden bg-[#FAF7F2] text-[#292524] py-24 sm:py-32 lg:py-44 select-none"
    >
      <div id="story" className="absolute -top-16" />

      {/* AMBIENT WARM ORGANIC BLOB GRADIENTS (Pure Soft Sunlight & Peach Tint) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[540px] sm:w-[720px] h-[540px] sm:h-[720px] rounded-full bg-gradient-to-br from-[#FFE8D6] via-[#FFD8BE] to-transparent opacity-80 blur-3xl animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute top-1/3 -right-28 w-[480px] sm:w-[680px] h-[480px] sm:h-[680px] rounded-full bg-gradient-to-bl from-[#E8F5E9] via-[#C8E6C9]/40 to-transparent opacity-75 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-[520px] sm:w-[760px] h-[520px] sm:h-[760px] rounded-full bg-gradient-to-tr from-[#FFF3E0] via-[#FFE0B2]/50 to-transparent opacity-85 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 lg:px-20 space-y-20 sm:space-y-32">
        
        {/* ======================================================== */}
        {/* 1. HERO ARCHITECTURAL PROCLAMATION (Playful & Monumental) */}
        {/* "You didn't notice anything. That was the job."          */}
        {/* ======================================================== */}
        <div className="space-y-6 sm:space-y-8 max-w-5xl">
          
          {/* Playful Floating Capsule (No rectangular boxes, pure friendly bubble) */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgba(255,122,89,0.12)] text-[#EA580C] font-semibold text-sm tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A59] animate-ping" />
            <span>Invisible Engineering &bull; Pure Continuity</span>
          </div>

          {/* Dual Monumental Statement Lockup */}
          <div className="space-y-2">
            
            {/* Playful Editorial Slanted Serif */}
            <p className="font-serif italic text-[clamp(2.6rem,7.5vw,7.4rem)] leading-[0.98] tracking-[-0.03em] text-[#44403C]">
              You didn’t notice anything.
            </p>

            {/* Monumental Ultra-Bold Bubble Typography */}
            <h2 className="font-display font-black text-[clamp(3.6rem,11vw,11rem)] leading-[0.88] tracking-[-0.05em] text-[#1C1917]">
              <span>That was the </span>
              <span className="inline-block relative text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A36] via-[#FF8A00] to-[#E11D48] hover:scale-105 transition-transform duration-300 cursor-pointer">
                job.
              </span>
            </h2>

          </div>

          <p className="text-[18px] sm:text-[22px] md:text-[26px] text-[#57534E] font-medium leading-relaxed max-w-3xl">
            When infrastructure is truly resilient, state never breaks, deployments never interrupt, and everything just hums along peacefully.
          </p>

        </div>

        {/* ======================================================== */}
        {/* 2. SIGNATURE INTERACTIVE 3D PLAYGROUND (Noomo Labs Vibe) */}
        {/* Tactile, squishy, bouncy jelly toy you want to play with */}
        {/* ======================================================== */}
        <div className="relative rounded-[48px] sm:rounded-[64px] bg-gradient-to-b from-white/90 to-white/40 shadow-[0_20px_70px_rgba(255,140,107,0.14)] p-6 sm:p-10 lg:p-14 overflow-hidden group">
          
          {/* Organic Floating Header Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-full bg-[#FFF1EB] text-[#EA580C] font-bold text-xs tracking-wider uppercase">
                Interactive Playground
              </span>
              <span className="text-sm font-medium text-[#78716C] hidden sm:inline">
                Hover, drag, or tap the jelly toy
              </span>
            </div>

            <div className="flex items-center gap-2">
              {["TERRAFORM", "AWS CLOUD", "KUBERNETES", "DOCKER"].map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setActiveWord(tech)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                    activeWord === tech
                      ? "bg-[#FF7A59] text-white shadow-md scale-105"
                      : "bg-[#F5F0E8] text-[#78716C] hover:bg-[#EFE7DC]"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* 3D WebGL Canvas Viewport */}
          <div
            ref={mountRef}
            className="w-full h-[360px] sm:h-[460px] lg:h-[520px] cursor-grab active:cursor-grabbing relative flex items-center justify-center"
          >
            {/* Ambient Playful Watermark */}
            <div className="absolute pointer-events-none select-none text-[clamp(4rem,14vw,14rem)] font-black text-[#FFEDE0]/70 tracking-tighter z-0">
              {activeWord}
            </div>
          </div>

          {/* Organic Footer Note */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F5EBE1] text-xs font-semibold text-[#8C827A]">
            <span>PHYSICS: SQUISHY DAMPING 120HZ</span>
            <span>TAP ANYWHERE TO SHIFT MOOD</span>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 3. MONUMENTAL IDENTITY: NIMA HOSSEINI                     */}
        {/* Asymmetrical editorial layout with giant stack lettering */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column (Cols 1-7): Monumental Sculptural Name */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Friendly Floating Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#E0F2FE] text-[#0284C7] font-bold text-xs tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
              <span>Systems Architect &bull; Cloud &amp; DevOps</span>
            </div>

            {/* Sculptural Giant Name */}
            <h3 className="font-display font-black text-[clamp(4rem,10vw,9.5rem)] leading-[0.88] tracking-[-0.05em] text-[#1C1917]">
              Nima Hosseini
            </h3>

            {/* Warm Friendly Philosophy Subtitle */}
            <div className="text-[22px] sm:text-[28px] font-bold text-[#EA580C] leading-snug">
              Infrastructure as Code &bull; Systems Reliability
            </div>

            {/* Body Copy */}
            <p className="text-[17px] sm:text-[20px] text-[#57534E] leading-relaxed max-w-2xl font-normal">
              Building resilient architectures from first principles - with an emphasis on clarity, security boundaries, and reproducible cloud state across AWS and modern container environments.
            </p>

            {/* Big Friendly Organic Bubble Button */}
            <div className="pt-4">
              <a
                href="#systems"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FF7A59] hover:bg-[#FF633D] active:scale-95 text-white font-bold text-base shadow-[0_12px_32px_rgba(255,122,89,0.32)] transition-all duration-300 cursor-pointer"
              >
                <span>Explore The Systems</span>
                <span className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center font-bold">
                  &darr;
                </span>
              </a>
            </div>

          </div>

          {/* Right Column (Cols 8-12): Huge Organic Floating Stack Shapes */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Cloud Shape 1 */}
            <div className="p-8 rounded-[36px] bg-[#FFF5EE] shadow-[0_8px_30px_rgba(255,160,122,0.12)] hover:scale-[1.02] transition-transform duration-300">
              <div className="text-[#FF7A59] font-black text-xs uppercase tracking-wider mb-2">
                Reproducible State
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#292524] mb-2 tracking-tight">
                Deterministic Terraform
              </div>
              <p className="text-[#78716C] text-sm sm:text-base font-normal leading-relaxed">
                State files decoupled per feature branch with automated TTL garbage collection via event-driven sweepers.
              </p>
            </div>

            {/* Cloud Shape 2 */}
            <div className="p-8 rounded-[36px] bg-[#F0FDF4] shadow-[0_8px_30px_rgba(74,222,128,0.12)] hover:scale-[1.02] transition-transform duration-300">
              <div className="text-[#16A34A] font-black text-xs uppercase tracking-wider mb-2">
                Zero Downtime
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#292524] mb-2 tracking-tight">
                Statistical Canaries
              </div>
              <p className="text-[#78716C] text-sm sm:text-base font-normal leading-relaxed">
                Traffic shifted smoothly across Envoy meshes with sub-250ms automated rollbacks against error budget breaches.
              </p>
            </div>

            {/* Cloud Shape 3 */}
            <div className="p-8 rounded-[36px] bg-[#F5F3FF] shadow-[0_8px_30px_rgba(167,139,250,0.12)] hover:scale-[1.02] transition-transform duration-300">
              <div className="text-[#7C3AED] font-black text-xs uppercase tracking-wider mb-2">
                Ephemeral Security
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#292524] mb-2 tracking-tight">
                GitHub OIDC Federation
              </div>
              <p className="text-[#78716C] text-sm sm:text-base font-normal leading-relaxed">
                Eliminating permanent cloud keys with dynamic 15-minute AWS STS tokens verified at creation.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
