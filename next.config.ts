import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: "asset/resource",
    });
    // Removed the custom rule for (png|jpg|jpeg|gif) 
    // Next.js handles images automatically, and overriding it breaks metadata icons
    return config;
  },
};

export default nextConfig;