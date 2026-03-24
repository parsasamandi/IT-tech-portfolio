"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Layers } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { SAMPLE_PROJECTS as PROJECTS, PROJECT_CATEGORIES } from "@/lib/constants";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? PROJECTS : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading title="Impactful Projects" highlight="Projects" subtitle="Portfolio" />

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {PROJECT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all duration-300 tracking-widest uppercase
                ${activeCategory === cat
                  ? "gradient-primary text-white shadow-lg shadow-crimson-600/30 scale-105"
                  : "bg-navy-50 text-navy-600 hover:bg-navy-100 hover:text-navy-900 hover:shadow-sm"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="group rounded-3xl glass-card border border-navy-100 overflow-hidden card-shadow-hover transition-shadow duration-500"
              >
                {/* Image Area */}
                <div className="relative h-56 bg-navy-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 transform group-hover:scale-110 transition-transform duration-700">
                    <Layers className="w-20 h-20 text-navy-900" />
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4">
                    <a href="#" className="w-12 h-12 rounded-2xl gradient-primary text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-crimson-600/40">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-12 h-12 rounded-2xl bg-white text-navy-900 flex items-center justify-center hover:scale-110 transition-transform">
                      <Github className="w-5 h-5" />
                    </a>
                  </div>

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-[10px] font-black uppercase tracking-tighter bg-crimson-600 text-white rounded-lg">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-xl font-black text-navy-900 mb-3 group-hover:text-crimson-600 transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                    {project.title}
                  </h3>
                  <p className="text-navy-600 text-sm leading-relaxed mb-8 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((t: string) => (
                      <span key={t} className="px-3 py-1 text-[10px] font-bold bg-white text-navy-700 border border-navy-100 rounded-lg uppercase tracking-tighter card-shadow">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
