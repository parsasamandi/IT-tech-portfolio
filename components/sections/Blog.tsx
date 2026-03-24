"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { BLOG_ARTICLES } from "@/lib/constants";

export default function Blog() {
  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <SectionHeading title="Latest Articles" highlight="Articles" subtitle="Our Blog" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BLOG_ARTICLES.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group card overflow-hidden"
            >
              <div className="relative h-44 overflow-hidden bg-gradient-to-br from-navy-50 via-slate-50 to-crimson-50">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-navy-200" />
                </div>
                <div className="absolute inset-0 bg-crimson-500/0 group-hover:bg-crimson-500/5 transition-colors duration-300" />
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-[10px] font-semibold text-crimson-600 rounded bg-crimson-50">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-base font-bold text-navy-900 mb-2 line-clamp-2
                  group-hover:text-crimson-600 transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                  {post.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-[11px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />{post.read_time}
                    </span>
                  </div>
                  <span className="text-crimson-600 text-xs font-medium flex items-center gap-1
                    group-hover:gap-2 transition-all">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
