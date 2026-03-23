"use client";

/**
 * Admin Layout
 *
 * Wraps all /admin pages with the sidebar navigation and header.
 * Includes auth check redirect and responsive sidebar.
 */
import { useState, type ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-surface-dark overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
