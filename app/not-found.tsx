"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { WordsPullUp } from "@/components/ui/prisma-hero";
import { useRef, useEffect } from "react";

/**
 * 404 Page - Based on the cinematic hero animation.
 * Features:
 * - Truly imperceptible background cinemagraph loop player
 * - Dark vignette gradient overlay
 * - Monumental Apple-grade typography with WordsPullUp animation
 * - Tactile navigation affordances to return home or explore stories
 */
export default function NotFoundPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    }
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full bg-black text-[#E1E0CC] overflow-hidden select-none">
      <title>404: Page Not Found | WVRNER</title>
      <meta name="robots" content="noindex, follow" />
      {/* Background Video Cinemagraph */}
      <div className="absolute inset-0 h-full w-full overflow-hidden bg-black pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
          src="/hero-master-endless.mp4"
          className="absolute inset-0 h-full w-full object-cover will-change-transform opacity-75"
        />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
      </div>

      {/* Floating Navigation */}
      <Navigation />

      {/* Center 404 Hero Content */}
      <main className="relative z-20 flex min-h-[100dvh] w-full flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl space-y-6">
          
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11.5px] font-mono tracking-widest uppercase text-[#E1E0CC]/80">
            <span>ERROR 404 &bull; ROUTE NOT FOUND</span>
          </div>

          {/* Monumental Headline */}
          <h1 className="font-bold leading-[0.88] tracking-[-0.05em] text-[clamp(4.2rem,11vw,9rem)] font-[family-name:var(--font-plus-jakarta)] text-[#E1E0CC]">
            <WordsPullUp text="404" />
          </h1>

          <p className="text-[16px] sm:text-[18px] text-[#E1E0CC]/80 font-normal leading-relaxed max-w-[44ch] mx-auto">
            The requested resource, dispatch, or architectural state does not exist in this deployment.
          </p>

          {/* Apple-grade Action Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#E1E0CC] py-2 pl-5 pr-2 text-[14px] font-medium text-black transition-all duration-300 hover:bg-white hover:gap-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <span>Return to Portfolio</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-105">
                <ArrowRight className="h-3.5 w-3.5 text-[#E1E0CC]" />
              </span>
            </Link>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-[#E1E0CC] text-[14px] font-medium transition-all duration-300 cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Explore Stories</span>
            </Link>
          </div>

        </div>
      </main>

      {/* Subtle Bottom Watermark */}
      <div className="absolute bottom-6 left-0 right-0 z-20 text-center text-[11px] font-mono tracking-widest uppercase text-[#E1E0CC]/40">
        WVRNER &bull; DETERMINISTIC SYSTEMS
      </div>
    </div>
  );
}
