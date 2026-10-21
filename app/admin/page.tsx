"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLeadsTable } from "@/components/admin-leads-table";
import { AgentMonitor } from "@/components/admin/agent-monitor";
import { ClientsSection } from "@/components/admin/clients-section";
import { DashboardOverview } from "@/components/admin/dashboard-overview";
import { EmailCampaignsSection } from "@/components/admin/email-campaigns-section";
import { PaymentsTracker } from "@/components/admin/payments-tracker";

const TABS = ["Dashboard", "Leads", "Clients", "Email Campaigns", "Payments", "Agents"] as const;
type Tab = (typeof TABS)[number];

interface Stats {
  mrr: number;
  newLeadsToday: number;
  activeClients: number;
  emailsSentToday: number;
  revenue: Array<{ date: string; amount: number }>;
}

interface ActivityEntry {
  id: string;
  agent_name: string;
  message: string;
  level: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [statsRes, activityRes] = await Promise.all([fetch("/api/admin/stats"), fetch("/api/admin/activity")]);
        if (cancelled) return;
        if (statsRes.status === 401) {
          router.push("/admin/login");
          return;
        }
        const statsData = await statsRes.json();
        const activityData = await activityRes.json();
        if (cancelled) return;
        setStats(statsData);
        setActivity(activityData.activity ?? []);
        setAuthChecked(true);
      } catch {
        // transient — next poll will retry
      }
    }

    load();
    const interval = setInterval(load, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [router]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-navy-950 px-4 py-10">
        <p className="text-sm text-neutral-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Spotket CRM</h1>
          <button
            onClick={logout}
            className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-neutral-300 transition-colors hover:bg-white/5"
          >
            Log Out
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-1 border-b border-white/10">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-t-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === t ? "border-b-2 border-brand text-white" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "Dashboard" && <DashboardOverview stats={stats} activity={activity} />}
          {tab === "Leads" && <AdminLeadsTable />}
          {tab === "Clients" && <ClientsSection />}
          {tab === "Email Campaigns" && <EmailCampaignsSection />}
          {tab === "Payments" && <PaymentsTracker />}
          {tab === "Agents" && <AgentMonitor />}
        </div>
      </div>
    </div>
  );
}
