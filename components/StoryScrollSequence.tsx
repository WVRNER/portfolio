"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Terminal, Shield, Zap, Sparkles, Activity } from "lucide-react";

/**
 * EditorialStatement / StoryScrollSequence
 * Awwwards Site of the Day Grade Architectural Installation
 * 
 * Concept: "The Architecture of Invisibility"
 * - Features the dual manifesto: "You didn't notice anything. That was the job."
 * - Features the foundational identity: Nima Hosseini, Systems Architect
 * - Signature Interactive Artifact: An interactive self-healing zero-latency waveform canvas
 * - Codified Engineering Invariants: Real distributed infrastructure telemetry
 */
export function StoryScrollSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [telemetryState, setTelemetryState] = useState({
    latency: "0.14ms",
    packets: "100%",
    status: "HEALTHY",
  });

  // Self-Healing Telemetry Waveform Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 800);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 200);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    window.addEventListener("resize", handleResize);

    // Wave state variables
    let phase = 0;
    let perturbation = 0;
    let targetPerturbation = 0;
    let mouseX = -1000;
    let mouseY = -1000;
    let isHovered = false;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      mouseX = (clientX - rect.left) * window.devicePixelRatio;
      mouseY = (clientY - rect.top) * window.devicePixelRatio;
      targetPerturbation = Math.min(1.0, targetPerturbation + 0.35);
      isHovered = true;

      // Update telemetry reading dynamically
      setTelemetryState({
        latency: (0.12 + Math.random() * 0.08).toFixed(2) + "ms",
        packets: "100.0%",
        status: "SELF-HEALING",
      });
    };

    const handlePointerLeave = () => {
      isHovered = false;
      setTimeout(() => {
        setTelemetryState({
          latency: "0.14ms",
          packets: "100%",
          status: "NOMINAL",
        });
      }, 600);
    };

    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("mouseleave", handlePointerLeave);
    canvas.addEventListener("touchstart", handlePointerMove, { passive: true });
    canvas.addEventListener("touchend", handlePointerLeave);

    const render = () => {
      phase += 0.028;
      // Spring decay towards 0 (self-healing physics)
      targetPerturbation *= 0.94;
      perturbation += (targetPerturbation - perturbation) * 0.15;

      ctx.clearRect(0, 0, width, height);

      const centerY = height * 0.5;
      const points = 120;
      const step = width / (points - 1);

      // 1. Draw Background Laser Horizon Line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Draw Interactive Harmonic Waveform
      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const x = i * step;
        
        // Base rhythmic breath
        const baseWave = Math.sin(phase + (i / points) * Math.PI * 4) * (height * 0.06);
        const microHarmonic = Math.cos(phase * 1.8 + (i / points) * Math.PI * 8) * (height * 0.025);

        // Mouse perturbation influence
        let mouseInfluence = 0;
        if (isHovered) {
          const dist = Math.abs(x - mouseX);
          if (dist < width * 0.35) {
            const bell = Math.cos((dist / (width * 0.35)) * (Math.PI / 2));
            mouseInfluence = Math.sin((phase * 4) + (dist * 0.02)) * (height * 0.28) * bell * perturbation;
          }
        }

        const y = centerY + baseWave + microHarmonic + mouseInfluence;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Gradient Stroke: Electric Cyan to Signal Amber to Indigo
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0.0, "rgba(56, 189, 248, 0.85)"); // Cyan
      gradient.addColorStop(0.4, "rgba(249, 115, 22, 0.95)");  // Signal Amber
      gradient.addColorStop(0.7, "rgba(244, 63, 94, 0.90)");   // Rose
      gradient.addColorStop(1.0, "rgba(129, 140, 248, 0.85)"); // Violet

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5 * window.devicePixelRatio;
      ctx.shadowColor = "rgba(249, 115, 22, 0.4)";
      ctx.shadowBlur = 12 * window.devicePixelRatio;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 3. Draw active particle pulse node along the wave
      const pulseIndex = Math.floor(((Math.sin(phase * 0.7) + 1) / 2) * (points - 1));
      const pulseX = pulseIndex * step;
      const pulseY = centerY + Math.sin(phase + (pulseIndex / points) * Math.PI * 4) * (height * 0.06);

      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
      ctx.shadowBlur = 16 * window.devicePixelRatio;
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 3.5 * window.devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handlePointerMove);
      canvas.removeEventListener("mouseleave", handlePointerLeave);
      canvas.removeEventListener("touchstart", handlePointerMove);
      canvas.removeEventListener("touchend", handlePointerLeave);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="nima-hosseini"
      aria-label="The Architecture of Invisibility"
      className="relative w-full bg-[#070709] text-[#F3F4F6] py-24 sm:py-32 lg:py-40 border-t border-white/[0.08] overflow-hidden"
    >
      <div id="story" className="absolute -top-16" />

      {/* ======================================================== */}
      {/* 1. ATMOSPHERIC OPTICAL ILLUMINATION & TACTILE GRAIN      */}
      {/* ======================================================== */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Subtle Top-Right Amber Phosphor Flare */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-500/12 via-orange-600/8 to-transparent blur-[120px]" />
        
        {/* Deep Bottom-Left Cobalt Aura */}
        <div className="absolute -bottom-40 -left-40 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-indigo-600/12 via-cyan-500/8 to-transparent blur-[130px]" />
        
        {/* Center Subsurface Radiation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-violet-600/6 via-amber-500/6 to-rose-600/6 blur-[140px]" />

        {/* Precision Fine Architectural Hairline Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto px-6 sm:px-12 md:px-16 lg:px-20 space-y-20 sm:space-y-28">

        {/* ======================================================== */}
        {/* 2. THE DUAL MANIFESTO TIER (Awwwards Monumental Scale)   */}
        {/* "You didn't notice anything. That was the job."          */}
        {/* ======================================================== */}
        <div className="space-y-6 sm:space-y-8">
          
          {/* Header Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/[0.08] text-[11px] font-mono tracking-[0.22em] uppercase text-white/50">
            <div className="inline-flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-white/80">PRINCIPLE 001 // THE INVISIBLE RUNTIME</span>
            </div>

            <div className="flex items-center gap-4 text-white/40">
              <span className="hidden sm:inline">STATE: DETERMINISTIC</span>
              <span>&bull;</span>
              <span className="text-emerald-400 font-semibold">99.999% STEADY STATE</span>
            </div>
          </div>

          {/* Monumental Dual Typographic Inscription */}
          <div className="space-y-2 sm:space-y-3">
            
            {/* Line 1: Italian Editorial Serif Italic */}
            <p className="font-serif italic font-normal text-[clamp(2.4rem,6.8vw,6.8rem)] leading-[1.0] tracking-[-0.03em] text-white/85 select-none">
              You didn’t notice anything.
            </p>

            {/* Line 2: Heavy Architectural Sans with High-Octane Gradient Glow */}
            <h2 className="font-display font-black text-[clamp(3.2rem,9.6vw,9.8rem)] leading-[0.88] tracking-[-0.045em] uppercase text-white select-none">
              <span>That was the </span>
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FF5500] via-[#FF2A6D] to-[#9900FF] drop-shadow-[0_4px_30px_rgba(255,85,0,0.35)]">
                job.
              </span>
            </h2>

          </div>

          <p className="max-w-2xl text-[15px] sm:text-[17px] text-white/60 font-normal leading-relaxed">
            When distributed systems are built with ruthless discipline, failure modes are intercepted, isolated, and self-healed before latency spikes. The hallmark of cloud mastery is complete silence.
          </p>

        </div>

        {/* ======================================================== */}
        {/* 3. SIGNATURE MOMENT: THE SELF-HEALING WAVEFORM CANVAS    */}
        {/* Real-time interactive latency horizon with live feedback */}
        {/* ======================================================== */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md overflow-hidden group">
          
          {/* Top Canvas Telemetry Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-3 border-b border-white/[0.06] text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/25 text-amber-400 font-semibold tracking-wider text-[11px]">
                TELEMETRY MESH
              </span>
              <span className="text-white/60 hidden sm:inline">
                Interactive Latency Horizon &bull; Hover or touch to inject chaos
              </span>
            </div>

            <div className="flex items-center gap-3.5 text-white/70">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>P99: <strong className="text-white font-mono">{telemetryState.latency}</strong></span>
              </div>
              <span className="text-white/20">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-semibold">{telemetryState.status}</span>
              </div>
            </div>
          </div>

          {/* Interactive Canvas Plane */}
          <div className="relative w-full h-[140px] sm:h-[180px] cursor-crosshair">
            <canvas
              ref={canvasRef}
              className="w-full h-full block"
            />
          </div>

          {/* Bottom Canvas Caption */}
          <div className="flex items-center justify-between pt-3 text-[11px] font-mono text-white/40 border-t border-white/[0.04]">
            <span>AWS MULTI-REGION SYNCHRONIZATION</span>
            <span>AUTO-DAMPING: 180ms SELF-HEALING</span>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 4. THE IDENTITY & ARCHITECTURAL FOUNDATION               */}
        {/* "Nima Hosseini" // Systems Architect & Cloud Infrastructure*/}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pt-6">
          
          {/* Left Column (Cols 1-7): Monumental Identity Nameplate */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-mono tracking-wider uppercase text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SYSTEMS ARCHITECT &bull; CLOUD &amp; DEVOPS</span>
            </div>

            {/* Monumental Name */}
            <h3 className="font-display text-[clamp(3.4rem,7.5vw,6.4rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-white uppercase select-none">
              Nima Hosseini
            </h3>

            {/* Subtitle & Focus */}
            <div className="text-[20px] sm:text-[24px] font-medium tracking-tight text-white/90 flex flex-wrap items-center gap-2.5">
              <span className="text-amber-400">Infrastructure as Code</span>
              <span className="text-white/30">&bull;</span>
              <span className="text-cyan-400">Systems Reliability</span>
            </div>

            {/* Core Narrative */}
            <p className="text-[15px] sm:text-[17px] text-white/70 leading-relaxed max-w-[56ch] font-normal">
              Building resilient architectures from first principles - with an emphasis on clarity, security boundaries, and reproducible cloud state across AWS and modern container environments.
            </p>

            {/* Direct Action Link */}
            <div className="pt-2">
              <Link
                href="#systems"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-[#0A0A0A] hover:bg-[#EAEAEA] active:scale-95 transition-all duration-200 text-[13.5px] font-semibold tracking-tight shadow-[0_0_25px_rgba(255,255,255,0.15)] cursor-pointer group"
              >
                <span>Inspect Operational Systems</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

          </div>

          {/* Right Column (Cols 8-12): Codified Architectural Invariants */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Invariant 1: Terraform & Multi-Region */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-500/40 transition-colors group">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-widest mb-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>01 / REPRODUCIBLE STATE</span>
              </div>
              <h4 className="text-[15px] font-semibold text-white mb-1.5">
                Deterministic Terraform Topology
              </h4>
              <p className="text-[13px] text-white/60 leading-relaxed">
                State files isolated per feature branch with automated TTL garbage collection via event-driven sweepers. Zero configuration drift.
              </p>
            </div>

            {/* Invariant 2: Istio Canary Delivery */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/40 transition-colors group">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>02 / ZERO DOWNTIME CANARIES</span>
              </div>
              <h4 className="text-[15px] font-semibold text-white mb-1.5">
                Envoy Multi-Cluster Traffic Splitting
              </h4>
              <p className="text-[13px] text-white/60 leading-relaxed">
                Automated 5% traffic weight increments evaluated against Mann-Whitney U error budgets. Sub-250ms automated rollback.
              </p>
            </div>

            {/* Invariant 3: Ephemeral Security */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-rose-500/40 transition-colors group">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono uppercase tracking-widest mb-2">
                <Shield className="w-4 h-4 text-rose-400" />
                <span>03 / CRYPTOGRAPHIC BOUNDARIES</span>
              </div>
              <h4 className="text-[15px] font-semibold text-white mb-1.5">
                Zero Static AWS Secrets
              </h4>
              <p className="text-[13px] text-white/60 leading-relaxed">
                GitHub Actions federated OIDC authenticating directly to AWS STS with 15-minute maximum session expiry.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
