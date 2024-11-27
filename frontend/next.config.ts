import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Enable external image domains for dynamic images (optional, if you fetch and display images directly)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "resizing.flixster.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.rottentomatoes.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.fandango.com",
        pathname: "/**",
      },
    ],
  },

  // CORS configuration for API routes (proxying external requests)
  async headers() {
    return [
      {
        source: "/api/:path*", // Match all API routes under the `/api/` path
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Adjust this value to be specific to allowed origins in production
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
