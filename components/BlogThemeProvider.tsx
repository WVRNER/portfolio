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
const THEME_CHANGE_EVENT = "wvrner-blog-theme-change";

function subscribeToTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleMediaChange = () => {
    callback();
  };

  const handleCustomChange = () => {
    callback();
  };

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback();
    }
  };

  try {
    mediaQuery.addEventListener("change", handleMediaChange);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(THEME_CHANGE_EVENT, handleCustomChange);
  } catch {
    // Media query listener not supported
  }

  return () => {
    try {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(THEME_CHANGE_EVENT, handleCustomChange);
    } catch {
      // Clean-up failed
    }
  };
}

function getStoredThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      if (isSystemDark && stored !== "dark") {
        return "dark";
      }
      return stored;
    }
    return isSystemDark ? "dark" : "light";
  } catch {
    return "light";
  }
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

export function BlogThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getStoredThemeSnapshot,
    getServerThemeSnapshot
  );

  const [localOverride, setLocalOverride] = useState<Theme | null>(null);
  const activeTheme = localOverride || theme;

  // Synchronize theme to document element and clean up when navigating away
  useEffect(() => {
    try {
      if (activeTheme === "dark") {
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
  }, [activeTheme]);

  const toggleTheme = useCallback(() => {
    const next = activeTheme === "dark" ? "light" : "dark";
    setLocalOverride(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    } catch {
      // Storage unavailable
    }
  }, [activeTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setLocalOverride(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
      window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    } catch {
      // Storage unavailable
    }
  }, []);

  return (
    <BlogThemeContext.Provider value={{ theme: activeTheme, toggleTheme, setTheme }}>
      <div className={activeTheme === "dark" ? "dark" : ""}>
        {children}
      </div>
    </BlogThemeContext.Provider>
  );
}

export function useBlogTheme() {
  return useContext(BlogThemeContext);
}
