"use client";

/**
 * Admin Testimonials Page
 *
 * CRUD management for testimonials:
 * - Testimonial list with edit/delete actions
 * - Premium add/edit form modal
 */
import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  MessageSquareQuote,
  Loader2,
  Star,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Testimonial } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const EMPTY_TESTIMONIAL: Testimonial = {
  name: "",
  role: "",
  content: "",
  rating: 5,
  featured: true,
};

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Testimonial>(EMPTY_TESTIMONIAL);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data) setTestimonials(data as Testimonial[]);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddForm = () => {
    setFormData(EMPTY_TESTIMONIAL);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (testimonial: Testimonial) => {
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating || 5,
      featured: testimonial.featured ?? true,
    });
    setEditingId(testimonial.id!);
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.content.trim()) return;
    if (!supabase) return;
    setIsSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from("testimonials")
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq("id", editingId);
        if (error) throw error;
        setTestimonials((prev) =>
          prev.map((t) =>
            t.id === editingId
              ? { ...t, ...formData, updated_at: new Date().toISOString() }
              : t
          )
        );
      } else {
        const { data, error } = await supabase
          .from("testimonials")
          .insert({
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();
        if (error) throw error;
        if (data) setTestimonials((prev) => [data as Testimonial, ...prev]);
      }
      setIsFormOpen(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error saving testimonial:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  const isFormValid = formData.name.trim() && formData.content.trim() && formData.role.trim();

  /* Shared input classes — readable white text on translucent background */
  const inputCls = `w-full px-4 py-2.5 text-sm text-text-primary bg-overlay-hover rounded-xl
    border border-border-subtle outline-none 
    focus:border-crimson-500/50 focus:ring-2 focus:ring-crimson-500/15
    placeholder:text-text-muted transition-all`;

  return (
    <div className="page-transition">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Testimonials
          </h1>
          <p className="text-text-secondary mt-1">
            Manage your client reviews and feedback
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddForm}
          className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl gradient-primary 
            hover:opacity-90 transition-opacity shadow-lg shadow-crimson-600/25
            flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </motion.button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-crimson-500" />
          <p className="text-sm">Loading testimonials...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center text-text-muted">
          <MessageSquareQuote className="w-14 h-14 mx-auto mb-5 opacity-30" />
          <p className="font-medium text-text-secondary">No testimonials yet</p>
          <p className="text-sm mt-1">Add your first testimonial to build trust.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id!}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 group relative flex flex-col h-full"
            >
              {testimonial.featured && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full">
                    <Star className="w-2.5 h-2.5 fill-yellow-400" />
                    Featured
                  </span>
                </div>
              )}

              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < testimonial.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-white/10 fill-white/5"
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-text-secondary line-clamp-4 leading-relaxed italic mb-5 flex-1 pr-4">
                "{testimonial.content}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border-subtle mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-xs shadow-sm shadow-crimson-500/15 shrink-0">
                    {testimonial.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-text-primary truncate">
                      {testimonial.name}
                    </h3>
                    <p className="text-[11px] text-text-muted truncate">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditForm(testimonial)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-overlay-hover transition-all"
                    aria-label="Edit testimonial">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteConfirmId(testimonial.id!)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                    aria-label="Delete testimonial">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ─── Delete Confirm Modal ─────────────────────────────── */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirmId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm"
            >
              <div className="glass-strong rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center mb-4 mx-auto">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-base font-semibold text-text-primary text-center mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                  Delete Testimonial
                </h3>
                <p className="text-sm text-text-secondary text-center mb-6">
                  This action cannot be undone. The testimonial will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-text-secondary rounded-xl border border-border-subtle hover:bg-overlay-hover hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirmId)}
                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Add / Edit Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsFormOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden glass-strong rounded-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-crimson-600/20">
                    {editingId ? <Pencil className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-text-primary leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                      {editingId ? "Edit Testimonial" : "New Testimonial"}
                    </h2>
                    <p className="text-xs text-text-muted mt-0.5">
                      {editingId ? "Update feedback from client" : "Add a new client review"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="w-8 h-8 rounded-xl bg-overlay-hover hover:bg-overlay-hover flex items-center justify-center text-text-muted hover:text-text-primary transition-all"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Client Name <span className="text-crimson-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className={inputCls}
                    autoFocus
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Role / Company <span className="text-crimson-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="CEO at TechFlow"
                    className={inputCls}
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Testimonial <span className="text-crimson-500">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="What did they say?"
                    rows={4}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Rating (1-5)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          formData.rating >= star
                            ? "bg-yellow-400/10 border border-yellow-400/30"
                            : "bg-overlay-hover border border-border-subtle"
                        }`}
                      >
                        <Star className={`w-5 h-5 ${formData.rating >= star ? "text-yellow-400 fill-yellow-400" : "text-text-muted"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer
                      ${formData.featured
                        ? "bg-yellow-400/8 border-yellow-400/25"
                        : "bg-overlay-hover border-border-subtle hover:border-border-subtle"
                      }`}
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all
                      ${formData.featured ? "bg-yellow-400 border-yellow-400" : "border-border-subtle bg-overlay-hover"}`}
                    >
                      {formData.featured && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-text-primary flex items-center gap-1.5">
                        <Star className={`w-3.5 h-3.5 ${formData.featured ? "text-yellow-400 fill-yellow-400" : "text-text-muted"}`} />
                        Show on Website
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">If unchecked, it stays visible only here</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-text-secondary rounded-xl border border-border-subtle hover:bg-overlay-hover hover:text-text-primary transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  disabled={!isFormValid || isSaving}
                  className="min-w-[130px] px-5 py-2.5 text-sm font-semibold text-white rounded-xl gradient-primary 
                    hover:opacity-90 transition-opacity shadow-lg shadow-crimson-600/25
                    flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                  ) : (
                    <>{editingId ? "Save Changes" : "Add Review"}</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
