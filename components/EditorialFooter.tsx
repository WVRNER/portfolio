"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Copy, Check, ArrowUp, FileText, Mail } from "lucide-react";

interface EditorialFooterProps {
  onOpenCV?: () => void;
}

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

  return (
    <footer
      aria-label="Editorial Colophon and Navigation"
      className="relative bg-[#0A0A0A] text-[#EDEDED] border-t border-white/10 overflow-hidden select-none"
    >
      {/* Printed tactile surface grain matching Syscore */}
      <div
        className="absolute inset-0 grain-level-2 opacity-30 pointer-events-none z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12 md:px-16 lg:px-24 py-16 sm:py-24">
        {/* Top Operational Status Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 sm:pb-16 border-b border-white/10">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-mono tracking-widest uppercase text-white/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYSTEMS OPERATIONAL &bull; DETERMINISTIC ARCHITECTURE</span>
            </div>

            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-[clamp(2rem,4.5vw,3.6rem)] font-extrabold tracking-[-0.035em] text-white leading-[1.05]">
              Good architecture is quiet.
              <br />
              <span className="text-white/60">Great infrastructure is invisible.</span>
            </h2>
          </div>

          {/* Quick Actions (Direct Email Copy + View CV) */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-[13px] font-medium text-white transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Copy direct email address"
            >
              <Mail className="w-3.5 h-3.5 text-white/70" />
              <span>{copiedEmail ? "Email copied" : email}</span>
              {copiedEmail ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-white/50" />
              )}
            </button>

            {onOpenCV && (
              <button
                type="button"
                onClick={onOpenCV}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0A0A0A] hover:bg-white/90 text-[13px] font-semibold transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <FileText className="w-3.5 h-3.5 text-[#0A0A0A]" />
                <span>View CV</span>
              </button>
            )}
          </div>
        </div>

        {/* Multi-Column Engineering Index */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 py-12 sm:py-16 border-b border-white/10 text-[13.5px]">
          {/* Identity Column */}
          <div className="col-span-2 md:col-span-1 space-y-3 font-sans">
            <div className="text-[11.5px] font-mono uppercase tracking-[0.22em] text-white/50">
              IDENTITY
            </div>
            <div className="font-semibold text-white text-[15px]">
              Nima Hosseini
            </div>
            <p className="text-white/60 text-[13px] leading-relaxed pr-4">
              Cloud and DevOps Engineer specializing in reproducible state, container orchestration, and automated verification across AWS.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="space-y-3">
            <div className="text-[11.5px] font-mono uppercase tracking-[0.22em] text-white/50">
              NAVIGATION
            </div>
            <ul className="space-y-2.5 font-sans">
              <li>
                <Link
                  href="/"
                  className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Portfolio Home</span>
                  <span className="text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all text-[11px]">
                    &rarr;
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#systems"
                  className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Systems &amp; Syscore</span>
                  <span className="text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all text-[11px]">
                    &rarr;
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#projects"
                  className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Projects &amp; Labs</span>
                  <span className="text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all text-[11px]">
                    &rarr;
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>All Stories &amp; Notes</span>
                  <span className="text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all text-[11px]">
                    &rarr;
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Channels Column */}
          <div className="space-y-3">
            <div className="text-[11.5px] font-mono uppercase tracking-[0.22em] text-white/50">
              CHANNELS
            </div>
            <ul className="space-y-2.5 font-sans">
              <li>
                <a
                  href="https://github.com/wvrner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/wvrner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/wvrner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Telegram</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/wvrner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </li>
            </ul>
          </div>

          {/* Invariants Column */}
          <div className="space-y-3 font-mono">
            <div className="text-[11.5px] uppercase tracking-[0.22em] text-white/50">
              INVARIANTS
            </div>
            <ul className="space-y-2 text-[12px] text-white/60">
              <li>01 / DETERMINISTIC IAC</li>
              <li>02 / EPHEMERAL STACKS</li>
              <li>03 / STATISTICAL CANARIES</li>
              <li>04 / KEYLESS OIDC IAM</li>
            </ul>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-8 sm:pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-white/50 font-sans">
          <div>
            &copy; {new Date().getFullYear()} WVRNER &bull; Nima Hosseini. All rights reserved.
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>NEXT.JS &bull; GHOST &bull; CLOUDFLARE</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors cursor-pointer group"
              aria-label="Scroll back to top"
            >
              <span>TOP</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
