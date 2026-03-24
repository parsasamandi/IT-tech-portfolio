import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

/**
 * Font configurations
 * - Inter: Body text — clean, highly readable
 * - Outfit: Headings — modern, geometric feel
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Global SEO metadata
 */
export const metadata: Metadata = {
  title: {
    default: "IT Tech Portfolio | Modern Developer Portfolio",
    template: "%s | IT Tech Portfolio",
  },
  description:
    "Professional IT solutions and technology services portfolio. Full-stack development, cloud architecture, and modern web applications.",
  keywords: [
    "portfolio",
    "developer",
    "IT solutions",
    "technology",
    "full-stack",
    "web development",
  ],
  authors: [{ name: "IT Tech Portfolio" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "IT Tech Portfolio",
  },
};

/**
 * Root Layout
 * Wraps the entire application with fonts, theme, and global providers.
 * defaultTheme="dark" keeps the admin panel dark by default.
 * The toggle in the sidebar lets users switch to light.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body
        className="min-h-screen antialiased transition-colors duration-300"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange={false}>
          {children}

          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#ffffff",
                color: "#1e3a5f",
                border: "1px solid #ebf3ff",
                boxShadow: "0 4px 12px rgba(30, 58, 95, 0.08)",
              },
              success: {
                iconTheme: { primary: "#dc2626", secondary: "#ffffff" },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
