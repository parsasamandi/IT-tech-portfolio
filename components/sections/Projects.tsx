"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Layers, Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { PROJECT_CATEGORIES, SAMPLE_PROJECTS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/lib/types";
import { useShouldReduceMotion } from "@/lib/hooks";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [isLoading, setIsLoading] = useState(true);
  const reduce = useShouldReduceMotion();

  useEffect(() => {
    async function fetchProjects() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) setProjects(data as Project[]);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading title="Our Work" highlight="Work" subtitle="Portfolio" />

        {/* Description */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-12">
            <p className="text-navy-600 text-lg leading-relaxed mb-2">
              SYSPLAT delivers high-performance digital platforms across industries
            </p>
            <div className="h-1 w-16 bg-gradient-to-r from-crimson-500 to-crimson-400 mx-auto rounded-full opacity-60" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              "Corporate websites",
              "E-commerce stores",
              "AI chatbots",
              "CRM dashboards",
              "Booking systems",
              "Loyalty platforms",
              "Social media campaigns",
              "Digital branding & content"
            ].map((item, i) => (
              <div
                key={item}
                className="group flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 hover:bg-navy-50/50"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-crimson-500 to-crimson-600 flex items-center justify-center shadow-md group-hover:shadow-crimson-500/40 transition-shadow">
                  <span className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="text-sm font-semibold text-navy-700 text-center group-hover:text-navy-900 transition-colors">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <div className="h-px bg-gradient-to-r from-transparent via-navy-200 to-transparent w-24 mx-auto" />
          </div>
        </div>

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

        {/* Grid / Loader */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-navy-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-crimson-600" />
            <p className="text-sm font-bold uppercase tracking-widest">Fetching Projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-navy-50 rounded-3xl border border-navy-100 border-dashed">
            <Layers className="w-16 h-16 mx-auto mb-4 text-navy-200" />
            <p className="text-navy-500 font-bold uppercase tracking-widest">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
                  className="group rounded-3xl glass-card border border-navy-100 overflow-hidden card-shadow-hover transition-shadow duration-500 flex flex-col h-full bg-white"
                >
                  {/* Image Area */}
                  <div className="relative h-56 bg-navy-100 overflow-hidden shrink-0">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-20 transform group-hover:scale-110 transition-transform duration-700">
                        <Layers className="w-20 h-20 text-navy-900" />
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4">
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl gradient-primary text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-crimson-600/40">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white text-navy-900 flex items-center justify-center hover:scale-110 transition-transform">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                    </div>

                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-[10px] font-black uppercase tracking-tighter bg-crimson-600 text-white rounded-lg shadow-md shadow-crimson-900/20">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-crimson-600 transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                      {project.title}
                    </h3>
                    <p className="text-navy-600 text-sm leading-relaxed mb-6 line-clamp-3 text-justify h-[60px] overflow-hidden">
                      {project.description}
                    </p>

                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((t: string) => (
                          <span key={t} className="px-3 py-1 text-[10px] font-bold bg-navy-50 text-navy-700 border border-navy-100 rounded-lg uppercase tracking-tighter shadow-sm transition-colors group-hover:bg-white">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

