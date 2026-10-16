"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, ArrowRight, Bookmark } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { CVDrawer } from "@/components/CVDrawer";
import { BLOG_POSTS, type BlogPost } from "@/lib/blogData";

/**
 * Editorial Blog Archive — WVRNER JOURNAL
 * Authentic Medium.com Publication Experience:
 * - Medium typography: bold modern sans headings + crisp editorial preview
 * - Medium story feed with right-side thumbnail pictures
 * - Lead story spotlight with cover image
 * - Clean, distraction-free reading cadence
 */
export default function BlogIndexPage() {
  const [cvOpen, setCvOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [following, setFollowing] = useState(false);
  const POSTS_PER_PAGE = 10;

  const leadPost = BLOG_POSTS[0];
  const remainingPosts = useMemo(() => BLOG_POSTS.slice(1), []);

  const totalPages = Math.max(1, Math.ceil(remainingPosts.length / POSTS_PER_PAGE));
  const paginatedRecentPosts = useMemo(() => {
    const validPage = Math.max(1, Math.min(currentPage, totalPages));
    const start = (validPage - 1) * POSTS_PER_PAGE;
    return remainingPosts.slice(start, start + POSTS_PER_PAGE);
  }, [remainingPosts, currentPage, totalPages]);

  const handlePageChange = (targetPage: number) => {
    const next = Math.max(1, Math.min(targetPage, totalPages));
    setCurrentPage(next);
    if (typeof window !== "undefined") {
      const el = document.getElementById("recent-stories");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Generate robust page numbers with smart ellipsis for any number of pages
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  return (
    <div className="relative min-h-[100dvh] bg-[#FFFFFF] text-[#242424] font-sans antialiased selection:bg-[#E8F3EC] selection:text-[#1A8917]">
      {/* Floating Navigation Pill */}
      <Navigation onOpenCV={() => setCvOpen(true)} />

      {/* Main Publication Container */}
      <main className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-12 pt-28 sm:pt-36 pb-24">
        
        {/* Navigation Breadcrumb / Folio Bar */}
        <div className="flex items-center justify-between gap-4 mb-10 pb-4 border-b border-[#F2F2F2] text-[13px] font-sans text-[#6B6B6B]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 hover:text-[#242424] transition-colors group cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to portfolio</span>
          </Link>

          <div className="text-[13px] text-[#6B6B6B]">
            <span className="text-[#242424] font-medium">Stories</span>
          </div>
        </div>

        {/* Medium-style Publication Masthead */}
        <header className="mb-12 sm:mb-14 pb-8 border-b border-[#F2F2F2]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 text-[12px] font-medium tracking-wide uppercase text-[#6B6B6B]">
                <span>WVRNER JOURNAL</span>
              </div>

              <h1 className="font-[family-name:var(--font-plus-jakarta)] text-[36px] sm:text-[46px] font-bold tracking-[-0.03em] text-[#242424] leading-[1.08]">
                Stories
              </h1>

              <p className="text-[17px] sm:text-[19px] text-[#6B6B6B] leading-relaxed font-normal">
                Notes on distributed architecture, cloud infrastructure, and the disciplined engineering behind quiet production systems.
              </p>
            </div>

            {/* Writer Bio Pill */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FAFAFA] border border-[#F2F2F2] shrink-0 self-start md:self-center">
              <div className="w-12 h-12 rounded-full bg-[#161617] text-white flex items-center justify-center font-bold text-[14px] shrink-0 shadow-sm">
                NH
              </div>
              <div className="space-y-0.5">
                <span className="font-semibold text-[#242424] text-[15px] block">Nima Hosseini</span>
                <span className="text-[12px] text-[#6B6B6B] block">Cloud &amp; DevOps Engineer</span>
                <button
                  onClick={() => setFollowing(!following)}
                  className={`text-[12.5px] font-medium transition-colors pt-0.5 block ${
                    following ? "text-[#6B6B6B]" : "text-[#1A8917] hover:text-[#156912]"
                  }`}
                >
                  {following ? "Following" : "Follow on Medium"}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* STORY FEED CADENCE */}
        {BLOG_POSTS.length > 0 && (
          <div className="space-y-12 sm:space-y-16">

            {/* 1. LEAD FEATURE STORY (Only on Page 1) */}
            {currentPage === 1 && leadPost && (
              <section className="relative">
                <Link
                  href={`/blog/${leadPost.slug}`}
                  className="group block p-6 sm:p-9 md:p-11 bg-white hover:bg-[#FAFAFA] rounded-2xl border border-[#EAEAEA] hover:border-[#D1D1D1] transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] cursor-pointer"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-center">
                    
                    {/* Left Column */}
                    <div className="md:col-span-7 lg:col-span-8 space-y-3.5">
                      
                      {/* Author byline */}
                      <div className="flex items-center gap-2.5 text-[13px] text-[#6B6B6B]">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#242424] text-white font-medium text-[11px]">
                          Featured Story
                        </span>
                        <span>&middot;</span>
                        <span className="font-semibold text-[#242424]">Nima Hosseini</span>
                        <span>&middot;</span>
                        <span>{leadPost.date}</span>
                      </div>

                      {/* Title */}
                      <h2 className="font-[family-name:var(--font-plus-jakarta)] text-[24px] sm:text-[32px] md:text-[36px] font-bold text-[#242424] leading-[1.18] sm:leading-[1.12] tracking-[-0.025em] group-hover:text-[#555] transition-colors">
                        {leadPost.title}
                      </h2>
                      
                      {leadPost.subtitle && (
                        <p className="text-[16px] sm:text-[18px] text-[#6B6B6B] font-normal leading-relaxed">
                          {leadPost.subtitle}
                        </p>
                      )}

                      {/* Excerpt */}
                      <p className="text-[14.5px] sm:text-[15.5px] text-[#6B6B6B] leading-relaxed line-clamp-2 font-normal pt-1">
                        {leadPost.excerpt}
                      </p>

                      {/* Action Bar */}
                      <div className="pt-4 flex items-center justify-between text-[13px] text-[#6B6B6B]">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#F2F2F2] text-[#242424] font-medium text-[12px]">
                            {leadPost.category}
                          </span>
                          <span>{leadPost.readingTime}</span>
                        </div>

                        <span className="inline-flex items-center gap-1 font-medium text-[#1A8917] group-hover:translate-x-0.5 transition-transform">
                          <span>Read story</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* Right Picture Column */}
                    {leadPost.featureImage && (
                      <div className="md:col-span-5 lg:col-span-4 aspect-[16/10] w-full overflow-hidden rounded-xl bg-neutral-100 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={leadPost.featureImage}
                          alt={leadPost.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    )}

                  </div>
                </Link>
              </section>
            )}

            {/* 2. MEDIUM RECENT STORIES FEED (With Thumbnail Pictures) */}
            {remainingPosts.length > 0 && (
              <div id="recent-stories" className="space-y-6 scroll-mt-28">
                <div className="pb-3 border-b border-[#F2F2F2] flex items-center justify-between">
                  <h3 className="font-[family-name:var(--font-plus-jakarta)] text-[20px] sm:text-[22px] font-bold text-[#242424]">
                    Recent Stories
                  </h3>
                  <span className="text-[13px] text-[#6B6B6B]">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                {/* Feed of Medium Stories */}
                <div className="divide-y divide-[#F2F2F2]">
                  {paginatedRecentPosts.map((post) => (
                    <article key={post.slug} className="py-7 first:pt-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-8 cursor-pointer"
                      >
                        {/* Left Content */}
                        <div className="flex-1 space-y-2">
                          
                          {/* Byline */}
                          <div className="flex items-center gap-2 text-[12.5px] text-[#6B6B6B]">
                            <div className="w-5 h-5 rounded-full bg-[#242424] text-white flex items-center justify-center font-bold text-[9px]">
                              NH
                            </div>
                            <span className="font-semibold text-[#242424]">Nima Hosseini</span>
                            <span>&middot;</span>
                            <span>{post.date}</span>
                          </div>

                          {/* Title */}
                          <h4 className="font-[family-name:var(--font-plus-jakarta)] text-[18px] sm:text-[21px] font-bold text-[#242424] group-hover:text-[#555] transition-colors leading-snug tracking-tight">
                            {post.title}
                          </h4>

                          {/* Excerpt */}
                          <p className="text-[14px] sm:text-[14.5px] text-[#6B6B6B] leading-relaxed line-clamp-2 font-normal">
                            {post.excerpt}
                          </p>

                          {/* Footer */}
                          <div className="pt-2 flex items-center gap-3 text-[12px] text-[#6B6B6B]">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#F2F2F2] text-[#242424] font-medium text-[11px]">
                              {post.category}
                            </span>
                            <span>{post.readingTime}</span>
                            <span>&middot;</span>
                            <span className="inline-flex items-center gap-1 font-medium text-[#1A8917] group-hover:underline">
                              Read story
                            </span>
                          </div>
                        </div>

                        {/* Right Thumbnail Image */}
                        {post.featureImage && (
                          <div className="w-full sm:w-[150px] md:w-[170px] aspect-[16/10] sm:aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100 shrink-0 shadow-sm self-center sm:self-start">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={post.featureImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </Link>
                    </article>
                  ))}
                </div>

                {/* Medium Centered Pagination */}
                {totalPages > 1 && (
                  <nav
                    aria-label="Stories pagination"
                    className="pt-10 sm:pt-12 border-t border-[#F2F2F2] flex items-center justify-center gap-2 font-sans"
                  >
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      aria-label="Previous page"
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                        currentPage <= 1
                          ? "text-black/25 bg-black/[0.02] cursor-not-allowed"
                          : "text-[#242424] bg-[#F2F2F2] hover:bg-[#EAEAEA] active:scale-95 cursor-pointer"
                      }`}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {getPageNumbers().map((item, idx) => {
                        if (item === "...") {
                          return (
                            <span
                              key={`ellipsis-${idx}`}
                              className="w-8 h-8 flex items-center justify-center text-[#86868B] text-[13px] font-medium select-none"
                            >
                              &hellip;
                            </span>
                          );
                        }

                        const pageNum = item as number;
                        const isCurrent = pageNum === currentPage;

                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            aria-label={`Page ${pageNum}`}
                            aria-current={isCurrent ? "page" : undefined}
                            className={`w-9 h-9 rounded-full text-[13px] font-medium transition-all cursor-pointer flex items-center justify-center ${
                              isCurrent
                                ? "bg-[#242424] text-white shadow-sm"
                                : "text-[#242424] hover:bg-[#F2F2F2]"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      aria-label="Next page"
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                        currentPage >= totalPages
                          ? "text-black/25 bg-black/[0.02] cursor-not-allowed"
                          : "text-[#242424] bg-[#F2F2F2] hover:bg-[#EAEAEA] active:scale-95 cursor-pointer"
                      }`}
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </nav>
                )}

              </div>
            )}

          </div>
        )}

      </main>

      {/* CV Modal */}
      <CVDrawer isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </div>
  );
}
