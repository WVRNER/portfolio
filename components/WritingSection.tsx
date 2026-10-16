"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blogData";

/**
 * WritingSection — Personal Engineering Journal & Stories Showcase
 * 
 * - Pure reader UI (zero reactions, zero claps, zero bookmarks, zero comments)
 * - Contained, well-padded width (not overly wide, optimal reading line length)
 * - Zero author repetition (it's a solo journal)
 * - Monochromatic palette (#161617 black accents, zero green)
 * - Featured story automatically elevated to the lead spot
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 mb-10 sm:mb-12 border-b border-[#F2F2F2]">
        <div className="space-y-2.5 max-w-xl">
          <div className="inline-flex items-center gap-2 text-[12px] font-medium tracking-wider uppercase text-[#6B6B6B] font-sans">
            <span>WVRNER JOURNAL &bull; ARCHITECTURE &amp; SYSTEMS</span>
          </div>

          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-[32px] sm:text-[40px] font-bold text-[#242424] tracking-[-0.025em] leading-[1.12]">
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
        <article className="pb-12 sm:pb-14 border-b border-[#F2F2F2]">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block cursor-pointer space-y-4"
          >
            {/* Top Meta Line */}
            <div className="flex items-center gap-2.5 text-[12.5px] text-[#6B6B6B]">
              <span className="text-[#242424] font-medium text-[11.5px] uppercase tracking-wider">
                Featured Story
              </span>
              <span>&middot;</span>
              <span>{featuredPost.date}</span>
              <span>&middot;</span>
              <span>{featuredPost.readingTime}</span>
            </div>

            {/* Title */}
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-[22px] sm:text-[28px] font-bold text-[#242424] group-hover:underline transition-colors leading-[1.22] tracking-[-0.02em]">
              {featuredPost.title}
            </h3>

            {/* Subtitle / Excerpt */}
            <p className="text-[15.5px] sm:text-[16.5px] text-[#6B6B6B] leading-relaxed line-clamp-2 font-normal font-[family-name:var(--font-source-serif),Charter,Georgia,serif]">
              {featuredPost.subtitle || featuredPost.excerpt}
            </p>

            {/* Featured Image */}
            {featuredPost.featureImage && (
              <div className="aspect-[16/9] w-full overflow-hidden rounded-[4px] bg-neutral-100 mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredPost.featureImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            )}

            {/* Action Footer */}
            <div className="pt-2 flex items-center justify-between text-[12.5px] text-[#6B6B6B]">
              <span className="px-2.5 py-0.5 rounded-full bg-[#F2F2F2] hover:bg-[#EAEAEA] text-[#242424] font-medium text-[11.5px] transition-colors">
                {featuredPost.category}
              </span>

              <span className="inline-flex items-center gap-1 font-medium text-[#242424] group-hover:translate-x-0.5 transition-transform text-[13px]">
                <span>Read story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </article>
      )}

      {/* 2. RECENT STORIES STREAM */}
      <div className="pt-8 sm:pt-10 space-y-2">
        <div className="pb-3 flex items-center justify-between">
          <h3 className="font-[family-name:var(--font-plus-jakarta)] text-[17px] sm:text-[18px] font-bold text-[#242424]">
            Recent Stories
          </h3>
          <span className="text-[12.5px] text-[#6B6B6B]">
            From WVRNER Journal
          </span>
        </div>

        <div className="divide-y divide-[#F2F2F2]">
          {recentPosts.map((post) => (
            <article key={post.slug} className="py-7 sm:py-8 first:pt-4">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-7 cursor-pointer"
              >
                {/* Left Content */}
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-2 text-[12px] text-[#6B6B6B]">
                    <span>{post.date}</span>
                    <span>&middot;</span>
                    <span>{post.readingTime}</span>
                  </div>

                  {/* Headline */}
                  <h4 className="font-[family-name:var(--font-plus-jakarta)] text-[17px] sm:text-[19px] font-bold text-[#242424] group-hover:underline transition-colors leading-[1.28] tracking-[-0.015em] line-clamp-2">
                    {post.title}
                  </h4>

                  {/* Excerpt */}
                  <p className="text-[13.5px] sm:text-[14px] text-[#6B6B6B] leading-relaxed line-clamp-2 font-normal font-[family-name:var(--font-source-serif),Charter,Georgia,serif]">
                    {post.subtitle || post.excerpt}
                  </p>

                  {/* Metadata Row */}
                  <div className="pt-2 flex items-center justify-between text-[12px] text-[#6B6B6B]">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F2F2F2] hover:bg-[#EAEAEA] text-[#242424] font-medium text-[11px] transition-colors">
                      {post.category}
                    </span>

                    <span className="font-medium text-[#242424] text-[12.5px] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      <span>Read story</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Right Thumbnail Image */}
                {post.featureImage && (
                  <div className="w-full sm:w-[130px] md:w-[140px] aspect-[16/10] sm:aspect-[4/3] rounded-[4px] overflow-hidden bg-neutral-100 shrink-0 self-center sm:self-start">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.featureImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}
              </Link>
            </article>
          ))}
        </div>
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
