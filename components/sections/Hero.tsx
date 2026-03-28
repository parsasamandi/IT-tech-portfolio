"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { useShouldReduceMotion } from "@/lib/hooks";
import { supabase } from "@/lib/supabase";

const DEFAULT_TYPED_WORDS = [
  "Scalable Platforms",
  "AI-Powered Solutions",
  "Digital Growth Engines",
  "Smart Automation",
  "Unified Ecosystems"
];

const DEFAULT_HEADLINE = "Empowering Businesses";
const DEFAULT_SUBTITLE = "SYSPLAT builds intelligent digital platforms that transform how your business operates, grows, and scales.";

export default function Hero() {
  const [currentWord, setCurrentWord] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [typedWords, setTypedWords] = useState(DEFAULT_TYPED_WORDS);
  const [headline, setHeadline] = useState(DEFAULT_HEADLINE);
  const [subtitle, setSubtitle] = useState(DEFAULT_SUBTITLE);
  const shouldReduceMotion = useShouldReduceMotion();

  // Fetch hero data from database
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        if (!supabase) return;
        const { data, error } = await supabase
          .from("settings")
          .select("hero_typed_words, hero_headline, hero_subtitle")
          .single();

        if (error) throw error;
        if (data) {
          if (data.hero_typed_words && Array.isArray(data.hero_typed_words)) {
            setTypedWords(data.hero_typed_words);
          }
          if (data.hero_headline) setHeadline(data.hero_headline);
          if (data.hero_subtitle) setSubtitle(data.hero_subtitle);
        }
      } catch (err) {
        console.error("Error fetching hero data:", err);
      }
    };

    fetchHeroData();
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const word = typedWords[currentWord];
    const speed = isDeleting ? 30 : 60;
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        const next = word.substring(0, displayText.length + 1);
        setDisplayText(next);
        if (next === word) {
          setIsPaused(true);
          setTimeout(() => { setIsPaused(false); setIsDeleting(true); }, 2000);
        }
      } else {
        const next = word.substring(0, displayText.length - 1);
        setDisplayText(next);
        if (next === "") {
          setIsDeleting(false);
          setCurrentWord((p) => (p + 1) % typedWords.length);
        }
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWord, isPaused, typedWords]);

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-navy-50 px-6">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        {/* Blur orbs - hidden on mobile to prevent jitter, reduced blur on tablet */}
        <div className="hidden md:block absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-crimson-100/30 rounded-full blur-[60px] md:blur-[120px] hero-orb" />
        <div className="hidden md:block absolute bottom-1/4 right-1/4 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-navy-100/40 rounded-full blur-[70px] md:blur-[140px] hero-orb" style={{ animationDelay: "2s" }} />
      </div>

      {/* Hero Content - Forced Centering */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center py-20 mt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-10 px-5 py-2.5 rounded-full glass-card border border-white/60 shadow-md text-navy-900"
        >
          <Sparkles className="w-4 h-4 text-crimson-600" />
          <span className="text-[13px] font-bold text-navy-600 tracking-wide uppercase">Intelligent Digital Platforms</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-navy-900 leading-[1.05] tracking-tight mb-8"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {headline.split(" ").map((word, i) => (
            <span key={i}>
              {i === headline.split(" ").length - 1 ? (
                <span className="text-crimson-600 glow-crimson">{word}</span>
              ) : (
                word
              )}
              {i < headline.split(" ").length - 1 && " "}
            </span>
          ))}<br />
          <span className="inline-block gradient-text-hero min-h-[1em]">
            {displayText}<span className="typing-cursor" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-navy-600 leading-relaxed mb-12"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <a href="#projects" className="px-10 py-4 text-base font-bold text-white rounded-2xl gradient-primary gradient-primary-hover shadow-xl shadow-crimson-600/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
            View Our Work <ArrowRight className="w-5 h-5" />
          </a>
          <a href="#contact" className="px-10 py-4 text-base font-bold text-navy-900 rounded-2xl bg-white border border-navy-200 card-shadow-hover hover:-translate-y-1 transition-all duration-300">
            Get in Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator - static on mobile to prevent jitter */}
      <motion.div
        animate={shouldReduceMotion ? { y: 0 } : { y: [0, 10, 0] }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 2, repeat: Infinity }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-navy-400 opacity-50"
      >
        <span className="text-[10px] font-black tracking-widest uppercase">Scroll Down</span>
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
}
