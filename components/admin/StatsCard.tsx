"use client";

/**
 * StatsCard Component
 *
 * Reusable stats card for the admin dashboard.
 * Displays a metric with icon, value, label, and optional trend.
 */
import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
}

export default function StatsCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
}: StatsCardProps) {
  return (
    <div className="glass rounded-2xl p-5 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-crimson-600/20">
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-lg ${
              trendUp
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      <p
        className="text-2xl font-bold text-text-primary"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {value}
      </p>
      <p className="text-sm text-text-muted mt-1">{label}</p>
    </div>
  );
}
