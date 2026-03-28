"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Users, Clock, TrendingUp } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { STATS } from "@/lib/constants";
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
    title: "About SYSPLAT",
    paragraph1: "SYSPLAT is a next-generation Information Technology company specializing in modular digital platforms designed to help businesses grow, automate, and scale. Each \"Plat\" represents a dedicated platform built with precision, performance, and modern engineering.",
    paragraph2: "We combine strategic business development, high-end web engineering, AI-powered automation, digital marketing excellence, customer engagement systems, and enterprise-grade CRM and LMS solutions. Our mission is simple: build intelligent platforms that transform businesses into digital powerhouses.",
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
            title: data.about_title || "About SYSPLAT",
            paragraph1: data.about_paragraph1 || "SYSPLAT is a next-generation Information Technology company specializing in modular digital platforms designed to help businesses grow, automate, and scale. Each \"Plat\" represents a dedicated platform built with precision, performance, and modern engineering.",
            paragraph2: data.about_paragraph2 || "We combine strategic business development, high-end web engineering, AI-powered automation, digital marketing excellence, customer engagement systems, and enterprise-grade CRM and LMS solutions. Our mission is simple: build intelligent platforms that transform businesses into digital powerhouses.",
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
        <SectionHeading title="About SYSPLAT" highlight="SYSPLAT" subtitle="Who We Are" />

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
