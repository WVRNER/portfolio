"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Check,
  Copy,
  Link2,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { CVDrawer } from "@/components/CVDrawer";
import { EditorialFooter } from "@/components/EditorialFooter";
import { FeaturedStarIcon } from "@/components/FeaturedStarIcon";
import { BLOG_POSTS, formatDisplayDate, type BlogPost } from "@/lib/blogData";

interface ArticleClientWrapperProps {
  post: BlogPost;
}

/**
 * Percent-encode text according to W3C Scroll-to-Text-Fragment specification.
 * Delimiters like hyphens, commas, periods, and ampersands must be encoded
 * to prevent ambiguous parsing as prefix/suffix delimiters in browser engines.
 */
function encodeFragmentText(str: string): string {
  return encodeURIComponent(str)
    .replace(/-/g, "%2D")
    .replace(/_/g, "%5F")
    .replace(/\./g, "%2E")
    .replace(/!/g, "%21")
    .replace(/~/g, "%7E")
    .replace(/\*/g, "%2A")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

/**
 * Builds the text directive for URL text fragments.
 * For selections under 6 words, uses exact matching.
 * For longer selections, uses resilient start,end boundary matching per Chromium and W3C guidelines.
 */
function buildTextFragmentDirective(text: string): string {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 5) {
    return encodeFragmentText(text);
  }
  const start = words.slice(0, 3).join(" ");
  const end = words.slice(-3).join(" ");
  return `${encodeFragmentText(start)},${encodeFragmentText(end)}`;
}

export function ArticleClientWrapper({ post }: ArticleClientWrapperProps) {
  const [cvOpen, setCvOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Article body reference for scoped progress tracking and quote sharing
  const articleRef = useRef<HTMLElement>(null);
  const [quoteSelection, setQuoteSelection] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [quoteCopied, setQuoteCopied] = useState(false);

  // Track reading scroll progress through the article body only
  useEffect(() => {
    let ticking = false;

    const updateArticleProgress = () => {
      const el = articleRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Top boundary offset (beneath navigation)
      const topOffset = 90;
      const startOffset = rect.top - topOffset;
      const totalArticleDistance = rect.height - (viewportHeight - topOffset);

      if (totalArticleDistance <= 0) {
        setScrollProgress(rect.top <= topOffset ? 100 : 0);
        return;
      }

      if (startOffset > 0) {
        setScrollProgress(0);
      } else if (-startOffset >= totalArticleDistance) {
        setScrollProgress(100);
      } else {
        const progress = (-startOffset / totalArticleDistance) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateArticleProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateArticleProgress();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Highlight-to-share selection listener scoped to the article body
  useEffect(() => {
    const handleSelection = () => {
      if (typeof window === "undefined") return;
      const selection = window.getSelection();

      if (!selection || selection.isCollapsed) {
        setQuoteSelection(null);
        return;
      }

      const selectedText = selection.toString().trim();
      // Ignore short selections under ~10 characters
      if (selectedText.length < 10) {
        setQuoteSelection(null);
        return;
      }

      // Ensure selection is inside the article body
      const articleEl = articleRef.current;
      if (!articleEl) return;

      const anchorNode = selection.anchorNode;
      const focusNode = selection.focusNode;
      if (
        !anchorNode ||
        !focusNode ||
        !articleEl.contains(anchorNode) ||
        !articleEl.contains(focusNode)
      ) {
        setQuoteSelection(null);
        return;
      }

      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
          setQuoteSelection(null);
          return;
        }

        const buttonWidth = 156;
        const x = Math.max(
          16,
          Math.min(window.innerWidth - buttonWidth - 16, rect.left + rect.width / 2 - buttonWidth / 2)
        );
        const y = rect.top < 60 ? rect.bottom + 10 : rect.top - 44;

        setQuoteSelection({
          text: selectedText,
          x,
          y,
        });
      } catch {
        setQuoteSelection(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setQuoteSelection(null);
      }
    };

    document.addEventListener("selectionchange", handleSelection);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("selectionchange", handleSelection);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Scroll to and highlight quote when opened via shared link
  useEffect(() => {
    if (typeof window === "undefined") return;

    let quoteText: string | null = null;

    // 1. Primary: Check URL search parameter (?quote=...)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get("quote");
      if (q) {
        quoteText = decodeURIComponent(q).trim();
      }
    } catch {}

    // 2. Secondary: Check performance navigation entries for raw #:~:text= directive
    if (!quoteText) {
      try {
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries && navEntries.length > 0) {
          const navUrl = (navEntries[0] as PerformanceNavigationTiming).name;
          const textMatch = navUrl.match(/#:~:text=([^&#]+)/);
          if (textMatch && textMatch[1]) {
            const rawDirective = decodeURIComponent(textMatch[1]);
            if (rawDirective.includes(",")) {
              quoteText = rawDirective.split(",")[0].trim();
            } else {
              quoteText = rawDirective.trim();
            }
          }
        }
      } catch {}
    }

    // 3. Tertiary: Check window.location.hash in case browser preserved text= directive
    if (!quoteText && window.location.hash) {
      try {
        const hashMatch = window.location.hash.match(/text=([^&#]+)/);
        if (hashMatch && hashMatch[1]) {
          quoteText = decodeURIComponent(hashMatch[1]).split(",")[0].trim();
        }
      } catch {}
    }

    if (!quoteText) return;

    const targetQuote = quoteText;
    const normalize = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
    const normalizedTarget = normalize(targetQuote);
    const targetSnippet = normalizedTarget.slice(0, 32);

    // Give time for layout, fonts, and hydration to stabilize
    const timer = setTimeout(() => {
      const article = articleRef.current;
      if (!article) return;

      const candidates = Array.from(
        article.querySelectorAll("p, blockquote, h1, h2, h3, h4, li")
      ) as HTMLElement[];

      let matchedEl: HTMLElement | null = null;

      // Match strategy 1: full normalized string
      for (const el of candidates) {
        const text = normalize(el.textContent || "");
        if (text.includes(normalizedTarget)) {
          matchedEl = el;
          break;
        }
      }

      // Match strategy 2: start snippet prefix
      if (!matchedEl) {
        for (const el of candidates) {
          const text = normalize(el.textContent || "");
          if (text.includes(targetSnippet)) {
            matchedEl = el;
            break;
          }
        }
      }

      if (!matchedEl) return;

      // Scroll smoothly to target with sticky navigation clearance
      const navOffset = 100;
      const rect = matchedEl.getBoundingClientRect();
      const targetY = Math.max(0, rect.top + window.scrollY - navOffset);

      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });

      // Highlight target element
      matchedEl.classList.add("quote-highlight-active");

      const cleanupTimer = setTimeout(() => {
        matchedEl?.classList.remove("quote-highlight-active");
      }, 3200);

      return () => clearTimeout(cleanupTimer);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  const handleCopyQuoteLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!quoteSelection || typeof window === "undefined") return;

    const cleanText = quoteSelection.text.replace(/\s+/g, " ").trim();
    const fragmentDirective = buildTextFragmentDirective(cleanText);

    // Provide both universal query parameter (?quote=) and standard W3C text fragment (#:~:text=).
    // This guarantees instant, reliable scrolling across Safari, Brave, Chrome, Firefox, and mobile webviews.
    const fragmentUrl = `${window.location.origin}${window.location.pathname}?quote=${encodeURIComponent(cleanText)}#:~:text=${fragmentDirective}`;

    navigator.clipboard.writeText(fragmentUrl).then(() => {
      setQuoteCopied(true);
      setTimeout(() => {
        setQuoteCopied(false);
        setQuoteSelection(null);
      }, 2000);
    });
  };

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

  // Recommended articles (Selected Stories - 2x2 grid)
  const recommendedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 4);

  return (
    <div className="relative min-h-[100dvh] bg-[#FFFFFF] text-[#242424] font-sans antialiased selection:bg-[#EAEAEA] selection:text-[#242424]">
      {/* Top Reading Progress Indicator (Hairline) - Tracked strictly across article body */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#161617] z-50 origin-left will-change-transform transition-transform duration-75 motion-reduce:transition-none pointer-events-none"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        aria-hidden="true"
      />

      {/* Floating Highlight-to-Share Quote Link Button */}
      {quoteSelection && (
        <div
          className="fixed z-50 transition-all duration-150 animate-in fade-in"
          style={{
            left: `${quoteSelection.x}px`,
            top: `${quoteSelection.y}px`,
          }}
        >
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleCopyQuoteLink}
            aria-label="Copy link to quote"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161617] text-white text-[12px] font-sans font-medium shadow-[0_6px_20px_rgba(0,0,0,0.25)] border border-white/15 hover:bg-[#2A2A2D] active:scale-95 transition-all cursor-pointer select-none"
          >
            {quoteCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Link copied</span>
              </>
            ) : (
              <>
                <Link2 className="w-3.5 h-3.5 text-neutral-300" />
                <span>Copy link to quote</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navigation onOpenCV={() => setCvOpen(true)} />

      {/* Main Longform Article Wrapper (Strict 680px column) */}
      <main className="max-w-[680px] mx-auto px-6 sm:px-8 md:px-0 pt-28 sm:pt-36 pb-28">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 pb-4 border-b border-[#F2F2F2] text-[13px] text-[#6B6B6B]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#242424] transition-colors group cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Stories</span>
          </Link>
        </div>

        {/* Story Header (Exact hierarchy matching uploaded screenshot) */}
        <header className="space-y-4 mb-8">
          
          {/* Super bold punchy headline (Lowered size, amplified thickness) */}
          <h1 className="title-thick font-[family-name:var(--font-inter),var(--font-plus-jakarta),-apple-system,BlinkMacSystemFont,sans-serif] text-[34px] sm:text-[44px] md:text-[48px] text-[#0A0A0A] leading-[1.1] tracking-[-0.035em]">
            {post.title}
          </h1>

          {/* Subtitle */}
          {post.subtitle && (
            <p className="text-[21px] sm:text-[25px] md:text-[27px] text-[#555555] font-normal leading-[1.38] tracking-normal font-sans">
              {post.subtitle}
            </p>
          )}

          {/* Meta line: "5 min read · Aug 4" */}
          <div className="pt-2 text-[14px] sm:text-[14.5px] text-[#6B6B6B] font-normal flex items-center">
            {post.featured && (
              <span title="Featured Story" className="inline-flex items-center mr-2">
                <FeaturedStarIcon className="w-3.5 h-3.5" />
              </span>
            )}
            <span>{post.readingTime}</span>
            <span className="mx-2">&middot;</span>
            <span>{formatDisplayDate(post.date)}</span>
          </div>

          {/* Share Pill Button (Matching screenshot bordered pill button) */}
          <div className="pt-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/15 hover:border-black/30 hover:bg-black/[0.03] text-[#242424] text-[13.5px] font-medium transition-colors cursor-pointer"
              title="Share story"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-[#161617]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#242424]" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

        </header>

        {/* Feature / Cover Image (Sitting cleanly below Share button) */}
        {post.featureImage && (
          <figure className="my-8 rounded-[3px] overflow-hidden bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featureImage}
              alt={post.title}
              className="w-full h-auto max-h-[460px] object-cover bg-neutral-100"
              loading="eager"
            />
            <figcaption className="text-center text-[13px] text-[#6B6B6B] mt-2.5 font-sans font-normal">
              Architectural state boundaries and deployment topology &bull; Verified in production
            </figcaption>
          </figure>
        )}

        {/* Editorial Pullquote (Highlighted with #e8f3e8) */}
        {post.pullQuote && (
          <blockquote className="my-9 pl-6 pr-5 py-4 border-l-[3px] border-[#161617] bg-[#e8f3e8] rounded-r-md">
            <p className="font-[family-name:var(--font-source-serif),Charter,Georgia,serif] italic text-[21px] sm:text-[23px] text-[#242424] leading-[1.45]">
              &ldquo;{post.pullQuote}&rdquo;
            </p>
          </blockquote>
        )}

        {/* Article Body Content */}
        <article
          ref={articleRef}
          className="py-4 font-[family-name:var(--font-source-serif),Charter,Georgia,serif] text-[20px] leading-[34px] text-[#242424] font-normal selection:bg-[#EAEAEA]"
        >
          
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
                <h2 className="font-[family-name:var(--font-plus-jakarta)] font-extrabold text-[24px] sm:text-[28px] text-[#1D1D1F] tracking-[-0.025em] leading-tight pt-8 pb-2">
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
                            <Check className="w-3 h-3 text-white" />
                            <span className="text-white">Copied</span>
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
                <aside className="my-9 p-6 rounded-r-lg border-l-[3px] border-[#161617] bg-[#F9F9F9] space-y-1.5 font-sans">
                  <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-[#161617] font-bold">
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
                      <span className="w-6 h-6 rounded-full bg-[#161617] text-white text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
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

        {/* Selected Stories Recommendations */}
        {recommendedPosts.length > 0 && (
          <section className="pt-12 mt-12 border-t border-[#F2F2F2] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-[20px] font-bold text-[#242424]">
                Selected Stories
              </h3>
              <Link
                href="/blog"
                className="text-[13px] text-[#242424] hover:underline font-medium font-sans"
              >
                See all stories
              </Link>
            </div>

            {/* 2x2 Editorial Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recommendedPosts.map((rec) => (
                <Link
                  key={rec.slug}
                  href={`/blog/${rec.slug}`}
                  className="group flex flex-col justify-between cursor-pointer space-y-3 p-4 rounded-xl hover:bg-neutral-50 transition-colors outline-none focus:outline-none focus-visible:outline-none hover:outline-none"
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
                    <h4 className="font-[family-name:var(--font-plus-jakarta)] text-[15.5px] font-extrabold text-[#1D1D1F] leading-snug line-clamp-2 tracking-tight">
                      {rec.title}
                    </h4>
                    <p className="text-[13px] text-[#6B6B6B] line-clamp-2 mt-1.5 font-normal leading-[19px]">
                      {rec.subtitle || rec.excerpt}
                    </p>
                  </div>
                  <div className="pt-2 text-[12px] text-[#6B6B6B] font-sans flex items-center gap-1.5">
                    {rec.featured && <FeaturedStarIcon className="w-3 h-3" />}
                    <span>{rec.readingTime} &middot; {formatDisplayDate(rec.date)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Footer / Architectural Colophon Section */}
      <EditorialFooter onOpenCV={() => setCvOpen(true)} />

      {/* CV Modal */}
      <CVDrawer isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </div>
  );
}
