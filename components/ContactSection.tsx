"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ArrowUpRight, Mail, ArrowUp } from "lucide-react";
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
    <footer
      id="contact"
      aria-label="Contact and Channels"
      className="relative py-20 sm:py-28 lg:py-36 px-5 sm:px-12 md:px-16 lg:px-24 max-w-[1400px] mx-auto border-t border-black/[0.08] bg-white text-[#242424]"
    >
      {/* Header: Pure "Let's talk." */}
      <div className="pb-3 mb-6 relative">
        <h2
          className="select-none text-[#01030E] inline-flex items-baseline relative"
          style={{
            fontFamily: 'var(--font-plus-jakarta), var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 800,
            fontSize: "clamp(60px, 9.2vw, 142px)",
            lineHeight: 0.9,
            letterSpacing: "-0.045em",
          }}
        >
          <span>Let&rsquo;s talk.</span>
        </h2>
      </div>

      {/* Floor Divider Line */}
      <div className="relative w-full mb-5 sm:mb-7">
        <div className="h-px w-full bg-gradient-to-r from-black/20 via-black/10 to-transparent" />
      </div>

      {/* Container Tray */}
      <div className="relative rounded-[2rem] sm:rounded-[2.75rem] bg-[#F7F7F9] border border-black/[0.07] p-4 sm:p-7 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.025)] overflow-hidden">
        {/* Subtle top specular sheen along the container rim */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />

        {/* Main Grid: Direct Line Card + Social Channels Bento */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          
          {/* Direct Email Card */}
          <div className="lg:col-span-5 p-6 sm:p-8 md:p-9 rounded-3xl bg-white border border-black/[0.07] flex flex-col justify-between gap-6 sm:gap-8 relative overflow-hidden group hover:shadow-[0_16px_36px_rgba(0,0,0,0.05)] hover:border-black/15 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            {/* Subtle top specular sheen */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

            {/* Interactive hover sweep sheen */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white shadow-sm border border-black/[0.06] flex items-center justify-center text-[#171717] group-hover:scale-105 transition-transform duration-300">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-[22px] sm:text-[26px] font-semibold text-[#171717] tracking-tight">
                  Send a direct dispatch.
                </h3>
              </div>

              <p className="text-[14px] sm:text-[14.5px] text-[#6E6E73] leading-relaxed max-w-[42ch]">
                For architecture reviews, infrastructure delivery, or engineering inquiries.
              </p>
            </div>

            <div className="space-y-3 pt-5 sm:pt-6 border-t border-black/[0.06] relative z-10">
              <a
                href={`mailto:${email}`}
                className="text-[17px] sm:text-[22px] font-semibold text-[#171717] hover:text-[#555] transition-colors break-all block"
              >
                {email}
              </a>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5 pt-1">
                <a
                  href={`mailto:${email}`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#171717] text-white text-[13px] font-medium hover:bg-[#2e2e32] transition-all cursor-pointer shadow-sm active:scale-95 min-h-[42px]"
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

        {/* 4 Social Channels Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {contactChannels.map((channel) => {
            const IconComponent = channel.IconComponent;
            const isCopied = copiedKey === channel.key;

            return (
              <div
                key={channel.key}
                className={`p-5 sm:p-7 rounded-3xl bg-white border border-black/[0.07] ${channel.color} hover:shadow-[0_16px_36px_rgba(0,0,0,0.05)] hover:border-black/20 transition-all duration-300 flex flex-col justify-between gap-5 sm:gap-6 group cursor-default relative overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]`}
              >
                {/* Micro specular sheen sweep on hover */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-900 ease-out bg-gradient-to-r from-transparent via-black/[0.02] to-transparent pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                    <div className={`w-10 h-10 rounded-2xl ${channel.bgAccent} ${channel.accent} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-black/[0.04] group-hover:bg-[#171717] group-hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
                      title={channel.actionLabel}
                    >
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11.5px] sm:text-[12px] font-medium uppercase tracking-wider text-[#86868B]">
                      {channel.name}
                    </div>
                    <div className="font-display text-[17px] sm:text-[20px] font-semibold text-[#171717]">
                      {channel.handle}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="pt-3.5 sm:pt-4 border-t border-black/[0.06] flex items-center justify-between text-[12px] relative z-10">
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#171717] group-hover:underline underline-offset-4 flex items-center gap-1 py-1"
                  >
                    <span>{channel.actionLabel}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopy(channel.value, channel.key)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#6E6E73] hover:text-[#171717] transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-[#171717]" />
                        <span className="text-[#171717] font-medium">Copied</span>
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
    </div>

      {/* Clean Colophon Bottom Bar (Desktop & Mobile Optimized) */}
      <div className="pt-10 sm:pt-16 mt-10 sm:mt-16 border-t border-black/[0.07] flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-4 text-[12px] text-[#86868B] text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span>
            <span className="font-bold wv-mark wv-mark--wave">
              WVRNER
            </span>{" "}
            <span className="text-black/30">/</span> Nima Hosseini
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
    </footer>
  );
}
