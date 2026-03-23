"use client";

/**
 * Admin Dashboard Page
 *
 * Overview page with:
 * - Stats cards (messages, projects, views, response time)
 * - Recent messages list
 * - Quick actions
 */
import {
  MessageSquare,
  FolderOpen,
  Eye,
  Clock,
  Mail,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import StatsCard from "@/components/admin/StatsCard";

/** Sample recent messages for demo */
const RECENT_MESSAGES = [
  {
    id: "1",
    name: "Alex Martinez",
    email: "alex@example.com",
    subject: "Project Inquiry",
    time: "2 hours ago",
    isRead: false,
  },
  {
    id: "2",
    name: "Sara Williams",
    email: "sara@company.com",
    subject: "Partnership Opportunity",
    time: "5 hours ago",
    isRead: false,
  },
  {
    id: "3",
    name: "David Kim",
    email: "david@startup.io",
    subject: "Technical Consultation",
    time: "1 day ago",
    isRead: true,
  },
  {
    id: "4",
    name: "Emily Chen",
    email: "emily@enterprise.co",
    subject: "Cloud Migration Quote",
    time: "2 days ago",
    isRead: true,
  },
];

export default function AdminDashboard() {
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon={MessageSquare}
          label="Total Messages"
          value={24}
          trend="+12%"
          trendUp
        />
        <StatsCard
          icon={FolderOpen}
          label="Active Projects"
          value={6}
          trend="+2"
          trendUp
        />
        <StatsCard
          icon={Eye}
          label="Page Views"
          value="3.2K"
          trend="+8%"
          trendUp
        />
        <StatsCard
          icon={Clock}
          label="Avg. Response"
          value="2.4h"
          trend="-15%"
          trendUp
        />
      </div>

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

        <div className="space-y-3">
          {RECENT_MESSAGES.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-center justify-between p-4 rounded-xl transition-colors
                ${
                  msg.isRead
                    ? "bg-white/[0.02] hover:bg-white/[0.04]"
                    : "bg-crimson-500/5 hover:bg-crimson-500/10 border-l-2 border-crimson-500"
                }`}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-navy-700 flex items-center justify-center text-text-primary font-semibold text-sm">
                  {msg.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
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
                  {msg.time}
                </span>
                {!msg.isRead && (
                  <span className="w-2 h-2 rounded-full bg-crimson-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

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
            icon: Clock,
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
