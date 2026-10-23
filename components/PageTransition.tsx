"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

interface TransitionState {
  active: boolean;
  title: string;
  subtitle: string;
}

interface PageTransitionContextType {
  triggerTransition: (
    title: string,
    subtitle: string,
    onExecuteOrHref: string | (() => void)
  ) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | null>(null);

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) {
    return {
      triggerTransition: (
        _title: string,
        _subtitle: string,
        onExecuteOrHref: string | (() => void)
      ) => {
        if (typeof onExecuteOrHref === "function") {
          onExecuteOrHref();
        }
      },
    };
  }
  return ctx;
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const [transitionState, setTransitionState] = useState<TransitionState | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Dissolve transition overlay smoothly once destination page renders
  useEffect(() => {
    if (transitionState?.active) {
      const dissolveTimer = setTimeout(() => {
        setTransitionState(null);
      }, 350);
      return () => clearTimeout(dissolveTimer);
    }
  }, [pathname]);

  const triggerTransition = useCallback(
    (title: string, subtitle: string, onExecuteOrHref: string | (() => void)) => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        if (typeof onExecuteOrHref === "string") {
          router.push(onExecuteOrHref);
        } else {
          onExecuteOrHref();
        }
        return;
      }

      setTransitionState({ active: true, title, subtitle });

      // Navigate at peak focus and full coverage
      const execTimer = setTimeout(() => {
        if (typeof onExecuteOrHref === "string") {
          router.push(onExecuteOrHref);
        } else {
          onExecuteOrHref();
        }
      }, 380);

      // Safety fallback to dismiss overlay if route change is delayed
      const fallbackTimer = setTimeout(() => {
        setTransitionState(null);
      }, 950);

      return () => {
        clearTimeout(execTimer);
        clearTimeout(fallbackTimer);
      };
    },
    [router]
  );

  return (
    <PageTransitionContext.Provider value={{ triggerTransition }}>
      {children}

      {/* Global Synchronized Page Swap Overlay */}
      <AnimatePresence>
        {transitionState?.active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[120] pointer-events-none bg-[#e1e1e5] flex flex-col items-center justify-center text-[#010c14] select-none overflow-hidden"
          >
            {/* Subtle liquid corner pools with blue inner spectral fringe */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(ellipse 55% 50% at 100% 0%, #010c14 0%, #1A1240 25%, rgba(47,75,255,0.22) 45%, rgba(0,200,255,0.12) 65%, transparent 80%), radial-gradient(ellipse 55% 50% at 0% 100%, #010c14 0%, #1A1240 25%, rgba(47,75,255,0.22) 45%, rgba(127,243,255,0.14) 65%, transparent 80%)",
              }}
            />

            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 14, filter: "blur(28px)" }}
              animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ scale: 1.04, opacity: 0, y: -6, filter: "blur(20px)" }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col items-center gap-3 text-center px-6"
            >
              <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#030e16]" />
                <span>{transitionState.title} &bull; ROUTING</span>
              </div>

              <h2
                className="text-[clamp(48px,11vw,110px)] font-[900] tracking-[-0.04em] text-[#010c14] leading-[0.92] select-none"
                style={{
                  fontFamily: "var(--font-inter-tight), 'Inter Tight', var(--font-inter), sans-serif",
                }}
              >
                {transitionState.title}
              </h2>

              <p className="text-[14px] sm:text-[16px] text-[#4B5563] font-normal tracking-[-0.01em] max-w-[42ch]">
                {transitionState.subtitle}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}
