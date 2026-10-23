"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { CVDrawer } from "@/components/CVDrawer";
import { EditorialFooter } from "@/components/EditorialFooter";
import { FeaturedStarIcon } from "@/components/FeaturedStarIcon";
import { InstantLink } from "@/components/InstantLink";
import { BlurImage } from "@/components/BlurImage";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getImageMetadata } from "@/lib/imageMetadataHelper";
import { getPostTransitionName } from "@/lib/viewTransitions";
import {
  formatDisplayDate,
  getPrimaryToolTag,
  getPublishedPosts,
} from "@/lib/blogData";

/**
 * Editorial Blog Archive - Writing
 * 
 * - Each post sized at 680x225 on desktop with responsive mobile scaling
 * - Dark mode toggle scoped to blog surfaces with persistent user state
 * - Super bold punchy titles (font-black / font-extrabold)
 * - Mobile & desktop compact thumbnail layout
 * - Exact recruiter tool tags (Cloud, Terraform, CI/CD, Networking, Linux, Kubernetes)
 * - Meta line: "Date · X min read · Tag"
 * - Zero em dashes
 */
export default function BlogIndexPage() {
  const [cvOpen, setCvOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const POSTS_PER_PAGE = 10;

  // Topics and stream categories
  const topics = [
    "All",
    "Articles",
    "Projects & Labs",
    "Cloud",
    "Terraform",
    "Automation",
    "Networking",
    "Kubernetes",
  ];

  const published = useMemo(() => getPublishedPosts(), []);

  // Filter posts based on active tool category or kind
  const filteredPosts = useMemo(() => {
    let list = published;
    if (activeCategory === "Articles") {
      list = published.filter((p) => p.kind !== "project");
    } else if (activeCategory === "Projects & Labs") {
      list = published.filter((p) => p.kind === "project");
    } else if (activeCategory !== "All") {
      list = published.filter((p) => {
        const primaryTag = getPrimaryToolTag(p);
        return primaryTag.toLowerCase() === activeCategory.toLowerCase();
      });
    }
    return list;
  }, [published, activeCategory]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  // Paginated subset
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (typeof window !== "undefined") {
        const feedElement = document.getElementById("story-feed");
        if (feedElement) {
          feedElement.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }
  };

  // Generate robust sliding window page numbers with ellipsis for any scale (up to 100+ pages)
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    // Near start: 1, 2, 3, 4, "...", totalPages
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    }
    // Near end: 1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages
    else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    }
    // Middle: 1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages
    else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }

    return pages;
  };

  return (
    <div className="relative min-h-[100dvh] bg-[#FFFFFF] dark:bg-[#171717] text-[#242424] dark:text-[#e5e5e5] font-sans antialiased transition-colors duration-200 selection:bg-[#EAEAEA] selection:text-[#242424] dark:selection:bg-[#2C2C30] dark:selection:text-[#e5e5e5]">
      {/* Floating Navigation Pill */}
      <Navigation onOpenCV={() => setCvOpen(true)} />

      {/* Main Container - Centered Strict 680px Column */}
      <div className="max-w-[680px] w-full mx-auto px-6 sm:px-0 pt-28 sm:pt-36 pb-24">
        
        {/* Masthead */}
        <header className="mb-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="font-[family-name:var(--font-plus-jakarta)] text-[34px] sm:text-[46px] font-extrabold sm:font-black tracking-[-0.035em] text-[#242424] dark:text-[#e5e5e5] leading-[1.08]">
                Writing
              </h1>

              <p className="text-[15.5px] sm:text-[17.5px] text-[#6B6B6B] dark:text-[#9E9E9E] leading-relaxed font-normal max-w-xl">
                Notes on distributed architecture, cloud infrastructure, and the disciplined engineering behind quiet production systems.
              </p>
            </div>

            {/* Dark Mode Toggle */}
            <div className="pt-2 shrink-0">
              <ThemeToggle />
            </div>
          </div>

          {/* Topic Tab Bar: "For you" + tool tags */}
          <div className="flex items-center gap-6 mt-8 overflow-x-auto no-scrollbar border-b border-[#F2F2F2] dark:border-[#262626] text-[14px]">
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveCategory(t);
                  setCurrentPage(1);
                }}
                className={`pb-3 border-b-2 font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === t
                    ? "border-[#242424] dark:border-[#e5e5e5] text-[#242424] dark:text-[#e5e5e5]"
                    : "border-transparent text-[#6B6B6B] dark:text-[#8E8E93] hover:text-[#242424] dark:hover:text-[#e5e5e5]"
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
            <div className="py-16 text-center text-[#6B6B6B] dark:text-[#8E8E93]">
              <p>No writing found for topic &ldquo;{activeCategory}&rdquo;.</p>
              <button
                onClick={() => setActiveCategory("All")}
                className="mt-3 text-[13px] text-[#242424] dark:text-[#e5e5e5] hover:underline font-medium cursor-pointer"
              >
                View all writing
              </button>
            </div>
          ) : (
            <div>
              {/* WRITING STREAM: Each post card 680x225 on desktop */}
              <div className="divide-y divide-[#F2F2F2] dark:divide-[#262626]">
                {paginatedPosts.map((post, pIdx) => (
                  <article
                    key={post.slug}
                    className="w-full max-w-[680px] min-h-[190px] sm:h-[225px] flex flex-col justify-center py-4 sm:py-0"
                  >
                    <InstantLink
                      href={`/blog/${post.slug}`}
                      transitionTitle={post.title}
                      className="group block w-full cursor-pointer outline-none focus:outline-none focus-visible:outline-none hover:outline-none"
                    >
                      <div className="flex items-center justify-between gap-4 sm:gap-6 w-full">
                        
                        {/* Left Text Block */}
                        <div className="flex-1 min-w-0 space-y-2">
                          {/* Big Bold Headline with View Transition */}
                          <h2
                            className="title-thick font-[family-name:var(--font-inter),var(--font-plus-jakarta),sans-serif] text-[22px] sm:text-[25px] md:text-[26px] text-[#242424] dark:text-[#e5e5e5] leading-[1.2] tracking-[-0.03em] line-clamp-2"
                            style={{ viewTransitionName: getPostTransitionName("title", post.slug) }}
                          >
                            {post.title}
                          </h2>

                          {/* Subtitle / Excerpt in Serif */}
                          <p className="text-[15px] sm:text-[16px] text-[#555555] dark:text-[#b3b3b3] leading-[1.4] line-clamp-2 font-normal font-[family-name:var(--font-source-serif),Charter,Georgia,serif]">
                            {post.subtitle || post.excerpt}
                          </p>

                          {/* Date before read time, then Tool Tag (one per post only) */}
                          <div className="pt-1 flex flex-wrap items-center gap-2.5 text-[12.5px] sm:text-[13px] text-[#6B6B6B] dark:text-[#8E8E93] font-sans">
                            {post.featured && (
                              <span title="Featured Story" className="inline-flex items-center">
                                <FeaturedStarIcon className="w-3.5 h-3.5" />
                              </span>
                            )}
                            <span>{formatDisplayDate(post.date)}</span>
                            <span>&middot;</span>
                            <span>{post.readingTime}</span>
                            <span>&middot;</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#F2F2F2] dark:bg-[#262626] text-[#242424] dark:text-[#e5e5e5] font-medium text-[11px] font-mono tracking-tight dark:border dark:border-white/10">
                              {getPrimaryToolTag(post)}
                            </span>
                          </div>
                        </div>

                        {/* Right Thumbnail Image with Blur-up and View Transition */}
                        {post.featureImage && (
                          <div
                            className="w-[96px] h-[64px] sm:w-[160px] sm:h-[108px] md:w-[172px] md:h-[116px] rounded-[3px] overflow-hidden bg-neutral-100 dark:bg-[#262626] shrink-0 self-center"
                            style={{ viewTransitionName: getPostTransitionName("cover", post.slug) }}
                          >
                            <BlurImage
                              src={post.featureImage}
                              alt={post.title}
                              aspectRatio={getImageMetadata(post.slug)?.aspectRatio || 1.5}
                              blurDataUrl={getImageMetadata(post.slug)?.blurDataUrl}
                              priority={pIdx < 2}
                              sizes="(max-width: 640px) 96px, 172px"
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
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
                  aria-label="Writing pagination"
                  className="pt-10 sm:pt-12 border-t border-[#F2F2F2] dark:border-[#262626] flex items-center justify-center gap-2 font-sans"
                >
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    aria-label="Previous page"
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                      currentPage <= 1
                        ? "text-black/25 dark:text-white/20 bg-black/[0.02] dark:bg-white/[0.03] cursor-not-allowed"
                        : "text-[#242424] dark:text-[#e5e5e5] bg-[#F2F2F2] dark:bg-[#262626] hover:bg-[#EAEAEA] dark:hover:bg-[#333333] active:scale-95 cursor-pointer"
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    {getPageNumbers().map((item, idx) => {
                      if (item === "...") {
                        return (
                          <span
                            key={`ellipsis-${idx}`}
                            className="min-w-[28px] h-8 flex items-center justify-center text-[#86868B] dark:text-[#8E8E93] text-[13px] font-medium select-none px-1"
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
                          aria-current={isCurrent ? "page" : undefined}
                          aria-label={`Page ${pageNum}`}
                          className={`min-w-[34px] h-8 px-2 rounded-full text-[13px] font-medium transition-all cursor-pointer inline-flex items-center justify-center ${
                            isCurrent
                              ? "bg-[#242424] dark:bg-[#e5e5e5] text-white dark:text-[#171717] shadow-sm font-semibold"
                              : "text-[#6B6B6B] dark:text-[#8E8E93] hover:text-[#242424] dark:hover:text-[#e5e5e5] hover:bg-[#F2F2F2] dark:hover:bg-[#262626] active:scale-95"
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
                        ? "text-black/25 dark:text-white/20 bg-black/[0.02] dark:bg-white/[0.03] cursor-not-allowed"
                        : "text-[#242424] dark:text-[#e5e5e5] bg-[#F2F2F2] dark:bg-[#262626] hover:bg-[#EAEAEA] dark:hover:bg-[#333333] active:scale-95 cursor-pointer"
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
