import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse is a CommonJS module — must be treated as external by the bundler
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
