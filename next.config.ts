import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: "asset/resource",
    });
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif)$/,
      type: "asset/resource",
    });
    return config;
  },
};

export default nextConfig;
