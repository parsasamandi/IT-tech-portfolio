"use client";

/**
 * Admin Layout
 *
 * Wraps all /admin pages with the sidebar navigation and header.
 * Includes auth check redirect and responsive sidebar.
 */
import { useState, type ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // If we are already on login page, skip the redirect check
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      if (!supabase) {
        router.push("/admin/login");
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/admin/login");
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, isLoginPage, router]);

  // Don't render layout if checking session
  if (isLoading && !isLoginPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-dark text-text-muted">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-crimson-500 mx-auto" />
          <p>Verifying session...</p>
        </div>
      </div>
    );
  }

  // If we are on login page, render children raw (no sidebar)
  if (isLoginPage) {
    return <>{children}</>;
  }

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
