"use client";

import { useState } from "react";
import Link from "next/link";
import { scrollToTarget } from "@/components/SmoothScroll";

interface EditorialFooterProps {
  onOpenCV?: () => void;
}

export function EditorialFooter({ onOpenCV }: EditorialFooterProps = {}) {
  const [copied, setCopied] = useState(false);
  const email = "wvrner@outlook.com";

  const handleCopy = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch (e) {}
    }
  };

  const handleScrollTop = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTarget(0, { duration: 0.9 });
  };

  return (
    <footer className="ct" aria-label="Contact and Colophon">
      <style jsx>{`
        .ct {
          --bg: #E3E5EA;
          --ink: #01030E;
          --ink-2: rgba(1, 3, 14, 0.62);
          --ink-3: rgba(1, 3, 14, 0.42);
          --rule: rgba(1, 3, 14, 0.14);
          background: var(--bg);
          color: var(--ink);
          overflow: hidden;
          font-family: var(--font-inter-tight), "Inter Tight", -apple-system, BlinkMacSystemFont, sans-serif;
          padding: clamp(40px, 6vh, 64px) clamp(16px, 6vw, 96px) 0;
        }
        .ct-wrap {
          max-width: 1400px;
          margin: 0 auto;
        }
        .mono {
          font-family: var(--font-jetbrains-mono), "JetBrains Mono", ui-monospace, monospace;
        }
        .ct-back {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          color: var(--ink-2);
          text-decoration: none;
          font-size: 15px;
          transition: color 0.3s;
        }
        .ct-back-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--rule);
          display: grid;
          place-items: center;
          transition: background 0.3s, color 0.3s, border-color 0.3s;
        }
        .ct-back:hover {
          color: var(--ink);
        }
        .ct-back:hover .ct-back-icon {
          background: var(--ink);
          border-color: var(--ink);
          color: var(--bg);
        }
        .ct-grid {
          margin-top: clamp(56px, 10vh, 110px);
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: clamp(40px, 6vw, 96px);
          align-items: end;
        }
        @media (max-width: 900px) {
          .ct-grid {
            grid-template-columns: 1fr;
            align-items: start;
          }
        }
        .ct-eyebrow {
          font-size: 11px;
          letter-spacing: 0.22em;
          color: var(--ink-3);
          text-transform: uppercase;
        }
        .ct-title {
          margin-top: 14px;
          font-weight: 500;
          font-size: clamp(64px, 9.5vw, 148px);
          letter-spacing: -0.055em;
          line-height: 0.88;
        }
        .ct-lede {
          margin-top: 24px;
          max-width: 42ch;
          color: var(--ink-2);
          font-size: clamp(16px, 1.25vw, 18px);
          line-height: 1.6;
        }
        .ct-email {
          margin-top: clamp(32px, 5vh, 52px);
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .ct-email a {
          color: var(--ink);
          text-decoration: none;
          font-size: clamp(20px, 2.3vw, 32px);
          letter-spacing: -0.01em;
          background: linear-gradient(var(--ink), var(--ink)) 0 100% / 100% 1.5px no-repeat;
          padding-bottom: 4px;
          transition: background-size 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ct-email a:hover {
          background-size: 0 1.5px;
          background-position: 100% 100%;
        }
        .ct-copy {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          border: 1px solid var(--rule);
          background: transparent;
          color: var(--ink-2);
          border-radius: 999px;
          padding: 9px 14px;
          font: 500 11px/1 var(--font-jetbrains-mono), "JetBrains Mono", monospace;
          letter-spacing: 0.16em;
          transition: all 0.3s;
        }
        .ct-copy:hover {
          color: var(--ink);
          border-color: var(--ink);
        }
        .ct-copy.done {
          background: var(--ink);
          color: var(--bg);
          border-color: var(--ink);
        }
        .ct-cv {
          margin-top: 22px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0 24px;
          min-height: 52px;
          border-radius: 999px;
          background: var(--ink);
          color: var(--bg);
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          transition: transform 0.3s;
          cursor: pointer;
        }
        .ct-cv:hover {
          transform: translateY(-1px);
        }
        .ct-links {
          list-style: none;
          margin: 16px 0 0;
          padding: 0;
          border-top: 1px solid var(--ink);
        }
        .ct-links li {
          border-bottom: 1px solid var(--rule);
        }
        .ct-links a {
          display: grid;
          grid-template-columns: 1fr auto 24px;
          align-items: center;
          gap: 16px;
          min-height: 76px;
          padding: 0 4px;
          color: var(--ink);
          text-decoration: none;
          transition: padding 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ct-links a:hover {
          padding-left: 14px;
        }
        .ct-name {
          font-size: clamp(22px, 2vw, 28px);
          font-weight: 500;
          letter-spacing: -0.025em;
        }
        .ct-handle {
          font-size: 13px;
          color: var(--ink-3);
        }
        .ct-arrow {
          color: var(--ink-3);
          transition: color 0.3s, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ct-links a:hover .ct-arrow {
          color: var(--ink);
          transform: translate(3px, -3px);
        }
        .ct-mark {
          margin-top: clamp(72px, 12vh, 140px);
          font-weight: 900;
          font-size: 17.6vw;
          line-height: 0.74;
          letter-spacing: -0.045em;
          text-align: center;
          white-space: nowrap;
          margin-bottom: -0.06em;
          user-select: none;
          background-image:
            radial-gradient(ellipse var(--wv-tr-w, 20%) var(--wv-tr-h, 70%) at var(--wv-tr-x, 100%) var(--wv-tr-y, 0%), #FF6A3D 0%, #FF2D3D 16%, #FF1F7A 32%, #FF4FB0 48%, #2A1FA8 66%, transparent 84%),
            radial-gradient(ellipse var(--wv-bl-w, 20%) var(--wv-bl-h, 70%) at var(--wv-bl-x, 0%) var(--wv-bl-y, 100%), #7FF3FF 0%, #00C8FF 14%, #1E8BFF 30%, #2F4BFF 46%, #0A1440 66%, transparent 84%),
            linear-gradient(var(--ink), var(--ink));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .ct-base {
          position: relative;
          background: var(--bg);
          display: flex;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding: 22px 0 26px;
          border-top: 1px solid var(--ink);
          font-size: 11px;
          letter-spacing: 0.18em;
          color: var(--ink-3);
          text-transform: uppercase;
        }
        .ct-base a {
          color: var(--ink-3);
          text-decoration: none;
        }
        .ct-base a:hover {
          color: var(--ink);
        }
        @media (prefers-reduced-motion: reduce) {
          .ct-links a,
          .ct-email a {
            transition: none;
          }
        }
      `}</style>

      <div className="ct-wrap">
        <Link href="/" className="ct-back">
          <span className="ct-back-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13 8H3M7 4L3 8l4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>Back to portfolio</span>
        </Link>

        <div className="ct-grid">
          <section aria-labelledby="ct-title">
            <span className="ct-eyebrow mono">Email</span>
            <h2 className="ct-title" id="ct-title">
              Let&rsquo;s talk.
            </h2>
            <p className="ct-lede">
              I&rsquo;m looking for a junior Cloud / DevOps role. The fastest way to reach me is email or LinkedIn.
            </p>
            <div className="ct-email">
              <a className="mono" href={`mailto:${email}`}>
                {email}
              </a>
              <button
                className={`ct-copy ${copied ? "done" : ""}`}
                type="button"
                onClick={handleCopy}
                aria-label="Copy email address"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="5" y="5" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" />
                  <path
                    d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
                <span>{copied ? "COPIED" : "COPY"}</span>
              </button>
            </div>

            {onOpenCV ? (
              <button
                type="button"
                onClick={onOpenCV}
                className="ct-cv border-none"
                aria-label="View Curriculum Vitae"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 1.5h5.5L13 5v9.5H4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M9 1.5V5h4M6.5 8.5h4M6.5 11h4" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                View CV
              </button>
            ) : (
              <a className="ct-cv" href="/cv.pdf" target="_blank" rel="noopener">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 1.5h5.5L13 5v9.5H4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M9 1.5V5h4M6.5 8.5h4M6.5 11h4" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                View CV
              </a>
            )}
          </section>

          <nav aria-label="Elsewhere">
            <span className="ct-eyebrow mono">Elsewhere</span>
            <ul className="ct-links">
              <li>
                <a href="https://github.com/wvrner" target="_blank" rel="noopener">
                  <span className="ct-name">GitHub</span>
                  <span className="ct-handle mono">wvrner</span>
                  <span className="ct-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/wvrner" target="_blank" rel="noopener">
                  <span className="ct-name">LinkedIn</span>
                  <span className="ct-handle mono">in/wvrner</span>
                  <span className="ct-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a href="https://t.me/wvrner" target="_blank" rel="noopener">
                  <span className="ct-name">Telegram</span>
                  <span className="ct-handle mono">@wvrner</span>
                  <span className="ct-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/wvrner" target="_blank" rel="noopener">
                  <span className="ct-name">WhatsApp</span>
                  <span className="ct-handle mono">+ Direct</span>
                  <span className="ct-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="ct-mark wv-mark--wave" aria-hidden="true">
        WVRNER
      </div>
      <div className="ct-wrap">
        <div className="ct-base mono">
          <span>&copy; 2026 Nima Hosseini</span>
          <a href="#top" onClick={handleScrollTop}>
            Back to top &uarr;
          </a>
        </div>
      </div>
    </footer>
  );
}
