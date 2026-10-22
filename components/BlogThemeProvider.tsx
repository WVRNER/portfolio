"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";

interface BlogThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const BlogThemeContext = createContext<BlogThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

const STORAGE_KEY = "wvrner-blog-theme";

function subscribeNoop() {
  return () => {};
}

function getStoredThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

export function BlogThemeProvider({ children }: { children: React.ReactNode }) {
  const initialTheme = useSyncExternalStore(
    subscribeNoop,
    getStoredThemeSnapshot,
    getServerThemeSnapshot
  );

  const [theme, setThemeState] = useState<Theme>(initialTheme);

  // Synchronize theme to document element and clean up when navigating away
  useEffect(() => {
    try {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-blog-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-blog-theme", "light");
      }
    } catch {
      // Storage or DOM unavailable
    }

    return () => {
      // Leaving blog section: clean up dark class from root
      document.documentElement.classList.remove("dark");
      document.documentElement.removeAttribute("data-blog-theme");
    };
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Storage unavailable
      }
      return next;
    });
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Storage unavailable
    }
  }, []);

  return (
    <BlogThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </BlogThemeContext.Provider>
  );
}

export function useBlogTheme() {
  return useContext(BlogThemeContext);
}
