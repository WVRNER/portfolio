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
  subtitle: string;
  color: string;
  hoverBg: string;
  accentPing: string;
  poolGradient: string;
}

const navItems: NavItem[] = [
  {
    label: "Work",
    id: "projects",
    subtitle: "architectural labs, projects, and cloud systems",
    color: "#00C8FF",
    hoverBg: "rgba(0, 0, 0, 0.05)",
    accentPing: "#00C8FF",
    poolGradient:
      "radial-gradient(ellipse 65% 55% at 50% 0%, rgba(0, 200, 255, 0.12) 0%, rgba(2, 14, 38, 0.6) 45%, transparent 75%), radial-gradient(ellipse 55% 55% at 100% 100%, rgba(0, 140, 255, 0.10) 0%, transparent 70%), radial-gradient(ellipse 55% 55% at 0% 100%, rgba(2, 10, 25, 0.8) 0%, transparent 60%)",
  },
  {
    label: "Writing",
    href: "/blog",
    isShiny: true,
    subtitle: "systems, cloud infrastructure, and technical field notes",
    color: "#FF1F7A",
    hoverBg: "rgba(0, 0, 0, 0.05)",
    accentPing: "#FF1F7A",
    poolGradient:
      "radial-gradient(ellipse 65% 55% at 50% 0%, rgba(255, 31, 122, 0.12) 0%, rgba(35, 6, 22, 0.6) 45%, transparent 75%), radial-gradient(ellipse 55% 55% at 100% 100%, rgba(217, 27, 116, 0.10) 0%, transparent 70%), radial-gradient(ellipse 55% 55% at 0% 100%, rgba(25, 3, 15, 0.8) 0%, transparent 60%)",
  },
  {
    label: "About",
    id: "about",
    subtitle: "operational background, architecture, and principles",
    color: "#10B981",
    hoverBg: "rgba(0, 0, 0, 0.05)",
    accentPing: "#10B981",
    poolGradient:
      "radial-gradient(ellipse 65% 55% at 50% 0%, rgba(16, 185, 129, 0.10) 0%, rgba(4, 30, 20, 0.6) 45%, transparent 75%), radial-gradient(ellipse 55% 55% at 100% 100%, rgba(5, 120, 85, 0.08) 0%, transparent 70%), radial-gradient(ellipse 55% 55% at 0% 100%, rgba(2, 20, 14, 0.8) 0%, transparent 60%)",
  },
  {
    label: "CV",
    action: "cv",
    subtitle: "verified credentials, history, and engineering experience",
    color: "#A78BFA",
    hoverBg: "rgba(0, 0, 0, 0.05)",
    accentPing: "#A78BFA",
    poolGradient: "",
  },
  {
    label: "Contact",
    id: "contact",
    subtitle: "direct lines, consultations, and channels",
    color: "#F97316",
    hoverBg: "rgba(0, 0, 0, 0.05)",
    accentPing: "#F97316",
    poolGradient:
      "radial-gradient(ellipse 65% 55% at 50% 0%, rgba(249, 115, 22, 0.10) 0%, rgba(45, 18, 5, 0.6) 45%, transparent 75%), radial-gradient(ellipse 55% 55% at 100% 100%, rgba(194, 65, 12, 0.08) 0%, transparent 70%), radial-gradient(ellipse 55% 55% at 0% 100%, rgba(25, 10, 2, 0.8) 0%, transparent 60%)",
  },
];

const WVRNER_OVERLAY = {
  title: "WVRNER",
  subtitle: "returning to home surface",
  color: "#FFFFFF",
  accentPing: "#00C8FF",
  poolGradient:
    "radial-gradient(ellipse 65% 55% at 50% 0%, rgba(255, 255, 255, 0.06) 0%, rgba(15, 20, 30, 0.6) 45%, transparent 75%), radial-gradient(ellipse 55% 55% at 100% 100%, rgba(0, 200, 255, 0.08) 0%, transparent 70%), radial-gradient(ellipse 55% 55% at 0% 100%, rgba(10, 12, 18, 0.8) 0%, transparent 60%)",
};

interface NavOverlayState {
  active: boolean;
  title: string;
  subtitle: string;
  accentColor: string;
  pingColor: string;
  poolGradient: string;
}

export function Navigation({ onOpenCV }: NavigationProps) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navOverlay, setNavOverlay] = useState<NavOverlayState | null>(null);
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
      const getDetails = (id: string) => {
        const matched = navItems.find((n) => n.id === id);
        if (matched) {
          return {
            title: matched.label,
            subtitle: matched.subtitle,
            accentColor: matched.color,
            pingColor: matched.accentPing,
            poolGradient: matched.poolGradient,
          };
        }
        return {
          title: WVRNER_OVERLAY.title,
          subtitle: WVRNER_OVERLAY.subtitle,
          accentColor: WVRNER_OVERLAY.color,
          pingColor: WVRNER_OVERLAY.accentPing,
          poolGradient: WVRNER_OVERLAY.poolGradient,
        };
      };

      const details = getDetails(targetId);
      setNavOverlay({
        active: true,
        title: details.title,
        subtitle: details.subtitle,
        accentColor: details.accentColor,
        pingColor: details.pingColor,
        poolGradient: details.poolGradient,
      });

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

      performScroll();
      const retry1 = setTimeout(performScroll, 80);
      const retry2 = setTimeout(performScroll, 220);

      const fadeTimer = setTimeout(() => {
        setNavOverlay(null);
      }, 750);

      return () => {
        clearTimeout(retry1);
        clearTimeout(retry2);
        clearTimeout(fadeTimer);
      };
    }
  }, [pathname]);

  /* Liquid Corner Pools Loading Screen with Blurred Big Text */
  const showNavLoading = (
    title: string,
    subtitle: string,
    accentColor: string,
    pingColor: string,
    poolGradient: string,
    onExecute: () => void
  ) => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      onExecute();
      return;
    }

    setNavOverlay({
      active: true,
      title,
      subtitle,
      accentColor,
      pingColor,
      poolGradient,
    });

    // Execute navigation at peak blur and coverage
    setTimeout(() => {
      onExecute();
    }, 420);

    // Dissolve smoothly once destination is rendered
    setTimeout(() => {
      setNavOverlay(null);
    }, 850);
  };

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    showNavLoading(
      WVRNER_OVERLAY.title,
      WVRNER_OVERLAY.subtitle,
      WVRNER_OVERLAY.color,
      WVRNER_OVERLAY.accentPing,
      WVRNER_OVERLAY.poolGradient,
      () => {
        if (pathname !== "/") {
          try {
            sessionStorage.setItem("wvrner_pending_spawn", "top");
          } catch {
            // Ignore
          }
          router.push("/");
        } else {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      }
    );
  };

  const handleClick = (item: (typeof navItems)[number]) => {
    setMobileMenuOpen(false);

    // CV drawer opens immediately with zero loading screen
    if (item.action === "cv") {
      onOpenCV?.();
      return;
    }

    if (item.href) {
      showNavLoading(
        item.label,
        item.subtitle,
        item.color,
        item.accentPing,
        item.poolGradient,
        () => {
          if (pathname === item.href) {
            window.scrollTo({ top: 0, behavior: "auto" });
          } else {
            router.push(item.href!);
          }
        }
      );
      return;
    }

    if (item.id) {
      showNavLoading(
        item.label,
        item.subtitle,
        item.color,
        item.accentPing,
        item.poolGradient,
        () => {
          if (pathname !== "/") {
            try {
              sessionStorage.setItem("wvrner_pending_spawn", item.id!);
            } catch {
              // Ignore
            }
            router.push(`/#${item.id}`);
          } else {
            const el = document.getElementById(item.id!);
            if (el) {
              const top = el.getBoundingClientRect().top + window.scrollY - 80;
              window.scrollTo({ top, behavior: "auto" });
            }
          }
        }
      );
    }
  };

  return (
    <>
      {/* Dark Cinematic Loading Screen with Monumental Blurred Typography */}
      <AnimatePresence>
        {navOverlay?.active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] pointer-events-none bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center text-white select-none overflow-hidden"
          >
            {/* Subtle atmospheric ambient lighting */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500"
              style={{
                background: navOverlay.poolGradient,
              }}
            />

            {/* Depth vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 14, filter: "blur(32px)" }}
              animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ scale: 1.04, opacity: 0, y: -8, filter: "blur(24px)" }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col items-center gap-3 text-center px-6"
            >
              <div className="flex items-center gap-2.5 font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-white/40">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: navOverlay.pingColor,
                    boxShadow: `0 0 10px ${navOverlay.pingColor}`,
                  }}
                />
                <span>{navOverlay.title} &bull; ROUTING</span>
              </div>
              <h2
                className="text-[clamp(52px,11vw,116px)] font-[900] tracking-[-0.045em] text-white leading-[0.9] select-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
                style={{
                  fontFamily: "var(--font-inter-tight), 'Inter Tight', var(--font-inter), sans-serif",
                }}
              >
                {navOverlay.title}
              </h2>
              <p className="text-[13px] sm:text-[15px] text-white/50 font-normal tracking-[-0.01em] max-w-[42ch]">
                {navOverlay.subtitle}
              </p>
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
          
          {/* MOBILE PILL: Platinum container #e1e2e5 with dark #030e16 contents */}
          <div className="flex sm:hidden items-center justify-between w-full rounded-full bg-[#e1e2e5]/90 backdrop-blur-2xl px-5 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.12),0_0_0_1px_rgba(3,14,22,0.06)] border border-[#030e16]/15">
            <button
              onClick={handleLogoClick}
              className="flex items-center font-[family-name:var(--font-plus-jakarta)] text-[14px] font-extrabold tracking-[-0.02em] uppercase transition-colors cursor-pointer py-1"
              title="WVRNER Home"
              aria-label="WVRNER Home"
            >
              <span className="font-black wv-mark wv-mark--dark">
                WVRNER
              </span>
            </button>

            {/* 2-line hamburger button in #030e16 */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="w-9 h-9 rounded-full flex flex-col items-center justify-center gap-[5px] hover:bg-[#030e16]/10 active:scale-95 transition-all cursor-pointer"
            >
              <span
                className={`w-4 h-[1.5px] bg-[#030e16] rounded-full transition-transform duration-250 ease-out origin-center ${
                  mobileMenuOpen ? "rotate-45 translate-y-[3.25px]" : ""
                }`}
              />
              <span
                className={`w-4 h-[1.5px] bg-[#030e16] rounded-full transition-transform duration-250 ease-out origin-center ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-[3.25px]" : ""
                }`}
              />
            </button>
          </div>

          {/* DESKTOP PILL: Platinum container #e1e2e5 with #030e16 contents */}
          <div className="hidden sm:flex items-center gap-1 sm:gap-2 md:gap-2.5 rounded-full bg-[#e1e2e5]/90 backdrop-blur-2xl px-2.5 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 shadow-[0_16px_40px_rgba(0,0,0,0.12),0_0_0_1px_rgba(3,14,22,0.06)] border border-[#030e16]/15">
            {/* Logo return home action (dark wordmark) */}
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-[family-name:var(--font-plus-jakarta)] text-[13px] sm:text-[14px] font-extrabold tracking-[-0.02em] uppercase transition-colors cursor-pointer"
              title="WVRNER Home"
              aria-label="WVRNER Home"
            >
              <span className="font-black wv-mark wv-mark--dark">
                WVRNER
              </span>
            </button>

            <span className="w-px h-3.5 bg-[#030e16]/20 inline-block" aria-hidden="true" />

            {navItems.map((item) => {
              if (item.isShiny) {
                return (
                  <button
                    key={item.label}
                    onClick={() => handleClick(item)}
                    className="relative group text-[13.5px] sm:text-[14.5px] md:text-[15px] font-sans font-semibold tracking-tight cursor-pointer whitespace-nowrap px-3.5 sm:px-4 py-1.5 rounded-full active:scale-95 min-h-[36px] sm:min-h-[38px] flex items-center justify-center overflow-hidden transition-all duration-300 text-[#030e16] bg-[#030e16]/[0.06] hover:bg-[#030e16]/[0.10] border border-[#030e16]/15 shadow-[0_2px_8px_rgba(3,14,22,0.06)]"
                  >
                    <span className="relative z-10 tracking-[-0.01em]">{item.label}</span>
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-[#030e16]/12 to-transparent pointer-events-none" />
                  </button>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => handleClick(item)}
                  className="text-[13.5px] sm:text-[14.5px] md:text-[15.5px] font-sans font-semibold tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap px-2.5 sm:px-3.5 py-1.5 rounded-full active:scale-95 min-h-[38px] flex items-center justify-center text-[#030e16] hover:bg-[#030e16]/[0.08]"
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* MOBILE DROPDOWN MENU: Platinum container #e1e2e5 with #030e16 contents */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="sm:hidden mt-2.5 w-full rounded-3xl bg-[#e1e2e5]/95 backdrop-blur-2xl border border-[#030e16]/15 p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.22)] overflow-hidden"
              >
                <div className="flex flex-col space-y-1.5">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleClick(item)}
                      className={`w-full text-left px-4 py-3 rounded-2xl text-[14.5px] font-sans font-semibold transition-all active:scale-[0.98] cursor-pointer flex items-center justify-between min-h-[48px] text-[#030e16] ${
                        item.isShiny
                          ? "bg-[#030e16]/[0.06] border border-[#030e16]/15"
                          : "hover:bg-[#030e16]/[0.08]"
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.isShiny && (
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#030e16]/10 text-[#030e16]/75">
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
