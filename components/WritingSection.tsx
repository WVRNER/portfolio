"use client";

import Link from "next/link";
import { ArrowRight, Bookmark } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blogData";

// Modern Medium Clapping Hands SVG Icon
function MediumClapIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.5"
    >
      <path d="M14.5 9.5c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5v4" />
      <path d="M17.5 10.5c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5v3" />
      <path d="M11.5 9c0-.8-.7-1.5-1.5-1.5S8.5 8.2 8.5 9v4" />
      <path d="M8.5 10c0-.8-.7-1.5-1.5-1.5S5.5 9.2 5.5 10v4.5c0 3.6 2.9 6.5 6.5 6.5h2c3.3 0 6-2.7 6-6V13c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5" />
    </svg>
  );
}

/**
 * WritingSection — Modern Medium.com Publication Stories Showcase
 * 
 * True Modern Medium UI:
 * - Clean borderless stream (NO bulky boxed cards, NO drop shadows)
 * - Pure white canvas (#FFFFFF) with delicate hairline dividers (#F2F2F2)
 * - Signature Medium typography: bold modern sans headings + crisp editorial preview
 * - Left content with right-aligned thumbnail images (subtle 4px radius)
 * - Medium green (#1A8917) action button & author follow accents
 * - Category pills, reading times, clapping hands indicator, bookmarking
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
      aria-label="Stories & Articles"
      className="relative py-20 sm:py-28 lg:py-32 px-6 sm:px-12 md:px-16 lg:px-24 max-w-[1240px] mx-auto bg-white border-t border-[#F2F2F2]"
    >
      <div id="stories" className="absolute -top-12" />

      {/* Modern Medium Publication Masthead */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-10 sm:mb-14 border-b border-[#F2F2F2]">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[12px] font-medium tracking-wider uppercase text-[#6B6B6B] font-sans">
            <span>PUBLISHED IN WVRNER JOURNAL</span>
          </div>

          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-[34px] sm:text-[44px] font-bold text-[#242424] tracking-[-0.025em] leading-[1.12]">
            Stories
          </h2>

          <p className="text-[16px] sm:text-[18px] text-[#6B6B6B] font-normal leading-relaxed">
            Notes on distributed architecture, cloud infrastructure, and the disciplined engineering behind quiet production systems.
          </p>
        </div>

        {/* Medium Green "See all stories" Pill Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A8917] hover:bg-[#156912] text-white text-[14px] font-medium transition-all active:scale-95 shrink-0 font-sans cursor-pointer shadow-none"
        >
          <span>See all stories</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 1. LEAD FEATURED STORY — Modern Medium Showcase (Borderless) */}
      {featuredPost && (
        <article className="pb-12 sm:pb-14 border-b border-[#F2F2F2]">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block cursor-pointer"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-center">
              
              {/* Left Content Column */}
              <div className="md:col-span-7 lg:col-span-8 space-y-3.5">
                
                {/* Author & Byline Row */}
                <div className="flex items-center gap-2.5 text-[13px] text-[#6B6B6B]">
                  <div className="w-6 h-6 rounded-full bg-[#242424] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    NH
                  </div>
                  <span className="font-semibold text-[#242424]">Nima Hosseini</span>
                  <span>&middot;</span>
                  <span>{featuredPost.date}</span>
                  <span>&middot;</span>
                  <span className="text-[#1A8917] font-medium text-[12px]">Featured Story</span>
                </div>

                {/* Title */}
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-[24px] sm:text-[30px] md:text-[34px] font-bold text-[#242424] group-hover:underline transition-colors leading-[1.2] tracking-[-0.02em]">
                  {featuredPost.title}
                </h3>

                {/* Subtitle / Excerpt */}
                <p className="text-[16px] sm:text-[17px] text-[#6B6B6B] leading-relaxed line-clamp-2 font-normal font-[family-name:var(--font-source-serif),Charter,Georgia,serif]">
                  {featuredPost.subtitle || featuredPost.excerpt}
                </p>

                {/* Action Footer */}
                <div className="pt-2 flex items-center justify-between text-[13px] text-[#6B6B6B]">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F2F2F2] hover:bg-[#EAEAEA] text-[#242424] font-medium text-[12px] transition-colors">
                      {featuredPost.category}
                    </span>
                    <span>{featuredPost.readingTime}</span>
                    <span>&middot;</span>
                    <span className="inline-flex items-center gap-1">
                      <MediumClapIcon className="w-3.5 h-3.5 text-[#6B6B6B]" />
                      <span>184</span>
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-medium text-[#1A8917] group-hover:translate-x-0.5 transition-transform text-[13.5px]">
                    <span>Read story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Right Picture Column */}
              {featuredPost.featureImage && (
                <div className="md:col-span-5 lg:col-span-4 aspect-[16/10] w-full overflow-hidden rounded-[4px] bg-neutral-100 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredPost.featureImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}

            </div>
          </Link>
        </article>
      )}

      {/* 2. RECENT STORIES STREAM — Modern Medium List Items */}
      <div className="pt-8 sm:pt-10 space-y-2">
        <div className="pb-4 flex items-center justify-between">
          <h3 className="font-[family-name:var(--font-plus-jakarta)] text-[18px] sm:text-[20px] font-bold text-[#242424]">
            Recent Stories
          </h3>
          <span className="text-[13px] text-[#6B6B6B]">
            From WVRNER Journal
          </span>
        </div>

        <div className="divide-y divide-[#F2F2F2]">
          {recentPosts.map((post) => (
            <article key={post.slug} className="py-7 first:pt-4">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-8 cursor-pointer"
              >
                {/* Left Content */}
                <div className="flex-1 space-y-2 min-w-0">
                  
                  {/* Author Row */}
                  <div className="flex items-center gap-2 text-[12.5px] text-[#6B6B6B]">
                    <div className="w-5 h-5 rounded-full bg-[#242424] text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                      NH
                    </div>
                    <span className="font-semibold text-[#242424]">Nima Hosseini</span>
                    <span>&middot;</span>
                    <span>{post.date}</span>
                  </div>

                  {/* Headline */}
                  <h4 className="font-[family-name:var(--font-plus-jakarta)] text-[18px] sm:text-[21px] font-bold text-[#242424] group-hover:underline transition-colors leading-[1.25] tracking-[-0.015em] line-clamp-2">
                    {post.title}
                  </h4>

                  {/* Excerpt */}
                  <p className="text-[14px] sm:text-[14.5px] text-[#6B6B6B] leading-relaxed line-clamp-2 font-normal font-[family-name:var(--font-source-serif),Charter,Georgia,serif]">
                    {post.subtitle || post.excerpt}
                  </p>

                  {/* Metadata Row */}
                  <div className="pt-2 flex items-center justify-between text-[12.5px] text-[#6B6B6B]">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F2F2F2] hover:bg-[#EAEAEA] text-[#242424] font-medium text-[11.5px] transition-colors">
                        {post.category}
                      </span>
                      <span>{post.readingTime}</span>
                      <span>&middot;</span>
                      <span className="inline-flex items-center gap-1">
                        <MediumClapIcon className="w-3.5 h-3.5 text-[#6B6B6B]" />
                        <span>92</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[#6B6B6B] group-hover:text-[#242424]">
                      <Bookmark className="w-4 h-4 hover:fill-current transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Right Thumbnail Image */}
                {post.featureImage && (
                  <div className="w-full sm:w-[150px] md:w-[160px] aspect-[16/10] sm:aspect-[4/3] rounded-[4px] overflow-hidden bg-neutral-100 shrink-0 self-center sm:self-start">
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

      {/* 3. BOTTOM BUTTON — Modern Medium Pill */}
      <div className="pt-10 sm:pt-12 flex justify-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F2F2F2] hover:bg-[#EAEAEA] text-[#242424] text-[13.5px] font-medium transition-all active:scale-95 cursor-pointer font-sans"
        >
          <span>See all stories</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
