"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to detect mobile devices
 * Returns true on mobile (< 768px) or when user prefers reduced motion
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check screen width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Listen for resize
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
 * (either mobile device OR user prefers reduced motion)
 */
export function useShouldReduceMotion(): boolean {
  const isMobile = useIsMobile();
  const prefersReduced = usePrefersReducedMotion();
  return isMobile || prefersReduced;
}
