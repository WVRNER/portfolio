"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Download, Copy, Share2, Check, X, ShieldAlert } from "lucide-react";
import type { BlogPost } from "@/lib/blogData";

interface QuoteImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteText: string;
  post: BlogPost;
  accentColor: string;
}

/**
 * Validates that the quoted text actually appears in the article body.
 * Prevents malicious or spoofed quotes from generating branded assets.
 */
function verifyQuoteAuthenticity(quote: string, post: BlogPost): boolean {
  if (!quote || quote.trim().length === 0) return false;
  const normalize = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
  const normalizedQuote = normalize(quote);

  // Search in title, subtitle, pullQuote, lead, and all section paragraphs
  if (normalize(post.title).includes(normalizedQuote)) return true;
  if (post.subtitle && normalize(post.subtitle).includes(normalizedQuote)) return true;
  if (post.pullQuote && normalize(post.pullQuote).includes(normalizedQuote)) return true;
  if (post.content.lead && normalize(post.content.lead).includes(normalizedQuote)) return true;

  for (const section of post.content.sections) {
    if (section.heading && normalize(section.heading).includes(normalizedQuote)) return true;
    for (const p of section.paragraphs) {
      if (normalize(p).includes(normalizedQuote)) return true;
    }
    if (section.callout && normalize(section.callout.body).includes(normalizedQuote)) return true;
  }

  // Also check if the quote is a partial selection (first 4 words)
  const words = normalizedQuote.split(" ");
  if (words.length >= 4) {
    const snippet = words.slice(0, 4).join(" ");
    for (const section of post.content.sections) {
      for (const p of section.paragraphs) {
        if (normalize(p).includes(snippet)) return true;
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
  const [canShare, setCanShare] = useState(false);
  const [isValid, setIsValid] = useState(true);

  // Check Web Share API with file support
  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function" && typeof File !== "undefined") {
      setCanShare(true);
    }
  }, []);

  // Truncate cleanly at word boundary if very long
  const formatQuote = useCallback((text: string): string => {
    const clean = text.replace(/\s+/g, " ").trim();
    const maxLength = 260;
    if (clean.length <= maxLength) return clean;
    const truncated = clean.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
  }, []);

  // Render canvas card
  useEffect(() => {
    if (!isOpen) {
      setDataUrl(null);
      return;
    }

    const valid = verifyQuoteAuthenticity(quoteText, post);
    setIsValid(valid);
    if (!valid) return;

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

    const maxTextWidth = width - 240;
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
    
    // Position quote so quote + author name are vertically centered as a unit
    const authorMargin = 48;
    const authorHeight = 24;
    const totalBlockHeight = totalQuoteHeight + authorMargin + authorHeight;
    const startY = (height - totalBlockHeight) / 2 + fontSize * 0.9;

    lines.forEach((line, index) => {
      ctx.fillText(line, 120, startY + index * lineHeight);
    });

    // Author Name Only (per instruction: "only contain my name and the quote thats all")
    const authorY = startY + (lines.length - 1) * lineHeight + authorMargin;
    ctx.fillStyle = "#A3A3A3";
    ctx.font = "600 18px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";
    ctx.letterSpacing = "0.08em";
    ctx.fillText("Nima Hosseini", 120, authorY);

    try {
      setDataUrl(canvas.toDataURL("image/png"));
    } catch {
      // Ignore
    }
  }, [isOpen, quoteText, post, accentColor, formatQuote]);

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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black hover:bg-neutral-200 text-[13px] font-sans font-semibold transition-colors cursor-pointer"
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
