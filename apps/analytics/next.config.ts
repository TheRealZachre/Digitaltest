import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "path";
import { fileURLToPath } from "url";
import { loadDevVars } from "../../scripts/load-dev-vars.mjs";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(configDir, "../..");
const sharedSrc = path.join(repoRoot, "src");
const localSrc = path.join(configDir, "src");
const stubRoot = path.join(sharedSrc, "lib/youtube/stubs");

loadDevVars(repoRoot);
loadEnvConfig(repoRoot);

function isCloudflareBuild(): boolean {
  if (
    process.env.OPENNEXT_CLOUDFLARE === "1" ||
    process.env.CF_PAGES === "1" ||
    process.env.WORKERS_CI === "1"
  ) {
    return true;
  }

  if (
    process.env.CI &&
    process.env.CI !== "false" &&
    process.env.CI !== "0" &&
    !process.env.VERCEL &&
    !process.env.NETLIFY
  ) {
    return true;
  }

  return false;
}

const isCloudflareBuildEnv = isCloudflareBuild();

const cloudflareNativeStubAliases = isCloudflareBuildEnv
  ? {
      "@xenova/transformers": path.join(stubRoot, "transformers-stub.ts"),
      "ffmpeg-static": path.join(stubRoot, "ffmpeg-static-stub.ts"),
      "onnxruntime-node": path.join(stubRoot, "empty-stub.ts"),
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

if (process.env.NODE_ENV !== "production") {
  void import("@opennextjs/cloudflare").then((m) =>
    m.initOpenNextCloudflareForDev()
  );
}
