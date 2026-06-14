import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "path";
import { fileURLToPath } from "url";
import { loadDevVars } from "../../scripts/load-dev-vars.mjs";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(configDir, "../..");
const sharedSrc = path.join(repoRoot, "src");
const localSrc = path.join(configDir, "src");

loadDevVars(repoRoot);
// Share root .env.local with the analytics app (AUTH_SECRET, API keys, etc.)
loadEnvConfig(repoRoot);

const isCloudflareBuild =
  process.env.CF_PAGES === "1" ||
  process.env.OPENNEXT_CLOUDFLARE === "1";

const cloudflareNativeStubAliases = isCloudflareBuild
  ? {
      "@xenova/transformers": "./src/lib/youtube/stubs/transformers-stub.ts",
      "ffmpeg-static": "./src/lib/youtube/stubs/ffmpeg-static-stub.ts",
      "onnxruntime-node": "./src/lib/youtube/stubs/empty-stub.ts",
    }
  : undefined;

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "ffmpeg-static",
    "@xenova/transformers",
    "onnxruntime-node",
    "pptxgenjs",
  ],
  turbopack: {
    resolveAlias: {
      "@": sharedSrc,
      "@analytics": localSrc,
      ...(cloudflareNativeStubAliases ?? {}),
    },
  },
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": sharedSrc,
      "@analytics": localSrc,
      ...(cloudflareNativeStubAliases ?? {}),
    };
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
