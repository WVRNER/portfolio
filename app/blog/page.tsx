"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bookmark, Sparkles } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { CVDrawer } from "@/components/CVDrawer";
import { BLOG_POSTS, type BlogPost } from "@/lib/blogData";

// Clapping Hands SVG Icon
function ClapIcon({ className = "w-4 h-4" }: { className?: string }) {
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
 * Editorial Blog Archive — WVRNER JOURNAL
 * 
 * - Refined 2-column editorial layout with comfortable measure and padding
 * - Removed repeated author name on every post card
 * - Removed author promo box from sidebar
 * - "Read story" links and actions in crisp black
 * - Topic filters (For you, Architecture, Security, DevOps, Infrastructure, Reliability)
 */
export default function BlogIndexPage() {
  const [cvOpen, setCvOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const POSTS_PER_PAGE = 10;

  // Filter posts based on active category
  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") return BLOG_POSTS;
    return BLOG_POSTS.filter((p) =>
      p.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()))
    );
  }, [activeCategory]);

  const leadPost = filteredPosts[0];
  const remainingPosts = useMemo(() => filteredPosts.slice(1), [filteredPosts]);

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
      const el = document.getElementById("story-feed");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const toggleBookmark = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
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

  // Staff picks for right sidebar
  const staffPicks = BLOG_POSTS.slice(0, 3);

  // Recommended topics
  const topics = ["All", "Architecture", "Security", "DevOps", "Infrastructure", "Reliability"];

  return (
    <div className="relative min-h-[100dvh] bg-[#FFFFFF] text-[#242424] font-sans antialiased selection:bg-[#EAEAEA] selection:text-[#242424]">
      {/* Floating Navigation Pill */}
      <Navigation onOpenCV={() => setCvOpen(true)} />

      {/* Main Publication Container (Comfortable, well-padded width) */}
      <div className="max-w-[1120px] mx-auto px-6 sm:px-8 md:px-10 pt-28 sm:pt-36 pb-24">
        
        {/* Navigation Breadcrumb / Folio Bar */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-[#F2F2F2] text-[13px] font-sans text-[#6B6B6B]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 hover:text-[#242424] transition-colors group cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to portfolio</span>
          </Link>

          <div className="text-[13px] text-[#6B6B6B]">
            <span className="text-[#242424] font-medium">WVRNER Journal</span>
          </div>
        </div>

        {/* Publication Masthead */}
        <header className="mb-8 pb-6 border-b border-[#F2F2F2]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[12px] font-medium tracking-wider uppercase text-[#6B6B6B]">
              <span>WVRNER JOURNAL &bull; ARCHITECTURE &amp; SYSTEMS</span>
            </div>

            <h1 className="font-[family-name:var(--font-plus-jakarta)] text-[34px] sm:text-[44px] font-bold tracking-[-0.03em] text-[#242424] leading-[1.1]">
              Stories
            </h1>

            <p className="text-[15.5px] sm:text-[17.5px] text-[#6B6B6B] leading-relaxed font-normal max-w-2xl">
              Notes on distributed architecture, cloud infrastructure, and the disciplined engineering behind quiet production systems.
            </p>
          </div>

          {/* Topic Tab Bar */}
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
                {t === "All" ? "For you" : t}
              </button>
            ))}
          </div>
        </header>

        {/* 2-COLUMN EDITORIAL LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT: MAIN STORY STREAM (Col 1-8) */}
          <main id="story-feed" className="lg:col-span-8 scroll-mt-28">
            {filteredPosts.length === 0 ? (
              <div className="py-16 text-center text-[#6B6B6B]">
                <p>No stories found for topic &ldquo;{activeCategory}&rdquo;.</p>
                <button
                  onClick={() => setActiveCategory("All")}
                  className="mt-3 text-[13px] text-[#242424] hover:underline font-medium cursor-pointer"
                >
                  View all stories
                </button>
              </div>
            ) : (
              <div>
                {/* 1. LEAD FEATURED STORY (Page 1) */}
                {currentPage === 1 && leadPost && (
                  <article className="pb-10 border-b border-[#F2F2F2]">
                    <Link
                      href={`/blog/${leadPost.slug}`}
                      className="group block cursor-pointer"
                    >
                      {/* Full-width Lead Image */}
                      {leadPost.featureImage && (
                        <div className="aspect-[16/9] w-full overflow-hidden rounded-[4px] mb-5 bg-neutral-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={leadPost.featureImage}
                            alt={leadPost.title}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                            loading="eager"
                          />
                        </div>
                      )}

                      {/* Clean Date Row (No author repetition) */}
                      <div className="flex items-center gap-2 text-[12px] text-[#6B6B6B] mb-2.5">
                        <span className="text-[#242424] font-medium uppercase tracking-wider text-[11px]">
                          Featured Story
                        </span>
                        <span>&middot;</span>
                        <span>{leadPost.date}</span>
                      </div>

                      {/* Title */}
                      <h2 className="font-[family-name:var(--font-plus-jakarta)] text-[22px] sm:text-[28px] font-bold text-[#242424] group-hover:underline transition-colors leading-[1.22] tracking-[-0.02em] mb-2">
                        {leadPost.title}
                      </h2>

                      {/* Subtitle / Excerpt */}
                      <p className="text-[15px] sm:text-[16px] text-[#6B6B6B] leading-relaxed line-clamp-2 font-normal font-[family-name:var(--font-source-serif),Charter,Georgia,serif] mb-4">
                        {leadPost.subtitle || leadPost.excerpt}
                      </p>

                      {/* Metadata Row (Read story in black) */}
                      <div className="flex items-center justify-between text-[12.5px] text-[#6B6B6B]">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#F2F2F2] hover:bg-[#EAEAEA] text-[#242424] font-medium text-[11px] transition-colors">
                            {leadPost.category}
                          </span>
                          <span>{leadPost.readingTime}</span>
                          <span>&middot;</span>
                          <span className="inline-flex items-center gap-1">
                            <ClapIcon className="w-3.5 h-3.5 text-[#6B6B6B]" />
                            <span>184</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-medium text-[#242424] text-[12.5px] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                            <span>Read story</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                          <button
                            onClick={(e) => toggleBookmark(leadPost.slug, e)}
                            className="p-1 text-[#6B6B6B] hover:text-[#242424] cursor-pointer"
                            title="Save story"
                          >
                            <Bookmark className={`w-4 h-4 ${savedPosts.has(leadPost.slug) ? "fill-[#242424] text-[#242424]" : ""}`} />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </article>
                )}

                {/* 2. RECENT STORIES STREAM — Generous padding, clean measure */}
                <div className="divide-y divide-[#F2F2F2]">
                  {paginatedRecentPosts.map((post) => (
                    <article key={post.slug} className="py-8 first:pt-8">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-7 cursor-pointer"
                      >
                        {/* Left Content */}
                        <div className="flex-1 space-y-2 min-w-0">
                          {/* Clean Date (No author repetition) */}
                          <div className="text-[12px] text-[#6B6B6B]">
                            <span>{post.date}</span>
                          </div>

                          {/* Title */}
                          <h3 className="font-[family-name:var(--font-plus-jakarta)] text-[17px] sm:text-[19px] font-bold text-[#242424] group-hover:underline transition-colors leading-[1.28] tracking-[-0.015em] line-clamp-2">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-[13.5px] sm:text-[14.5px] text-[#6B6B6B] leading-relaxed line-clamp-2 font-normal font-[family-name:var(--font-source-serif),Charter,Georgia,serif]">
                            {post.subtitle || post.excerpt}
                          </p>

                          {/* Footer with Black Read Story Link */}
                          <div className="pt-2 flex items-center justify-between text-[12px] text-[#6B6B6B]">
                            <div className="flex items-center gap-3">
                              <span className="px-2.5 py-0.5 rounded-full bg-[#F2F2F2] hover:bg-[#EAEAEA] text-[#242424] font-medium text-[11px] transition-colors">
                                {post.category}
                              </span>
                              <span>{post.readingTime}</span>
                              <span>&middot;</span>
                              <span className="inline-flex items-center gap-1">
                                <ClapIcon className="w-3.5 h-3.5 text-[#6B6B6B]" />
                                <span>96</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-medium text-[#242424] text-[12.5px] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                                <span>Read story</span>
                                <ArrowRight className="w-3 h-3" />
                              </span>
                              <button
                                onClick={(e) => toggleBookmark(post.slug, e)}
                                className="p-1 text-[#6B6B6B] hover:text-[#242424] cursor-pointer"
                                title="Save story"
                              >
                                <Bookmark className={`w-4 h-4 ${savedPosts.has(post.slug) ? "fill-[#242424] text-[#242424]" : ""}`} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Right Thumbnail */}
                        {post.featureImage && (
                          <div className="w-full sm:w-[130px] md:w-[145px] aspect-[16/10] sm:aspect-[4/3] rounded-[4px] overflow-hidden bg-neutral-100 shrink-0 self-center sm:self-start">
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

          {/* RIGHT: EDITORIAL STICKY SIDEBAR (Col 9-12) */}
          <aside className="hidden lg:block lg:col-span-4 border-l border-[#F2F2F2] pl-8 space-y-10 sticky top-28">
            
            {/* Staff Picks (No author repetition) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[13.5px] font-bold text-[#242424]">
                <Sparkles className="w-4 h-4 text-[#242424]" />
                <span>Featured Stories</span>
              </div>

              <div className="space-y-4">
                {staffPicks.map((pick) => (
                  <Link
                    key={pick.slug}
                    href={`/blog/${pick.slug}`}
                    className="group block space-y-1"
                  >
                    <h4 className="font-[family-name:var(--font-plus-jakarta)] font-bold text-[14px] text-[#242424] group-hover:underline line-clamp-2 leading-snug">
                      {pick.title}
                    </h4>
                    <span className="text-[12px] text-[#6B6B6B] block">
                      {pick.date} &middot; {pick.readingTime}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recommended Topics */}
            <div className="pt-6 border-t border-[#F2F2F2] space-y-3">
              <h3 className="font-bold text-[13.5px] text-[#242424]">
                Recommended topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {["DevOps", "Terraform", "AWS", "Kubernetes", "Security", "CI/CD", "Architecture"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setActiveCategory(tag);
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-normal transition-colors cursor-pointer ${
                      activeCategory === tag
                        ? "bg-[#242424] text-white"
                        : "bg-[#F2F2F2] hover:bg-[#EAEAEA] text-[#242424]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Publication Quick Links */}
            <div className="pt-6 border-t border-[#F2F2F2] text-[11px] text-[#6B6B6B] space-x-2.5 leading-loose">
              <Link href="/" className="hover:text-[#242424]">Portfolio</Link>
              <span>&middot;</span>
              <button onClick={() => setCvOpen(true)} className="hover:text-[#242424] cursor-pointer">Curriculum Vitae</button>
              <span>&middot;</span>
              <Link href="/blog" className="hover:text-[#242424]">Archive</Link>
              <span>&middot;</span>
              <span>WVRNER</span>
            </div>

          </aside>

        </div>

      </div>

      {/* CV Modal */}
      <CVDrawer isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </div>
  );
}
