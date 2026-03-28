/**
 * Application Constants
 *
 * Shared constants, sample data, and configuration used across components.
 * This serves as the single source of truth for all static content.
 */
import type {
  NavLink,
  ServiceItem,
  StatItem,
  Testimonial,
  BlogArticle,
  Project,
} from "./types";

// ============================================
// Navigation
// ============================================
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

// ============================================
// Services / Skills
// ============================================
export const SERVICES: ServiceItem[] = [
  {
    icon: "Briefcase",
    title: "Business Plat",
    description:
      "Strategic business development platform — business model development, market research, revenue strategy, operational optimization, and startup scaling support.",
  },
  {
    icon: "Megaphone",
    title: "Digi Plat",
    description:
      "Complete digital marketing engine — SEO & SEM campaigns, social media advertising, email & automation funnels, brand storytelling, and analytics optimization.",
  },
  {
    icon: "Globe",
    title: "Web Plat",
    description:
      "High-performance web design & development — custom UI/UX, corporate websites, e-commerce, WordPress & headless CMS, speed, security & SEO optimization.",
  },
  {
    icon: "PenTool",
    title: "Cont Plat",
    description:
      "Professional content creation — website & landing page copy, blog articles & SEO content, product descriptions, video scripts, and multilingual content.",
  },
  {
    icon: "Share2",
    title: "Social Plat",
    description:
      "Complete social media management — content planning & scheduling, creative post design, community engagement, paid campaigns, and growth reporting.",
  },
  {
    icon: "MessageSquare",
    title: "Chatbot Plat",
    description:
      "Smart AI chatbot systems — custom chatbot development, website & CRM integration, lead qualification, customer support automation, and multilingual bots.",
  },
  {
    icon: "CalendarCheck",
    title: "Appointment Plat",
    description:
      "Seamless booking & scheduling — online scheduling interface, calendar sync & reminders, payment integration, staff management, and industry-specific modules.",
  },
  {
    icon: "Brain",
    title: "AI Plat",
    description:
      "AI solutions engineered to automate, predict, and optimize — predictive analytics, NLP & computer vision, recommendation engines, and automation workflows.",
  },
  {
    icon: "Users",
    title: "CRM Plat",
    description:
      "Customizable CRM system — lead tracking & segmentation, sales pipeline automation, email & chatbot integration, reporting & analytics, and lifecycle management.",
  },
  {
    icon: "Dumbbell",
    title: "Gym Plat",
    description:
      "Complete fitness & wellness platform — member management, class scheduling, trainer dashboards, billing & subscriptions, and progress tracking.",
  },
  {
    icon: "Gift",
    title: "LMS Plat",
    description:
      "Loyalty management system — points & rewards, tiered membership levels, gamification features, CRM & e-commerce integration, and customer behavior analytics.",
  },
];

// ============================================
// Stats
// ============================================
export const STATS: StatItem[] = [
  { value: 11, suffix: "+", label: "Digital Platforms" },
  { value: 50, suffix: "+", label: "Happy Clients" },
  { value: 100, suffix: "+", label: "Projects Delivered" },
  { value: 99, suffix: "%", label: "Client Satisfaction" },
];

// ============================================
// Project Categories
// ============================================
export const PROJECT_CATEGORIES = [
  "All",
  "Websites",
  "AI & Chatbots",
  "CRM & Dashboards",
  "Booking Systems",
  "Marketing",
];

// ============================================
// Sample Projects (used when Supabase is not configured)
// ============================================
export const SAMPLE_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Corporate Website Redesign",
    description:
      "High-performance corporate website with modern design, SEO optimization, and a headless CMS for seamless content management.",
    category: "Websites",
    image_url: "",
    tags: ["Next.js", "Tailwind CSS", "Headless CMS", "SEO"],
    live_url: "#",
    github_url: "",
    featured: true,
    created_at: "2025-01-15",
    updated_at: "2025-01-15",
  },
  {
    id: "2",
    title: "E-Commerce Store",
    description:
      "Full-featured e-commerce platform with payment integration, inventory management, and analytics dashboard.",
    category: "Websites",
    image_url: "",
    tags: ["React", "Stripe", "Node.js", "PostgreSQL"],
    live_url: "#",
    github_url: "",
    featured: true,
    created_at: "2025-02-10",
    updated_at: "2025-02-10",
  },
  {
    id: "3",
    title: "AI Customer Support Chatbot",
    description:
      "Multilingual AI-powered chatbot with lead qualification, CRM integration, and automated customer support flows.",
    category: "AI & Chatbots",
    image_url: "",
    tags: ["OpenAI", "NLP", "CRM Integration", "Multilingual"],
    live_url: "#",
    github_url: "",
    featured: true,
    created_at: "2025-03-05",
    updated_at: "2025-03-05",
  },
  {
    id: "4",
    title: "CRM Dashboard Platform",
    description:
      "Custom CRM with lead tracking, sales pipeline automation, reporting, and real-time analytics for enterprise clients.",
    category: "CRM & Dashboards",
    image_url: "",
    tags: ["React", "TypeScript", "PostgreSQL", "Analytics"],
    live_url: "#",
    github_url: "",
    featured: true,
    created_at: "2025-04-12",
    updated_at: "2025-04-12",
  },
  {
    id: "5",
    title: "Clinic Booking System",
    description:
      "Online appointment scheduling with calendar sync, automated reminders, payment integration, and staff management.",
    category: "Booking Systems",
    image_url: "",
    tags: ["Next.js", "Calendar API", "Stripe", "Automation"],
    live_url: "#",
    github_url: "",
    featured: false,
    created_at: "2025-05-20",
    updated_at: "2025-05-20",
  },
  {
    id: "6",
    title: "Social Media Growth Campaign",
    description:
      "End-to-end digital marketing campaign with SEO, social ads, content strategy, and analytics-driven optimization.",
    category: "Marketing",
    image_url: "",
    tags: ["SEO", "Social Ads", "Analytics", "Content Strategy"],
    live_url: "#",
    github_url: "",
    featured: false,
    created_at: "2025-06-15",
    updated_at: "2025-06-15",
  },
  {
    id: "7",
    title: "Loyalty Management System",
    description:
      "Points & rewards platform with tiered memberships, gamification, CRM integration, and customer behavior analytics.",
    category: "CRM & Dashboards",
    image_url: "",
    tags: ["Loyalty", "Gamification", "CRM", "Analytics"],
    live_url: "#",
    github_url: "",
    featured: false,
    created_at: "2025-07-01",
    updated_at: "2025-07-01",
  },
  {
    id: "8",
    title: "Gym & Fitness Platform",
    description:
      "Digital fitness system with member management, class scheduling, trainer dashboards, and subscription billing.",
    category: "Booking Systems",
    image_url: "",
    tags: ["Member Mgmt", "Scheduling", "Billing", "Dashboards"],
    live_url: "#",
    github_url: "",
    featured: false,
    created_at: "2025-08-10",
    updated_at: "2025-08-10",
  },
];

// ============================================
// Testimonials
// ============================================
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "CEO, Retail Company",
    role: "CEO",
    company: "Retail Company",
    content:
      "SYSPLAT transformed our business with a complete digital ecosystem. From website to CRM to AI automation — everything works seamlessly.",
    avatar: "",
    rating: 5,
  },
  {
    name: "Marketing Director",
    role: "Marketing Director",
    company: "",
    content:
      "Their marketing and content platforms helped us triple our online engagement in 90 days.",
    avatar: "",
    rating: 5,
  },
  {
    name: "Clinic Manager",
    role: "Clinic Manager",
    company: "",
    content:
      "The Appointment Plat and CRM Plat saved us hours of manual work every week.",
    avatar: "",
    rating: 5,
  },
];

// ============================================
// Blog Articles
// ============================================
export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: "1",
    title: "Why Every Business Needs a Digital Platform in 2026",
    excerpt:
      "Discover how modular digital platforms can accelerate growth, automate operations, and elevate your business presence.",
    image_url: "",
    tags: ["Business", "Digital Platforms", "Strategy"],
    date: "2026-01-15",
    read_time: "6 min read",
    slug: "business-digital-platform-2026",
  },
  {
    id: "2",
    title: "AI Chatbots: The Future of Customer Engagement",
    excerpt:
      "How AI-powered chatbots are revolutionizing customer support, lead qualification, and sales automation across industries.",
    image_url: "",
    tags: ["AI", "Chatbots", "Automation"],
    date: "2026-02-10",
    read_time: "7 min read",
    slug: "ai-chatbots-customer-engagement",
  },
  {
    id: "3",
    title: "Building a Loyalty Management System That Works",
    excerpt:
      "A deep dive into points & rewards, gamification, and customer retention strategies that drive lifetime value.",
    image_url: "",
    tags: ["Loyalty", "CRM", "Retention"],
    date: "2026-03-01",
    read_time: "8 min read",
    slug: "loyalty-management-system",
  },
];

// ============================================
// Social Links
// ============================================
export const SOCIAL_LINKS = {
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  email: "contact@sysplat.com",
};

// ============================================
// Tech Stack
// ============================================
export const TECH_STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "AI/ML",
  "WordPress",
  "Headless CMS",
  "SEO",
  "CRM",
  "Automation",
];
