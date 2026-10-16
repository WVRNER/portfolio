"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Check,
  Copy,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { CVDrawer } from "@/components/CVDrawer";
import { BLOG_POSTS, type BlogPost } from "@/lib/blogData";

interface ArticleClientWrapperProps {
  post: BlogPost;
}

/**
 * ArticleClientWrapper — Editorial Longform Reader (matching Medium screenshot)
 * 
 * - Super bold headline (font-extrabold / font-black)
 * - Subtitle
 * - Meta line: "X min read · Date" (e.g. 5 min read · Aug 4, 2026)
 * - Single bordered Share pill button
 * - Zero listen button, zero more button, zero follow, zero author names, zero member-only badges
 * - Feature cover image directly below Share button
 * - Pure reader typography in Source Serif 4
 */
export function ArticleClientWrapper({ post }: ArticleClientWrapperProps) {
  const [cvOpen, setCvOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

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

  // Recommended articles (Selected Stories)
  const recommendedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="relative min-h-[100dvh] bg-[#FFFFFF] text-[#242424] font-sans antialiased selection:bg-[#EAEAEA] selection:text-[#242424]">
      {/* Top Reading Progress Indicator (Hairline) */}
      <div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#161617] z-50 transition-transform duration-100 origin-left will-change-transform"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        aria-hidden="true"
      />

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
          
          {/* Super bold punchy headline */}
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-[32px] sm:text-[42px] md:text-[46px] font-extrabold sm:font-black text-[#1D1D1F] leading-[1.18] sm:leading-[1.12] tracking-[-0.035em]">
            {post.title}
          </h1>

          {/* Subtitle */}
          {post.subtitle && (
            <p className="text-[18px] sm:text-[21px] text-[#6B6B6B] font-normal leading-[1.4] tracking-normal font-sans">
              {post.subtitle}
            </p>
          )}

          {/* Meta line: "5 min read · Aug 4, 2026" */}
          <div className="pt-2 text-[14px] sm:text-[14.5px] text-[#6B6B6B] font-normal">
            <span>{post.readingTime}</span>
            <span className="mx-2">&middot;</span>
            <span>{post.date}</span>
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

        {/* Editorial Pullquote */}
        {post.pullQuote && (
          <blockquote className="my-9 pl-6 border-l-[3px] border-[#161617]">
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

        {/* Quiet Colophon */}
        <section className="py-10 border-t border-b border-[#F2F2F2] mt-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <p className="text-[14.5px] text-[#6B6B6B] leading-relaxed max-w-md font-sans">
              Engineering automated cloud systems, declarative infrastructure, and reproducible state across AWS.
            </p>

            <button
              onClick={() => setCvOpen(true)}
              className="px-5 py-2 rounded-full bg-[#161617] hover:bg-[#2C2C2E] text-white text-[13px] font-medium transition-all cursor-pointer font-sans shrink-0"
            >
              View CV
            </button>
          </div>
        </section>

        {/* Selected Stories Recommendations */}
        {recommendedPosts.length > 0 && (
          <section className="pt-12 space-y-6">
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
                    <h4 className="font-[family-name:var(--font-plus-jakarta)] text-[15.5px] font-extrabold sm:font-black text-[#1D1D1F] group-hover:underline transition-colors leading-snug line-clamp-2 tracking-tight">
                      {rec.title}
                    </h4>
                    <p className="text-[13px] text-[#6B6B6B] line-clamp-2 mt-1.5 font-normal leading-relaxed">
                      {rec.subtitle || rec.excerpt}
                    </p>
                  </div>
                  <div className="pt-2 text-[12px] text-[#6B6B6B] font-sans">
                    <span>{rec.readingTime} &middot; {rec.date}</span>
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
