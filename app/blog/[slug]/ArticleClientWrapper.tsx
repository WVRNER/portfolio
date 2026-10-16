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
  Bookmark,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { CVDrawer } from "@/components/CVDrawer";
import { BLOG_POSTS, type BlogPost } from "@/lib/blogData";

interface ArticleClientWrapperProps {
  post: BlogPost;
}

// Medium-style Clapping Hands SVG Icon
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
 * ArticleClientWrapper — Authentic Medium.com Longform Reading Experience
 * 
 * - Fonts:
 *   - Headings: Bold modern sans (Plus Jakarta Sans / Söhne style)
 *   - Article Body: Medium's signature editorial serif (Source Serif 4 / Charter)
 * - 0% read removed
 * - Medium Author Byline Bar (Avatar, name, publication, date, reading time)
 * - Medium Action Strip (Interactive claps, bookmark, share, copy link)
 * - Feature Cover Image with editorial caption
 * - Synchronized with Ghost CMS
 */
export function ArticleClientWrapper({ post }: ArticleClientWrapperProps) {
  const [cvOpen, setCvOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [claps, setClaps] = useState(184);
  const [hasClapped, setHasClapped] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [following, setFollowing] = useState(false);

  // Track reading scroll progress (for top progress hairline)
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

  const handleClap = () => {
    setClaps((prev) => prev + 1);
    setHasClapped(true);
  };

  // Find next and recommended articles
  const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === post.slug);
  const recommendedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="relative min-h-[100dvh] bg-[#FFFFFF] text-[#242424] font-sans antialiased selection:bg-[#E8F3EC] selection:text-[#1A8917]">
      {/* Top Reading Progress Indicator (Hairline) */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#242424] z-50 transition-transform duration-100 origin-left will-change-transform"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        aria-hidden="true"
      />

      {/* Navigation */}
      <Navigation onOpenCV={() => setCvOpen(true)} />

      {/* Main Longform Article Wrapper */}
      <main className="max-w-[740px] mx-auto px-5 sm:px-8 md:px-10 pt-28 sm:pt-36 pb-24">
        
        {/* Navigation Breadcrumb & Utility Strip */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-[#F2F2F2] text-[13px] text-[#6B6B6B]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#242424] transition-colors group cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Stories</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-[#F2F2F2] text-[#6B6B6B] hover:text-[#242424] transition-colors cursor-pointer text-[12.5px] font-medium"
              title="Share story URL"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#1A8917]" />
                  <span className="text-[#1A8917]">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Medium Story Header */}
        <header className="space-y-4 pb-6">
          
          {/* Headline (Medium's bold high-contrast sans) */}
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-[32px] sm:text-[42px] md:text-[46px] font-bold text-[#242424] leading-[1.18] sm:leading-[1.14] tracking-[-0.022em]">
            {post.title}
          </h1>

          {/* Subtitle (Medium's signature gray secondary line) */}
          {post.subtitle && (
            <p className="text-[19px] sm:text-[22px] text-[#6B6B6B] font-normal leading-[1.4] tracking-normal font-sans pt-1">
              {post.subtitle}
            </p>
          )}

          {/* Medium Author Byline Bar */}
          <div className="pt-6 pb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#161617] text-white flex items-center justify-center font-bold text-[13px] shadow-sm shrink-0">
                NH
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#242424] text-[15px]">Nima Hosseini</span>
                  <button
                    onClick={() => setFollowing(!following)}
                    className={`text-[13px] font-medium transition-colors ${
                      following ? "text-[#6B6B6B]" : "text-[#1A8917] hover:text-[#156912]"
                    }`}
                  >
                    {following ? "Following" : "Follow"}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#6B6B6B] pt-0.5">
                  <span>Published in WVRNER Journal</span>
                  <span>&middot;</span>
                  <span>{post.readingTime}</span>
                  <span>&middot;</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Medium Action Strip (Claps, Bookmark, Share) */}
          <div className="py-3 px-1 border-y border-[#F2F2F2] flex items-center justify-between text-[#6B6B6B] text-[13.5px]">
            <div className="flex items-center gap-6">
              <button
                onClick={handleClap}
                className={`inline-flex items-center gap-2 transition-all active:scale-125 cursor-pointer ${
                  hasClapped ? "text-[#1A8917] font-medium" : "hover:text-[#242424]"
                }`}
                title="Clap for this story"
              >
                <span className="w-6 h-6 flex items-center justify-center rounded-full">
                  <MediumClapIcon className="w-4 h-4" />
                </span>
                <span>{claps}</span>
              </button>

              <div className="inline-flex items-center gap-2 text-[#6B6B6B]">
                <MessageCircle className="w-4 h-4" />
                <span>12</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  bookmarked ? "text-[#242424]" : "hover:text-[#242424]"
                }`}
                title="Save story"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-1.5 rounded-full hover:text-[#242424] transition-colors cursor-pointer"
                title="Share story"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </header>

        {/* Feature / Cover Image (Medium Style) */}
        {post.featureImage && (
          <figure className="my-8 sm:my-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featureImage}
              alt={post.title}
              className="w-full h-auto max-h-[460px] object-cover rounded-md shadow-sm bg-neutral-100"
              loading="eager"
            />
            <figcaption className="text-center text-[13px] text-[#6B6B6B] mt-2.5 font-sans">
              Architectural state boundaries and deployment topology &bull; Verified in production
            </figcaption>
          </figure>
        )}

        {/* Medium Editorial Pullquote */}
        {post.pullQuote && (
          <blockquote className="my-8 pl-5 sm:pl-6 border-l-3 border-[#242424]">
            <p className="font-[family-name:var(--font-source-serif),Charter,Georgia,serif] italic text-[21px] sm:text-[23px] text-[#242424] leading-[1.4]">
              &ldquo;{post.pullQuote}&rdquo;
            </p>
          </blockquote>
        )}

        {/* Article Body Content (Medium's Signature Serif Typography) */}
        <article className="py-6 font-[family-name:var(--font-source-serif),Charter,Georgia,serif] text-[19px] sm:text-[20px] leading-[32px] sm:leading-[34px] text-[#242424] font-normal selection:bg-[#E8F3EC]">
          
          {/* Lead Abstract with Medium-style Drop-Cap */}
          {post.content.lead && (
            <div className="mb-8">
              <span className="float-left text-[3.8rem] sm:text-[4.4rem] leading-[0.78] pr-3 pt-1.5 font-serif font-bold text-[#242424]">
                {post.content.lead.charAt(0)}
              </span>
              <span>{post.content.lead.slice(1)}</span>
            </div>
          )}

          {/* Content Sections */}
          {post.content.sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-6 pt-4">
              
              {/* Section Heading (Medium Bold Sans) */}
              {section.heading && (
                <h2 className="font-[family-name:var(--font-plus-jakarta)] font-bold text-[24px] sm:text-[28px] text-[#242424] tracking-[-0.016em] leading-tight pt-6 pb-2">
                  {section.heading}
                </h2>
              )}

              {/* Section Paragraphs */}
              {section.paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="mb-7">
                  {para}
                </p>
              ))}

              {/* Code Snippet Block */}
              {section.codeBlock && (
                <div className="my-8 rounded-xl border border-[#2E2E2E] bg-[#161617] text-[#EDEDED] overflow-hidden shadow-lg font-mono">
                  <div className="px-5 py-2.5 bg-[#1F1F21] border-b border-[#2E2E2E] flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3E3E3E]" />
                      <span className="text-[#D4D4D4] font-medium font-sans">
                        {section.codeBlock.filename || "manifest.tf"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[#888888] uppercase tracking-wider text-[10.5px] px-2 py-0.5 rounded bg-white/5 font-sans">
                        {section.codeBlock.language}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyCode(
                            section.codeBlock!.code,
                            `code-${sIdx}`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2A2A2D] hover:bg-[#38383C] text-[11px] text-[#EDEDED] transition-colors cursor-pointer font-sans"
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

                  <div className="p-5 sm:p-6 overflow-x-auto text-[13.5px] font-mono leading-relaxed bg-[#161617]">
                    <pre>
                      <code>{section.codeBlock.code}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Architectural Rule Callout */}
              {section.callout && (
                <aside className="my-8 p-6 sm:p-7 rounded-xl border-l-4 border-[#242424] bg-[#F7F7F7] space-y-1.5 font-sans">
                  <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-[#242424] font-bold">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{section.callout.title}</span>
                  </div>
                  <p className="text-[15px] sm:text-[16px] text-[#404040] leading-relaxed font-normal">
                    {section.callout.body}
                  </p>
                </aside>
              )}

              {/* Numbered Invariants */}
              {section.list && (
                <div className="my-6 space-y-2.5 font-sans">
                  {section.list.map((item, lIdx) => (
                    <div
                      key={lIdx}
                      className="flex items-start gap-3 p-4 rounded-lg bg-[#FAFAFA] border border-[#EAEAEA] text-[15px] text-[#242424]"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#242424] text-white text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                        {lIdx + 1}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}

        </article>

        {/* Medium Bottom Article Actions & Tags */}
        <div className="pt-8 pb-10 border-b border-[#F2F2F2] space-y-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full bg-[#F2F2F2] hover:bg-[#EAEAEA] text-[#242424] text-[13px] font-medium font-sans cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bottom Claps & Response Strip */}
          <div className="flex items-center justify-between text-[#6B6B6B] text-[13.5px] pt-3">
            <div className="flex items-center gap-6">
              <button
                onClick={handleClap}
                className={`inline-flex items-center gap-2 transition-all active:scale-125 cursor-pointer ${
                  hasClapped ? "text-[#1A8917] font-medium" : "hover:text-[#242424]"
                }`}
              >
                <span className="w-6 h-6 flex items-center justify-center rounded-full">
                  <MediumClapIcon className="w-4 h-4" />
                </span>
                <span>{claps} claps</span>
              </button>

              <div className="inline-flex items-center gap-1.5 text-[#6B6B6B]">
                <MessageCircle className="w-4 h-4" />
                <span>12 responses</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  bookmarked ? "text-[#242424]" : "hover:text-[#242424]"
                }`}
                title="Save story"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-1.5 rounded-full hover:text-[#242424] transition-colors cursor-pointer"
                title="Share story"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Medium Author Signature Box */}
        <section className="py-10 border-b border-[#F2F2F2]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[#161617] text-white flex items-center justify-center font-bold text-[18px] shrink-0 shadow-sm">
                NH
              </div>
              <div className="space-y-1">
                <span className="text-[12px] uppercase font-bold text-[#6B6B6B] tracking-wider block font-sans">
                  WRITTEN BY
                </span>
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-[18px] font-bold text-[#242424]">
                  Nima Hosseini
                </h3>
                <p className="text-[14px] text-[#6B6B6B] leading-relaxed max-w-md font-sans">
                  Cloud &amp; DevOps Engineer. Engineering automated cloud systems, declarative infrastructure, and reproducible state across AWS.
                </p>
                <div className="text-[12.5px] text-[#6B6B6B] pt-1 font-sans">
                  <span>1.4K Followers</span> &middot; <span>WVRNER Journal</span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center gap-2.5 shrink-0">
              <button
                onClick={() => setFollowing(!following)}
                className={`px-5 py-2 rounded-full text-[13.5px] font-medium transition-all cursor-pointer font-sans ${
                  following
                    ? "bg-[#F2F2F2] text-[#242424] hover:bg-[#E6E6E6]"
                    : "bg-[#1A8917] hover:bg-[#156912] text-white shadow-sm"
                }`}
              >
                {following ? "Following" : "Follow"}
              </button>
              <button
                onClick={() => setCvOpen(true)}
                className="px-4 py-2 rounded-full border border-black/15 hover:bg-black/5 text-[#242424] text-[13px] font-medium transition-all cursor-pointer font-sans"
              >
                View CV
              </button>
            </div>
          </div>
        </section>

        {/* Medium Recommended: "More from Nima Hosseini" */}
        {recommendedPosts.length > 0 && (
          <section className="pt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-[20px] font-bold text-[#242424]">
                More from Nima Hosseini
              </h3>
              <Link
                href="/blog"
                className="text-[13px] text-[#1A8917] hover:underline font-medium font-sans"
              >
                See all stories
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedPosts.map((rec) => (
                <Link
                  key={rec.slug}
                  href={`/blog/${rec.slug}`}
                  className="group flex flex-col justify-between p-4 rounded-xl bg-white hover:bg-[#FAFAFA] border border-[#F2F2F2] hover:border-[#E0E0E0] transition-all cursor-pointer"
                >
                  <div>
                    {rec.featureImage && (
                      <div className="aspect-[16/10] w-full overflow-hidden rounded-md mb-3 bg-neutral-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rec.featureImage}
                          alt={rec.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <span className="text-[11px] font-medium text-[#6B6B6B] block mb-1 font-sans">
                      {rec.category} &middot; {rec.readingTime}
                    </span>
                    <h4 className="font-[family-name:var(--font-plus-jakarta)] text-[15px] font-bold text-[#242424] group-hover:text-[#555] transition-colors leading-snug line-clamp-2">
                      {rec.title}
                    </h4>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#F2F2F2] flex items-center justify-between text-[11.5px] text-[#6B6B6B] font-sans">
                    <span>{rec.date}</span>
                    <span className="font-medium text-[#242424] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Read story &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* CV Modal */}
      <CVDrawer isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </div>
  );
}
