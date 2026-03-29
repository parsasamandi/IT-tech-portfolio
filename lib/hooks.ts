"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to detect mobile devices
 * Returns true on mobile (< 768px)
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    // Debounce resize to avoid excessive re-renders
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(timer); timer = setTimeout(check, 150); };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); clearTimeout(timer); };
  }, []);

  return isMobile;
}

/**
 * Custom hook to detect if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}

/**
 * Combined hook: returns true if animations should be reduced
 * Only respects user's OS prefers-reduced-motion setting
 * Mobile devices get FULL animations (entrance, staggered delays, transitions)
 * Only Hero typing cycle respects this hook to prevent mobile layout jumps
 */
export function useShouldReduceMotion(): boolean {
  return usePrefersReducedMotion();
}
