"use client";

/**
 * Admin Settings Page
 *
 * Site configuration management:
 * - Site name, tagline, about text
 * - Social media links
 * - Contact information
 * - Save to Supabase
 */
import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

export default function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settingsId, setSettingsId] = useState<string | null>(null);
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

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .single();
        
      if (error && error.code !== "PGRST116") {
        throw error;
      }
      
      if (data) {
        setSettingsId(data.id);
        setSettings({
          site_name: data.site_name || "",
          tagline: data.tagline || "",
          about_text: data.about_text || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          github_url: data.github_url || "",
          linkedin_url: data.linkedin_url || "",
          twitter_url: data.twitter_url || "",
          resume_url: data.resume_url || "",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  /** Handle save */
  const handleSave = async () => {
    setIsSaving(true);

    try {
      if (!supabase) {
        toast.error("Supabase client not configured");
        setIsSaving(false);
        return;
      }

      if (settingsId) {
        const { error } = await supabase
          .from("settings")
          .update({
            ...settings,
            updated_at: new Date().toISOString(),
          })
          .eq("id", settingsId);
          
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("settings")
          .insert({
            ...settings,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();
          
        if (error) throw error;
        if (data) setSettingsId(data.id);
      }

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClasses = `w-full px-4 py-2.5 text-sm text-text-primary bg-white/5 rounded-xl
    border border-white/10 outline-none focus:border-crimson-500/50 
    placeholder:text-text-muted transition-colors`;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-text-muted page-transition">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-crimson-500" />
        <p>Loading settings...</p>
      </div>
    );
  }

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
