"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Copy, Check, ArrowUp, Mail, FileText, ArrowLeft } from "lucide-react";
import { scrollToTarget } from "@/components/SmoothScroll";

interface EditorialFooterProps {
  onOpenCV?: () => void;
}

/**
 * EditorialFooter - Monumental Dark Architectural Footer for Blog & Article surfaces
 *
 * Designed using:
 * - /design-taste-frontend: Bold monumental typography, tactile dark stage, anti-generic layout
 * - emilkowalski/skills: Spring-physics hover lifts, tactile active presses, reduced-motion gates
 * - impeccable: Distilled interaction hubs, calibrated type roles, optical alignment
 */
export function EditorialFooter({ onOpenCV }: EditorialFooterProps = {}) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const email = "wvrner@outlook.com";

  const handleCopyEmail = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(email).then(() => {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2200);
      });
    }
  };

  const scrollToTop = () => {
    scrollToTarget(0, { duration: 1.0 });
  };

  const channels = [
    { label: "GitHub", href: "https://github.com/wvrner", detail: "wvrner" },
    { label: "LinkedIn", href: "https://linkedin.com/in/wvrner", detail: "in/wvrner" },
    { label: "Telegram", href: "https://t.me/wvrner", detail: "@wvrner" },
    { label: "WhatsApp", href: "https://wa.me/wvrner", detail: "+ Direct" },
  ];

  return (
    <footer
      aria-label="Editorial Footer"
      className="relative bg-[#0d0d0f] text-[#EDEDED] border-t border-white/[0.08] overflow-hidden select-none"
    >
      {/* Smooth soft ambient highlight for depth without pixel noise */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-white/[0.03] rounded-full blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pt-10 sm:pt-14 pb-16 sm:pb-20">
        
        {/* Top Header: Navigation and Return Affordance */}
        <div className="flex items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-white/[0.08]">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 text-[13px] font-sans font-medium text-neutral-400 hover:text-white transition-colors duration-150"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 group-hover:bg-white/[0.12] group-hover:border-white/20 transition-all duration-150 motion-reduce:transition-none">
              <ArrowLeft className="w-3.5 h-3.5 text-neutral-300 group-hover:text-white group-hover:-translate-x-0.5 transition-transform duration-150 motion-reduce:transition-none" />
            </span>
            <span>Back to portfolio</span>
          </Link>
        </div>

        {/* Center Stage: Interactive Tactile Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 py-10 sm:py-14 border-b border-white/[0.08] items-stretch">
          
          {/* Left Column: Email Console */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8 p-7 sm:p-9 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.14] transition-all duration-200">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] uppercase text-neutral-400">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>EMAIL</span>
              </div>

              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-[24px] sm:text-[30px] font-bold text-white tracking-[-0.03em] leading-tight">
                Let&rsquo;s talk.
              </h3>

              <p className="text-[14.5px] sm:text-[15px] text-neutral-400 font-sans leading-relaxed max-w-[48ch]">
                I’m looking for a junior Cloud / DevOps role. The fastest way to reach me is email or LinkedIn.
              </p>
            </div>

            {/* Interactive Action Hub */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex-1 inline-flex items-center justify-between gap-3 px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] active:scale-[0.98] border border-white/10 hover:border-white/25 text-[13px] font-mono font-medium text-white transition-all duration-150 cursor-pointer shadow-sm motion-reduce:transition-none"
                title="Click to copy email address"
              >
                <span className="truncate">{email}</span>
                {copiedEmail ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold text-emerald-400 uppercase tracking-wider">
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium text-neutral-400 uppercase tracking-wider group-hover:text-white">
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </span>
                )}
              </button>

              {onOpenCV && (
                <button
                  type="button"
                  onClick={onOpenCV}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-[#242424] hover:bg-neutral-200 active:scale-[0.98] text-[13px] font-sans font-semibold transition-all duration-150 cursor-pointer shadow-sm motion-reduce:transition-none shrink-0"
                >
                  <FileText className="w-4 h-4 text-[#242424]" />
                  <span>View CV</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Tactile Channel Keycaps */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="text-[11px] font-mono tracking-[0.22em] uppercase text-neutral-400 px-1">
              ELSEWHERE
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {channels.map((ch, idx) => (
                <a
                  key={idx}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] active:scale-[0.97] border border-white/[0.07] hover:border-white/20 transition-all duration-150 cursor-pointer motion-reduce:transition-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-white tracking-tight">
                      {ch.label}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150 motion-reduce:transition-none" />
                  </div>
                  <span className="text-[12px] font-mono text-neutral-400 pt-3">
                    {ch.detail}
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Monumental Typographic Signature (Awwwards / Architectural Scale) */}
        <div className="pt-16 sm:pt-24 pb-8 sm:pb-12 flex justify-center text-center overflow-visible px-4 sm:px-8">
          <div
            className="font-wvrner font-black text-[clamp(3.8rem,13vw,11.5rem)] leading-[0.84] select-none text-center inline-flex items-baseline justify-center overflow-visible pr-4 sm:pr-8 wv-mark wv-mark--light wv-mark--wave"
            style={{
              fontFamily: "var(--font-plus-jakarta), sans-serif",
              fontWeight: 900,
            }}
          >
            <span>W</span>
            <span className="-ml-[0.08em]">V</span>
            <span className="-ml-[0.14em]">R</span>
            <span className="-ml-[0.17em]">N</span>
            <span className="-ml-[0.18em]">E</span>
            <span className="-ml-[0.15em]">R</span>
          </div>
        </div>

        {/* Baseline Bar */}
        <div className="pt-8 sm:pt-10 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 text-[12px] font-sans text-neutral-400">
          <div>
            &copy; {new Date().getFullYear()} Nima Hosseini &bull; Cloud &amp; DevOps Engineering
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/blog"
              className="hover:text-white transition-colors"
            >
              All Writing
            </Link>

            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] active:scale-[0.97] border border-white/10 text-neutral-300 hover:text-white transition-all duration-150 cursor-pointer motion-reduce:transition-none"
              aria-label="Back to top"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider">Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white group-hover:-translate-y-0.5 transition-transform duration-150 motion-reduce:transition-none" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
