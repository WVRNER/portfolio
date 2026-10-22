"use client";

import { useState } from "react";
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

  const handleClick = (item: (typeof navItems)[number]) => {
    setMobileMenuOpen(false);
    if (item.action === "cv") {
      onOpenCV?.();
      return;
    }
    if (item.href) {
      router.push(item.href);
      return;
    }
    if (item.id) {
      if (pathname !== "/") {
        router.push(`/#${item.id}`);
        return;
      }
      const el = document.getElementById(item.id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
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
        className="fixed left-1/2 top-[max(1.25rem,calc(env(safe-area-inset-top,0px)+0.75rem))] sm:top-5 md:top-6 z-50 -translate-x-1/2 pointer-events-auto flex flex-col items-center w-auto max-w-[calc(100vw-2rem)]"
      >
        <nav aria-label="Main Navigation" className="flex flex-col items-center">
          
          {/* MOBILE PILL: WVRNER logo + 2-line custom hamburger */}
          <div className="flex sm:hidden items-center justify-between gap-6 rounded-full bg-black/85 backdrop-blur-2xl px-4 py-2 shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.14)] border border-white/20">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                router.push("/");
              }}
              className="flex items-center text-white hover:text-white/80 font-[family-name:var(--font-plus-jakarta)] text-[13.5px] font-extrabold tracking-[-0.02em] uppercase transition-colors cursor-pointer"
              title="WVRNER Home"
              aria-label="WVRNER Home"
            >
              <span>WVRNER</span>
            </button>

            {/* 2-line hamburger button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="w-8 h-8 rounded-full flex flex-col items-center justify-center gap-[5px] hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
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
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white hover:text-white/80 font-[family-name:var(--font-plus-jakarta)] text-[13px] sm:text-[14px] font-extrabold tracking-[-0.02em] uppercase transition-colors cursor-pointer"
              title="WVRNER Home"
              aria-label="WVRNER Home"
            >
              <span>WVRNER</span>
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

          {/* MOBILE DROPDOWN MENU: 80% transparency with backdrop blur */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="sm:hidden mt-2.5 w-[220px] rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/20 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.65)] overflow-hidden"
              >
                <div className="flex flex-col space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleClick(item)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13.5px] font-sans font-medium transition-all active:scale-[0.98] cursor-pointer flex items-center justify-between ${
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
