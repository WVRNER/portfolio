"use client";

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from "react";
import { Download, Copy, Share2, Check, X, ShieldAlert } from "lucide-react";
import type { BlogPost } from "@/lib/blogData";

interface QuoteImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteText: string;
  post: BlogPost;
  accentColor: string;
}

function subscribeNoop() {
  return () => {};
}

function getCanShareSnapshot(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof File !== "undefined"
  );
}

function getCanShareServerSnapshot(): boolean {
  return false;
}

function normalizeQuote(s: string): string {
  return s
    .replace(/[\u201C\u201D\u2018\u2019"']/g, "")
    .replace(/[.,;:!?]+$/, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Validates that the quoted text actually appears in the article body.
 * Prevents malicious or spoofed quotes from generating branded assets.
 */
function verifyQuoteAuthenticity(quote: string, post: BlogPost): boolean {
  if (!quote || quote.trim().length === 0) return false;
  const normalizedQuote = normalizeQuote(quote);
  if (normalizedQuote.length === 0) return false;

  // Search in pullQuote, lead, and all section content
  if (post.pullQuote) {
    const normPull = normalizeQuote(post.pullQuote);
    if (normPull.includes(normalizedQuote) || normalizedQuote.includes(normPull)) return true;
  }
  if (post.content.lead) {
    const normLead = normalizeQuote(post.content.lead);
    if (normLead.includes(normalizedQuote) || normalizedQuote.includes(normLead)) return true;
  }

  for (const section of post.content.sections) {
    if (section.heading && normalizeQuote(section.heading).includes(normalizedQuote)) return true;
    for (const p of section.paragraphs) {
      const normP = normalizeQuote(p);
      if (normP.includes(normalizedQuote) || normalizedQuote.includes(normP)) return true;
    }
    if (section.callout && normalizeQuote(section.callout.body).includes(normalizedQuote)) return true;
  }

  // Check 3 consecutive words match in pullQuote, lead, or paragraphs
  const words = normalizedQuote.split(" ").filter((w) => w.length > 2);
  if (words.length >= 3) {
    const snippet = words.slice(0, 3).join(" ");
    if (post.pullQuote && normalizeQuote(post.pullQuote).includes(snippet)) return true;
    if (post.content.lead && normalizeQuote(post.content.lead).includes(snippet)) return true;
    for (const section of post.content.sections) {
      for (const p of section.paragraphs) {
        if (normalizeQuote(p).includes(snippet)) return true;
      }
    }
  }

  return false;
}

export function QuoteImageModal({
  isOpen,
  onClose,
  quoteText,
  post,
  accentColor,
}: QuoteImageModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const canShare = useSyncExternalStore(
    subscribeNoop,
    getCanShareSnapshot,
    getCanShareServerSnapshot
  );

  const isValid = verifyQuoteAuthenticity(quoteText, post);

  // Truncate cleanly at word boundary if very long, stripping outer quotes
  const formatQuote = useCallback((text: string): string => {
    const clean = text
      .replace(/^[\u201C\u201D"']+|[\u201C\u201D"']+$/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const maxLength = 260;
    if (clean.length <= maxLength) return clean;
    const truncated = clean.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
  }, []);

  // Render canvas card
  useEffect(() => {
    if (!isOpen || !isValid) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(0, 0, width, height);

    // Subtle hairline perimeter frame
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Top Header: WVRNER Brand
    ctx.fillStyle = "#A1A1AA";
    ctx.font = "700 14px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
    ctx.letterSpacing = "0.28em";
    ctx.fillText("WVRNER", 100, 88);

    // Quote Body Typography - Clean, spacious, and centered
    const quote = formatQuote(quoteText);
    const displayText = `"${quote}"`;

    let fontSize = 42;
    if (quote.length > 200) fontSize = 34;
    else if (quote.length > 130) fontSize = 38;
    else if (quote.length < 70) fontSize = 48;

    ctx.fillStyle = "#FFFFFF";
    ctx.font = `italic ${fontSize}px "Source Serif 4", Charter, Georgia, serif`;
    ctx.letterSpacing = "-0.25px";

    const maxTextWidth = width - 200;
    const words = displayText.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const w of words) {
      const testLine = currentLine ? `${currentLine} ${w}` : w;
      if (ctx.measureText(testLine).width > maxTextWidth) {
        lines.push(currentLine);
        currentLine = w;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    const lineHeight = fontSize * 1.5;
    const totalQuoteHeight = lines.length * lineHeight;
    
    // Position quote and author in harmonious vertical balance
    const authorMargin = 48;
    const authorHeight = 24;
    const totalBlockHeight = totalQuoteHeight + authorMargin + authorHeight;
    const startY = Math.max(160, (height - totalBlockHeight) / 2 + fontSize * 0.9);

    lines.forEach((line, index) => {
      ctx.fillText(line, 100, startY + index * lineHeight);
    });

    // Author Name: Nima Hosseini
    const authorY = startY + (lines.length - 1) * lineHeight + authorMargin;
    ctx.fillStyle = "#EDEDED";
    ctx.font = "600 20px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
    ctx.letterSpacing = "0.04em";
    ctx.fillText("Nima Hosseini", 100, authorY);

    try {
      const url = canvas.toDataURL("image/png");
      const handle = requestAnimationFrame(() => {
        setDataUrl(url);
      });
      return () => cancelAnimationFrame(handle);
    } catch {
      // Ignore
    }
  }, [isOpen, isValid, quoteText, post, accentColor, formatQuote]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${post.slug}-quote.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (typeof ClipboardItem !== "undefined" && navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          handleDownload();
        }
      }, "image/png");
    } catch {
      handleDownload();
    }
  };

  const handleNativeShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `${post.slug}-quote.png`, {
          type: "image/png",
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: post.title,
            text: quoteText,
            files: [file],
          });
        } else {
          handleCopyImage();
        }
      }, "image/png");
    } catch {
      handleCopyImage();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[640px] rounded-2xl bg-[#161617] border border-white/10 p-5 sm:p-6 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h2 id="quote-modal-title" className="text-[15px] font-sans font-semibold text-neutral-200">
            Share Quote Card
          </h2>
          <button
            onClick={onClose}
            aria-label="Close quote modal"
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden Canvas used for high-res 1200x630 rendering */}
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

        {/* Content body */}
        <div className="py-4">
          {!isValid ? (
            <div className="p-6 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-3 text-red-300">
              <ShieldAlert className="w-6 h-6 flex-shrink-0" />
              <p className="text-[14px]">
                Authenticity check failed: This quote text could not be verified in the article.
              </p>
            </div>
          ) : (
            dataUrl && (
              <div className="rounded-lg overflow-hidden border border-white/10 shadow-lg bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dataUrl}
                  alt={`Quote from ${post.title}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            )
          )}
        </div>

        {/* Action Buttons */}
        {isValid && (
          <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5 sm:gap-3">
            {canShare && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-[13px] font-sans font-medium text-white transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyImage}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-[13px] font-sans font-medium text-white transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Image Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Image</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#242424] hover:bg-neutral-200 text-[13px] font-sans font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
