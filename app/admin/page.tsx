"use client";

/**
 * Admin Dashboard Page
 *
 * Overview page with:
 * - Recent messages list
 * - Quick actions
 */
import { useState, useEffect } from "react";
import {
  MessageSquare,
  FolderOpen,
  Mail,
  ArrowRight,
  Loader2,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      if (!supabase) return;

      // Fetch Recent Messages
      const { data: messages, error: messagesError } = await supabase
        .from("messages")
        .select("id, name, email, subject, created_at")
        .order("created_at", { ascending: false })
        .limit(4);

      if (messagesError) throw messagesError;
      if (messages) setRecentMessages(messages);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const daysDifference = Math.round((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference === 0) {
      const hoursDifference = Math.round((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60));
      if (hoursDifference === 0) {
        return "Just now";
      }
      return rtf.format(hoursDifference, "hour");
    }
    return rtf.format(daysDifference, "day");
  };

  return (
    <div className="page-transition">
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold text-text-primary"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Dashboard
        </h1>
        <p className="text-text-secondary mt-1">
          Welcome back! Here&apos;s an overview of your portfolio.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 text-text-muted">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-crimson-500" />
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Recent Messages */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-lg font-semibold text-text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Recent Messages
              </h2>
              <Link
                href="/admin/messages"
                className="flex items-center gap-1 text-sm text-crimson-400 hover:text-crimson-300 transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentMessages.length === 0 ? (
              <div className="text-center py-8 text-text-muted">
                <p>No recent messages.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-navy-700 flex items-center justify-center text-text-primary font-semibold text-sm">
                        {msg.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {msg.name}
                        </p>
                        <p className="text-xs text-text-muted">{msg.subject}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-muted hidden sm:block">
                        {formatTimeAgo(msg.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {[
          {
            label: "Manage Messages",
            href: "/admin/messages",
            icon: Mail,
            desc: "View and respond to inquiries",
          },
          {
            label: "Manage Projects",
            href: "/admin/projects",
            icon: FolderOpen,
            desc: "Add or edit portfolio items",
          },
          {
            label: "Site Settings",
            href: "/admin/settings",
            icon: Settings,
            desc: "Update site configuration",
          },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="glass rounded-2xl p-5 card-hover group"
          >
            <action.icon className="w-8 h-8 text-crimson-400 mb-3" />
            <h3
              className="text-base font-semibold text-text-primary group-hover:text-crimson-400 transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {action.label}
            </h3>
            <p className="text-sm text-text-muted mt-1">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
