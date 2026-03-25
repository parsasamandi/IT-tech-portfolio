"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, X, Loader2, BookOpen, Clock, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { BlogArticle } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const EMPTY_ARTICLE: Omit<BlogArticle, "id"> = {
  title: "",
  excerpt: "",
  image_url: "",
  tags: [],
  date: new Date().toISOString().split("T")[0],
  read_time: "5 min read",
  slug: "",
};

export default function AdminBlog() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_ARTICLE);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("blog_articles")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      if (data) setArticles(data as BlogArticle[]);
    } catch (error: any) {
      console.error("Error fetching articles:", error?.message || JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };

  const openAddForm = () => {
    setFormData(EMPTY_ARTICLE);
    setEditingId(null);
    setTagInput("");
    setIsFormOpen(true);
  };

  const openEditForm = (article: BlogArticle) => {
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      image_url: article.image_url || "",
      tags: article.tags || [],
      date: article.date,
      read_time: article.read_time,
      slug: article.slug,
    });
    setEditingId(article.id);
    setTagInput("");
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) return;
    if (!supabase) return;
    setIsSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from("blog_articles")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
        setArticles((prev) =>
          prev.map((a) => (a.id === editingId ? { ...a, ...formData } : a))
        );
      } else {
        const { data, error } = await supabase
          .from("blog_articles")
          .insert(formData)
          .select()
          .single();
        if (error) throw error;
        if (data) setArticles((prev) => [data as BlogArticle, ...prev]);
      }
      setIsFormOpen(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error saving article:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from("blog_articles").delete().eq("id", id);
      if (error) throw error;
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setTagInput("");
      tagInputRef.current?.focus();
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const generateSlug = () => {
    if (!formData.title) return;
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const isFormValid = formData.title.trim() && formData.slug.trim() && formData.excerpt.trim();
  const inputCls = `w-full px-4 py-2.5 text-sm text-text-primary bg-overlay-hover rounded-xl border border-border-subtle outline-none focus:border-crimson-500/50 focus:ring-2 focus:ring-crimson-500/15 placeholder:text-text-muted transition-all`;

  return (
    <div className="page-transition">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary" style={{ fontFamily: "var(--font-heading)" }}>
            Blog Articles
          </h1>
          <p className="text-text-secondary mt-1">Manage your professional blog content</p>
        </div>
        <motion.button onClick={openAddForm} className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl gradient-primary hover:opacity-90 transition-opacity shadow-lg shadow-crimson-600/25 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Article
        </motion.button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-crimson-500" />
          <p className="text-sm">Loading articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center text-text-muted">
          <BookOpen className="w-14 h-14 mx-auto mb-5 opacity-30" />
          <p className="font-medium text-text-secondary">No articles yet</p>
          <p className="text-sm mt-1">Write your first article to share your knowledge.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((article) => (
            <motion.div key={article.id} layout className="glass rounded-2xl p-5 group relative">
              <div className="flex items-start gap-4 mb-3 pr-16 bg-transparent">
                <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-navy-700 to-crimson-900/40 flex items-center justify-center overflow-hidden shrink-0 border border-border-subtle">
                  {article.image_url ? (
                    <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-text-muted" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-text-primary truncate" style={{ fontFamily: "var(--font-heading)" }}>
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-text-muted mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.read_time}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-text-secondary line-clamp-2 mb-4 leading-relaxed bg-transparent">
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                <div className="flex gap-1.5 flex-wrap">
                  {article.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-[10px] uppercase tracking-wider text-text-secondary bg-overlay-hover border border-border-subtle rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditForm(article)} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-overlay-hover transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteConfirmId(article.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
            <motion.div className="relative w-full max-w-sm glass-strong rounded-2xl p-6 shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center mb-4 mx-auto">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-base font-semibold text-text-primary text-center mb-1">Delete Article</h3>
              <p className="text-sm text-text-secondary text-center mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-4 py-2 text-sm text-text-secondary rounded-xl border border-border-subtle hover:bg-overlay-hover transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 px-4 py-2 text-sm font-semibold text-white rounded-xl bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
            <motion.div className="relative w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden glass-strong rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border-subtle">
                <div>
                  <h2 className="text-lg font-bold text-text-primary">{editingId ? "Edit Article" : "New Article"}</h2>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="text-text-muted hover:text-text-primary"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputCls} placeholder="Article title" />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">URL Slug</label>
                    <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className={inputCls} placeholder="my-article-title" />
                  </div>
                  <button type="button" onClick={generateSlug} className="px-4 py-2.5 text-xs font-semibold text-text-secondary bg-overlay-hover border border-border-subtle hover:text-text-primary rounded-xl transition-all">
                    Generate
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Excerpt</label>
                  <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className={`${inputCls} resize-none h-24`} placeholder="Short description..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Image URL</label>
                  <input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className={inputCls} placeholder="https://..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Publish Date</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Read Time</label>
                    <input type="text" value={formData.read_time} onChange={(e) => setFormData({ ...formData, read_time: e.target.value })} className={inputCls} placeholder="e.g. 5 min read" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Tags</label>
                  <div className="flex gap-2">
                    <input ref={tagInputRef} type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} className={`flex-1 ${inputCls}`} placeholder="Tag and hit Enter" />
                    <button type="button" onClick={addTag} className="px-4 py-2 text-sm text-white bg-navy-600 rounded-xl hover:bg-navy-700">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-text-secondary bg-overlay-hover border border-border-subtle rounded-lg">
                        {tag} <button onClick={() => removeTag(tag)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-border-subtle flex justify-end gap-3">
                <button onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 text-sm text-text-secondary border border-border-subtle hover:bg-overlay-hover rounded-xl transition-all">Cancel</button>
                <button onClick={handleSave} disabled={!isFormValid || isSaving} className="px-5 py-2.5 text-sm font-semibold text-white gradient-primary hover:opacity-90 rounded-xl shadow-lg disabled:opacity-50">
                  {isSaving ? "Saving..." : editingId ? "Save Changes" : "Create Article"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
