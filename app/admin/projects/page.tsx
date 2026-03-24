"use client";

/**
 * Admin Projects Page
 *
 * CRUD management for portfolio projects:
 * - Project list with edit/delete actions
 * - Premium add/edit form modal
 * - Category and tag management
 */
import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  Github,
  Layers,
  Loader2,
  Star,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["Web Apps", "Mobile", "Cloud", "AI/ML", "DevOps", "Other"];

const CATEGORY_COLORS: Record<string, string> = {
  "Web Apps": "text-blue-400 bg-blue-500/10",
  Mobile: "text-green-400 bg-green-500/10",
  Cloud: "text-cyan-400 bg-cyan-500/10",
  "AI/ML": "text-purple-400 bg-purple-500/10",
  DevOps: "text-orange-400 bg-orange-500/10",
  Other: "text-text-muted bg-overlay-hover",
};

const EMPTY_PROJECT: Omit<Project, "id" | "created_at" | "updated_at"> = {
  title: "",
  description: "",
  category: "Web Apps",
  image_url: "",
  tags: [],
  live_url: "",
  github_url: "",
  featured: false,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_PROJECT);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data) setProjects(data as Project[]);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddForm = () => {
    setFormData(EMPTY_PROJECT);
    setEditingId(null);
    setTagInput("");
    setIsFormOpen(true);
  };

  const openEditForm = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      image_url: project.image_url || "",
      tags: project.tags || [],
      live_url: project.live_url || "",
      github_url: project.github_url || "",
      featured: project.featured || false,
    });
    setEditingId(project.id);
    setTagInput("");
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) return;
    if (!supabase) return;
    setIsSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from("projects")
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq("id", editingId);
        if (error) throw error;
        setProjects((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? { ...p, ...formData, updated_at: new Date().toISOString() }
              : p
          )
        );
      } else {
        const { data, error } = await supabase
          .from("projects")
          .insert({
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();
        if (error) throw error;
        if (data) setProjects((prev) => [data as Project, ...prev]);
      }
      setIsFormOpen(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting project:", error);
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
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const isFormValid = formData.title.trim() && formData.description.trim();

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
            Projects
          </h1>
          <p className="text-text-secondary mt-1">
            Manage your portfolio projects
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
          Add Project
        </motion.button>
      </div>

      {/* Project List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-crimson-500" />
          <p className="text-sm">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center text-text-muted">
          <Layers className="w-14 h-14 mx-auto mb-5 opacity-30" />
          <p className="font-medium text-text-secondary">No projects yet</p>
          <p className="text-sm mt-1">Add your first project to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-5 group relative"
            >
              {project.featured && (
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full">
                    <Star className="w-2.5 h-2.5 fill-yellow-400" />
                    Featured
                  </span>
                </div>
              )}

              <div className="flex items-start gap-3 mb-3 pr-20">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-navy-700 to-crimson-900/40 flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-white/10">
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <Layers className="w-5 h-5 text-white/30" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3
                    className="text-base font-semibold text-text-primary truncate"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {project.title}
                  </h3>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[project.category] || CATEGORY_COLORS["Other"]}`}>
                    {project.category}
                  </span>
                </div>
              </div>

              <p className="text-sm text-text-secondary line-clamp-2 mb-4 leading-relaxed">
                {project.description}
              </p>

              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-[11px] text-text-secondary bg-overlay-hover border border-border-subtle rounded-md">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 5 && (
                    <span className="px-2 py-0.5 text-[11px] text-text-muted">+{project.tags.length - 5}</span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                <div className="flex gap-3">
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-text-muted hover:text-crimson-400 transition-colors">
                      <ExternalLink className="w-3 h-3" /> Live
                    </a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors">
                      <Github className="w-3 h-3" /> Source
                    </a>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditForm(project)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-overlay-hover transition-all"
                    aria-label="Edit project">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteConfirmId(project.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                    aria-label="Delete project">
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
                  Delete Project
                </h3>
                <p className="text-sm text-text-secondary text-center mb-6">
                  This action cannot be undone. The project will be permanently removed.
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
                      {editingId ? "Edit Project" : "New Project"}
                    </h2>
                    <p className="text-xs text-text-muted mt-0.5">
                      {editingId ? "Update your project details" : "Add a new portfolio project"}
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
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Title <span className="text-crimson-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Project title"
                    className={inputCls}
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Description <span className="text-crimson-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What does this project do?"
                    rows={3}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Category + Image URL */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={inputCls}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-surface-card text-text-primary">{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Image URL</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://..."
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Links */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Live URL</label>
                    <input
                      type="url"
                      value={formData.live_url}
                      onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                      placeholder="https://..."
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">GitHub URL</label>
                    <input
                      type="url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      placeholder="https://github.com/..."
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      ref={tagInputRef}
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                      placeholder="Add a tag and press Enter"
                      className={`flex-1 ${inputCls}`}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      disabled={!tagInput.trim()}
                      className="px-4 py-2.5 text-sm font-medium text-white rounded-xl gradient-primary hover:opacity-90 transition-opacity disabled:opacity-40"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      <AnimatePresence>
                        {formData.tags.map((tag) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 text-xs font-medium
                              text-text-secondary bg-overlay-hover border border-border-subtle rounded-lg group/tag"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="w-4 h-4 rounded flex items-center justify-center text-text-muted hover:text-red-400 transition-colors"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Featured Toggle */}
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
                      Featured Project
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">Show prominently on portfolio</p>
                  </div>
                </button>
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
                    <>{editingId ? "Save Changes" : "Create Project"}</>
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
