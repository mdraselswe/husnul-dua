import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  // Force Next.js file tracing to bundle the Prisma query engine (.so.node)
  // into the serverless functions. Without this Vercel drops the engine and
  // findMany() fails with "Query Engine not found for rhel-openssl-3.0.x".
  outputFileTracingIncludes: {
    "/api/**/*": ["./lib/prisma/**/*"],
  },
};

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

export default pwaConfig(nextConfig);
