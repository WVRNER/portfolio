"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { FeaturedStarIcon } from "@/components/FeaturedStarIcon";
import { InstantLink } from "@/components/InstantLink";
import { BlurImage } from "@/components/BlurImage";
import { getImageMetadata } from "@/lib/imageMetadataHelper";
import { BLOG_POSTS, formatDisplayDate } from "@/lib/blogData";

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
      aria-label="Stories & Field Notes"
      className="relative py-16 sm:py-24 px-6 sm:px-8 max-w-[760px] mx-auto bg-white border-t border-[#0A0A0A]/10"
    >
      <div id="stories" className="absolute -top-12" />

      {/* Editorial Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-2 border-b border-[#F2F2F2]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-black/[0.04] text-[11px] font-mono tracking-wider uppercase text-[#6E6E73] font-medium">
            <BookOpen className="w-3.5 h-3.5 text-[#1D1D1F]" />
            <span>WRITING &amp; ARCHITECTURE</span>
          </div>

          <h2 className="font-display text-[28px] sm:text-[34px] font-bold tracking-[-0.03em] text-[#0A0A0A] leading-tight">
            Stories &amp; Field Notes
          </h2>
        </div>

        {/* View all stories action */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#242424] hover:text-[#0A0A0A] hover:underline underline-offset-4 cursor-pointer shrink-0 pb-1"
        >
          <span>See all stories</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* COMPACT MEDIUM-STYLE VERTICAL STORIES STREAM */}
      <div className="divide-y divide-[#F2F2F2]">
        {displayedPosts.map((post) => (
          <article key={post.slug} className="py-6 sm:py-7 first:pt-4">
            <InstantLink
              href={`/blog/${post.slug}`}
              className="group block cursor-pointer outline-none focus:outline-none focus-visible:outline-none hover:outline-none"
            >
              <div className="flex items-start justify-between gap-4 sm:gap-6">
                
                {/* Left Text Block */}
                <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                  {/* Meta: Reading time · Date */}
                  <div className="flex items-center gap-2 text-[12.5px] text-[#6B6B6B]">
                    {post.featured && (
                      <span title="Featured Story" className="inline-flex items-center">
                        <FeaturedStarIcon className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span>{post.readingTime}</span>
                    <span>&middot;</span>
                    <span>{formatDisplayDate(post.date)}</span>
                  </div>

                  {/* Super bold punchy headline */}
                  <h3 className="title-thick font-[family-name:var(--font-inter),var(--font-plus-jakarta),sans-serif] text-[19px] sm:text-[22px] md:text-[24px] text-[#0A0A0A] group-hover:underline transition-colors leading-[1.2] tracking-[-0.03em] line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Subtitle / Excerpt */}
                  <p className="text-[14.5px] sm:text-[15.5px] text-[#555555] leading-[1.4] line-clamp-2 font-normal font-[family-name:var(--font-source-serif),Charter,Georgia,serif]">
                    {post.subtitle || post.excerpt}
                  </p>

                  {/* Topic Pill */}
                  <div className="pt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F2F2F2] hover:bg-[#EAEAEA] text-[#242424] font-medium text-[11px] transition-colors">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Right Compact Thumbnail Image with Blur-up */}
                {post.featureImage && (
                  <div className="w-[84px] h-[58px] sm:w-[120px] sm:h-[80px] md:w-[136px] md:h-[90px] rounded-[3px] overflow-hidden bg-neutral-100 shrink-0 self-start mt-1">
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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F5F5F7] hover:bg-[#EBEBEB] text-[#1D1D1F] border border-black/[0.06] text-[13px] font-medium transition-all active:scale-95 cursor-pointer outline-none focus:outline-none"
        >
          <span>Browse all stories in the archive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}

