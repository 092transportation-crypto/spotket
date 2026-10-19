import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NEW_SITE_NAME, SITE_NAME, SITE_URL } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} is now ${NEW_SITE_NAME}`,
  description: `${SITE_NAME} has closed. Find us at ${NEW_SITE_NAME}.`,
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} is now ${NEW_SITE_NAME}`,
    description: `${SITE_NAME} has closed. Find us at ${NEW_SITE_NAME}.`,
    url: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} flex min-h-screen flex-col font-sans antialiased`}>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
