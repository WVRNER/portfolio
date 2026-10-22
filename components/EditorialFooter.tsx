"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Copy, Check, ArrowUp, Mail, FileText } from "lucide-react";

interface EditorialFooterProps {
  onOpenCV?: () => void;
}

/**
 * EditorialFooter - Dedicated Dark Footer for Blog surfaces
 * 
 * Implements:
 * - design-taste-frontend: Anti-slop editorial layout, zero middle-dot spam, zero fake telemetry
 * - emilkowalski/skills: Tactile spring active states, subtle hover physics, motion-reduce safety
 * - impeccable: Distilled to genuine reader intent, calibrated typographic roles, micro-polished alignment
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

  return (
    <footer
      aria-label="Editorial Footer"
      className="relative bg-[#0A0A0A] text-[#EDEDED] border-t border-white/[0.08] select-none"
    >
      <div className="max-w-[1120px] mx-auto px-6 sm:px-8 md:px-10 pt-20 sm:pt-24 pb-14 sm:pb-16">
        {/* Main Editorial Block */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 pb-16 border-b border-white/[0.08]">
          
          {/* Author & Intent */}
          <div className="space-y-4 max-w-lg">
            <Link
              href="/"
              className="inline-block text-[15px] font-semibold text-white tracking-tight hover:text-white/80 transition-colors"
            >
              Nima Hosseini
            </Link>
            <p className="text-[15px] text-neutral-400 font-sans leading-relaxed">
              Cloud and DevOps engineer designing deterministic infrastructure,
              ephemeral cluster lifecycles, and automated deployment pipelines on AWS.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] active:scale-[0.98] border border-white/10 hover:border-white/20 text-[13px] font-sans font-medium text-white transition-all duration-150 cursor-pointer motion-reduce:transition-none"
                title="Copy email address"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>{copiedEmail ? "Email copied" : email}</span>
                {copiedEmail ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-neutral-500" />
                )}
              </button>

              {onOpenCV && (
                <button
                  type="button"
                  onClick={onOpenCV}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#0A0A0A] hover:bg-neutral-200 active:scale-[0.98] text-[13px] font-sans font-medium transition-all duration-150 cursor-pointer motion-reduce:transition-none shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5 text-[#0A0A0A]" />
                  <span>View CV</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation & Networks */}
          <div className="flex flex-wrap sm:flex-nowrap gap-12 sm:gap-16 text-[13px] font-sans">
            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">
                Portfolio
              </div>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>Home</span>
                    <span className="text-neutral-600 group-hover:text-white group-hover:translate-x-0.5 transition-all text-[11px] motion-reduce:transition-none">
                      &rarr;
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#systems"
                    className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>Systems</span>
                    <span className="text-neutral-600 group-hover:text-white group-hover:translate-x-0.5 transition-all text-[11px] motion-reduce:transition-none">
                      &rarr;
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#projects"
                    className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>Projects</span>
                    <span className="text-neutral-600 group-hover:text-white group-hover:translate-x-0.5 transition-all text-[11px] motion-reduce:transition-none">
                      &rarr;
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>Stories</span>
                    <span className="text-neutral-600 group-hover:text-white group-hover:translate-x-0.5 transition-all text-[11px] motion-reduce:transition-none">
                      &rarr;
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">
                Channels
              </div>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com/wvrner"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150 motion-reduce:transition-none" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/in/wvrner"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150 motion-reduce:transition-none" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/wvrner"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>Telegram</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150 motion-reduce:transition-none" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Baseline Colophon & Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] font-sans text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} Nima Hosseini. All rights reserved.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-1.5 text-neutral-400 hover:text-white active:scale-[0.97] transition-all duration-150 cursor-pointer motion-reduce:transition-none"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white group-hover:-translate-y-0.5 transition-all duration-150 motion-reduce:transition-none" />
          </button>
        </div>
      </div>
    </footer>
  );
}
