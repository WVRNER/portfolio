"use client";

import Link from "next/link";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blogData";

/**
 * WritingSection — Apple-Grade Engineering Writing & Field Notes
 * 
 * Clear, intuitive editorial showcase:
 * - Unmistakable purpose: Technical essays & architectural case studies
 * - Flagship Lead Story Card (full-width spotlight)
 * - Balanced 3-column Recent Field Notes grid
 * - Seamless synchronization with /blog archive
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
      <div id="stories" className="absolute -top-12" />

      {/* Editorial Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-10 sm:mb-12 border-b border-[#EAEAEA]">
        <div className="space-y-3.5 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.04] text-[11px] font-mono tracking-wider uppercase text-[#6E6E73] font-medium">
            <BookOpen className="w-3.5 h-3.5 text-[#1D1D1F]" />
            <span>TECHNICAL WRITING &amp; CASE STUDIES</span>
          </div>

          <h2 className="font-display text-[clamp(2.4rem,5vw,3.8rem)] font-semibold tracking-[-0.035em] text-[#0A0A0A] leading-tight">
            Stories &amp; Field Notes
          </h2>

          <p className="text-[16px] sm:text-[18px] text-[#6E6E73] font-normal leading-relaxed max-w-[56ch]">
            Interfaces are calm. Infrastructure is chaos. Long-form technical essays, architectural postmortems, and field notes on building quiet, zero-downtime cloud systems.
          </p>
        </div>

        {/* Primary Action Button to View All Stories Archive */}
        <Link
          href="/blog"
          className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#161617] text-white hover:bg-[#2C2C2E] active:scale-[0.97] transition-all duration-300 text-[14px] font-medium tracking-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_20px_rgba(0,0,0,0.12)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_30px_rgba(0,0,0,0.2)] cursor-pointer group shrink-0 overflow-hidden"
        >
          {/* Specular light glint */}
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
          
          <span className="relative z-10">Explore full archive ({BLOG_POSTS.length})</span>
          <span className="relative z-10 w-6 h-6 rounded-full bg-white/15 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-[#161617] group-hover:translate-x-0.5">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      {/* 1. LEAD CASE STUDY (Full-Width Flagship Card) */}
      {featuredPost && (
        <article className="mb-10 sm:mb-12">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block p-7 sm:p-9 md:p-11 bg-[#FAFAFA] hover:bg-white rounded-3xl border border-black/[0.08] hover:border-black/[0.18] transition-all duration-300 shadow-[0_2px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 cursor-pointer relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]"
          >
            {/* Top specular hairline */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />

            {/* Top Metadata Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-black/[0.06] text-[12px] text-[#86868B]">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-[#1D1D1F] text-white font-medium text-[11px] tracking-wide uppercase">
                  Lead Case Study
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-black/[0.08] text-[#1D1D1F] font-medium text-[11.5px]">
                  {featuredPost.category}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-[12.5px]">
                <span>{featuredPost.date}</span>
                <span>&middot;</span>
                <span className="flex items-center gap-1.5 text-[#1D1D1F]">
                  <Clock className="w-3.5 h-3.5 text-[#86868B]" />
                  <span>{featuredPost.readingTime}</span>
                </span>
              </div>
            </div>

            {/* Headline & Subhead */}
            <div className="space-y-3 mb-5 max-w-4xl">
              <h3 className="font-display text-[22px] sm:text-[28px] md:text-[32px] font-semibold text-[#0A0A0A] group-hover:text-[#333333] leading-snug tracking-[-0.025em] transition-colors">
                {featuredPost.title}
              </h3>

              {featuredPost.subtitle && (
                <p className="text-[15px] sm:text-[17px] text-[#555555] font-normal leading-relaxed">
                  {featuredPost.subtitle}
                </p>
              )}
            </div>

            {/* Excerpt */}
            <p className="text-[14.5px] sm:text-[15.5px] text-[#737373] leading-relaxed line-clamp-2 max-w-4xl font-normal mb-6">
              {featuredPost.excerpt}
            </p>

            {/* Footer Action */}
            <div className="pt-5 border-t border-black/[0.06] flex items-center justify-between text-[12.5px]">
              <span className="text-[11px] font-mono text-[#86868B] uppercase tracking-wider">
                READ ARCHITECTURAL BREAKDOWN
              </span>

              <span className="inline-flex items-center gap-1.5 font-medium text-[#1D1D1F] group-hover:translate-x-1 transition-transform">
                <span>Read case study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </article>
      )}

      {/* 2. RECENT FIELD NOTES (Balanced 3-Column Card Grid) */}
      <div className="space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA]">
          <span className="font-mono text-[11px] tracking-widest uppercase text-[#737373] font-medium">
            RECENT FIELD NOTES
          </span>
          <span className="text-[12px] text-[#86868B]">
            Curated dispatches from production systems
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {recentPosts.map((post) => (
            <article key={post.slug} className="flex">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex-1 p-6 sm:p-7 bg-[#FAFAFA] hover:bg-white rounded-3xl border border-black/[0.07] hover:border-black/[0.18] transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.015)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]"
              >
                <div>
                  {/* Topic & Reading Time */}
                  <div className="flex items-center justify-between text-[12px] text-[#86868B] mb-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-white border border-black/[0.06] text-[#1D1D1F] font-medium text-[11px]">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-[#1D1D1F]">
                      <Clock className="w-3 h-3 text-[#86868B]" />
                      <span>{post.readingTime}</span>
                    </span>
                  </div>

                  {/* Headline */}
                  <h4 className="font-display text-[18px] sm:text-[19px] font-semibold text-[#0A0A0A] group-hover:text-[#404040] leading-snug tracking-[-0.02em] transition-colors mb-2.5">
                    {post.title}
                  </h4>

                  {/* Excerpt */}
                  <p className="text-[13.5px] sm:text-[14px] text-[#6E6E73] leading-relaxed line-clamp-3 mb-6 font-normal">
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer with date & read link */}
                <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between text-[12px] text-[#86868B]">
                  <span>{post.date}</span>
                  <span className="inline-flex items-center gap-1 font-medium text-[#1D1D1F] group-hover:translate-x-0.5 transition-transform">
                    <span>Read dispatch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* 3. BOTTOM ARCHIVE LINK */}
      <div className="pt-10 sm:pt-12 flex justify-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F5F5F7] hover:bg-[#EBEBEB] text-[#1D1D1F] border border-black/[0.06] text-[13px] font-medium transition-all active:scale-95 cursor-pointer"
        >
          <span>Browse all {BLOG_POSTS.length} stories in the archive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
