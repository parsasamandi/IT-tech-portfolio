"use client";

import { motion } from "framer-motion";
import { Award, Users, Clock, TrendingUp } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { STATS, TECH_STACK } from "@/lib/constants";

const STAT_ICONS = [Award, Users, Clock, TrendingUp];

export default function About() {
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
              Driving Digital <span className="text-crimson-600">Transformation</span>
            </h3>
            <p className="text-text-secondary leading-relaxed mb-3 text-[15px]">
              With over a decade of experience in technology solutions, we specialize in building high-performance
              applications that scale. Our team combines deep technical expertise with creative problem-solving.
            </p>
            <p className="text-text-secondary leading-relaxed mb-7 text-[15px]">
              From startups to enterprise clients, we&apos;ve helped organizations across industries modernize their
              tech stacks, optimize workflows, and launch products that users love.
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
            {STATS.map((stat, i) => {
              const Icon = STAT_ICONS[i];
              return (
                <motion.div
                  key={stat.label}
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
