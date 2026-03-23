"use client";

/**
 * Admin Projects Page
 *
 * CRUD management for portfolio projects:
 * - Project list with edit/delete actions
 * - Add/edit form modal
 * - Category and tag management
 */
import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  Github,
  Layers,
} from "lucide-react";
import { SAMPLE_PROJECTS } from "@/lib/constants";
import type { Project } from "@/lib/types";

/** Empty project template for new entries */
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
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_PROJECT);
  const [tagInput, setTagInput] = useState("");

  /** Open form for adding a new project */
  const openAddForm = () => {
    setFormData(EMPTY_PROJECT);
    setEditingId(null);
    setIsFormOpen(true);
  };

  /** Open form for editing an existing project */
  const openEditForm = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      image_url: project.image_url,
      tags: project.tags,
      live_url: project.live_url || "",
      github_url: project.github_url || "",
      featured: project.featured,
    });
    setEditingId(project.id);
    setIsFormOpen(true);
  };

  /** Save (create or update) a project */
  const handleSave = () => {
    if (!formData.title.trim() || !formData.description.trim()) return;

    if (editingId) {
      // Update existing
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, ...formData, updated_at: new Date().toISOString() }
            : p
        )
      );
    } else {
      // Add new
      const newProject: Project = {
        ...formData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProjects((prev) => [newProject, ...prev]);
    }

    setIsFormOpen(false);
    setEditingId(null);
  };

  /** Delete a project */
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  /** Add a tag to the form */
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  /** Remove a tag from the form */
  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const inputClasses = `w-full px-4 py-2.5 text-sm text-text-primary bg-white/5 rounded-xl
    border border-white/10 outline-none focus:border-crimson-500/50 
    placeholder:text-text-muted transition-colors`;

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
        <button
          onClick={openAddForm}
          className="px-5 py-2.5 text-sm font-medium text-white rounded-xl gradient-primary 
            hover:opacity-90 transition-opacity shadow-lg shadow-crimson-600/20
            flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="glass rounded-2xl p-5 card-hover">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-700 to-crimson-900/50 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white/40" />
                </div>
                <div>
                  <h3
                    className="text-base font-semibold text-text-primary"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {project.title}
                  </h3>
                  <span className="text-xs text-crimson-400">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEditForm(project)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center 
                    text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                  aria-label="Edit project"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center 
                    text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  aria-label="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-text-secondary line-clamp-2 mb-3">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs text-text-muted rounded bg-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex gap-2">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-text-muted hover:text-crimson-400 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Live
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-text-muted hover:text-navy-400 transition-colors"
                >
                  <Github className="w-3 h-3" />
                  Source
                </a>
              )}
            </div>

            {project.featured && (
              <span className="inline-block mt-3 px-2 py-0.5 text-xs font-medium text-yellow-400 bg-yellow-400/10 rounded">
                ⭐ Featured
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
          />
          <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto glass-strong rounded-2xl p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-semibold text-text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {editingId ? "Edit Project" : "Add Project"}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center 
                  text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Project title"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Project description"
                  rows={3}
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className={inputClasses}
                  >
                    {["Web Apps", "Mobile", "Cloud", "AI/ML", "DevOps"].map(
                      (cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    placeholder="https://..."
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Live URL
                  </label>
                  <input
                    type="text"
                    value={formData.live_url}
                    onChange={(e) =>
                      setFormData({ ...formData, live_url: e.target.value })
                    }
                    placeholder="https://..."
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={formData.github_url}
                    onChange={(e) =>
                      setFormData({ ...formData, github_url: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add a tag"
                    className={`flex-1 ${inputClasses}`}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 text-sm text-white rounded-xl gradient-primary hover:opacity-90"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary 
                        bg-white/5 rounded-lg"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-text-muted hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Featured Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-4 h-4 rounded accent-crimson-500"
                />
                <span className="text-sm text-text-secondary">
                  Featured project
                </span>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
              <button
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-text-secondary rounded-xl 
                  hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 text-sm font-medium text-white rounded-xl gradient-primary 
                  hover:opacity-90 transition-opacity shadow-lg shadow-crimson-600/20"
              >
                {editingId ? "Update" : "Create"} Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
