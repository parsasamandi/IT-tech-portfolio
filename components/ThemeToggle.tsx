"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  collapsed?: boolean;
}

export default function ThemeToggle({ collapsed }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder to avoid layout shift
    return (
      <div
        className={`h-10 rounded-xl bg-white/5 animate-pulse ${collapsed ? "w-10 mx-auto" : "w-full"}`}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200
        ${isDark
          ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/8 border border-yellow-400/20"
          : "text-navy-700 hover:text-navy-900 hover:bg-navy-100 border border-navy-200"
        }
        ${collapsed ? "justify-center" : ""}
      `}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 flex-shrink-0" />
      ) : (
        <Moon className="w-5 h-5 flex-shrink-0" />
      )}
      {!collapsed && (
        <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
      )}
    </button>
  );
}
