"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blogData";

/**
 * WritingSection — Personal Engineering Stories Showcase
 * 
 * - Super bold punchy headlines (Modern Medium 2026 style)
 * - Compact right-aligned thumbnails on mobile and desktop (never stacked or oversized)
 * - Zero "Read story" buttons (clicking the card/title is natural affordance)
 * - Zero reactions (no claps, no likes, no bookmarks, no reposts)
 * - Zero redundant "WVRNER JOURNAL" repetitions
 */
export function WritingSection() {
  if (!BLOG_POSTS || BLOG_POSTS.length === 0) {
    return null;
  }

  // Find featured post (or first post)
  const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  const recentPosts = BLOG_POSTS.filter((p) => p.slug !== featuredPost.slug).slice(0, 3);

  return (
    <section
      id="writing"
      aria-label="Stories & Articles"
      className="relative py-20 sm:py-28 lg:py-32 px-6 sm:px-10 md:px-12 max-w-[820px] mx-auto bg-white border-t border-[#F2F2F2]"
    >
      <div id="stories" className="absolute -top-12" />

      {/* Publication Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 mb-8 sm:mb-10 border-b border-[#F2F2F2]">
        <div className="space-y-2 max-w-xl">
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-[32px] sm:text-[42px] font-extrabold sm:font-black text-[#1D1D1F] tracking-[-0.035em] leading-[1.1]">
            Stories
          </h2>

          <p className="text-[15.5px] sm:text-[17px] text-[#6B6B6B] font-normal leading-relaxed">
            Notes on distributed architecture, cloud infrastructure, and the disciplined engineering behind quiet production systems.
          </p>
        </div>

        {/* "See all stories" Black Pill Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#161617] hover:bg-[#2C2C2E] text-white text-[13.5px] font-medium transition-all active:scale-95 shrink-0 font-sans cursor-pointer shadow-none"
        >
          <span>See all stories</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 1. LEAD FEATURED STORY */}
      {featuredPost && (
        <article className="pb-8 sm:pb-10 border-b border-[#F2F2F2]">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4 sm:gap-7">
              {/* Left Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 text-[12px] sm:text-[12.5px] text-[#6B6B6B]">
                  <span className="text-[#1D1D1F] font-semibold uppercase tracking-wider text-[11px]">
                    Featured
                  </span>
                  <span>&middot;</span>
                  <span>{featuredPost.readingTime}</span>
                  <span>&middot;</span>
                  <span>{featuredPost.date}</span>
                </div>

                {/* Super bold punchy title (Modern 2026 Medium style) */}
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-[21px] sm:text-[25px] md:text-[28px] font-black text-[#1D1D1F] group-hover:underline transition-colors leading-[1.18] tracking-[-0.03em]">
                  {featuredPost.title}
                </h3>

                {/* Subtitle / Excerpt */}
                <p className="text-[14.5px] sm:text-[16px] text-[#555555] leading-relaxed line-clamp-2 font-normal font-[family-name:var(--font-source-serif),Charter,Georgia,serif]">
                  {featuredPost.subtitle || featuredPost.excerpt}
                </p>

                <div className="pt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F2F2F2] hover:bg-[#EAEAEA] text-[#242424] font-medium text-[11px] transition-colors">
                    {featuredPost.category}
                  </span>
                </div>
              </div>

              {/* Right Thumbnail Image (Compact on mobile and desktop) */}
              {featuredPost.featureImage && (
                <div className="w-[88px] h-[60px] sm:w-[130px] sm:h-[88px] md:w-[150px] md:h-[100px] rounded-[3px] overflow-hidden bg-neutral-100 shrink-0 self-start mt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredPost.featureImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </Link>
        </article>
      )}

      {/* 2. RECENT STORIES STREAM */}
      <div className="divide-y divide-[#F2F2F2]">
        {recentPosts.map((post) => (
          <article key={post.slug} className="py-7 sm:py-8">
            <Link
              href={`/blog/${post.slug}`}
              className="group block cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4 sm:gap-7">
                {/* Left Content */}
                <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2 text-[12px] text-[#6B6B6B]">
                    <span>{post.readingTime}</span>
                    <span>&middot;</span>
                    <span>{post.date}</span>
                  </div>

                  {/* Super bold punchy headline */}
                  <h4 className="font-[family-name:var(--font-plus-jakarta)] text-[19px] sm:text-[22px] md:text-[24px] font-black text-[#1D1D1F] group-hover:underline transition-colors leading-[1.2] tracking-[-0.03em] line-clamp-2">
                    {post.title}
                  </h4>

                  {/* Excerpt */}
                  <p className="text-[14.5px] sm:text-[15.5px] text-[#555555] leading-relaxed line-clamp-2 font-normal font-[family-name:var(--font-source-serif),Charter,Georgia,serif]">
                    {post.subtitle || post.excerpt}
                  </p>

                  <div className="pt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F2F2F2] hover:bg-[#EAEAEA] text-[#242424] font-medium text-[11px] transition-colors">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Right Thumbnail Image (Compact on mobile and desktop) */}
                {post.featureImage && (
                  <div className="w-[84px] h-[58px] sm:w-[120px] sm:h-[80px] md:w-[140px] md:h-[95px] rounded-[3px] overflow-hidden bg-neutral-100 shrink-0 self-start mt-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.featureImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* 3. BOTTOM BUTTON */}
      <div className="pt-10 sm:pt-12 flex justify-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#161617] hover:bg-[#2C2C2E] text-white text-[13px] font-medium transition-all active:scale-95 cursor-pointer font-sans"
        >
          <span>See all stories</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
