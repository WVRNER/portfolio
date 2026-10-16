"use client";

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blogData";

/**
 * WritingSection — LATEST NOTE
 * Clean, readable, Medium-inspired story feed with high editorial taste:
 * - Simple, distraction-free typography with optimal measure
 * - Unmistakable, irresistible buttons to explore all writings
 * - Redesigned, grounded "The Reality Gap" editorial callout
 * - Clean metadata, tags, and reading times
 */
export function WritingSection() {
  if (!BLOG_POSTS || BLOG_POSTS.length === 0) {
    return null;
  }

  // Display the top 3-4 posts
  const posts = BLOG_POSTS.slice(0, 4);

  return (
    <section
      id="writing"
      aria-label="Latest Published Notes"
      className="relative py-20 sm:py-28 lg:py-32 px-6 sm:px-12 md:px-16 lg:px-24 max-w-[1400px] mx-auto bg-white border-t border-[#0A0A0A]/10"
    >
      {/* Clean Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 mb-10 border-b border-[#EAEAEA]">
        <div>
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-medium tracking-[-0.035em] text-[#0A0A0A] leading-tight">
            Stories
          </h2>
        </div>

        {/* Primary Obvious Button for All Blog Posts — Apple + Medium Hybrid */}
        <Link
          href="/blog"
          className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#161617] text-white hover:bg-[#2C2C2E] active:scale-[0.97] transition-all duration-300 text-[14px] font-medium tracking-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_20px_rgba(0,0,0,0.14)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_30px_rgba(0,0,0,0.22)] cursor-pointer group shrink-0 overflow-hidden"
        >
          {/* Specular light glint */}
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
          
          <span className="relative z-10">View all posts</span>
          <span className="relative z-10 w-6 h-6 rounded-full bg-white/15 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-[#161617] group-hover:translate-x-0.5">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      {/* Main Grid: Medium-style Stories (Left) + The Reality Gap Note (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* ======================================================== */}
        {/* LEFT (8 cols): Medium-style Story List                   */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 divide-y divide-[#EAEAEA]">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group py-8 sm:py-9 first:pt-0"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] rounded-xl"
              >
                {/* Topic & Date Row */}
                <div className="flex items-center gap-2.5 text-[12px] text-[#86868B] mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F5F5F7] text-[#1D1D1F] font-medium text-[11px]">
                    {post.category}
                  </span>
                  <span>&middot;</span>
                  <span>{post.date}</span>
                </div>

                {/* Article Headline */}
                <h3 className="font-display text-[21px] sm:text-[24px] font-semibold text-[#0A0A0A] group-hover:text-[#404040] leading-snug tracking-[-0.025em] transition-colors mb-2.5">
                  {post.title}
                </h3>

                {/* Clean Excerpt */}
                <p className="text-[15px] sm:text-[16px] text-[#555555] leading-relaxed line-clamp-2 font-normal mb-4">
                  {post.excerpt}
                </p>

                {/* Reading Time & Action Footer */}
                <div className="flex items-center justify-between text-[12px] text-[#6B6B6B] pt-1">
                  <span className="flex items-center gap-1.5 text-[#737373]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readingTime}</span>
                  </span>

                  <span className="text-[12.5px] text-[#0A0A0A] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <span>Read article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* ======================================================== */}
        {/* RIGHT (4 cols): The Reality Gap Editorial Note           */}
        {/* ======================================================== */}
        <aside className="lg:col-span-4 sticky top-28 space-y-6">
          <div className="p-7 sm:p-8 bg-[#FAFAFA] rounded-2xl border border-[#EAEAEA] space-y-4">
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#737373]">
              THE REALITY GAP
            </div>

            <h3 className="font-display text-[20px] font-semibold text-[#0A0A0A] leading-snug tracking-tight">
              Interfaces are calm. Infrastructure is chaos.
            </h3>

            <p className="text-[14px] text-[#555555] leading-relaxed font-normal">
              Most people only interact with the visual finish. My writing documents the unglamorous mechanics beneath: why cloud state drifts, how cryptographic IAM boundaries prevent leaks, and the disciplined automation that makes systems feel quiet.
            </p>

            <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between text-[11.5px] font-mono text-[#737373]">
              <span>FIELD ESSAYS</span>
              <span className="text-[#0A0A0A] font-medium">WVRNER JOURNAL</span>
            </div>
          </div>
        </aside>

      </div>
    </section>
  );
}
