"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Users, Clock, TrendingUp } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { STATS, TECH_STACK } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import type { StatItem } from "@/lib/types";

const STAT_ICONS = [Award, Users, Clock, TrendingUp];

export default function About() {
  const [aboutData, setAboutData] = useState<{
    title: string;
    paragraph1: string;
    paragraph2: string;
    stats: StatItem[];
  }>({
    title: "Driving Digital Transformation",
    paragraph1: "With over a decade of experience in technology solutions, we specialize in building high-performance applications that scale. Our team combines deep technical expertise with creative problem-solving.",
    paragraph2: "From startups to enterprise clients, we've helped organizations across industries modernize their tech stacks, optimize workflows, and launch products that users love.",
    stats: STATS
  });

  useEffect(() => {
    async function fetchSettings() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("about_title, about_paragraph1, about_paragraph2, about_stats")
          .limit(1)
          .single();
        
        if (error && error.code !== "PGRST116") throw error;
        
        if (data) {
          setAboutData({
            title: data.about_title || "Driving Digital Transformation",
            paragraph1: data.about_paragraph1 || "With over a decade of experience in technology solutions, we specialize in building high-performance applications that scale. Our team combines deep technical expertise with creative problem-solving.",
            paragraph2: data.about_paragraph2 || "From startups to enterprise clients, we've helped organizations across industries modernize their tech stacks, optimize workflows, and launch products that users love.",
            stats: data.about_stats || STATS
          });
        }
      } catch (err) {
        console.error("Error fetching about settings:", err);
      }
    }

    fetchSettings();
  }, []);

  const titleParts = aboutData.title.split(" ");
  const lastWord = titleParts.length > 1 ? titleParts.pop() || "" : "";
  const firstPart = titleParts.join(" ");

  return (
    <section id="about" className="py-24 bg-navy-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <SectionHeading title="About Us" highlight="About" subtitle="Who We Are" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-navy-900 mb-5" style={{ fontFamily: "var(--font-heading)" }}>
              {firstPart} {lastWord && <span className="text-crimson-600">{lastWord}</span>}
              {!lastWord && aboutData.title}
            </h3>
            <p className="text-text-secondary leading-relaxed mb-3 text-[15px]">
              {aboutData.paragraph1}
            </p>
            <p className="text-text-secondary leading-relaxed mb-7 text-[15px]">
              {aboutData.paragraph2}
            </p>

            {/* Tech Stack */}
            <div className="mb-7">
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="px-3 py-1 text-xs font-medium text-text-secondary rounded-md
                      bg-white border border-slate-200 hover:border-crimson-200 hover:text-crimson-600
                      cursor-default transition-all"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card p-4 w-fit flex items-center gap-3 card-shadow-hover hover:-translate-y-1 transition-all duration-300 cursor-default"
            >
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-sm shadow-crimson-500/15">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Certified</p>
                <p className="text-sm font-semibold text-navy-900">AWS & Azure Solutions Architect</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            {aboutData.stats.map((stat, i) => {
              const Icon = STAT_ICONS[i % STAT_ICONS.length];
              return (
                <motion.div
                  key={stat.label + i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="glass-card rounded-2xl p-5 text-center hover:border-crimson-200 card-shadow-hover hover:-translate-y-1 transition-all duration-300 cursor-default"
                >
                  <div className="w-10 h-10 rounded-lg bg-crimson-50 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-crimson-500" />
                  </div>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
