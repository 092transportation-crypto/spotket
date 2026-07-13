import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the parent directory makes Next infer the wrong
  // workspace root, which breaks .env.local loading.
  turbopack: { root: __dirname },
  async redirects() {
    return [
      // Deals page retired — its traffic goes to the shop.
      {
        source: "/deals",
        destination: "/products",
        permanent: false,
      },
      // Product ids moved from slugs to database uuids; send old slug links
      // to the listing page instead of a 404.
      {
        source: "/products/moshou-5-in-2-usb-hub",
        destination: "/products",
        permanent: false,
      },
      {
        source: "/products/:slug(bluetooth-eye-massager|5-in-2-usb-hub|squishy-butter-stress-toy)",
        destination: "/products",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // AliExpress product images imported via the admin dashboard.
      {
        protocol: "https",
        hostname: "**.alicdn.com",
      },
      // Supabase storage, if product images are ever uploaded there.
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
