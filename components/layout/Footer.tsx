"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, Github, Linkedin, Twitter, Mail, Heart, ArrowUp } from "lucide-react";
import { NAV_LINKS, SERVICES, SOCIAL_LINKS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

export default function Footer() {
  const [settingsData, setSettingsData] = useState({
    email: SOCIAL_LINKS.email,
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    github_url: SOCIAL_LINKS.github,
    linkedin_url: SOCIAL_LINKS.linkedin,
    twitter_url: SOCIAL_LINKS.twitter,
  });

  useEffect(() => {
    async function fetchSettings() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("email, phone, location, github_url, linkedin_url, twitter_url")
          .limit(1)
          .single();

        if (error && error.code !== "PGRST116") throw error;

        if (data) {
          setSettingsData({
            email: data.email || SOCIAL_LINKS.email,
            phone: data.phone || "+1 (555) 123-4567",
            location: data.location || "San Francisco, CA",
            github_url: data.github_url || SOCIAL_LINKS.github,
            linkedin_url: data.linkedin_url || SOCIAL_LINKS.linkedin,
            twitter_url: data.twitter_url || SOCIAL_LINKS.twitter,
          });
        }
      } catch (err) {
        console.error("Error fetching footer settings:", err);
      }
    }
    fetchSettings();
  }, []);

  const SOCIAL_ITEMS = [
    { icon: Github, label: "GitHub", href: settingsData.github_url },
    { icon: Linkedin, label: "LinkedIn", href: settingsData.linkedin_url },
    { icon: Twitter, label: "Twitter", href: settingsData.twitter_url },
    { icon: Mail, label: "Email", href: `mailto:${settingsData.email}` },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                IT<span className="text-crimson-400">Tech</span>
              </span>
            </div>
            <p className="text-navy-300 text-sm leading-relaxed mb-5">
              Delivering cutting-edge technology solutions with a focus on innovation, quality, and client success.
            </p>
            <div className="flex gap-2">
              {SOCIAL_ITEMS.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label}
                  className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center
                    text-navy-400 hover:text-crimson-400 hover:bg-navy-700 transition-all">
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-white/90" style={{ fontFamily: "var(--font-heading)" }}>Quick Links</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-navy-300 hover:text-crimson-400 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-crimson-500" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-white/90" style={{ fontFamily: "var(--font-heading)" }}>Services</h3>
            <ul className="space-y-2">
              {SERVICES.map((s) => (
                <li key={s.title}>
                  <span className="text-sm text-navy-300 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-navy-500" />
                    {s.title}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-white/90" style={{ fontFamily: "var(--font-heading)" }}>Contact</h3>
            <ul className="space-y-3 text-sm text-navy-300">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-crimson-400 mt-0.5 flex-shrink-0" />
                <a href={`mailto:${settingsData.email}`} className="hover:text-crimson-400 transition-colors truncate max-w-full block">{settingsData.email}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-crimson-400 mt-0.5 flex-shrink-0 text-xs">📞</span>
                <span>{settingsData.phone}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-crimson-400 mt-0.5 flex-shrink-0 text-xs">📍</span>
                <span>{settingsData.location}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="border-t border-navy-700 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-navy-400 flex items-center gap-1">
              © {new Date().getFullYear()} ITTech Portfolio. All rights reserved.
            </p>
            <button onClick={scrollToTop}
              className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center
                hover:opacity-90 transition-opacity shadow-sm" aria-label="Back to top">
              <ArrowUp className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
