"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { TESTIMONIALS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import type { Testimonial } from "@/lib/types";
import { useShouldReduceMotion } from "@/lib/hooks";

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const reduce = useShouldReduceMotion();

  const fetchTestimonials = useCallback(async () => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false });

      if (error && error.code !== "PGRST116" && error.code !== "42P01") throw error;

      if (data && data.length > 0) {
        setTestimonials(data as Testimonial[]);
      }
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const next = useCallback(() => {
    if (testimonials.length === 0) return;
    setCurrent((p) => (p + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = () => {
    if (testimonials.length === 0) return;
    setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (reduce || testimonials.length <= 1) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next, testimonials.length, reduce]);

  if (testimonials.length === 0) return null;

  const item = testimonials[current] || testimonials[0];

  return (
    <section id="testimonials" className="py-24 overflow-hidden bg-navy-50">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <SectionHeading title="Client Testimonials" highlight="Testimonials" subtitle="What Clients Say" />

        <div className="relative h-[420px] sm:h-[400px] md:h-[360px]">
          <AnimatePresence>
            <motion.div
              key={current}
              initial={{ opacity: 0, x: reduce ? 0 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduce ? 0 : -20 }}
              transition={{ duration: reduce ? 0 : 0.4 }}
              className="absolute inset-0 glass-card rounded-3xl p-8 md:p-10 text-center card-shadow-hover transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-6
                shadow-sm shadow-crimson-500/15">
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-base md:text-lg text-navy-800 leading-relaxed mb-8 max-w-2xl mx-auto italic font-medium text-center md:text-justify min-h-[80px]">
                &ldquo;{item.content}&rdquo;
              </p>

              <div className="flex items-center justify-center gap-3">
                <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center
                  text-white font-semibold text-sm shadow-sm shadow-crimson-500/15">
                  {item.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-navy-900" style={{ fontFamily: "var(--font-heading)" }}>
                    {item.name}
                  </p>
                  <p className="text-xs text-text-secondary">{item.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev}
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center
                text-text-secondary hover:text-crimson-500 hover:border-crimson-200 transition-all shadow-sm"
              aria-label="Previous">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5 flex-wrap justify-center max-w-[200px]">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all
                    ${i === current ? "bg-crimson-500 w-6" : "bg-slate-200 w-2 hover:bg-slate-300"}`}
                  aria-label={`Go to ${i + 1}`} />
              ))}
            </div>
            <button onClick={next}
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center
                text-text-secondary hover:text-crimson-500 hover:border-crimson-200 transition-all shadow-sm"
              aria-label="Next">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
