"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  highlight: string;
  subtitle: string;
}

export default function SectionHeading({ title, highlight, subtitle }: SectionHeadingProps) {
  const parts = title.split(highlight);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="mb-20 text-center"
    >
      <span className="inline-block mb-4 px-5 py-2 text-[11px] font-black tracking-widest uppercase rounded-full bg-crimson-50 text-crimson-600 border border-crimson-100 shadow-sm">
        {subtitle}
      </span>
      <h2
        className="text-4xl md:text-5xl font-black text-navy-900 tracking-tight leading-tight"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {parts[0]}
        <span className="text-crimson-600">{highlight}</span>
        {parts[1]}
      </h2>
      <div className="w-16 h-1.5 bg-crimson-600 rounded-full mt-6 mx-auto opacity-20" />
    </motion.div>
  );
}
