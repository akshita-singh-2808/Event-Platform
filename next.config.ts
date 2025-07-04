import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
    domains: ['utfs.io'], // 👈 allow external image domain
  },
};

export default nextConfig;
