"use client";

/**
 * AnimatedCounter Component
 *
 * Animates a number from 0 to the target value when it scrolls into view.
 * Uses requestAnimationFrame for smooth performance.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  /** Target number to count up to */
  value: number;
  /** Text after the number (e.g., "+", "%") */
  suffix?: string;
  /** Duration of the animation in milliseconds */
  duration?: number;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  duration = 2000,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration]);

  return (
    <motion.span
      ref={ref}
      className="text-4xl md:text-5xl font-bold text-navy-900"
      style={{ fontFamily: "var(--font-heading)" }}
    >
      {count}
      {suffix}
    </motion.span>
  );
}
