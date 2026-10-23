"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ArrowUpRight, Mail, Sparkles, ArrowUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { scrollToTarget } from "@/components/SmoothScroll";

/* Clean Brand Icons */
function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

function TelegramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function LinkedInIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

interface ContactSectionProps {
  onOpenCV?: () => void;
}

/**
 * ContactSection - Apple + Notion Hybrid Redesign
 * Optimized for both desktop and mobile viewports with tactile ergonomics.
 */
export function ContactSection({ onOpenCV }: ContactSectionProps = {}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();
  const email = "wvrner@outlook.com";

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const contactChannels = [
    {
      key: "whatsapp",
      name: "WhatsApp",
      handle: "@wvrner",
      value: "wvrner",
      href: "https://wa.me/wvrner",
      IconComponent: WhatsAppIcon,
      actionLabel: "Chat on WhatsApp",
      color: "hover:border-[#25D366]/40",
      accent: "text-[#25D366]",
      bgAccent: "bg-[#25D366]/10",
    },
    {
      key: "telegram",
      name: "Telegram",
      handle: "@wvrner",
      value: "wvrner",
      href: "https://t.me/wvrner",
      IconComponent: TelegramIcon,
      actionLabel: "Direct Message",
      color: "hover:border-[#229ED9]/40",
      accent: "text-[#229ED9]",
      bgAccent: "bg-[#229ED9]/10",
    },
    {
      key: "linkedin",
      name: "LinkedIn",
      handle: "in/wvrner",
      value: "wvrner",
      href: "https://linkedin.com/in/wvrner",
      IconComponent: LinkedInIcon,
      actionLabel: "Connect Profile",
      color: "hover:border-[#0A66C2]/40",
      accent: "text-[#0A66C2]",
      bgAccent: "bg-[#0A66C2]/10",
    },
    {
      key: "github",
      name: "GitHub",
      handle: "@wvrner",
      value: "wvrner",
      href: "https://github.com/wvrner",
      IconComponent: GitHubIcon,
      actionLabel: "Source Repos",
      color: "hover:border-black/30",
      accent: "text-[#242424]",
      bgAccent: "bg-black/[0.06]",
    },
  ];

  return (
    <motion.footer
      id="contact"
      aria-label="Contact and Channels"
      initial={prefersReduced ? false : { opacity: 0, y: 32 }}
      whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative py-20 sm:py-28 lg:py-36 px-5 sm:px-12 md:px-16 lg:px-24 max-w-[1400px] mx-auto border-t border-black/[0.08] bg-white text-[#242424]"
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 mb-10 sm:mb-16 border-b border-black/[0.07]">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.04] text-[11.5px] font-medium tracking-wide uppercase text-[#6E6E73]">
            <Sparkles className="w-3 h-3 text-[#242424]" />
            <span>CONTACT &bull; GET IN TOUCH</span>
          </div>
          <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold tracking-[-0.035em] text-[#242424] leading-tight">
            Let&rsquo;s connect.
          </h2>
          <p className="text-[16px] sm:text-[17px] text-[#6E6E73] font-normal leading-relaxed max-w-[52ch]">
            Open for architectural consultations, DevOps advisory, and high-impact infrastructure engineering.
          </p>
        </div>
      </div>

      {/* Main Grid: Direct Line Card + Social Channels Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-stretch">
        
        {/* Direct Email Card (Apple Spotlight Card) */}
        <div className="lg:col-span-5 p-6 sm:p-9 md:p-10 rounded-3xl bg-[#F5F5F7] border border-black/[0.07] flex flex-col justify-between gap-6 sm:gap-8 relative overflow-hidden">
          {/* Subtle top specular sheen */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

          <div className="space-y-3.5 sm:space-y-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white shadow-sm border border-black/[0.06] flex items-center justify-center text-[#242424]">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] sm:text-[11.5px] font-medium uppercase tracking-wider text-[#86868B]">
                DIRECT EMAIL CHANNEL
              </span>
              <h3 className="font-display text-[21px] sm:text-[26px] font-semibold text-[#242424] tracking-tight">
                Send a direct dispatch.
              </h3>
            </div>

            <p className="text-[14px] sm:text-[14.5px] text-[#6E6E73] leading-relaxed">
              For detailed proposals, architecture reviews, or confidential project inquiries.
            </p>
          </div>

          <div className="space-y-3 pt-5 sm:pt-6 border-t border-black/[0.06]">
            <a
              href={`mailto:${email}`}
              className="text-[17px] sm:text-[22px] font-semibold text-[#242424] hover:text-[#555] transition-colors break-all block"
            >
              {email}
            </a>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5 pt-1">
              <a
                href={`mailto:${email}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#242424] text-white text-[13px] font-medium hover:bg-[#333333] transition-all cursor-pointer shadow-sm active:scale-95 min-h-[42px]"
              >
                <span>Compose Mail</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => handleCopy(email, "email")}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-black/[0.04] text-[#242424] border border-black/[0.08] text-[13px] font-medium transition-all cursor-pointer active:scale-95 min-h-[42px]"
              >
                {copiedKey === "email" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#242424]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#86868B]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Notion-Style Channels Bento Grid (Right 7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {contactChannels.map((channel) => {
            const IconComponent = channel.IconComponent;
            const isCopied = copiedKey === channel.key;

            return (
              <div
                key={channel.key}
                className={`p-5 sm:p-7 rounded-3xl bg-white border border-black/[0.07] ${channel.color} hover:shadow-[0_12px_32px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between gap-5 sm:gap-6 group cursor-default`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                    <div className={`w-10 h-10 rounded-2xl ${channel.bgAccent} ${channel.accent} flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-black/[0.04] group-hover:bg-[#242424] group-hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
                      title={channel.actionLabel}
                    >
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11.5px] sm:text-[12px] font-medium uppercase tracking-wider text-[#86868B]">
                      {channel.name}
                    </div>
                    <div className="font-display text-[17px] sm:text-[20px] font-semibold text-[#242424]">
                      {channel.handle}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="pt-3.5 sm:pt-4 border-t border-black/[0.06] flex items-center justify-between text-[12px]">
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#242424] group-hover:underline underline-offset-4 flex items-center gap-1 py-1"
                  >
                    <span>{channel.actionLabel}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopy(channel.value, channel.key)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#6E6E73] hover:text-[#242424] transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-[#242424]" />
                        <span className="text-[#242424] font-medium">Copied</span>
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
            );
          })}
        </div>

      </div>

      {/* Clean Colophon Bottom Bar (Desktop & Mobile Optimized) */}
      <div className="pt-10 sm:pt-16 mt-10 sm:mt-16 border-t border-black/[0.07] flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-4 text-[12px] text-[#86868B] text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0de1ed] shadow-[0_0_8px_rgba(13,225,237,0.6)]" />
          <span>
            <span className="font-bold wv-mark wv-mark--wave">
              WVRNER
            </span>{" "}
            &bull; Nima Hosseini &bull; 2026
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-5 sm:gap-6">
          <button
            type="button"
            onClick={() => scrollToTarget("#about", { offset: -80 })}
            className="hover:text-[#242424] transition-colors py-1 cursor-pointer"
          >
            About
          </button>
          <Link href="/blog" className="hover:text-[#242424] transition-colors py-1">
            Writing
          </Link>
          {onOpenCV && (
            <button
              type="button"
              onClick={onOpenCV}
              className="hover:text-[#242424] transition-colors cursor-pointer py-1 underline underline-offset-4"
            >
              Curriculum Vitae
            </button>
          )}
          <button
            type="button"
            onClick={() => scrollToTarget(0, { duration: 1.0 })}
            className="hover:text-[#242424] transition-colors cursor-pointer py-1 inline-flex items-center gap-1"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
          <span>All rights reserved</span>
        </div>
      </div>
    </motion.footer>
  );
}
