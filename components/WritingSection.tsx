"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { FeaturedStarIcon } from "@/components/FeaturedStarIcon";
import { InstantLink } from "@/components/InstantLink";
import { BlurImage } from "@/components/BlurImage";
import { getImageMetadata } from "@/lib/imageMetadataHelper";
import { getPostTransitionName } from "@/lib/viewTransitions";
import {
  formatDisplayDate,
  getPrimaryToolTag,
  getPublishedWritings,
} from "@/lib/blogData";

/**
 * WritingSection - Compact Medium-style Stories Stream on the Main Page
 * 
 * Clean, compact editorial layout:
 * - Refined, unbloated vertical stream
 * - High-density typography matching modern Medium & blog feed
 * - Compact right-aligned thumbnail pictures
 * - Direct seamless link to full archive
 */
export function WritingSection() {
  const publishedWritings = getPublishedWritings();
  if (!publishedWritings || publishedWritings.length === 0) {
    return null;
  }

  // Display top 4 published stories in a clean vertical stream
  const displayedPosts = publishedWritings.slice(0, 4);

  return (
    <section
      id="writing"
      aria-label="Writing & Architecture"
      className="relative py-20 sm:py-28 px-6 sm:px-12 md:px-16 lg:px-24 max-w-[1400px] mx-auto bg-white border-t border-[#242424]/10"
    >
      <div id="stories" className="absolute -top-12" />

      {/* Editorial Header Row */}
      <div className="pb-6 mb-8 border-b border-[#F2F2F2]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-black/[0.04] text-[11px] font-mono tracking-wider uppercase text-[#6E6E73] font-medium">
            <BookOpen className="w-3.5 h-3.5 text-[#242424]" />
            <span>WRITING &amp; ARCHITECTURE</span>
          </div>

          <h2 className="font-display text-[28px] sm:text-[34px] font-bold tracking-[-0.03em] text-[#242424] leading-tight">
            Writing
          </h2>
        </div>
      </div>

      {/* BALANCED 2-COLUMN EDITORIAL STORIES GRID ALIGNED TO SITE WIDTH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-8 sm:gap-y-10">
        {displayedPosts.map((post) => (
          <article
            key={post.slug}
            className="w-full h-auto sm:min-h-[160px] md:min-h-[170px] flex flex-col justify-between overflow-hidden"
          >
            <InstantLink
              href={`/blog/${post.slug}`}
              transitionTitle={post.title}
              className="group flex flex-col justify-between h-full cursor-pointer outline-none focus:outline-none focus-visible:outline-none hover:outline-none no-underline ring-0"
            >
              <div className="flex items-start justify-between gap-6 sm:gap-8 md:gap-10 flex-1 min-h-0">
                
                {/* Left Text Block */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                  <div className="space-y-2">
                    {/* Super bold punchy headline with strict 2-line clamp and View Transition */}
                    <h3
                      className="title-thick font-[family-name:var(--font-inter),var(--font-plus-jakarta),sans-serif] text-[16.5px] sm:text-[18px] md:text-[19px] text-[#242424] group-hover:text-[#242424]/75 transition-colors leading-[1.3] tracking-[-0.025em] line-clamp-2 no-underline"
                      style={{ viewTransitionName: getPostTransitionName("title", post.slug) }}
                    >
                      {post.title}
                    </h3>

                    {/* Subtitle / Excerpt in Serif with strict 2-line clamp and relaxed line-height */}
                    <p className="text-[13px] sm:text-[13.5px] md:text-[14px] text-[#555555] leading-[1.55] line-clamp-2 font-normal font-[family-name:var(--font-source-serif),Charter,Georgia,serif]">
                      {post.subtitle || post.excerpt}
                    </p>
                  </div>

                  {/* Bottom Meta: Date before read time, then Tool Tag & Draft Badge */}
                  <div className="pt-2.5 flex flex-wrap items-center gap-2 text-[12px] sm:text-[12.5px] text-[#6B6B6B] font-sans shrink-0">
                    {post.featured && (
                      <span title="Featured Story" className="inline-flex items-center shrink-0">
                        <FeaturedStarIcon className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="whitespace-nowrap">{formatDisplayDate(post.date)}</span>
                    <span>&middot;</span>
                    <span className="whitespace-nowrap">{post.readingTime}</span>
                    <span>&middot;</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F2F2F2] text-[#242424] font-medium text-[11px] font-mono tracking-tight shrink-0">
                      {getPrimaryToolTag(post)}
                    </span>
                  </div>
                </div>

                {/* Right Compact Thumbnail Image with Blur-up and View Transition */}
                {post.featureImage && (
                  <div
                    className="w-[84px] h-[58px] sm:w-[116px] sm:h-[78px] md:w-[128px] md:h-[86px] rounded-[3px] overflow-hidden bg-neutral-100 shrink-0 self-start mt-0.5"
                    style={{ viewTransitionName: getPostTransitionName("cover", post.slug) }}
                  >
                    <BlurImage
                      src={post.featureImage}
                      alt={post.title}
                      aspectRatio={getImageMetadata(post.slug)?.aspectRatio || 1.5}
                      blurDataUrl={getImageMetadata(post.slug)?.blurDataUrl}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                )}

              </div>
            </InstantLink>
          </article>
        ))}
      </div>

      {/* Bottom Archive Action: Liquid Glass Button */}
      <div className="pt-8 sm:pt-10 flex justify-center">
        <InstantLink
          href="/blog"
          transitionTitle="Writing"
          transitionSubtitle="systems, cloud infrastructure, and technical notes"
          className="relative group inline-flex items-center gap-3 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-[13.5px] sm:text-[14px] font-sans font-medium text-[#111111] bg-gradient-to-b from-white/90 via-white/55 to-white/35 backdrop-blur-2xl border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1.5px_1px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_36px_rgba(0,0,0,0.09),0_2px_6px_rgba(0,0,0,0.05),inset_0_1.5px_1px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(0,0,0,0.05)] hover:border-black/[0.14] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden outline-none focus:outline-none"
        >
          {/* Top specular meniscus highlight */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-3 top-0.5 h-[40%] rounded-t-full bg-gradient-to-b from-white/95 via-white/40 to-transparent"
          />

          {/* Liquid refraction sheen sweep */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/70 to-transparent"
          />

          <span className="relative z-10 tracking-tight">Browse all writing in the archive</span>
          <span className="relative z-10 w-5 h-5 rounded-full bg-black/[0.05] flex items-center justify-center group-hover:bg-[#171717] group-hover:text-white transition-colors duration-200">
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
          </span>
        </InstantLink>
      </div>
    </section>
  );
}

