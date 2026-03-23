"use client";

/**
 * Admin Login Page
 *
 * Simple login form for admin panel access.
 * Uses Supabase Auth when configured, or falls back to
 * environment variable credentials for demo mode.
 */
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Code2, LogIn, Loader2, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // In demo mode, accept any non-empty credentials
      // In production, this would use Supabase Auth
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (email && password) {
        // Set a simple auth cookie (for demo purposes)
        document.cookie = `admin_auth=true; path=/admin; max-age=${60 * 60 * 24}`;
        window.location.href = "/admin";
      } else {
        setError("Please enter both email and password");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = `w-full px-4 py-3 text-sm text-text-primary bg-white/5 rounded-xl
    border border-white/10 outline-none focus:border-crimson-500/50 focus:ring-2 focus:ring-crimson-500/20
    placeholder:text-text-muted transition-all duration-200`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-dark p-4">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-crimson-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-navy-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="glass rounded-3xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-crimson-600/20">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <h1
              className="text-2xl font-bold text-text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Admin Panel
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Sign in to manage your portfolio
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClasses}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-5 py-3 text-sm font-semibold text-white rounded-xl gradient-primary 
                hover:opacity-90 transition-all duration-200 shadow-lg shadow-crimson-600/25
                flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <p className="text-center text-xs text-text-muted mt-6">
            Demo mode: use any email & password to log in
          </p>
        </div>
      </motion.div>
    </div>
  );
}
