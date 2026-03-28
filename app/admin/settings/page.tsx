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
    site_name: "SYSPLAT",
    tagline: "Next-Generation Technology Solutions",
    about_text:
      "With over a decade of experience in technology solutions, we specialize in building high-performance applications that scale.",
    about_title: "Driving Digital Transformation",
    about_paragraph1: "With over a decade of experience in technology solutions, we specialize in building high-performance applications that scale. Our team combines deep technical expertise with creative problem-solving.",
    about_paragraph2: "From startups to enterprise clients, we've helped organizations across industries modernize their tech stacks, optimize workflows, and launch products that users love.",
    about_stats: [
      { value: 150, suffix: "+", label: "Projects Completed" },
      { value: 80, suffix: "+", label: "Happy Clients" },
      { value: 12, suffix: "+", label: "Years Experience" },
      { value: 99, suffix: "%", label: "Client Satisfaction" },
    ],
    email: "contact@itportfolio.dev",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    github_url: "https://github.com",
    linkedin_url: "https://linkedin.com",
    twitter_url: "https://twitter.com",
    resume_url: "",
    working_hours: [
      { day: "Mon - Fri", time: "9:00 AM - 6:00 PM" },
      { day: "Saturday", time: "10:00 AM - 4:00 PM" },
      { day: "Sunday", time: "Closed" },
    ],
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
          about_title: data.about_title || "Driving Digital Transformation",
          about_paragraph1: data.about_paragraph1 || "With over a decade of experience in technology solutions, we specialize in building high-performance applications that scale. Our team combines deep technical expertise with creative problem-solving.",
          about_paragraph2: data.about_paragraph2 || "From startups to enterprise clients, we've helped organizations across industries modernize their tech stacks, optimize workflows, and launch products that users love.",
          about_stats: data.about_stats || [
            { value: 150, suffix: "+", label: "Projects Completed" },
            { value: 80, suffix: "+", label: "Happy Clients" },
            { value: 12, suffix: "+", label: "Years Experience" },
            { value: 99, suffix: "%", label: "Client Satisfaction" },
          ],
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          github_url: data.github_url || "",
          linkedin_url: data.linkedin_url || "",
          twitter_url: data.twitter_url || "",
          resume_url: data.resume_url || "",
          working_hours: data.working_hours || [
            { day: "Mon - Fri", time: "9:00 AM - 6:00 PM" },
            { day: "Saturday", time: "10:00 AM - 4:00 PM" },
            { day: "Sunday", time: "Closed" },
          ],
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
    } catch (error: any) {
      console.error("Error saving settings:", JSON.stringify(error, null, 2), error);
      toast.error(error?.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClasses = `w-full px-4 py-2.5 text-sm text-text-primary bg-overlay-hover rounded-xl
    border border-border-subtle outline-none 
    focus:border-crimson-500/50 focus:ring-2 focus:ring-crimson-500/15
    placeholder:text-text-muted transition-all`;

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

        {/* About Section Settings */}
        <div className="glass rounded-2xl p-6">
          <h2
            className="text-lg font-semibold text-text-primary mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            About Us Section
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={settings.about_title}
                onChange={(e) =>
                  setSettings({ ...settings, about_title: e.target.value })
                }
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Paragraph 1
              </label>
              <textarea
                value={settings.about_paragraph1}
                onChange={(e) =>
                  setSettings({ ...settings, about_paragraph1: e.target.value })
                }
                rows={3}
                className={`${inputClasses} resize-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Paragraph 2
              </label>
              <textarea
                value={settings.about_paragraph2}
                onChange={(e) =>
                  setSettings({ ...settings, about_paragraph2: e.target.value })
                }
                rows={3}
                className={`${inputClasses} resize-none`}
              />
            </div>

            <div className="pt-4">
              <label className="block text-sm font-medium text-text-secondary mb-3">
                Stats
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {settings.about_stats.map((stat, i) => (
                  <div key={i} className="p-4 bg-overlay-hover border border-border-subtle rounded-xl space-y-3">
                    <div>
                      <label className="block text-xs text-text-muted mb-1">Value</label>
                      <input
                        type="number"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...settings.about_stats];
                          newStats[i].value = Number(e.target.value);
                          setSettings({ ...settings, about_stats: newStats });
                        }}
                        className={inputClasses + " py-2 text-sm"}
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs text-text-muted mb-1">Suffix (e.g. +, %)</label>
                        <input
                          type="text"
                          value={stat.suffix}
                          onChange={(e) => {
                            const newStats = [...settings.about_stats];
                            newStats[i].suffix = e.target.value;
                            setSettings({ ...settings, about_stats: newStats });
                          }}
                          className={inputClasses + " py-2 text-sm"}
                        />
                      </div>
                      <div className="flex-[2]">
                        <label className="block text-xs text-text-muted mb-1">Label</label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...settings.about_stats];
                            newStats[i].label = e.target.value;
                            setSettings({ ...settings, about_stats: newStats });
                          }}
                          className={inputClasses + " py-2 text-sm"}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

        {/* Working Hours Settings */}
        <div className="glass rounded-2xl p-6">
          <h2
            className="text-lg font-semibold text-text-primary mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Working Hours
          </h2>

          <div className="space-y-4">
            {settings.working_hours.map((item, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Day Range
                  </label>
                  <input
                    type="text"
                    value={item.day}
                    onChange={(e) => {
                      const newHours = [...settings.working_hours];
                      newHours[i].day = e.target.value;
                      setSettings({ ...settings, working_hours: newHours });
                    }}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Time Range
                  </label>
                  <input
                    type="text"
                    value={item.time}
                    onChange={(e) => {
                      const newHours = [...settings.working_hours];
                      newHours[i].time = e.target.value;
                      setSettings({ ...settings, working_hours: newHours });
                    }}
                    className={inputClasses}
                  />
                </div>
              </div>
            ))}
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
