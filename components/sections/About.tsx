"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

  const titleParts = aboutData.title.split(" ");
  const lastWord = titleParts.length > 1 ? titleParts.pop() || "" : "";
  const firstPart = titleParts.join(" ");

  return (
    <section id="about" className="py-32 bg-gradient-to-br from-navy-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-crimson-400 rounded-full opacity-60" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-navy-300 rounded-full" />
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-crimson-300 rounded-full opacity-40" />
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 relative">
        <SectionHeading title="About SYSPLAT" highlight="SYSPLAT" subtitle="Who We Are" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Company Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass-card border border-crimson-100 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-crimson-500" />
            <span className="text-sm font-semibold text-navy-700 tracking-wide">Next-Generation IT Company</span>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <p className="text-lg md:text-xl leading-relaxed text-navy-700 font-medium">
                {aboutData.paragraph1}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="border-l-4 border-crimson-200 pl-6 bg-white/60 backdrop-blur-sm rounded-r-xl py-6 pr-6"
            >
              <p className="text-base md:text-lg leading-relaxed text-navy-600">
                {aboutData.paragraph2}
              </p>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="pt-12"
          >
            <a 
              href="#projects" 
              className="group inline-flex items-center gap-3 px-8 py-4 bg-navy-900 text-white rounded-2xl hover:bg-navy-800 transition-all duration-300 hover:shadow-lg hover:shadow-navy-900/25 hover:-translate-y-1"
            >
              <span className="font-semibold">Explore Our Work</span>
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
