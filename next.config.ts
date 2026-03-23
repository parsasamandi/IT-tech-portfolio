import type { NextConfig } from "next";

/**
 * Next.js Configuration
 * - standalone output for Docker/Railway deployment
 * - image optimization with remote patterns
 */
const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
