"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { CVDrawer } from "@/components/CVDrawer";
import { EditorialFooter } from "@/components/EditorialFooter";
import { FeaturedStarIcon } from "@/components/FeaturedStarIcon";
import { InstantLink } from "@/components/InstantLink";
import { BLOG_POSTS, formatDisplayDate, type BlogPost } from "@/lib/blogData";

/**
 * Editorial Blog Archive - Stories
 * 
 * - Super bold punchy titles (font-black / font-extrabold)
 * - Mobile & desktop compact side-by-side thumbnail layout (matching screenshot)
 * - Exact topic tags: "For you" and exactly 4 tags (Architecture, Security, DevOps, Infrastructure)
 * - Meta line: "X min read · Date" (e.g. 5 min read · Aug 4, 2026)
 * - Zero "Read story" buttons anywhere
 * - Zero reactions (no claps, no likes, no reposts, no dislikes, no bookmarks)
 * - Synchronized "Selected Stories" section
 */
export default function BlogIndexPage() {
  const [cvOpen, setCvOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<string>("For you");
  const POSTS_PER_PAGE = 10;

  // Exact 4 tags + For you
  const topics = ["For you", "Architecture", "Security", "DevOps", "Infrastructure"];

  // Filter posts based on active category
  const filteredPosts = useMemo(() => {
    let list = BLOG_POSTS;
    if (activeCategory !== "For you") {
      list = BLOG_POSTS.filter((p) =>
        p.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()))
      );
    }
    // Elevate featured posts
    return [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }, [activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = useMemo(() => {
    const validPage = Math.max(1, Math.min(currentPage, totalPages));
    const start = (validPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage, totalPages]);

  const handlePageChange = (targetPage: number) => {
    const next = Math.max(1, Math.min(targetPage, totalPages));
    setCurrentPage(next);
    if (typeof window !== "undefined") {
      const el = document.getElementById("story-feed");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Generate page numbers with ellipsis
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
    <div className="relative min-h-[100dvh] bg-[#FFFFFF] text-[#242424] font-sans antialiased selection:bg-[#EAEAEA] selection:text-[#242424]">
      {/* Floating Navigation Pill */}
      <Navigation onOpenCV={() => setCvOpen(true)} />

      {/* Main Container - Centered Column */}
      <div className="max-w-[720px] mx-auto px-6 sm:px-8 md:px-0 pt-28 sm:pt-36 pb-24">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-[#F2F2F2] text-[13px] font-sans text-[#6B6B6B]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 hover:text-[#242424] transition-colors group cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to portfolio</span>
          </Link>

          <span className="text-[#242424] font-medium">Stories</span>
        </div>

        {/* Masthead */}
        <header className="mb-8 pb-6 border-b border-[#F2F2F2]">
          <div className="space-y-2">
            <h1 className="font-[family-name:var(--font-plus-jakarta)] text-[34px] sm:text-[46px] font-extrabold sm:font-black tracking-[-0.035em] text-[#1D1D1F] leading-[1.08]">
              Stories
            </h1>

            <p className="text-[15.5px] sm:text-[17.5px] text-[#6B6B6B] leading-relaxed font-normal max-w-2xl">
              Notes on distributed architecture, cloud infrastructure, and the disciplined engineering behind quiet production systems.
            </p>
          </div>

          {/* Topic Tab Bar: "For you" + exactly 4 tags */}
          <div className="flex items-center gap-6 mt-8 overflow-x-auto no-scrollbar border-b border-[#F2F2F2] text-[14px]">
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveCategory(t);
                  setCurrentPage(1);
                }}
                className={`pb-3 border-b-2 font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === t
                    ? "border-[#242424] text-[#242424]"
                    : "border-transparent text-[#6B6B6B] hover:text-[#242424]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </header>

        {/* CENTERED EDITORIAL MAIN STREAM */}
        <main id="story-feed" className="scroll-mt-28">
            {filteredPosts.length === 0 ? (
              <div className="py-16 text-center text-[#6B6B6B]">
                <p>No stories found for topic &ldquo;{activeCategory}&rdquo;.</p>
                <button
                  onClick={() => setActiveCategory("For you")}
                  className="mt-3 text-[13px] text-[#242424] hover:underline font-medium cursor-pointer"
                >
                  View all stories
                </button>
              </div>
            ) : (
              <div>
                {/* STORIES STREAM (Exact layout matching screenshot on mobile and desktop) */}
                <div className="divide-y divide-[#F2F2F2]">
                  {paginatedPosts.map((post) => (
                    <article key={post.slug} className="py-6 sm:py-8 first:pt-2">
                      <InstantLink
                        href={`/blog/${post.slug}`}
                        className="group block cursor-pointer outline-none focus:outline-none focus-visible:outline-none hover:outline-none"
                      >
                        <div className="flex items-start justify-between gap-4 sm:gap-6">
                          
                          {/* Left Text Block */}
                          <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                            {/* Meta: Reading time · Date (matching screenshot) */}
                            <div className="flex items-center gap-2 text-[12.5px] sm:text-[13px] text-[#6B6B6B]">
                              {post.featured && (
                                <span title="Featured Story" className="inline-flex items-center">
                                  <FeaturedStarIcon className="w-3.5 h-3.5" />
                                </span>
                              )}
                              <span>{post.readingTime}</span>
                              <span>&middot;</span>
                              <span>{formatDisplayDate(post.date)}</span>
                            </div>

                            {/* Big Bold Headline matching screenshot */}
                            <h2 className="title-thick font-[family-name:var(--font-inter),var(--font-plus-jakarta),sans-serif] text-[22px] sm:text-[25px] md:text-[27px] text-[#0A0A0A] leading-[1.2] tracking-[-0.03em] line-clamp-2">
                              {post.title}
                            </h2>

                            {/* Subtitle / Excerpt */}
                            <p className="text-[15px] sm:text-[16px] text-[#555555] leading-[1.4] line-clamp-2 font-normal font-[family-name:var(--font-source-serif),Charter,Georgia,serif]">
                              {post.subtitle || post.excerpt}
                            </p>
                          </div>

                          {/* Right Thumbnail Image (Compact on mobile and desktop, exactly like screenshot) */}
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
                      </InstantLink>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
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
          </main>
      </div>

      {/* Footer / Architectural Colophon Section */}
      <EditorialFooter onOpenCV={() => setCvOpen(true)} />

      {/* CV Modal */}
      <CVDrawer isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </div>
  );
}
