import type { NextConfig } from "next";
import path from "path";

const repoRoot = path.join(__dirname, "../..");
const sharedSrc = path.join(repoRoot, "src");

const localSrc = path.join(__dirname, "src");

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@": sharedSrc,
      "@analytics": localSrc,
    },
  },
  webpack: (config) => {
    config.resolve.alias["@"] = sharedSrc;
    config.resolve.alias["@analytics"] = localSrc;
    return config;
  },
  experimental: {
    proxyClientMaxBodySize: "5gb",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "media.licdn.com" },
      { protocol: "https", hostname: "dms.licdn.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" },
      { protocol: "https", hostname: "yt3.googleusercontent.com" },
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "**.twimg.com" },
    ],
  },
};

export default nextConfig;
