import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Drop the X-Powered-By: Next.js response header.
  poweredByHeader: false,
  // A stray lockfile in the parent directory makes Next infer the wrong
  // workspace root, which breaks .env.local loading.
  turbopack: { root: __dirname },
};

export default nextConfig;
