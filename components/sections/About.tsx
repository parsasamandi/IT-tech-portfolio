"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { supabase } from "@/lib/supabase";

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

  const shouldReduceMotion = useReducedMotion();

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
      className="py-20 md:py-32 bg-gradient-to-br from-navy-50 via-white to-slate-50 relative overflow-hidden"
      aria-labelledby="about-heading"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative">
        <SectionHeading
          title="About SYSPLAT"
          highlight="SYSPLAT"
          subtitle="Who We Are"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Company Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: shouldReduceMotion ? 0 : 0.5 }}
            className="inline-flex items-center gap-2 mb-10 px-5 py-2.5 rounded-full glass-card border border-crimson-100/60 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-crimson-500" aria-hidden="true" />
            <span className="text-sm font-semibold text-navy-700 tracking-wide">Next-Generation IT Company</span>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: shouldReduceMotion ? 0 : 0.6 }}
              className="glass-card border border-navy-100/50 rounded-3xl p-8 md:p-10 shadow-md hover:shadow-xl transition-shadow duration-500"
            >
              <p className="text-lg md:text-xl leading-relaxed text-navy-700 font-medium">
                {aboutData.paragraph1}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: shouldReduceMotion ? 0 : 0.6 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-crimson-500/5 via-transparent to-navy-500/5" aria-hidden="true" />
              <div className="relative border-l-4 border-crimson-500 pl-8 md:pl-10 py-8 md:py-10 pr-8 md:pr-10 glass-card border border-navy-100/30 shadow-md">
                <p className="text-base md:text-lg leading-relaxed text-navy-600 font-medium">
                  {aboutData.paragraph2}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.6, duration: shouldReduceMotion ? 0 : 0.6 }}
            className="pt-12 text-center"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-crimson-500 to-crimson-600 text-white rounded-2xl hover:from-crimson-600 hover:to-crimson-700 transition-all duration-300 shadow-xl shadow-crimson-600/30 hover:shadow-2xl hover:shadow-crimson-600/50 hover:-translate-y-1"
              aria-label="View our portfolio of projects"
            >
              <span className="font-semibold text-base">Explore Our Work</span>
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
