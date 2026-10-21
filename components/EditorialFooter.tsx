"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Copy, Check, ArrowUp, FileText, Mail, Terminal } from "lucide-react";

interface EditorialFooterProps {
  onOpenCV?: () => void;
}

/**
 * EditorialFooter - Dedicated Dark Architectural Footer for Blog & Article surfaces
 * 
 * Crafted following:
 * - design-taste-frontend: Asymmetric editorial hierarchy, anti-generic layout
 * - emilkowalski/skills: Spring-physics micro-interactions, tactile active states, motion-reduce safety
 * - impeccable: Distilled to functional essence, calibrated typography scales, micro-polished borders
 */
export function EditorialFooter({ onOpenCV }: EditorialFooterProps = {}) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const email = "wvrner@outlook.com";

  const handleCopyEmail = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(email).then(() => {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      });
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const channels = [
    { label: "GitHub", href: "https://github.com/wvrner", handle: "@wvrner" },
    { label: "LinkedIn", href: "https://linkedin.com/in/wvrner", handle: "in/wvrner" },
    { label: "Telegram", href: "https://t.me/wvrner", handle: "@wvrner" },
    { label: "WhatsApp", href: "https://wa.me/wvrner", handle: "Direct Line" },
  ];

  return (
    <footer
      aria-label="Editorial Colophon"
      className="relative bg-[#0A0A0A] text-[#EDEDED] border-t border-white/[0.08] overflow-hidden select-none"
    >
      {/* Tactile 2D surface grain matching Syscore */}
      <div
        className="absolute inset-0 grain-level-2 opacity-25 pointer-events-none z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24 pt-20 sm:pt-28 pb-12 sm:pb-16">
        
        {/* Telemetry Stage: Invariant status badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 sm:pb-10 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>US-EAST-1 &bull; DETERMINISTIC REPRODUCIBLE STATE</span>
          </div>

          <div className="text-[12px] font-mono tracking-[0.14em] uppercase text-neutral-400 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-neutral-400" />
            <span>ZERO CONFIGURATION DRIFT</span>
          </div>
        </div>

        {/* Monumental Headline & Dispatch Row (Asymmetric Stage) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 pt-12 sm:pt-16 pb-16 sm:pb-20 border-b border-white/[0.08]">
          
          {/* Main Statement */}
          <div className="lg:col-span-7 space-y-5">
            <div className="text-[11.5px] font-mono tracking-[0.26em] uppercase text-neutral-400 font-semibold">
              WVRNER &bull; ARCHITECTURAL DISPATCH
            </div>
            
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-[clamp(2.2rem,5vw,4.4rem)] font-bold tracking-[-0.04em] text-white leading-[0.98]">
              Good architecture is quiet.
              <br />
              <span className="text-neutral-400 font-medium">Great infrastructure is invisible.</span>
            </h2>

            <p className="text-[15px] sm:text-[16px] text-neutral-300 font-sans leading-relaxed max-w-[52ch] pt-2">
              Engineering declarative cloud architectures, cryptographic identity boundaries, and automated canary deployments across AWS and Kubernetes.
            </p>
          </div>

          {/* Direct Action Hub */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8 lg:pl-6">
            <div className="space-y-3">
              <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400">
                DIRECT INQUIRY &amp; CONSULTATION
              </div>
              
              {/* Tactile Email Copy Affordance (Emil Kowalski spring physics) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex-1 inline-flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-[0.98] border border-white/10 hover:border-white/20 text-[13.5px] font-mono font-medium text-white transition-all duration-200 cursor-pointer shadow-sm motion-reduce:transition-none"
                  title="Copy email to clipboard"
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-neutral-400" />
                    <span className="truncate">{email}</span>
                  </div>
                  {copiedEmail ? (
                    <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-emerald-400 font-sans font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-neutral-400 font-sans group-hover:text-white">
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </span>
                  )}
                </button>

                {onOpenCV && (
                  <button
                    type="button"
                    onClick={onOpenCV}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-[#0A0A0A] hover:bg-neutral-100 active:scale-[0.98] text-[13.5px] font-semibold transition-all duration-200 cursor-pointer shadow-sm motion-reduce:transition-none shrink-0"
                  >
                    <FileText className="w-4 h-4 text-[#0A0A0A]" />
                    <span>View CV</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Navigation Pills */}
            <div className="pt-2">
              <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400 pb-3">
                EXPLORE SURFACES
              </div>
              <div className="flex flex-wrap gap-2 text-[12.5px] font-sans">
                <Link
                  href="/"
                  className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-neutral-300 hover:text-white transition-colors"
                >
                  Portfolio Home &rarr;
                </Link>
                <Link
                  href="/#systems"
                  className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-neutral-300 hover:text-white transition-colors"
                >
                  Systems &amp; Disciplines &rarr;
                </Link>
                <Link
                  href="/#projects"
                  className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-neutral-300 hover:text-white transition-colors"
                >
                  Projects &amp; Labs &rarr;
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Distilled Channels Strip */}
        <div className="py-10 sm:py-12 border-b border-white/[0.08]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {channels.map((ch, idx) => (
              <a
                key={idx}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.15] transition-all duration-200 active:scale-[0.98] motion-reduce:transition-none"
              >
                <div className="flex items-center justify-between text-[13.5px] font-medium text-white group-hover:text-white">
                  <span>{ch.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </div>
                <div className="text-[12px] font-mono text-neutral-400 pt-1">
                  {ch.handle}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Polished Bottom Colophon Bar */}
        <div className="pt-8 sm:pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-[12px] text-neutral-400 font-sans">
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>&copy; {new Date().getFullYear()} WVRNER &bull; Nima Hosseini</span>
            <span className="hidden sm:inline text-neutral-500">&bull;</span>
            <span className="font-mono text-[11px] text-neutral-400">NEXT.JS &bull; GHOST &bull; CLOUDFLARE</span>
          </div>

          {/* Tactile Back to Top Button */}
          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:scale-[0.97] border border-white/10 hover:border-white/20 text-[11.5px] font-mono tracking-wider uppercase text-neutral-200 hover:text-white transition-all duration-200 cursor-pointer shadow-sm motion-reduce:transition-none"
            aria-label="Scroll back to top of page"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white group-hover:-translate-y-0.5 transition-transform duration-200" />
          </button>

        </div>

      </div>
    </footer>
  );
}
