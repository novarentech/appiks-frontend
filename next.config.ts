import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  images: {
    domains: [
      "images.unsplash.com",
      "unsplash.com",
      "img.youtube.com", // ✅ tambahkan ini
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com", // ✅ tambahkan ini juga
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
