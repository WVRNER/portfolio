"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";

interface NavigationProps {
  onOpenCV?: () => void;
}

interface NavItem {
  label: string;
  id?: string;
  action?: string;
  href?: string;
  isShiny?: boolean;
}

const navItems: NavItem[] = [
  { label: "Work", id: "projects" },
  { label: "Writing", href: "/blog", isShiny: true },
  { label: "About", id: "about" },
  { label: "CV", action: "cv" },
  { label: "Contact", id: "contact" },
];

export function Navigation({ onOpenCV }: NavigationProps) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [spawnActive, setSpawnActive] = useState(false);
  const [writingPortalActive, setWritingPortalActive] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;
    if (latest > 120 && diff > 8) {
      setHidden(true);
      setMobileMenuOpen(false);
    } else if (diff < -8 || latest <= 120) {
      setHidden(false);
    }
  });

  // Handle direct hash navigation or cross-page dreamy spawn
  useEffect(() => {
    if (typeof window === "undefined") return;

    let targetId: string | null = null;
    try {
      targetId = sessionStorage.getItem("wvrner_pending_spawn");
      if (targetId) {
        sessionStorage.removeItem("wvrner_pending_spawn");
      }
    } catch {
      // Ignore
    }

    if (!targetId && window.location.hash) {
      targetId = window.location.hash.replace("#", "");
    }

    if (targetId) {
      const showTimer = setTimeout(() => {
        setSpawnActive(true);
      }, 0);

      const performScroll = () => {
        if (targetId === "top") {
          window.scrollTo({ top: 0, behavior: "auto" });
        } else {
          const el = document.getElementById(targetId);
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: "auto" });
          }
        }
      };

      // Snap position behind mist
      performScroll();
      const retry1 = setTimeout(performScroll, 80);
      const retry2 = setTimeout(performScroll, 220);

      // Dissolve mist smoothly
      const fadeTimer = setTimeout(() => {
        setSpawnActive(false);
      }, 750);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(retry1);
        clearTimeout(retry2);
        clearTimeout(fadeTimer);
      };
    }
  }, [pathname]);

  /* Cross-Page Dreamy Spawn Transition */
  const triggerCrossPageSpawn = (targetId: string, href: string) => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      router.push(href);
      return;
    }

    setSpawnActive(true);
    try {
      sessionStorage.setItem("wvrner_pending_spawn", targetId);
    } catch {
      // Ignore
    }

    // Navigate at peak mist envelopment
    setTimeout(() => {
      router.push(href);
    }, 320);

    // Safety fallback to dissolve mist if route change is delayed
    setTimeout(() => {
      setSpawnActive(false);
    }, 950);
  };

  /* Dreamy / Steamy Apple-Style Instant Spawn (Same-page) */
  const triggerDreamySpawn = (targetTop: number) => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      window.scrollTo({ top: targetTop, behavior: "auto" });
      return;
    }

    setSpawnActive(true);
    // Port smoothly behind the soft mist at the peak of the vapor
    setTimeout(() => {
      window.scrollTo({ top: targetTop, behavior: "auto" });
    }, 320);

    // Fade mist out smoothly
    setTimeout(() => {
      setSpawnActive(false);
    }, 780);
  };

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    if (pathname !== "/") {
      triggerCrossPageSpawn("top", "/");
      return;
    }
    triggerDreamySpawn(0);
  };

  const handleClick = (item: (typeof navItems)[number]) => {
    setMobileMenuOpen(false);
    if (item.action === "cv") {
      onOpenCV?.();
      return;
    }

    // Bespoke unique portal animation for Writing page
    if (item.href === "/blog") {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        router.push("/blog");
        return;
      }
      setWritingPortalActive(true);
      setTimeout(() => {
        if (pathname === "/blog") {
          window.scrollTo({ top: 0, behavior: "auto" });
        } else {
          router.push("/blog");
        }
      }, 420);
      setTimeout(() => {
        setWritingPortalActive(false);
      }, 820);
      return;
    }

    if (item.href) {
      triggerCrossPageSpawn("top", item.href);
      return;
    }

    if (item.id) {
      if (pathname !== "/") {
        triggerCrossPageSpawn(item.id, `/#${item.id}`);
        return;
      }
      const el = document.getElementById(item.id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        triggerDreamySpawn(top);
      }
    }
  };

  return (
    <>
      {/* Dreamy / Steamy Atmospheric Spawn Mist */}
      <AnimatePresence>
        {spawnActive && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] pointer-events-none bg-white/40 dark:bg-black/50 backdrop-blur-2xl flex items-center justify-center overflow-hidden"
          >
            {/* Soft dreamy vapor cloud with chromatic dispersion tint */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1.25, opacity: 0.8 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              className="w-[640px] h-[420px] rounded-full bg-gradient-to-tr from-[#0de1ed]/25 via-white/80 dark:via-white/30 to-[#ec178b]/25 blur-3xl pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unique Bespoke Celestial Iris Portal for Writing Page */}
      <AnimatePresence>
        {writingPortalActive && (
          <motion.div
            initial={{ clipPath: "circle(0% at 50% 50%)", opacity: 0.95 }}
            animate={{ clipPath: "circle(150% at 50% 50%)", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] pointer-events-none bg-[#E2E2E6] flex flex-col items-center justify-center text-[#050c1a]"
          >
            {/* Nima Hosseini corner liquid chromatic dispersion ambient pools */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 45% 45% at 100% 0%, rgba(255,45,61,0.18) 0%, rgba(42,31,168,0.12) 40%, transparent 75%), radial-gradient(ellipse 55% 55% at 0% 100%, rgba(0,200,255,0.2) 0%, rgba(47,75,255,0.14) 40%, rgba(26,18,64,0.08) 65%, transparent 80%)",
              }}
            />
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col items-center gap-2 select-none"
            >
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase font-bold text-[#5E5E66]">
                OPENING FIELD NOTES
              </span>
              <span className="font-display font-extrabold text-[28px] text-[#050c1a] tracking-tight">
                Writing &amp; Architecture
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invisible backdrop to dismiss mobile menu when tapping outside */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 sm:hidden bg-transparent"
          aria-hidden="true"
        />
      )}

      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-150%", opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 right-0 top-[max(1rem,calc(env(safe-area-inset-top,0px)+0.5rem))] sm:top-5 md:top-6 z-50 pointer-events-none flex flex-col items-center px-3 sm:px-0"
      >
        <nav aria-label="Main Navigation" className="pointer-events-auto w-full sm:w-auto flex flex-col items-center max-w-md sm:max-w-none">
          
          {/* MOBILE PILL: Full-width closed bar with WVRNER on left and 2-line hamburger on right */}
          <div className="flex sm:hidden items-center justify-between w-full rounded-full bg-black/85 backdrop-blur-2xl px-5 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.14)] border border-white/20">
            <button
              onClick={handleLogoClick}
              className="flex items-center font-[family-name:var(--font-plus-jakarta)] text-[14px] font-extrabold tracking-[-0.02em] uppercase transition-colors cursor-pointer py-1"
              title="WVRNER Home"
              aria-label="WVRNER Home"
            >
              <span
                className="bg-clip-text text-transparent font-black"
                style={{
                  backgroundImage: "linear-gradient(120deg, #0de1ed 0%, #0233bc 26%, #ffffff 50%, #ec178b 76%, #df556c 100%)",
                }}
              >
                WVRNER
              </span>
            </button>

            {/* 2-line hamburger button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="w-9 h-9 rounded-full flex flex-col items-center justify-center gap-[5px] hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <span
                className={`w-4 h-[1.5px] bg-white rounded-full transition-transform duration-250 ease-out origin-center ${
                  mobileMenuOpen ? "rotate-45 translate-y-[3.25px]" : ""
                }`}
              />
              <span
                className={`w-4 h-[1.5px] bg-white rounded-full transition-transform duration-250 ease-out origin-center ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-[3.25px]" : ""
                }`}
              />
            </button>
          </div>

          {/* DESKTOP PILL: Full Navigation */}
          <div className="hidden sm:flex items-center gap-1 sm:gap-3 md:gap-4 rounded-full bg-black/85 backdrop-blur-2xl px-2.5 py-1.5 sm:px-5 sm:py-2 md:px-6 md:py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.14)] border border-white/20">
            {/* Logo return home action */}
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-[family-name:var(--font-plus-jakarta)] text-[13px] sm:text-[14px] font-extrabold tracking-[-0.02em] uppercase transition-colors cursor-pointer"
              title="WVRNER Home"
              aria-label="WVRNER Home"
            >
              <span
                className="bg-clip-text text-transparent font-black"
                style={{
                  backgroundImage: "linear-gradient(120deg, #0de1ed 0%, #0233bc 26%, #ffffff 50%, #ec178b 76%, #df556c 100%)",
                }}
              >
                WVRNER
              </span>
            </button>

            <span className="w-px h-3.5 bg-white/20 inline-block" aria-hidden="true" />

            {navItems.map((item) => {
              if (item.isShiny) {
                return (
                  <button
                    key={item.label}
                    onClick={() => handleClick(item)}
                    className="relative group text-[13.5px] sm:text-[14.5px] md:text-[15px] font-sans font-medium tracking-tight cursor-pointer whitespace-nowrap px-3.5 sm:px-4 py-1.5 rounded-full text-white active:scale-95 min-h-[36px] sm:min-h-[38px] flex items-center justify-center overflow-hidden transition-all duration-300 bg-white/[0.14] hover:bg-white/[0.24] border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_16px_rgba(0,0,0,0.25)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_6px_24px_rgba(255,255,255,0.2)]"
                  >
                    <span className="relative z-10 tracking-[-0.01em]">{item.label}</span>
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                  </button>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => handleClick(item)}
                  className="text-[13.5px] sm:text-[14.5px] md:text-[15.5px] font-sans font-medium tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap px-2.5 sm:px-3.5 py-1.5 rounded-full hover:bg-white/15 active:scale-95 min-h-[38px] flex items-center justify-center"
                  style={{ color: "rgba(225, 224, 204, 0.9)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(225, 224, 204, 0.9)")
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* MOBILE DROPDOWN MENU: Full-width 85% transparency with backdrop blur */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="sm:hidden mt-2.5 w-full rounded-3xl bg-black/85 backdrop-blur-2xl border border-white/20 p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden"
              >
                <div className="flex flex-col space-y-1.5">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleClick(item)}
                      className={`w-full text-left px-4 py-3 rounded-2xl text-[14.5px] font-sans font-medium transition-all active:scale-[0.98] cursor-pointer flex items-center justify-between min-h-[48px] ${
                        item.isShiny
                          ? "bg-white/[0.14] text-white border border-white/25 shadow-sm"
                          : "text-white/85 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.isShiny && (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">
                          Field Notes
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </nav>
      </motion.header>
    </>
  );
}
