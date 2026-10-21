"use client";

import { RevenueChart } from "./revenue-chart";

interface ActivityEntry {
  id: string;
  agent_name: string;
  message: string;
  level: string;
  created_at: string;
}

interface DashboardStats {
  mrr: number;
  newLeadsToday: number;
  activeClients: number;
  emailsSentToday: number;
  revenue: Array<{ date: string; amount: number }>;
}

const AGENT_LABELS: Record<string, string> = {
  sales_agent: "Sales Agent",
  blog_agent: "Blog Agent",
  landing_page_agent: "Landing Page Agent",
  lead_follow_up_agent: "Lead Follow-Up Agent",
  email_campaign_agent: "Email Campaign Agent",
  lead_finder_agent: "Lead Finder Agent",
};

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function DashboardOverview({ stats, activity }: { stats: DashboardStats | null; activity: ActivityEntry[] }) {
  if (!stats) return <p className="mt-4 text-sm text-neutral-500">Loading…</p>;

  const tiles = [
    { label: "MRR", value: `$${stats.mrr.toLocaleString()}` },
    { label: "New Leads Today", value: stats.newLeadsToday },
    { label: "Active Clients", value: stats.activeClients },
    { label: "Emails Sent Today", value: `${stats.emailsSentToday}/100` },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-xl border border-white/10 bg-navy-900/60 p-4">
            <p className="text-2xl font-bold text-white">{tile.value}</p>
            <p className="mt-1 text-xs text-neutral-400">{tile.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-navy-900/60 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Revenue</h2>
          <div className="mt-3">
            <RevenueChart data={stats.revenue} />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Recent Activity</h2>
          <div className="mt-3 max-h-[20rem] space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-navy-900/60 p-4">
            {activity.length === 0 && <p className="text-sm text-neutral-500">No activity yet.</p>}
            {activity.map((entry) => (
              <div key={entry.id} className="border-b border-white/5 pb-2 text-sm last:border-0">
                <span
                  className={`font-semibold ${
                    entry.level === "error" ? "text-red-400" : entry.level === "warn" ? "text-amber-400" : "text-brand-light"
                  }`}
                >
                  {AGENT_LABELS[entry.agent_name] ?? entry.agent_name}
                </span>
                <span className="ml-2 text-neutral-300">{entry.message}</span>
                <span className="ml-2 text-neutral-600">{relativeTime(entry.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
