"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start with a stable server-friendly default to avoid SSR hydration mismatches.
  const [theme, setTheme] = useState<ThemeMode>("light");

  // On mount, read stored preference or system preference and apply it.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("whisperhub-theme") as ThemeMode | null;
      const initial = stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      // Defer state update to avoid synchronous setState in effect
      queueMicrotask(() => setTheme(initial));
    } catch (e) {
      // If any error occurs (e.g., localStorage not available), keep default.
      console.error("Theme init error", e);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      window.localStorage.setItem("whisperhub-theme", theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === "light" ? "dark" : "light")),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
