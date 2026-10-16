"use client";

import Link from "next/link";
import { ArrowLeft, FileCode2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";

/**
 * Blank Canvas for Project 01 (under blog pages)
 * Designed with Apple + Notion clean minimal restraint.
 */
export default function Project01Page() {
  return (
    <div className="relative min-h-[100dvh] bg-[#FCFCFB] text-[#1D1D1F] font-sans antialiased selection:bg-[#1D1D1F] selection:text-white">
      {/* Navigation */}
      <Navigation />

      {/* Main Container */}
      <main className="max-w-[840px] mx-auto px-6 sm:px-10 pt-36 sm:pt-44 pb-28">
        
        {/* Breadcrumb */}
        <div className="mb-10 pb-5 border-b border-black/[0.07] flex items-center justify-between text-[12.5px] text-[#86868B]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 hover:text-[#1D1D1F] transition-colors group cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to Stories</span>
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#86868B]">
            PROJECT 01
          </span>
        </div>

        {/* Page Header */}
        <header className="space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.04] text-[11.5px] font-medium tracking-wide uppercase text-[#6E6E73]">
            <span>SYSTEM ARCHITECTURE</span>
          </div>
          <h1 className="font-display text-[clamp(2.4rem,5vw,3.8rem)] font-semibold tracking-[-0.035em] text-[#1D1D1F] leading-[1.08]">
            Project 01
          </h1>
          <p className="text-[17px] text-[#6E6E73] font-normal leading-relaxed max-w-[50ch]">
            Documentation and architectural field notes for Project 01.
          </p>
        </header>

        {/* Notion-style Clean Blank Slate Box */}
        <div className="p-12 sm:p-16 rounded-3xl border border-dashed border-black/15 bg-white text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-black/[0.04] text-[#1D1D1F] flex items-center justify-center mx-auto shadow-sm">
            <FileCode2 className="w-6 h-6 text-[#6E6E73]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-[18px] font-semibold text-[#1D1D1F]">
              Blank Project Canvas
            </h3>
            <p className="text-[14px] text-[#86868B] max-w-sm mx-auto leading-relaxed">
              This space is prepared for your case study write-up, diagrams, and implementation details.
            </p>
          </div>
        </div>

      </main>

      {/* Clean Colophon Footer */}
      <footer className="border-t border-black/[0.07] py-10 px-6 max-w-[840px] mx-auto text-[12px] text-[#86868B] flex items-center justify-between">
        <span>WVRNER &middot; Nima Hosseini</span>
        <Link href="/" className="hover:text-[#1D1D1F] transition-colors">
          Portfolio Home
        </Link>
      </footer>
    </div>
  );
}
