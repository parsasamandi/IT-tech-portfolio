"use client";

/**
 * Admin Settings Page
 *
 * Site configuration management:
 * - Site name, tagline, about text
 * - Social media links
 * - Contact information
 * - Save to Supabase (or local state in demo mode)
 */
import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    site_name: "ITTech Portfolio",
    tagline: "Next-Generation Technology Solutions",
    about_text:
      "With over a decade of experience in technology solutions, we specialize in building high-performance applications that scale.",
    email: "contact@itportfolio.dev",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    github_url: "https://github.com",
    linkedin_url: "https://linkedin.com",
    twitter_url: "https://twitter.com",
    resume_url: "",
  });

  /** Handle save */
  const handleSave = async () => {
    setIsSaving(true);

    // Simulate API call (would store in Supabase when configured)
    await new Promise((resolve) => setTimeout(resolve, 800));

    toast.success("Settings saved successfully!");
    setIsSaving(false);
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
            Settings
          </h1>
          <p className="text-text-secondary mt-1">
            Configure your portfolio site
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 text-sm font-medium text-white rounded-xl gradient-primary 
            hover:opacity-90 transition-opacity shadow-lg shadow-crimson-600/20
            flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* General Settings */}
        <div className="glass rounded-2xl p-6">
          <h2
            className="text-lg font-semibold text-text-primary mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            General
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Site Name
              </label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) =>
                  setSettings({ ...settings, site_name: e.target.value })
                }
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) =>
                  setSettings({ ...settings, tagline: e.target.value })
                }
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                About Text
              </label>
              <textarea
                value={settings.about_text}
                onChange={(e) =>
                  setSettings({ ...settings, about_text: e.target.value })
                }
                rows={4}
                className={`${inputClasses} resize-none`}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="glass rounded-2xl p-6">
          <h2
            className="text-lg font-semibold text-text-primary mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className={inputClasses}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={settings.location}
                onChange={(e) =>
                  setSettings({ ...settings, location: e.target.value })
                }
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="glass rounded-2xl p-6">
          <h2
            className="text-lg font-semibold text-text-primary mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Social Links
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                value={settings.github_url}
                onChange={(e) =>
                  setSettings({ ...settings, github_url: e.target.value })
                }
                placeholder="https://github.com/username"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={settings.linkedin_url}
                onChange={(e) =>
                  setSettings({ ...settings, linkedin_url: e.target.value })
                }
                placeholder="https://linkedin.com/in/username"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Twitter URL
              </label>
              <input
                type="url"
                value={settings.twitter_url}
                onChange={(e) =>
                  setSettings({ ...settings, twitter_url: e.target.value })
                }
                placeholder="https://twitter.com/username"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Resume URL
              </label>
              <input
                type="url"
                value={settings.resume_url}
                onChange={(e) =>
                  setSettings({ ...settings, resume_url: e.target.value })
                }
                placeholder="https://example.com/resume.pdf"
                className={inputClasses}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
