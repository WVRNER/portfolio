"use client";

import Link from "next/link";
import { ArrowRight, Clock, Bookmark } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blogData";

/**
 * WritingSection — Medium.com Publication Stories Showcase
 * 
 * - Authentic Medium layout with thumbnail pictures for all stories
 * - Medium typography: bold modern sans headings + clean metadata
 * - Replaced "read dispatch" with Medium's "Read story"
 * - Removed number "14" from the archive button, titled "See all stories"
 * - Fully synchronized with Ghost CMS
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
      className="relative py-20 sm:py-28 lg:py-32 px-6 sm:px-12 md:px-16 lg:px-24 max-w-[1400px] mx-auto bg-white border-t border-[#F2F2F2]"
    >
      <div id="stories" className="absolute -top-12" />

      {/* Medium Publication Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-10 sm:mb-12 border-b border-[#F2F2F2]">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[12px] font-medium tracking-wide uppercase text-[#6B6B6B] font-sans">
            <span>PUBLISHED IN WVRNER JOURNAL</span>
          </div>

          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-[34px] sm:text-[44px] font-bold text-[#242424] tracking-[-0.025em] leading-tight">
            Stories
          </h2>

          <p className="text-[16px] sm:text-[18px] text-[#6B6B6B] font-normal leading-relaxed">
            Notes on distributed architecture, cloud infrastructure, and the disciplined engineering behind quiet production systems.
          </p>
        </div>

        {/* Medium-style "See all stories" Primary Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#1A8917] hover:bg-[#156912] text-white text-[14px] font-medium transition-all shadow-sm active:scale-95 shrink-0 font-sans cursor-pointer"
        >
          <span>See all stories</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 1. LEAD FEATURED STORY (Medium Showcase Card with Picture) */}
      {featuredPost && (
        <article className="mb-12 sm:mb-14">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block p-6 sm:p-8 md:p-10 bg-white hover:bg-[#FAFAFA] rounded-2xl border border-[#EAEAEA] hover:border-[#D1D1D1] transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] cursor-pointer"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
              
              {/* Left Content Column */}
              <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between">
                
                {/* Author & Byline Row */}
                <div className="flex items-center gap-2.5 text-[13px] text-[#6B6B6B] mb-3">
                  <div className="w-6 h-6 rounded-full bg-[#242424] text-white flex items-center justify-center font-bold text-[10px]">
                    NH
                  </div>
                  <span className="font-semibold text-[#242424]">Nima Hosseini</span>
                  <span>&middot;</span>
                  <span>{featuredPost.date}</span>
                </div>

                {/* Title */}
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-[22px] sm:text-[28px] md:text-[30px] font-bold text-[#242424] group-hover:text-[#555] transition-colors leading-snug tracking-tight mb-2.5">
                  {featuredPost.title}
                </h3>

                {/* Subtitle / Excerpt */}
                {featuredPost.subtitle ? (
                  <p className="text-[15px] sm:text-[16px] text-[#6B6B6B] leading-relaxed line-clamp-2 mb-4 font-normal">
                    {featuredPost.subtitle}
                  </p>
                ) : (
                  <p className="text-[14.5px] sm:text-[15.5px] text-[#6B6B6B] leading-relaxed line-clamp-2 mb-4 font-normal">
                    {featuredPost.excerpt}
                  </p>
                )}

                {/* Card Action Footer */}
                <div className="pt-4 flex items-center justify-between text-[13px] text-[#6B6B6B]">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F2F2F2] text-[#242424] font-medium text-[12px]">
                      {featuredPost.category}
                    </span>
                    <span>{featuredPost.readingTime}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-medium text-[#1A8917] group-hover:translate-x-0.5 transition-transform">
                    <span>Read story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Right Picture Column */}
              {featuredPost.featureImage && (
                <div className="md:col-span-5 lg:col-span-4 aspect-[16/10] w-full overflow-hidden rounded-xl bg-neutral-100 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredPost.featureImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}

            </div>
          </Link>
        </article>
      )}

      {/* 2. RECENT STORIES (Medium 3-Card Grid with Pictures) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2F2F2]">
          <h3 className="font-[family-name:var(--font-plus-jakarta)] text-[18px] sm:text-[20px] font-bold text-[#242424]">
            Recent Stories
          </h3>
          <span className="text-[13px] text-[#6B6B6B]">
            From WVRNER Journal
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {recentPosts.map((post) => (
            <article key={post.slug} className="flex">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex-1 p-5 sm:p-6 bg-white hover:bg-[#FAFAFA] rounded-2xl border border-[#EAEAEA] hover:border-[#D1D1D1] transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.05)] flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Thumbnail Picture */}
                  {post.featureImage && (
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-xl mb-4 bg-neutral-100 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.featureImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-400"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Author Row */}
                  <div className="flex items-center gap-2 text-[12px] text-[#6B6B6B] mb-2.5">
                    <span className="font-semibold text-[#242424]">Nima Hosseini</span>
                    <span>&middot;</span>
                    <span>{post.date}</span>
                  </div>

                  {/* Headline */}
                  <h4 className="font-[family-name:var(--font-plus-jakarta)] text-[17px] sm:text-[18px] font-bold text-[#242424] group-hover:text-[#555] leading-snug tracking-tight mb-2 transition-colors">
                    {post.title}
                  </h4>

                  {/* Excerpt */}
                  <p className="text-[13.5px] text-[#6B6B6B] leading-relaxed line-clamp-2 mb-4 font-normal">
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer with Reading Time & Read Story */}
                <div className="pt-3 border-t border-[#F2F2F2] flex items-center justify-between text-[12px] text-[#6B6B6B]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#F2F2F2] text-[#242424] font-medium text-[11px]">
                      {post.category}
                    </span>
                    <span>{post.readingTime}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-medium text-[#1A8917] group-hover:translate-x-0.5 transition-transform">
                    <span>Read story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* 3. BOTTOM MEDIUM BUTTON (No "14", titled "See all stories") */}
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
