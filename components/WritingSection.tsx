"use client";

import Link from "next/link";
import { Clock, ArrowRight, Sparkles } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blogData";

/**
 * WritingSection — Main Page Stories Feed
 * Fully synchronized with /blog archive:
 * - Highlights the Featured Story identically to the lead story in /blog
 * - Displays the latest Recent Stories stream
 * - Includes "The Reality Gap" editorial perspective
 * - Apple + Medium precision typography and tactile action affordances
 */
export function WritingSection() {
  if (!BLOG_POSTS || BLOG_POSTS.length === 0) {
    return null;
  }

  const featuredPost = BLOG_POSTS[0];
  const recentPosts = BLOG_POSTS.slice(1, 4);

  return (
    <section
      id="writing"
      aria-label="Stories & Field Notes"
      className="relative py-20 sm:py-28 lg:py-32 px-6 sm:px-12 md:px-16 lg:px-24 max-w-[1400px] mx-auto bg-white border-t border-[#0A0A0A]/10"
    >
      {/* Clean Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 mb-10 sm:mb-12 border-b border-[#EAEAEA]">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.04] text-[11.5px] font-medium tracking-wide uppercase text-[#6E6E73]">
            <Sparkles className="w-3 h-3 text-[#1D1D1F]" />
            <span>DISPATCHES &bull; FIELD NOTES</span>
          </div>
          <h2 className="font-display text-[clamp(2.4rem,5vw,3.8rem)] font-semibold tracking-[-0.035em] text-[#0A0A0A] leading-tight">
            Stories
          </h2>
          <p className="text-[16px] sm:text-[17px] text-[#6E6E73] font-normal leading-relaxed max-w-[50ch]">
            Architectural case studies on deterministic cloud infrastructure, automated pipelines, and zero-downtime reliability.
          </p>
        </div>

        {/* Primary Action Button to View All Stories Archive */}
        <Link
          href="/blog"
          className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#161617] text-white hover:bg-[#2C2C2E] active:scale-[0.97] transition-all duration-300 text-[14px] font-medium tracking-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_20px_rgba(0,0,0,0.14)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_30px_rgba(0,0,0,0.22)] cursor-pointer group shrink-0 overflow-hidden"
        >
          {/* Specular light glint */}
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
          
          <span className="relative z-10">View all stories ({BLOG_POSTS.length})</span>
          <span className="relative z-10 w-6 h-6 rounded-full bg-white/15 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-[#161617] group-hover:translate-x-0.5">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      {/* Main Grid: Synced Stories (Left 8 cols) + The Reality Gap Note (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* ======================================================== */}
        {/* LEFT (8 cols): Synchronized Featured & Recent Stories    */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* 1. SYNCHRONIZED FEATURED STORY SPOTLIGHT */}
          {featuredPost && (
            <article className="relative">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group block p-7 sm:p-9 md:p-10 bg-[#FAFAFA] hover:bg-white rounded-3xl border border-black/[0.08] hover:border-black/[0.18] transition-all duration-300 shadow-[0_2px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 cursor-pointer relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]"
              >
                {/* Top specular hairline */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-black/[0.06] text-[12px] text-[#86868B]">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#1D1D1F] text-white font-medium text-[11px] tracking-wide uppercase">
                      Featured Story
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white border border-black/[0.06] text-[#1D1D1F] font-medium text-[11.5px]">
                      {featuredPost.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span>{featuredPost.date}</span>
                    <span>&middot;</span>
                    <span className="flex items-center gap-1.5 text-[#1D1D1F]">
                      <Clock className="w-3.5 h-3.5 text-[#86868B]" />
                      <span>{featuredPost.readingTime}</span>
                    </span>
                  </div>
                </div>

                {/* Headline & Subhead */}
                <h3 className="font-display text-[22px] sm:text-[28px] font-semibold text-[#0A0A0A] group-hover:text-[#404040] leading-snug tracking-[-0.025em] transition-colors mb-3">
                  {featuredPost.title}
                </h3>

                {featuredPost.subtitle && (
                  <p className="text-[15px] sm:text-[16px] text-[#555555] font-normal leading-relaxed mb-4">
                    {featuredPost.subtitle}
                  </p>
                )}

                <p className="text-[14px] sm:text-[15px] text-[#737373] leading-relaxed line-clamp-2 mb-6 font-normal">
                  {featuredPost.excerpt}
                </p>

                {/* Card Action Footer */}
                <div className="pt-5 border-t border-black/[0.06] flex items-center justify-end text-[12.5px]">
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#1D1D1F] group-hover:translate-x-0.5 transition-transform">
                    <span>Read featured story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </article>
          )}

          {/* 2. SYNCHRONIZED RECENT STORIES LIST */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA]">
              <span className="font-mono text-[11px] tracking-widest uppercase text-[#737373] font-medium">
                RECENT DISPATCHES
              </span>
              <Link
                href="/blog"
                className="text-[12.5px] font-medium text-[#1D1D1F] hover:underline underline-offset-4 flex items-center gap-1"
              >
                <span>Browse all {BLOG_POSTS.length} stories</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-[#EAEAEA]">
              {recentPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group py-6 first:pt-2"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] rounded-xl"
                  >
                    {/* Topic & Date Row */}
                    <div className="flex items-center gap-2.5 text-[12px] text-[#86868B] mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F5F5F7] text-[#1D1D1F] font-medium text-[11px]">
                        {post.category}
                      </span>
                      <span>&middot;</span>
                      <span>{post.date}</span>
                    </div>

                    {/* Article Headline */}
                    <h4 className="font-display text-[19px] sm:text-[21px] font-semibold text-[#0A0A0A] group-hover:text-[#404040] leading-snug tracking-[-0.02em] transition-colors mb-2">
                      {post.title}
                    </h4>

                    {/* Excerpt */}
                    <p className="text-[14.5px] text-[#555555] leading-relaxed line-clamp-2 font-normal mb-3.5">
                      {post.excerpt}
                    </p>

                    {/* Reading Time & Action Footer */}
                    <div className="flex items-center justify-between text-[12px] text-[#6B6B6B]">
                      <span className="flex items-center gap-1.5 text-[#737373]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readingTime}</span>
                      </span>

                      <span className="text-[12.5px] text-[#0A0A0A] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <span>Read story</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT (4 cols): The Reality Gap Editorial Note           */}
        {/* ======================================================== */}
        <aside className="lg:col-span-4 sticky top-28 space-y-6">
          <div className="p-7 sm:p-8 bg-[#FAFAFA] rounded-3xl border border-[#EAEAEA] space-y-5">
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#737373]">
              THE REALITY GAP
            </div>

            <h3 className="font-display text-[20px] font-semibold text-[#0A0A0A] leading-snug tracking-tight">
              Interfaces are calm. Infrastructure is chaos.
            </h3>

            <p className="text-[14px] text-[#555555] leading-relaxed font-normal">
              Most people only interact with the visual finish. My writing documents the unglamorous mechanics beneath: why cloud state drifts, how cryptographic IAM boundaries prevent leaks, and the disciplined automation that makes systems feel quiet.
            </p>

            <div className="pt-4 border-t border-[#EAEAEA] space-y-3">
              <div className="flex items-center justify-between text-[11.5px] font-mono text-[#737373]">
                <span>PUBLICATION</span>
                <span className="text-[#0A0A0A] font-medium">WVRNER JOURNAL</span>
              </div>
              <div className="flex items-center justify-between text-[11.5px] font-mono text-[#737373]">
                <span>STORIES ARCHIVE</span>
                <span className="text-[#0A0A0A] font-medium">{BLOG_POSTS.length} PUBLISHED</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/blog"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-white hover:bg-black/[0.04] text-[#1D1D1F] border border-black/[0.08] text-[13px] font-medium transition-all active:scale-95"
              >
                <span>Explore Full Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </aside>

      </div>
    </section>
  );
}
