"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Briefcase, Globe, Zap, Megaphone, Users, MessageSquare } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { supabase } from "@/lib/supabase";
import { useShouldReduceMotion } from "@/lib/hooks";

const PILLARS = [
  { label: "Business Development", icon: Briefcase },
  { label: "Web Engineering", icon: Globe },
  { label: "AI Automation", icon: Zap },
  { label: "Digital Marketing", icon: Megaphone },
  { label: "Customer Engagement", icon: MessageSquare },
  { label: "CRM & LMS", icon: Users },
];

export default function About() {
  const [aboutData, setAboutData] = useState<{
    title: string;
    paragraph1: string;
    paragraph2: string;
  }>({
    title: "About SYSPLAT",
    paragraph1: "SYSPLAT is a next-generation Information Technology company specializing in modular digital platforms designed to help businesses grow, automate, and scale. Each \"Plat\" represents a dedicated platform built with precision, performance, and modern engineering.",
    paragraph2: "We combine strategic business development, high-end web engineering, AI-powered automation, digital marketing excellence, customer engagement systems, and enterprise-grade CRM and LMS solutions. Our mission is simple: build intelligent platforms that transform businesses into digital powerhouses."
  });

  const reduce = useShouldReduceMotion();

  useEffect(() => {
    async function fetchSettings() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("about_title, about_paragraph1, about_paragraph2")
          .limit(1)
          .single();

        if (error && error.code !== "PGRST116") throw error;

        if (data) {
          setAboutData({
            title: data.about_title || "About SYSPLAT",
            paragraph1: data.about_paragraph1 || "SYSPLAT is a next-generation Information Technology company specializing in modular digital platforms designed to help businesses grow, automate, and scale. Each \"Plat\" represents a dedicated platform built with precision, performance, and modern engineering.",
            paragraph2: data.about_paragraph2 || "We combine strategic business development, high-end web engineering, AI-powered automation, digital marketing excellence, customer engagement systems, and enterprise-grade CRM and LMS solutions. Our mission is simple: build intelligent platforms that transform businesses into digital powerhouses."
          });
        }
      } catch (err) {
        console.error("Error fetching about settings:", err);
      }
    }

    fetchSettings();
  }, []);

  return (
    <section
      id="about"
      className="py-20 md:py-32 bg-navy-50 relative overflow-hidden"
      aria-labelledby="about-heading"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.35] dot-pattern" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
        <SectionHeading title="About SYSPLAT" highlight="SYSPLAT" subtitle="Who We Are" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* ── Left: Content ── */}
          <div className="lg:col-span-7 space-y-8">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduce ? 0 : 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-crimson-50 border border-crimson-100 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-crimson-500" aria-hidden="true" />
              <span className="text-xs font-bold text-crimson-600 tracking-widest uppercase">Next-Generation IT Company</span>
            </motion.div>

            {/* Paragraphs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: reduce ? 0 : 0.1, duration: reduce ? 0 : 0.6 }}
              className="space-y-5"
            >
              <p className="text-lg md:text-xl leading-relaxed text-navy-700 font-medium text-justify">
                {aboutData.paragraph1}
              </p>
              <div className="w-12 h-0.5 bg-gradient-to-r from-crimson-500 to-crimson-300 rounded-full" />
              <p className="text-base md:text-lg leading-relaxed text-navy-600 text-justify">
                {aboutData.paragraph2}
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: reduce ? 0 : 0.2, duration: reduce ? 0 : 0.5 }}
            >
              <a
                href="#projects"
                className="group inline-flex items-center gap-3 px-8 py-4 text-white rounded-2xl
                  bg-gradient-to-r from-crimson-500 to-crimson-600
                  hover:from-crimson-600 hover:to-crimson-700
                  shadow-lg shadow-crimson-600/25 hover:shadow-xl hover:shadow-crimson-600/35
                  hover:-translate-y-0.5 transition-all duration-300"
                aria-label="View our portfolio of projects"
              >
                <span className="font-semibold">Explore Our Work</span>
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </a>
            </motion.div>
          </div>

          {/* ── Right: Platforms + Mission ── */}
          <div className="lg:col-span-5 space-y-4">

            {/* Platform pillars */}
            <motion.div
              initial={{ opacity: 0, x: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: reduce ? 0 : 0.15, duration: reduce ? 0 : 0.6 }}
              className="glass-card rounded-2xl border border-navy-100/60 p-5"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-4">What We Build</p>
              <div className="grid grid-cols-2 gap-2.5">
                {PILLARS.map(({ label, icon: Icon }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: reduce ? 0 : 0.2 + i * 0.06 }}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-navy-50
                      transition-colors duration-200 group cursor-default"
                  >
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0
                      shadow-sm shadow-crimson-500/15 group-hover:shadow-md group-hover:shadow-crimson-500/25 transition-shadow">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-navy-700 group-hover:text-navy-900 leading-tight transition-colors">
                      {label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Mission card */}
            <motion.div
              initial={{ opacity: 0, x: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: reduce ? 0 : 0.35, duration: reduce ? 0 : 0.6 }}
              className="relative overflow-hidden rounded-2xl glass-card border border-navy-100/60 p-6"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-crimson-500/8 rounded-full pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-navy-500/5 rounded-full pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 rounded-full bg-gradient-to-b from-crimson-500 to-crimson-300" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-crimson-600">Our Mission</h4>
                </div>
                <p className="text-sm text-navy-600 leading-relaxed text-justify">
                  Build intelligent platforms that transform businesses into digital powerhouses — unified, scalable, and future-ready.
                </p>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}