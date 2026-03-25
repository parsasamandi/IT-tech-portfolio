/**
 * TypeScript Interfaces
 *
 * Shared type definitions used throughout the application.
 */

/** Project / Portfolio Item */
export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  tags: string[];
  live_url?: string;
  github_url?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

/** Contact Form Message */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

/** Site Settings */
export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string;
  about_text: string;
  about_title?: string;
  about_paragraph1?: string;
  about_paragraph2?: string;
  about_stats?: StatItem[];
  email: string;
  phone?: string;
  location?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  resume_url?: string;
}

/** Chat Message */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/** Chat Log (stored in database) */
export interface ChatLog {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

/** Service / Skill Item */
export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

/** Testimonial */
export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

/** Blog Article */
export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  tags: string[];
  date: string;
  read_time: string;
  slug: string;
}

/** Nav Link */
export interface NavLink {
  label: string;
  href: string;
}

/** Stats Item */
export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}
