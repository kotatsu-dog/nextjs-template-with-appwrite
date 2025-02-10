import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  experimental: {
    serverActions: {
      allowedOrigins: ["psychic-invention-g4rv5prvqw74fvvxj-3000.app.github.dev", "localhost:3000"]
    }
  }
};

export default nextConfig;
