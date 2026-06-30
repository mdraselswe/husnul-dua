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

// next-pwa's bundled types omit `fallbacks` and function urlPatterns, both of
// which are valid at runtime — cast to bypass the incomplete type.
const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // Show an offline page when a navigation fails with no cache.
  fallbacks: { document: "/offline" },
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "next-static" },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "images",
        expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      // Public dua reads — serve fresh, fall back to cache when offline.
      urlPattern: /\/api\/duas(?:\/(?:tags|categories))?(?:\?.*)?$/i,
      handler: "NetworkFirst",
      method: "GET",
      options: {
        cacheName: "duas-api",
        networkTimeoutSeconds: 5,
        expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      // App shell / pages.
      urlPattern: ({ request }: { request: Request }) =>
        request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        networkTimeoutSeconds: 5,
        expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 },
      },
    },
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

export default pwaConfig(nextConfig);
