"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "motion/react";

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
  const pathname = usePathname();
  const router = useRouter();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;
    if (latest > 120 && diff > 8) {
      setHidden(true);
    } else if (diff < -8 || latest <= 120) {
      setHidden(false);
    }
  });

  const handleClick = (item: (typeof navItems)[number]) => {
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
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-150%", opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-1/2 top-[max(1.25rem,calc(env(safe-area-inset-top,0px)+0.75rem))] sm:top-5 md:top-6 z-50 -translate-x-1/2 pointer-events-auto w-auto max-w-[calc(100vw-2rem)]"
    >
      <nav aria-label="Main Navigation" className="flex items-center justify-center">
        <div className="flex items-center gap-1 sm:gap-4 md:gap-6 rounded-full bg-black/85 backdrop-blur-2xl px-3 py-1.5 sm:px-6 sm:py-2 md:px-7 md:py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.14)] border border-white/20">
          {navItems.map((item) => {
            if (item.isShiny) {
              return (
                <button
                  key={item.label}
                  onClick={() => handleClick(item)}
                  className="relative group text-[13.5px] sm:text-[14.5px] md:text-[15px] font-sans font-medium tracking-tight cursor-pointer whitespace-nowrap px-3.5 sm:px-4 py-1.5 rounded-full text-white active:scale-95 min-h-[36px] sm:min-h-[38px] flex items-center justify-center overflow-hidden transition-all duration-300 bg-white/[0.14] hover:bg-white/[0.24] border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_16px_rgba(0,0,0,0.25)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_6px_24px_rgba(255,255,255,0.2)]"
                >
                  <span className="relative z-10 tracking-[-0.01em]">{item.label}</span>
                  {/* Apple-style specular sheen glint */}
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
      </nav>
    </motion.header>
  );
}
