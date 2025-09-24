import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: "standalone",

  images: {
    domains: [
      "images.unsplash.com",
      "unsplash.com",
      "img.youtube.com",
      "via.placeholder.com",
      "api.appiks.id",
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
        hostname: "img.youtube.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.appiks.id",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
