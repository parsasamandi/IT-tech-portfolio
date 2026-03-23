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
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

// ============================================
// Services / Skills
// ============================================
export const SERVICES: ServiceItem[] = [
  {
    icon: "Globe",
    title: "Web Development",
    description:
      "Building responsive, high-performance web applications with modern frameworks like React, Next.js, and TypeScript.",
  },
  {
    icon: "Server",
    title: "Backend & APIs",
    description:
      "Designing scalable server architectures, RESTful APIs, and microservices using Node.js, Python, and cloud-native solutions.",
  },
  {
    icon: "Cloud",
    title: "Cloud & DevOps",
    description:
      "Deploying and managing infrastructure on AWS, Azure, and GCP with CI/CD pipelines, Docker, and Kubernetes.",
  },
  {
    icon: "Smartphone",
    title: "Mobile Development",
    description:
      "Creating cross-platform mobile applications with React Native and Flutter for iOS and Android.",
  },
  {
    icon: "Shield",
    title: "Cybersecurity",
    description:
      "Implementing security best practices, penetration testing, vulnerability assessments, and compliance solutions.",
  },
  {
    icon: "Brain",
    title: "AI & Machine Learning",
    description:
      "Integrating intelligent AI solutions, natural language processing, and predictive analytics into business applications.",
  },
];

// ============================================
// Stats
// ============================================
export const STATS: StatItem[] = [
  { value: 150, suffix: "+", label: "Projects Completed" },
  { value: 80, suffix: "+", label: "Happy Clients" },
  { value: 12, suffix: "+", label: "Years Experience" },
  { value: 99, suffix: "%", label: "Client Satisfaction" },
];

// ============================================
// Project Categories
// ============================================
export const PROJECT_CATEGORIES = [
  "All",
  "Web Apps",
  "Mobile",
  "Cloud",
  "AI/ML",
  "DevOps",
];

// ============================================
// Sample Projects (used when Supabase is not configured)
// ============================================
export const SAMPLE_PROJECTS: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description:
      "Full-stack e-commerce solution with real-time inventory, payment processing, and admin dashboard built with Next.js and Stripe.",
    category: "Web Apps",
    image_url: "/projects/ecommerce.jpg",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    live_url: "#",
    github_url: "#",
    featured: true,
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
  },
  {
    id: "2",
    title: "Health Tracker App",
    description:
      "Cross-platform mobile app for health monitoring with wearable device integration, AI-powered insights, and doctor consultation features.",
    category: "Mobile",
    image_url: "/projects/health.jpg",
    tags: ["React Native", "Firebase", "TensorFlow", "Node.js"],
    live_url: "#",
    github_url: "#",
    featured: true,
    created_at: "2024-02-20",
    updated_at: "2024-02-20",
  },
  {
    id: "3",
    title: "Cloud Infrastructure Manager",
    description:
      "Enterprise cloud orchestration platform with multi-cloud support, cost optimization, and automated scaling policies.",
    category: "Cloud",
    image_url: "/projects/cloud.jpg",
    tags: ["AWS", "Terraform", "Go", "Kubernetes"],
    live_url: "#",
    github_url: "#",
    featured: true,
    created_at: "2024-03-10",
    updated_at: "2024-03-10",
  },
  {
    id: "4",
    title: "AI Content Generator",
    description:
      "SaaS platform leveraging GPT models for automated content creation, SEO optimization, and multi-language translation.",
    category: "AI/ML",
    image_url: "/projects/ai-content.jpg",
    tags: ["Python", "OpenAI", "FastAPI", "React"],
    live_url: "#",
    github_url: "#",
    featured: false,
    created_at: "2024-04-05",
    updated_at: "2024-04-05",
  },
  {
    id: "5",
    title: "CI/CD Pipeline Builder",
    description:
      "Visual pipeline designer for automated deployment workflows with GitHub Actions, Docker, and real-time monitoring.",
    category: "DevOps",
    image_url: "/projects/cicd.jpg",
    tags: ["Docker", "GitHub Actions", "Node.js", "React"],
    live_url: "#",
    github_url: "#",
    featured: false,
    created_at: "2024-05-12",
    updated_at: "2024-05-12",
  },
  {
    id: "6",
    title: "Real-time Analytics Dashboard",
    description:
      "Interactive analytics dashboard with live data streaming, custom chart builders, and automated reporting for enterprise clients.",
    category: "Web Apps",
    image_url: "/projects/analytics.jpg",
    tags: ["React", "D3.js", "WebSocket", "PostgreSQL"],
    live_url: "#",
    github_url: "#",
    featured: false,
    created_at: "2024-06-08",
    updated_at: "2024-06-08",
  },
];

// ============================================
// Testimonials
// ============================================
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "CTO",
    company: "TechVision Inc.",
    content:
      "Exceptional work on our cloud migration project. The team delivered beyond expectations with zero downtime during the transition. Highly recommend!",
    avatar: "/avatars/avatar-1.jpg",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager",
    company: "InnovateLab",
    content:
      "The attention to detail and code quality was outstanding. Our new platform runs 3x faster and handles 10x the traffic effortlessly.",
    avatar: "/avatars/avatar-2.jpg",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Founder",
    company: "StartupFlow",
    content:
      "From concept to launch in just 6 weeks. The iterative development process kept us aligned and the final product exceeded all our requirements.",
    avatar: "/avatars/avatar-3.jpg",
    rating: 5,
  },
];

// ============================================
// Blog Articles
// ============================================
export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: "1",
    title: "Building Scalable APIs with Next.js Route Handlers",
    excerpt:
      "Learn how to design and implement production-ready API endpoints using Next.js App Router and best practices for error handling.",
    image_url: "/blog/api-design.jpg",
    tags: ["Next.js", "API", "TypeScript"],
    date: "2024-03-15",
    read_time: "8 min read",
    slug: "scalable-apis-nextjs",
  },
  {
    id: "2",
    title: "The Future of AI in Web Development",
    excerpt:
      "Exploring how artificial intelligence is transforming the way we build, test, and deploy modern web applications.",
    image_url: "/blog/ai-web.jpg",
    tags: ["AI", "Web Dev", "Future Tech"],
    date: "2024-03-01",
    read_time: "6 min read",
    slug: "ai-future-web-dev",
  },
  {
    id: "3",
    title: "Mastering Cloud Architecture Patterns",
    excerpt:
      "A deep dive into microservices, event-driven architecture, and serverless patterns for building resilient cloud-native applications.",
    image_url: "/blog/cloud-arch.jpg",
    tags: ["Cloud", "Architecture", "AWS"],
    date: "2024-02-18",
    read_time: "10 min read",
    slug: "cloud-architecture-patterns",
  },
];

// ============================================
// Social Links
// ============================================
export const SOCIAL_LINKS = {
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  email: "contact@itportfolio.dev",
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
  "AWS",
  "Docker",
  "Kubernetes",
  "TensorFlow",
  "GraphQL",
  "Redis",
];
