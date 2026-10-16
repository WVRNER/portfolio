"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { CVDrawer } from "@/components/CVDrawer";
import { BLOG_POSTS, type BlogPost } from "@/lib/blogData";

/**
 * Editorial Blog Archive — WVRNER STORIES
 * Designed with Apple Newsroom craftsmanship and Medium.com's effortless reading comfort.
 * Pure typographic restraint — zero noisy e-commerce tag filters, zero artificial status counters.
 */
export default function BlogIndexPage() {
  const [cvOpen, setCvOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
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
    <div className="relative min-h-[100dvh] bg-[#FCFCFB] text-[#1D1D1F] font-sans antialiased selection:bg-[#1D1D1F] selection:text-white">
      {/* Floating Navigation Pill */}
      <Navigation onOpenCV={() => setCvOpen(true)} />

      {/* Main Publication Container */}
      <main className="max-w-[1240px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pt-32 sm:pt-40 pb-28">
        
        {/* Navigation Breadcrumb / Folio Bar */}
        <div className="flex items-center justify-between gap-4 mb-10 pb-5 border-b border-black/[0.07] text-[12px] font-sans text-[#86868B]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 hover:text-[#1D1D1F] transition-colors group cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to portfolio</span>
          </Link>

          <div className="flex items-center gap-2 text-[12px] text-[#86868B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F]" />
            <span className="text-[#1D1D1F] font-medium">Stories &amp; Field Notes</span>
          </div>
        </div>

        {/* Editorial Masthead */}
        <header className="mb-14 sm:mb-16">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.04] text-[11.5px] font-medium tracking-wide uppercase text-[#6E6E73]">
              <Sparkles className="w-3 h-3 text-[#1D1D1F]" />
              <span>WVRNER JOURNAL</span>
            </div>

            <h1 className="font-display text-[clamp(2.6rem,5.5vw,4.5rem)] font-semibold tracking-[-0.035em] text-[#1D1D1F] leading-[1.04]">
              Stories
            </h1>

            <p className="text-[17px] sm:text-[19px] text-[#6E6E73] leading-relaxed font-normal pt-1 max-w-[56ch]">
              Notes on distributed architecture, cloud infrastructure, and the disciplined engineering behind quiet production systems.
            </p>

            <div className="flex items-center gap-2.5 pt-2 text-[13px] text-[#86868B]">
              <span className="font-medium text-[#1D1D1F]">Cloud &amp; DevOps Engineering</span>
              <span>&middot;</span>
              <span>Production Field Notes</span>
            </div>
          </div>
        </header>

        {/* ======================================================== */}
        {/* STORY FEED CADENCE                                       */}
        {/* ======================================================== */}
        {BLOG_POSTS.length > 0 && (
          <div className="space-y-14 sm:space-y-16">

            {/* 1. LEAD FEATURE STORY (Only on Page 1 to let Page 2+ focus on recent archive) */}
            {currentPage === 1 && leadPost && (
              <section className="relative">
                <Link
                  href={`/blog/${leadPost.slug}`}
                  className="group block p-8 sm:p-12 md:p-14 bg-white rounded-3xl border border-black/[0.07] hover:border-black/[0.18] transition-all duration-300 shadow-[0_2px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 cursor-pointer relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]"
                >
                  {/* Subtle Top Specular Sheen */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />

                  {/* Header Meta Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-black/[0.06] text-[12.5px] text-[#86868B]">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-full bg-[#1D1D1F] text-white font-medium text-[11.5px]">
                        Featured Story
                      </span>
                      <span>&middot;</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F5F5F7] text-[#1D1D1F] font-medium text-[11px]">
                        {leadPost.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span>{leadPost.date}</span>
                      <span>&middot;</span>
                      <span className="flex items-center gap-1.5 text-[#1D1D1F]">
                        <Clock className="w-3.5 h-3.5 text-[#86868B]" />
                        <span>{leadPost.readingTime}</span>
                      </span>
                    </div>
                  </div>

                  {/* Monumental Title */}
                  <div className="space-y-3.5 max-w-4xl mb-6">
                    <h2 className="font-display text-[26px] sm:text-[34px] md:text-[40px] font-semibold text-[#1D1D1F] leading-[1.14] sm:leading-[1.1] tracking-[-0.03em] group-hover:text-[#404040] transition-colors">
                      {leadPost.title}
                    </h2>
                    
                    {leadPost.subtitle && (
                      <p className="text-[17px] sm:text-[18.5px] text-[#515154] font-normal leading-relaxed">
                        {leadPost.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Editorial Pull Quote */}
                  {leadPost.pullQuote && (
                    <div className="my-6 py-4 px-5 rounded-2xl bg-[#F9F9FB] border-l-3 border-[#1D1D1F]">
                      <p className="italic text-[15.5px] sm:text-[16.5px] text-[#2C2C2E] leading-relaxed">
                        &ldquo;{leadPost.pullQuote}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Excerpt Paragraph */}
                  <p className="text-[15.5px] sm:text-[16.5px] text-[#515154] leading-relaxed max-w-[70ch] font-normal mb-8">
                    {leadPost.excerpt}
                  </p>

                  {/* Action Bar */}
                  <div className="pt-6 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {leadPost.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11.5px] px-2.5 py-1 rounded-full bg-[#F5F5F7] text-[#6E6E73] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#161617] text-white text-[13.5px] font-medium tracking-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_16px_rgba(0,0,0,0.12)] group-hover:bg-[#2C2C2E] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_22px_rgba(0,0,0,0.2)] transition-all duration-300">
                      <span>Read story</span>
                      <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* 2. RECENT STORIES STREAM (Clean Editorial Grid with Zero Clutter) */}
            {remainingPosts.length > 0 && (
              <div id="recent-stories" className="space-y-8 scroll-mt-28">
                <div className="pb-4 border-b border-black/[0.07]">
                  <h3 className="font-display text-[22px] sm:text-[24px] font-semibold text-[#1D1D1F] tracking-tight">
                    Recent Stories
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {paginatedRecentPosts.map((post) => (
                    <article key={post.slug} className="flex">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group flex-1 p-7 sm:p-8 bg-white rounded-3xl border border-black/[0.07] hover:border-black/[0.18] transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.015)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]"
                      >
                        <div>
                          {/* Topic & Reading Time */}
                          <div className="flex items-center justify-between text-[12px] text-[#86868B] mb-3.5">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#F5F5F7] text-[#1D1D1F] font-medium text-[11px]">
                              {post.category}
                            </span>
                            <span className="flex items-center gap-1.5 text-[#1D1D1F]">
                              <Clock className="w-3 h-3 text-[#86868B]" />
                              <span>{post.readingTime}</span>
                            </span>
                          </div>

                          {/* Headline */}
                          <h4 className="font-display text-[20px] sm:text-[22px] font-semibold text-[#1D1D1F] leading-snug tracking-[-0.02em] group-hover:text-[#555] transition-colors mb-3">
                            {post.title}
                          </h4>

                          {/* Excerpt */}
                          <p className="text-[14.5px] text-[#6E6E73] leading-relaxed line-clamp-3 mb-6 font-normal">
                            {post.excerpt}
                          </p>
                        </div>

                        {/* Bottom Footer */}
                        <div className="pt-5 border-t border-black/[0.06] flex items-center justify-between text-[12.5px]">
                          <span className="text-[#86868B]">{post.date}</span>
                          <span className="inline-flex items-center gap-1.5 font-medium text-[#1D1D1F] group-hover:translate-x-0.5 transition-transform">
                            <span>Read story</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>

                {/* Apple + Medium Minimal Centered Pagination */}
                {totalPages > 1 && (
                  <nav
                    aria-label="Stories pagination"
                    className="pt-10 sm:pt-12 border-t border-black/[0.07] flex items-center justify-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      aria-label="Previous page"
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                        currentPage <= 1
                          ? "text-black/25 bg-black/[0.02] cursor-not-allowed"
                          : "text-[#1D1D1F] bg-black/[0.04] hover:bg-black/[0.08] active:scale-95 cursor-pointer"
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
                        const isActive = pageNum === currentPage;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            aria-current={isActive ? "page" : undefined}
                            className={`w-9 h-9 rounded-full text-[13px] font-medium transition-all flex items-center justify-center cursor-pointer ${
                              isActive
                                ? "bg-[#1D1D1F] text-white shadow-sm"
                                : "text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.05] active:scale-95"
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
                          : "text-[#1D1D1F] bg-black/[0.04] hover:bg-black/[0.08] active:scale-95 cursor-pointer"
                      }`}
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </nav>
                )}
              </div>
            )}

            {/* 3. APPLE-STYLE CALLOUT CARD: Systems Engineering Philosophy */}
            <div className="p-8 sm:p-12 rounded-3xl bg-[#F5F5F7] border border-black/[0.06] text-[#1D1D1F] relative overflow-hidden">
              <div className="max-w-2xl space-y-4">
                <div className="text-[11.5px] font-medium tracking-wide uppercase text-[#86868B]">
                  ENGINEERING PHILOSOPHY
                </div>
                <h3 className="font-display text-[24px] sm:text-[28px] font-semibold text-[#1D1D1F] tracking-tight">
                  Quiet infrastructure. Dependable delivery.
                </h3>
                <p className="text-[15px] sm:text-[16px] text-[#6E6E73] leading-relaxed">
                  Every article documents the discipline required to build resilient cloud architectures: eliminating drift, enforcing cryptographic security boundaries, and designing systems that fail predictably and recover automatically.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setCvOpen(true)}
                    className="px-5 py-2.5 rounded-full bg-[#161617] text-white text-[13px] font-medium hover:bg-[#2C2C2E] transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    View Resume
                  </button>
                  <Link
                    href="/#contact"
                    className="px-5 py-2.5 rounded-full bg-white text-[#1D1D1F] border border-black/[0.08] hover:bg-black/[0.03] text-[13px] font-medium transition-all cursor-pointer active:scale-95"
                  >
                    Get in touch
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Clean Apple-style Colophon Footer */}
      <footer className="border-t border-black/[0.07] py-12 px-6 sm:px-10 md:px-16 max-w-[1240px] mx-auto text-[12px] text-[#86868B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F]" />
          <span>WVRNER &middot; 2026</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/" className="hover:text-[#1D1D1F] transition-colors">
            Portfolio Home
          </Link>
          <button
            onClick={() => setCvOpen(true)}
            className="hover:text-[#1D1D1F] transition-colors cursor-pointer underline underline-offset-4"
          >
            Curriculum Vitae
          </button>
          <span>All rights reserved</span>
        </div>
      </footer>

      {/* CV Modal */}
      <CVDrawer isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </div>
  );
}
