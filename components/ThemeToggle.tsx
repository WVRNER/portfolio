"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useBlogTheme } from "@/components/BlogThemeProvider";

interface ThemeToggleProps {
  className?: string;
}

/**
 * ThemeToggle - Minimalist Apple/Linear-grade toggle for blog & articles
 * Supports smooth transition, tooltip, and zero em dashes.
 */
export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useBlogTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`group relative inline-flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isDark
          ? "border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-[#F5F5F7] focus-visible:ring-white/40 focus-visible:ring-offset-[#0C0C0D]"
          : "border-black/10 bg-black/[0.03] hover:bg-black/[0.07] text-[#333333] focus-visible:ring-black/30 focus-visible:ring-offset-white"
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 rotate-0 scale-100 group-hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-[#444444] transition-transform duration-300 rotate-0 scale-100 group-hover:-rotate-12" />
        )}
      </div>
    </button>
  );
}
