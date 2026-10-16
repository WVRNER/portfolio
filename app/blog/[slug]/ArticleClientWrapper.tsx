"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Copy,
  Check,
  Share2,
  ShieldCheck,
  Bookmark,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { CVDrawer } from "@/components/CVDrawer";
import { BLOG_POSTS, type BlogPost } from "@/lib/blogData";

interface ArticleClientWrapperProps {
  post: BlogPost;
}

/**
 * Editorial Article Monograph Reader — WVRNER DISPATCHES
 * Designed for effortless, fatigue-free longform reading with high perceived quality.
 * 
 * Features:
 * - Fluid reading progress bar with subtle percentage readout
 * - Strict 65ch measure for optimal eye tracking and cognitive comfort
 * - Authentic editorial drop-caps, section anchors (§ 1.0), and marginalia
 * - Machined dark graphite code enclosures with 1-click clipboard copy
 * - Narrative rabbit-hole discovery that seamlessly pulls the reader into the next dispatch
 */
export function ArticleClientWrapper({ post }: ArticleClientWrapperProps) {
  const [cvOpen, setCvOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      });
    }
  };

  // Find next article in sequence with continuity
  const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === post.slug);
  const nextPost =
    post.nextSlug
      ? BLOG_POSTS.find((p) => p.slug === post.nextSlug) || BLOG_POSTS[(currentIndex + 1) % BLOG_POSTS.length]
      : BLOG_POSTS[(currentIndex + 1) % BLOG_POSTS.length];

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.slug !== nextPost?.slug);

  return (
    <div className="relative min-h-[100dvh] bg-[#FCFCFB] text-[#0A0A0A] font-sans antialiased selection:bg-[#0A0A0A] selection:text-white">
      {/* Top Reading Progress Indicator */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#0A0A0A] z-50 transition-transform duration-100 origin-left will-change-transform"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        aria-hidden="true"
      />

      {/* Navigation */}
      <Navigation onOpenCV={() => setCvOpen(true)} />

      {/* Main Longform Article Wrapper */}
      <main className="max-w-[760px] mx-auto px-5 sm:px-10 md:px-12 pt-32 sm:pt-40 pb-28 overflow-hidden">
        
        {/* Navigation Breadcrumb & Utility Strip */}
        <div className="flex items-center justify-between gap-4 mb-10 pb-5 border-b border-black/[0.07] text-[12px] text-[#86868B]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 hover:text-[#1D1D1F] transition-colors group cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to stories</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[#1D1D1F] font-medium text-[12px]">
              {Math.round(scrollProgress)}% read
            </span>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] transition-colors cursor-pointer text-[12px] font-medium"
              title="Copy story URL"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Story Header */}
        <header className="space-y-6 pb-10 border-b border-black/[0.07]">
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-[#86868B]">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-[#F5F5F7] text-[#1D1D1F] font-medium text-[11.5px]">
                {post.category}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span>{post.date}</span>
              <span>&middot;</span>
              <span className="flex items-center gap-1.5 text-[#1D1D1F]">
                <Clock className="w-3.5 h-3.5 text-[#86868B]" />
                <span>{post.readingTime}</span>
              </span>
            </div>
          </div>

          {/* Monumental Headline */}
          <h1 className="font-display text-[26px] sm:text-[34px] md:text-[42px] font-semibold text-[#1D1D1F] leading-[1.15] sm:leading-[1.1] tracking-[-0.03em] break-words">
            {post.title}
          </h1>

          {/* Subtitle / Core Thesis */}
          {post.subtitle && (
            <p className="text-[17px] sm:text-[19px] text-[#6E6E73] leading-relaxed font-normal">
              {post.subtitle}
            </p>
          )}

          {/* Editorial Quote Banner */}
          {post.pullQuote && (
            <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#F9F9FB] border-l-3 border-[#1D1D1F]">
              <p className="italic text-[16px] sm:text-[17.5px] text-[#2C2C2E] leading-relaxed">
                &ldquo;{post.pullQuote}&rdquo;
              </p>
            </div>
          )}

          {/* Author Byline Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-[12.5px] border-t border-black/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
                NH
              </div>
              <div>
                <span className="font-semibold text-[#1D1D1F] block">Nima Hosseini</span>
                <span className="text-[11.5px] text-[#86868B]">Cloud &amp; DevOps Engineer</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50 text-[11.5px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified in Production</span>
            </div>
          </div>

        </header>

        {/* Article Body Content */}
        <article className="py-12 space-y-12 text-[#1C1C1A]">
          
          {/* Lead Abstract with Editorial Drop-Cap on First Paragraph */}
          {post.content.lead && (
            <div className="text-[18px] sm:text-[19.5px] text-[#2E2E2C] leading-relaxed font-normal">
              <span className="float-left text-[4rem] sm:text-[4.5rem] leading-[0.8] pr-3 pt-1 font-serif text-[#0A0A0A] font-bold">
                {post.content.lead.charAt(0)}
              </span>
              <span>{post.content.lead.slice(1)}</span>
            </div>
          )}

          {/* Content Sections */}
          {post.content.sections.map((section, sIdx) => (
            <section key={sIdx} className="space-y-6 pt-4">
              
              {section.heading && (
                <div className="pt-6 pb-2 border-b border-[#0A0A0A]/8">
                  <div className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#737373] mb-1">
                    § {`0${sIdx + 1}`}.0 SECTION
                  </div>
                  <h2 className="font-display text-[22px] sm:text-[27px] font-medium text-[#0A0A0A] tracking-[-0.025em] leading-tight">
                    {section.heading}
                  </h2>
                </div>
              )}

              {section.paragraphs.map((para, pIdx) => (
                <p
                  key={pIdx}
                  className="text-[16.5px] sm:text-[17.5px] text-[#262624] leading-[1.85] font-normal"
                >
                  {para}
                </p>
              ))}

              {/* Machined Code Block with Header and Copy */}
              {section.codeBlock && (
                <div className="my-8 rounded-2xl border border-[#262626] bg-[#0E0F12] text-[#EDEDED] overflow-hidden shadow-xl">
                  <div className="px-5 py-3 bg-[#17181D] border-b border-[#262626] flex items-center justify-between text-[11.5px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#333333]" />
                      <span className="text-[#D4D4D4] font-medium">
                        {section.codeBlock.filename || "Manifest"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[#888888] uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-white/5">
                        {section.codeBlock.language}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyCode(
                            section.codeBlock!.code,
                            `code-${sIdx}`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#262626] hover:bg-[#383838] text-[11px] text-[#EDEDED] transition-colors cursor-pointer"
                        title="Copy code snippet"
                      >
                        {copiedCode === `code-${sIdx}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 overflow-x-auto text-[13.5px] font-mono leading-relaxed bg-[#0E0F12]">
                    <pre>
                      <code>{section.codeBlock.code}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Architectural Rule Callout */}
              {section.callout && (
                <aside className="my-8 p-6 sm:p-7 rounded-2xl border-l-4 border-[#0A0A0A] bg-[#F7F7F5] border-y border-r border-[#0A0A0A]/5 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#0A0A0A] font-semibold">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{section.callout.title}</span>
                  </div>
                  <p className="text-[15px] sm:text-[16px] text-[#404040] leading-relaxed font-normal">
                    {section.callout.body}
                  </p>
                </aside>
              )}

              {/* Numbered Core Invariants */}
              {section.list && (
                <div className="my-6 space-y-3 pt-2">
                  {section.list.map((item, lIdx) => (
                    <div
                      key={lIdx}
                      className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-[#0A0A0A]/6 text-[15.5px] text-[#262626]"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#0A0A0A] text-white text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                        {lIdx + 1}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              )}

            </section>
          ))}

        </article>

        {/* ======================================================== */}
        {/* STORY DISCOVERY & CONTINUITY                             */}
        {/* ======================================================== */}
        <footer className="pt-14 border-t border-black/[0.07] space-y-12">
          
          {/* Continuity Recommendation: Next Story */}
          {nextPost && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[12px] text-[#86868B] font-medium">
                <span>Next Story</span>
                <span>Continue Reading</span>
              </div>

              <Link
                href={`/blog/${nextPost.slug}`}
                className="group p-8 sm:p-10 rounded-3xl bg-white border border-black/[0.07] hover:border-black/[0.18] transition-all duration-300 shadow-[0_2px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 flex flex-col justify-between gap-6 cursor-pointer block relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-[12px] text-[#86868B]">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F5F5F7] text-[#1D1D1F] font-medium text-[11px]">
                      {nextPost.category}
                    </span>
                    <span>&middot;</span>
                    <span>{nextPost.readingTime}</span>
                  </div>

                  <h3 className="font-display text-[22px] sm:text-[26px] font-semibold text-[#1D1D1F] group-hover:text-[#555] transition-colors leading-snug">
                    {nextPost.title}
                  </h3>

                  {nextPost.pullQuote && (
                    <p className="italic text-[15px] sm:text-[16px] text-[#6E6E73] leading-relaxed">
                      &ldquo;{nextPost.pullQuote}&rdquo;
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between text-[13px] font-medium text-[#1D1D1F]">
                  <span>Read next story</span>
                  <span className="w-8 h-8 rounded-full bg-[#161617] text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shadow-sm">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </div>
          )}

          {/* Quick Browse Shelf: More Stories */}
          {otherPosts.length > 0 && (
            <div className="space-y-4">
              <div className="text-[12px] text-[#86868B] font-medium">
                More Stories
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherPosts.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/blog/${other.slug}`}
                    className="p-6 rounded-2xl bg-[#F5F5F7] hover:bg-white border border-black/[0.05] hover:border-black/[0.15] transition-all duration-200 group block cursor-pointer"
                  >
                    <div className="text-[11.5px] text-[#86868B] mb-2 flex justify-between">
                      <span className="font-medium text-[#1D1D1F]">{other.category}</span>
                      <span>{other.readingTime}</span>
                    </div>
                    <h4 className="font-display text-[16px] font-semibold text-[#1D1D1F] group-hover:text-[#555] transition-colors leading-snug line-clamp-2">
                      {other.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author Signature & Card */}
          <div className="p-7 sm:p-9 bg-[#F5F5F7] rounded-3xl border border-black/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="font-display text-[20px] font-semibold text-[#1D1D1F]">
                Nima Hosseini
              </div>
              <p className="text-[14px] text-[#6E6E73] max-w-md leading-relaxed">
                Architecting declarative cloud environments, automated delivery workflows, and resilient multi-region infrastructure.
              </p>
            </div>

            <button
              onClick={() => setCvOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#161617] text-white text-[13px] font-medium hover:bg-[#2C2C2E] transition-all cursor-pointer flex-shrink-0 shadow-sm active:scale-95"
            >
              View Resume
            </button>
          </div>

          {/* Bottom Return Bar */}
          <div className="flex items-center justify-between pt-6 text-[12px] text-[#86868B]">
            <Link
              href="/blog"
              className="hover:text-[#1D1D1F] hover:underline underline-offset-4 flex items-center gap-1.5 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all stories</span>
            </Link>
            <Link
              href="/"
              className="hover:text-[#1D1D1F] hover:underline underline-offset-4 font-medium"
            >
              Portfolio Home
            </Link>
          </div>

        </footer>

      </main>

      {/* CV Modal */}
      <CVDrawer isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </div>
  );
}
