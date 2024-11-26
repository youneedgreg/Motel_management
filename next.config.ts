import type { NextConfig } from "next";

// next.config.ts
const nextConfig = {
  images: {
    domains: ['sevendaysinn.co.ke'], // Add your domain here
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Completely ignore build errors
    ignoreBuildErrors: true
  },
};

export default nextConfig;
