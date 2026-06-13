import type { NextConfig } from "next";

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
  ],
  experimental: {
    proxyClientMaxBodySize: "5gb",
  },
  ...(cloudflareNativeStubAliases
    ? {
        turbopack: {
          resolveAlias: cloudflareNativeStubAliases,
        },
        webpack: (config) => {
          config.resolve ??= {};
          config.resolve.alias = {
            ...config.resolve.alias,
            ...cloudflareNativeStubAliases,
          };
          return config;
        },
      }
    : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "dms.licdn.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
      },
      {
        protocol: "https",
        hostname: "yt3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "**.twimg.com",
      },
  const nextConfig = {
  serverExternalPackages: ["onnxruntime-node"],  // <-- add this line
  images: {
    remotePatterns: [
      // ... your existing patterns
    ],
  },
  // ... rest of your existing config
};


    ],
  },
};

export default nextConfig;

if (process.env.NODE_ENV !== "production") {
  void import("@opennextjs/cloudflare").then((m) =>
    m.initOpenNextCloudflareForDev()
  );
}
