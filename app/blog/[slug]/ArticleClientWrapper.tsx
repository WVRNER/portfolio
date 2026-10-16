"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  Bookmark,
  Check,
  Copy,
  Volume2,
  MoreHorizontal,
  MessageCircle,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { CVDrawer } from "@/components/CVDrawer";
import { BLOG_POSTS, type BlogPost } from "@/lib/blogData";

interface ArticleClientWrapperProps {
  post: BlogPost;
}

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
 * ArticleClientWrapper — Editorial Longform Reading Experience
 * 
 * - Strictly calibrated 680px reading column
 * - Minimalist monochromatic palette (#FFFFFF canvas, #242424 ink, #6B6B6B secondary)
 * - Source Serif 4 body typography (20px / 34px line-height)
 * - Pure black "Read story" links and actions
 * - Audio "Listen" feature, claps, bookmarking, and share
 */
export function ArticleClientWrapper({ post }: ArticleClientWrapperProps) {
  const [cvOpen, setCvOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [claps, setClaps] = useState(184);
  const [hasClapped, setHasClapped] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Track reading scroll progress (hairline indicator)
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

  const handleListenToggle = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (isListening) {
        window.speechSynthesis.cancel();
        setIsListening(false);
      } else {
        const textToRead = `${post.title}. ${post.subtitle || ""}. ${post.content.lead || ""}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 1.0;
        utterance.onend = () => setIsListening(false);
        utterance.onerror = () => setIsListening(false);
        window.speechSynthesis.speak(utterance);
        setIsListening(true);
      }
    }
  };

  // 3 Recommended articles
  const recommendedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="relative min-h-[100dvh] bg-[#FFFFFF] text-[#242424] font-sans antialiased selection:bg-[#EAEAEA] selection:text-[#242424]">
      {/* Top Reading Progress Indicator (Hairline) */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#242424] z-50 transition-transform duration-100 origin-left will-change-transform"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        aria-hidden="true"
      />

      {/* Navigation */}
      <Navigation onOpenCV={() => setCvOpen(true)} />

      {/* Main Longform Article Wrapper (Strict 680px column) */}
      <main className="max-w-[680px] mx-auto px-6 sm:px-8 md:px-0 pt-28 sm:pt-36 pb-28">
        
        {/* Navigation Breadcrumb & Folio Header */}
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
                  <Check className="w-3.5 h-3.5 text-[#242424]" />
                  <span className="text-[#242424]">Copied</span>
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

        {/* Story Header */}
        <header className="space-y-4">
          
          {/* Headline */}
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-[32px] sm:text-[40px] md:text-[44px] font-bold text-[#242424] leading-[1.2] sm:leading-[1.15] tracking-[-0.022em]">
            {post.title}
          </h1>

          {/* Subtitle */}
          {post.subtitle && (
            <p className="text-[19px] sm:text-[22px] text-[#6B6B6B] font-normal leading-[1.4] tracking-normal font-sans pt-1">
              {post.subtitle}
            </p>
          )}

          {/* Clean Byline (No redundant follow buttons) */}
          <div className="pt-4 pb-2 flex items-center gap-2.5 text-[13.5px] text-[#6B6B6B]">
            <span className="font-medium text-[#242424]">WVRNER Journal</span>
            <span>&middot;</span>
            <span>{post.date}</span>
            <span>&middot;</span>
            <span>{post.readingTime}</span>
          </div>

          {/* Action Strip (Claps, Audio, Bookmark, Share in pure black) */}
          <div className="py-3 px-0 border-y border-[#F2F2F2] flex items-center justify-between text-[#6B6B6B] text-[13.5px] my-7">
            <div className="flex items-center gap-6">
              <button
                onClick={handleClap}
                className={`inline-flex items-center gap-2 transition-all active:scale-125 cursor-pointer ${
                  hasClapped ? "text-[#242424] font-medium" : "hover:text-[#242424]"
                }`}
                title="Clap for this story"
              >
                <span className="w-6 h-6 flex items-center justify-center rounded-full">
                  <ClapIcon className="w-4 h-4" />
                </span>
                <span>{claps}</span>
              </button>

              <div className="inline-flex items-center gap-2 text-[#6B6B6B]">
                <MessageCircle className="w-4 h-4" />
                <span>12</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Audio Listen Pill */}
              <button
                onClick={handleListenToggle}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12.5px] font-medium transition-colors cursor-pointer ${
                  isListening
                    ? "bg-[#161617] text-white"
                    : "hover:bg-[#F2F2F2] text-[#6B6B6B] hover:text-[#242424]"
                }`}
                title={isListening ? "Stop listening" : "Listen to article"}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isListening ? "Playing..." : "Listen"}</span>
              </button>

              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  bookmarked ? "text-[#242424]" : "hover:text-[#242424]"
                }`}
                title="Save story"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current text-[#242424]" : ""}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-1.5 rounded-full hover:text-[#242424] transition-colors cursor-pointer"
                title="Share story"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                className="p-1.5 rounded-full hover:text-[#242424] transition-colors cursor-pointer"
                title="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

        </header>

        {/* Feature / Cover Image */}
        {post.featureImage && (
          <figure className="my-9">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featureImage}
              alt={post.title}
              className="w-full h-auto max-h-[460px] object-cover rounded-[3px] bg-neutral-100"
              loading="eager"
            />
            <figcaption className="text-center text-[13.5px] text-[#6B6B6B] mt-2.5 font-sans font-normal">
              Architectural state boundaries and deployment topology &bull; Verified in production
            </figcaption>
          </figure>
        )}

        {/* Editorial Pullquote */}
        {post.pullQuote && (
          <blockquote className="my-9 pl-6 border-l-[3px] border-[#242424]">
            <p className="font-[family-name:var(--font-source-serif),Charter,Georgia,serif] italic text-[21px] sm:text-[23px] text-[#242424] leading-[1.45]">
              &ldquo;{post.pullQuote}&rdquo;
            </p>
          </blockquote>
        )}

        {/* Article Body Content */}
        <article className="py-4 font-[family-name:var(--font-source-serif),Charter,Georgia,serif] text-[20px] leading-[34px] text-[#242424] font-normal selection:bg-[#EAEAEA]">
          
          {/* Lead Abstract */}
          {post.content.lead && (
            <p className="mb-8 font-normal leading-[34px]">
              {post.content.lead}
            </p>
          )}

          {/* Content Sections */}
          {post.content.sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-6 pt-4">
              
              {/* Section Heading */}
              {section.heading && (
                <h2 className="font-[family-name:var(--font-plus-jakarta)] font-bold text-[24px] sm:text-[28px] text-[#242424] tracking-[-0.016em] leading-tight pt-8 pb-2">
                  {section.heading}
                </h2>
              )}

              {/* Section Paragraphs */}
              {section.paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="mb-8 font-normal leading-[34px]">
                  {para}
                </p>
              ))}

              {/* Code Snippet Block */}
              {section.codeBlock && (
                <div className="my-9 rounded-lg border border-[#2E2E2E] bg-[#161617] text-[#EDEDED] overflow-hidden font-mono">
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
                <aside className="my-9 p-6 rounded-r-lg border-l-[3px] border-[#242424] bg-[#F9F9F9] space-y-1.5 font-sans">
                  <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-[#242424] font-bold">
                    <span>{section.callout.title}</span>
                  </div>
                  <p className="text-[15px] sm:text-[16px] text-[#404040] leading-relaxed font-normal">
                    {section.callout.body}
                  </p>
                </aside>
              )}

              {/* Numbered Invariants */}
              {section.list && (
                <div className="my-6 space-y-3 font-sans">
                  {section.list.map((item, lIdx) => (
                    <div
                      key={lIdx}
                      className="flex items-start gap-3.5 text-[16px] text-[#242424]"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#242424] text-white text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
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

        {/* Bottom Article Actions & Tags */}
        <div className="pt-8 pb-10 border-b border-[#F2F2F2] space-y-6">
          {/* Topic Tags */}
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
                  hasClapped ? "text-[#242424] font-medium" : "hover:text-[#242424]"
                }`}
              >
                <span className="w-6 h-6 flex items-center justify-center rounded-full">
                  <ClapIcon className="w-4 h-4" />
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
                <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current text-[#242424]" : ""}`} />
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

        {/* Author Bio Box (Clean and purposeful) */}
        <section className="py-10 border-b border-[#F2F2F2]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-[#161617] text-white flex items-center justify-center font-bold text-[16px] shrink-0">
                NH
              </div>
              <div className="space-y-1">
                <span className="text-[11.5px] uppercase font-bold text-[#6B6B6B] tracking-wider block font-sans">
                  WRITTEN BY
                </span>
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-[18px] font-bold text-[#242424]">
                  Nima Hosseini
                </h3>
                <p className="text-[14px] text-[#6B6B6B] leading-relaxed max-w-md font-sans">
                  Cloud &amp; DevOps Engineer. Engineering automated cloud systems, declarative infrastructure, and reproducible state across AWS.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setCvOpen(true)}
                className="px-5 py-2 rounded-full bg-[#161617] hover:bg-[#2C2C2E] text-white text-[13px] font-medium transition-all cursor-pointer font-sans"
              >
                View CV
              </button>
            </div>
          </div>
        </section>

        {/* More Stories Recommendations */}
        {recommendedPosts.length > 0 && (
          <section className="pt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-[20px] font-bold text-[#242424]">
                More from WVRNER Journal
              </h3>
              <Link
                href="/blog"
                className="text-[13px] text-[#242424] hover:underline font-medium font-sans"
              >
                See all stories
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedPosts.map((rec) => (
                <Link
                  key={rec.slug}
                  href={`/blog/${rec.slug}`}
                  className="group flex flex-col justify-between cursor-pointer space-y-3"
                >
                  <div>
                    {rec.featureImage && (
                      <div className="aspect-[16/10] w-full overflow-hidden rounded-[3px] mb-3 bg-neutral-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rec.featureImage}
                          alt={rec.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <h4 className="font-[family-name:var(--font-plus-jakarta)] text-[15.5px] font-bold text-[#242424] group-hover:underline transition-colors leading-snug line-clamp-2">
                      {rec.title}
                    </h4>
                    <p className="text-[13px] text-[#6B6B6B] line-clamp-2 mt-1.5 font-normal leading-relaxed">
                      {rec.subtitle || rec.excerpt}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[12px] text-[#6B6B6B] font-sans">
                    <span>{rec.readingTime} &middot; {rec.date}</span>
                    <span className="font-medium text-[#242424] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Read story</span>
                      <ArrowRight className="w-3 h-3" />
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
