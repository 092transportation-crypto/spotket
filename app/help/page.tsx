import type { Metadata } from "next";
import HelpCenter from "@/components/HelpCenter";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Search Spotket help articles about orders, shipping, returns, payments, and your account — or contact support 24/7.",
};

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">Help Center</p>
        <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">How can we help?</h1>
      </div>
      <div className="mt-10">
        <HelpCenter />
      </div>
    </div>
  );
}
