"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef, useEffect, useSyncExternalStore } from "react";
import { scrollToTarget } from "@/components/SmoothScroll";

/* ---------------- WordsPullUp (Ultra-Crisp Motion) ---------------- */
interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({
  text,
  className = "",
  showAsterisk = false,
  style,
}: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const words = text.split(" ");
  const shouldAnimate = mounted || isInView;

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 24, opacity: 0 }}
            animate={shouldAnimate ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.7,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] select-none text-[#E1E0CC]">
                *
              </span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- WordsPullUpMultiStyle ---------------- */
interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  style?: React.CSSProperties;
}

export const WordsPullUpMultiStyle = ({
  segments,
  className = "",
  style,
}: WordsPullUpMultiStyleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words: { word: string; className?: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div
      ref={ref}
      className={`inline-flex flex-wrap justify-center ${className}`}
      style={style}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: 28, opacity: 0, filter: "blur(6px)" }}
          animate={isInView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
          transition={{
            duration: 0.75,
            delay: i * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`inline-block ${w.className ?? ""}`}
          style={{ marginRight: "0.25em" }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  );
};

/* ---------------- Truly Imperceptible Cinemagraph Loop Player ---------------- */
function ImperceptibleHeroVideo({
  src = "/hero-master-endless.mp4",
  webmSrc = "/hero-master-endless.webm",
  poster = "/hero-poster.jpg",
}: {
  src?: string;
  webmSrc?: string;
  poster?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Enforce DOM properties required by Safari / mobile WebKit
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");

    const attemptPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If iOS low power mode or strict autoplay restricts initial play,
          // resume immediately on the very first user interaction or scroll
          const onFirstInteraction = () => {
            video.play().catch(() => {});
            window.removeEventListener("touchstart", onFirstInteraction);
            window.removeEventListener("touchend", onFirstInteraction);
            window.removeEventListener("click", onFirstInteraction);
            window.removeEventListener("scroll", onFirstInteraction);
          };
          window.addEventListener("touchstart", onFirstInteraction, { once: true, passive: true });
          window.addEventListener("touchend", onFirstInteraction, { once: true, passive: true });
          window.addEventListener("click", onFirstInteraction, { once: true, passive: true });
          window.addEventListener("scroll", onFirstInteraction, { once: true, passive: true });
        });
      }
    };

    attemptPlay();

    // Auto-resume if mobile app/browser tab wakes from sleep
    const onVisibilityChange = () => {
      if (!document.hidden && video.paused) {
        video.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [src, webmSrc]);

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-black select-none pointer-events-none">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        {...({ "webkit-playsinline": "true" } as Record<string, string>)}
        preload="metadata"
        poster={poster}
        disablePictureInPicture
        disableRemotePlayback
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        style={{
          objectPosition: "center center",
          transform: "translate3d(0, 0, 0)",
          WebkitTransform: "translate3d(0, 0, 0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <source src={webmSrc} type="video/webm" />
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

/* ---------------- PrismaHero Component ---------------- */
interface PrismaHeroProps {
  navItems?: { label: string; href?: string; id?: string; action?: string }[];
  showIntegratedNav?: boolean;
}

const DEFAULT_NAV_ITEMS = [
  { label: "Work", id: "projects" },
  { label: "Writing", href: "/blog" },
  { label: "About", id: "about" },
  { label: "CV", action: "cv" },
  { label: "Contact", id: "contact" },
];

const PrismaHero = ({
  navItems = DEFAULT_NAV_ITEMS,
  showIntegratedNav = false,
}: PrismaHeroProps) => {
  return (
    <section className="h-[100dvh] w-full relative">
      <div className="relative h-full w-full overflow-hidden rounded-none border-b border-[#0A0A0A]/10">
        
        {/* Mathematically Seamless 13.5Mbps Master Endless Video */}
        <ImperceptibleHeroVideo
          src="/hero-master-endless.mp4"
          poster="/hero-poster.jpg"
        />

        {/* Cinematic Vignette Gradient overlay (Clean, uncrushed shadows) */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

        {/* Optional integrated navbar (if used standalone) */}
        {showIntegratedNav && (
          <nav className="absolute left-1/2 top-0 z-30 -translate-x-1/2 pointer-events-auto">
            <div className="flex items-center gap-4 sm:gap-8 md:gap-10 rounded-b-2xl sm:rounded-b-[1.75rem] bg-black/90 backdrop-blur-xl px-5 py-2.5 sm:px-8 sm:py-3.5 md:px-10 md:py-4 shadow-[0_16px_40px_rgba(0,0,0,0.45)] border-b border-x border-white/15">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href || (item.id ? `#${item.id}` : "#")}
                  className="text-[13px] sm:text-[14.5px] md:text-[15.5px] font-sans font-medium tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap px-2 sm:px-3 py-1 rounded-full hover:bg-white/10"
                  style={{ color: "rgba(225, 224, 204, 0.9)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(225, 224, 204, 0.9)")
                  }
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}

        {/* Hero content aligned with site container */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-6 sm:px-12 sm:pb-10 md:px-16 md:pb-12 lg:px-24">
          <div className="max-w-[1400px] mx-auto grid grid-cols-12 items-end gap-3 sm:gap-6 lg:gap-8">
            
            {/* Monumental Headline: WVRNER (Plus Jakarta Sans - Bolder & Touching Glyphs) */}
            <div className="col-span-12 lg:col-span-7 xl:col-span-8 overflow-visible">
              <motion.h1
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="font-wvrner font-[800] leading-[0.82] text-[clamp(3.2rem,8.8vw,10.2rem)] select-none whitespace-nowrap pr-4 sm:pr-8 overflow-visible wv-mark wv-mark--light wv-mark--wave"
                style={{
                  fontFamily: "var(--font-plus-jakarta), sans-serif",
                  fontWeight: 800,
                }}
              >
                <span className="inline-flex items-baseline overflow-visible">
                  <span>W</span>
                  <span className="-ml-[0.08em]">V</span>
                  <span className="-ml-[0.14em]">R</span>
                  <span className="-ml-[0.17em]">N</span>
                  <span className="-ml-[0.18em]">E</span>
                  <span className="-ml-[0.15em]">R</span>
                </span>
              </motion.h1>
            </div>

            {/* Narrative & Action Block (Apple + Notion Design) */}
            <div className="col-span-12 lg:col-span-5 xl:col-span-4 flex flex-col pb-1 sm:pb-3 lg:pb-5">
              
              <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-black/45 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] space-y-4">
                
                {/* Notion-style minimal eyebrow metadata */}
                <div className="text-[11px] font-mono tracking-widest uppercase text-[#E1E0CC]/75">
                  <span>DISTRIBUTED ARCHITECTURE</span>
                </div>

                <p
                  className="text-[14px] sm:text-[15px] font-normal tracking-normal text-[#E1E0CC]/90 leading-relaxed max-w-[38ch]"
                  style={{ lineHeight: 1.55 }}
                >
                  Designing automated cloud systems, declarative infrastructure, and zero-downtime delivery pipelines.
                </p>

                {/* Apple-grade Action Pill Button with Sheen Glint */}
                <div className="pt-1">
                  <a
                    href="#nima-hosseini"
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.getElementById("nima-hosseini") || document.getElementById("projects");
                      if (target) {
                        target.scrollIntoView({ behavior: "smooth" });
                      } else {
                        scrollToTarget("#nima-hosseini", { duration: 1.2 });
                      }
                    }}
                    className="group relative inline-flex items-center gap-3 rounded-full bg-[#E1E0CC] hover:bg-white text-[#121211] py-2 pl-5 pr-2 text-[14px] font-medium tracking-tight transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.35)] active:scale-95 cursor-pointer overflow-hidden"
                  >
                    {/* Specular sheen sweep */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                    <span className="relative z-10">Explore Work</span>
                    <span className="relative z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-black text-[#E1E0CC] transition-transform duration-300 group-hover:scale-105 group-hover:translate-x-0.5">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </a>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { PrismaHero };
