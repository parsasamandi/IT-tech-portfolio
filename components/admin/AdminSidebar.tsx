"use client";

/**
 * AdminSidebar Component
 *
 * Sidebar navigation for the admin panel with:
 * - Logo and brand
 * - Navigation links with active state
 * - Collapsible on mobile
 * - Logout action
 */
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Code2,
  ChevronLeft,
  BookOpen,
  Star,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import ThemeToggle from "@/components/ThemeToggle";

/** Admin navigation items */
const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  // { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({
  collapsed,
  onToggle,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-border-subtle">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span
              className="text-lg font-bold text-text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              SYS<span className="text-crimson-500">PLAT</span>
            </span>
          )}
        </Link>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={onToggle}
          className="hidden lg:flex w-8 h-8 rounded-lg items-center justify-center
            text-text-muted hover:text-text-primary hover:bg-overlay-hover transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {ADMIN_NAV.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? "gradient-primary text-white shadow-lg shadow-crimson-600/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-overlay-hover"
                }
                ${collapsed ? "justify-center" : ""}
              `}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="px-3 py-4 border-t border-border-subtle space-y-1">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            text-text-secondary hover:text-text-primary hover:bg-overlay-hover transition-colors
            ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Back to Site" : undefined}
        >
          <ChevronLeft className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Back to Site</span>}
        </Link>

        <ThemeToggle collapsed={collapsed} />

        <button
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors
            ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Logout" : undefined}
          onClick={async () => {
            if (supabase) {
              await supabase.auth.signOut();
              window.location.href = "/admin/login";
            }
          }}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl glass 
          flex items-center justify-center text-text-primary"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          lg:hidden fixed top-0 left-0 z-50 h-screen w-64 bg-surface-card
          border-r border-border-subtle flex flex-col
          transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center
            text-text-muted hover:text-text-primary"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
        <NavContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col h-screen bg-surface-card border-r border-border-subtle
          transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        <NavContent />
      </aside>
    </>
  );
}
