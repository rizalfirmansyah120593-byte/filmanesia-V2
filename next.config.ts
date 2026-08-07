import withPWAInit from "@ducanh2912/next-pwa";
import { NextConfig } from "next/dist/server/config";
import path from "node:path";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  reloadOnOnline: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    qualities: [50, 75],
  },
  // https://github.com/payloadcms/payload/issues/12550#issuecomment-2939070941
  turbopack: {
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
    resolveAlias: {
      "cross-fetch": "./src/api/native-fetch.ts",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "cross-fetch": path.resolve(process.cwd(), "src/api/native-fetch.ts"),
    };
    return config;
  },
  experimental: {
    optimizePackageImports: ["@heroui/react"],
    prefetchInlining: true,
  },
};

const pwa = withPWA(nextConfig);

export default pwa;
