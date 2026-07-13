import type { Metadata } from "next";
import AccountView from "@/components/AccountView";

export const metadata: Metadata = {
  title: "Your Account",
  description: "Sign in to view your Spotket orders, addresses, and profile.",
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-14">
      <AccountView />
    </div>
  );
}
