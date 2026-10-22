"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { FeaturedStarIcon } from "@/components/FeaturedStarIcon";
import { InstantLink } from "@/components/InstantLink";
import { BlurImage } from "@/components/BlurImage";
import { getImageMetadata } from "@/lib/imageMetadataHelper";
import {
  BLOG_POSTS,
  formatDisplayDate,
  getPrimaryToolTag,
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
  if (!BLOG_POSTS || BLOG_POSTS.length === 0) {
    return null;
  }

  // Display top 4 stories in a clean vertical stream
  const displayedPosts = BLOG_POSTS.slice(0, 4);

  return (
    <section
      id="writing"
      aria-label="Writing & Technical Field Notes"
      className="relative py-20 sm:py-28 px-6 sm:px-12 md:px-16 lg:px-24 max-w-[1400px] mx-auto bg-white border-t border-[#242424]/10"
    >
      <div id="stories" className="absolute -top-12" />

      {/* Editorial Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#F2F2F2]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-black/[0.04] text-[11px] font-mono tracking-wider uppercase text-[#6E6E73] font-medium">
            <BookOpen className="w-3.5 h-3.5 text-[#242424]" />
            <span>WRITING &amp; ARCHITECTURE</span>
          </div>

          <h2 className="font-display text-[28px] sm:text-[34px] font-bold tracking-[-0.03em] text-[#242424] leading-tight">
            Writing &amp; Field Notes
          </h2>
        </div>

        {/* View all writing action */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#242424] hover:text-[#242424] hover:underline underline-offset-4 cursor-pointer shrink-0 pb-1"
        >
          <span>See all writing</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* BALANCED 2-COLUMN EDITORIAL STORIES GRID ALIGNED TO SITE WIDTH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-8 sm:gap-y-10">
        {displayedPosts.map((post) => (
          <article
            key={post.slug}
            className="w-full h-auto sm:h-[155px] md:h-[165px] flex flex-col justify-between overflow-hidden"
          >
            <InstantLink
              href={`/blog/${post.slug}`}
              className="group flex flex-col justify-between h-full cursor-pointer outline-none focus:outline-none focus-visible:outline-none hover:outline-none no-underline ring-0"
            >
              <div className="flex items-start justify-between gap-4 sm:gap-6 flex-1 min-h-0">
                
                {/* Left Text Block */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                  <div className="space-y-1.5">
                    {/* Super bold punchy headline with strict 2-line clamp */}
                    <h3 className="title-thick font-[family-name:var(--font-inter),var(--font-plus-jakarta),sans-serif] text-[18px] sm:text-[20px] md:text-[21px] text-[#242424] group-hover:text-[#242424]/75 transition-colors leading-[1.25] tracking-[-0.03em] line-clamp-2 no-underline">
                      {post.title}
                    </h3>

                    {/* Subtitle / Excerpt in Serif with strict 2-line clamp */}
                    <p className="text-[13.5px] sm:text-[14.5px] text-[#555555] leading-[1.4] line-clamp-2 font-normal font-[family-name:var(--font-source-serif),Charter,Georgia,serif]">
                      {post.subtitle || post.excerpt}
                    </p>
                  </div>

                  {/* Bottom Meta: Date before read time, then Tool Tag - anchored at bottom */}
                  <div className="pt-2 flex flex-wrap items-center gap-2 text-[12px] sm:text-[12.5px] text-[#6B6B6B] font-sans shrink-0">
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

                {/* Right Compact Thumbnail Image with Blur-up */}
                {post.featureImage && (
                  <div className="w-[84px] h-[58px] sm:w-[120px] sm:h-[80px] md:w-[136px] md:h-[90px] rounded-[3px] overflow-hidden bg-neutral-100 shrink-0 self-center">
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

      {/* Bottom Archive Action */}
      <div className="pt-8 sm:pt-10 flex justify-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F5F5F7] hover:bg-[#EBEBEB] text-[#242424] border border-black/[0.06] text-[13px] font-medium transition-all active:scale-95 cursor-pointer outline-none focus:outline-none"
        >
          <span>Browse all writing in the archive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}

