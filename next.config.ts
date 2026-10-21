import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Drop the X-Powered-By: Next.js response header.
  poweredByHeader: false,
  // A stray lockfile in the parent directory makes Next infer the wrong
  // workspace root, which breaks .env.local loading.
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  // Permanent redirects for old dropshipping/ecommerce URLs that predate the
  // Spotket Digital rebuild — none of these routes exist in this codebase,
  // but Google may still have them indexed from the old site.
  async redirects() {
    return [
      { source: "/shop", destination: "/", permanent: true },
      { source: "/shop/:path*", destination: "/", permanent: true },
      { source: "/store", destination: "/", permanent: true },
      { source: "/store/:path*", destination: "/", permanent: true },
      { source: "/products", destination: "/", permanent: true },
      { source: "/products/:path*", destination: "/", permanent: true },
      { source: "/product/:path*", destination: "/", permanent: true },
      { source: "/collections", destination: "/", permanent: true },
      { source: "/collections/:path*", destination: "/", permanent: true },
      { source: "/cart", destination: "/", permanent: true },
      { source: "/checkout", destination: "/", permanent: true },
      { source: "/about", destination: "/", permanent: true },
      { source: "/about-us", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
