"use client";

/**
 * GlassCard Component
 *
 * Reusable glassmorphic card container with hover glow effect.
 * Wraps children in a styled, animated card.
 */
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Whether to show hover glow effect */
  hover?: boolean;
  /** Animation delay for staggered reveals */
  delay?: number;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className={`
        glass rounded-2xl p-6 
        ${hover ? "card-hover cursor-pointer" : ""} 
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
