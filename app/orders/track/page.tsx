import type { Metadata } from "next";
import TrackOrder from "@/components/TrackOrder";

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Enter your Spotket order reference to see live shipping status and tracking events for your delivery.",
};

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-20">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Track Your Order</h1>
      <p className="mt-3 text-sm text-slate-400">
        Enter the order reference from your confirmation screen or email.
      </p>
      <div className="mt-8">
        <TrackOrder />
      </div>
    </div>
  );
}
