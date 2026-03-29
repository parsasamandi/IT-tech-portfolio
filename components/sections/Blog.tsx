"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Clock, ArrowRight, Loader2, Layers } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { supabase } from "@/lib/supabase";
import type { BlogArticle } from "@/lib/types";
import { useShouldReduceMotion } from "@/lib/hooks";

export default function Blog() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const reduce = useShouldReduceMotion();

  useEffect(() => {
    async function fetchArticles() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from("blog_articles")
          .select("*")
          .order("date", { ascending: false });

        if (error) throw error;
        if (data) setArticles(data as BlogArticle[]);
      } catch (err: any) {
        console.error("Error fetching articles:", err?.message || JSON.stringify(err));
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticles();
  }, []);

  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <SectionHeading title="Latest Articles" highlight="Articles" subtitle="Our Blog" />

        {/* Loader, Empty, or Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-navy-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-crimson-600" />
            <p className="text-sm font-bold uppercase tracking-widest">Fetching Articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-navy-50 rounded-3xl border border-navy-100 border-dashed">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-navy-200" />
            <p className="text-navy-500 font-bold uppercase tracking-widest">No articles found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: reduce ? 0 : i * 0.08, duration: reduce ? 0 : 0.4 }}
                className="group card overflow-hidden glass-card transition-all duration-300 card-shadow-hover hover:border-crimson-200 flex flex-col h-full bg-white"
              >
                <div className="relative h-44 overflow-hidden bg-gradient-to-br from-navy-50 via-slate-50 to-crimson-50 shrink-0">
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-700">
                      <BookOpen className="w-10 h-10 text-navy-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-crimson-500/0 group-hover:bg-crimson-500/10 transition-colors duration-300" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3 mt-1">
                      {post.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-[10px] font-semibold text-crimson-600 rounded-md bg-crimson-50 uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-navy-900 mb-3 line-clamp-2
                    group-hover:text-crimson-600 transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                    {post.title}
                  </h3>
                  <p className="text-sm text-navy-600 leading-relaxed mb-6 line-clamp-3 text-justify h-[54px] overflow-hidden">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-navy-100">
                    <div className="flex items-center gap-3 text-[11px] font-semibold text-navy-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />{post.read_time}
                      </span>
                    </div>
                    <a href={`/blog/${post.slug || post.id}`} className="text-crimson-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all hover:text-crimson-700">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
