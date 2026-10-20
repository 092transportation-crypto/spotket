"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AgentSetting {
  agent_name: string;
  enabled: boolean;
  updated_at: string | null;
}

interface ActivityEntry {
  id: string;
  agent_name: string;
  message: string;
  level: string;
  created_at: string;
}

interface Stats {
  totalLeads: number;
  followUpsSent: number;
  blogPosts: number;
  blogPostsThisWeek: number;
  landingPages: number;
  landingPagesThisWeek: number;
}

const AGENT_LABELS: Record<string, string> = {
  sales_agent: "Sales Agent",
  blog_agent: "Blog Agent",
  landing_page_agent: "Landing Page Agent",
  lead_follow_up_agent: "Lead Follow-Up Agent",
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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<AgentSetting[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [agentsRes, activityRes, statsRes] = await Promise.all([
          fetch("/api/admin/agents"),
          fetch("/api/admin/activity"),
          fetch("/api/admin/stats"),
        ]);
        if (cancelled) return;
        if (agentsRes.status === 401) {
          router.push("/admin/login");
          return;
        }
        const agentsData = await agentsRes.json();
        const activityData = await activityRes.json();
        const statsData = await statsRes.json();
        if (cancelled) return;
        setAgents(agentsData.agents ?? []);
        setActivity(activityData.activity ?? []);
        setStats(statsData);
      } catch {
        // transient — next poll will retry
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    load();
    const interval = setInterval(load, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [router]);

  async function toggleAgent(agentName: string, enabled: boolean) {
    setAgents((prev) => prev.map((a) => (a.agent_name === agentName ? { ...a, enabled } : a)));
    await fetch("/api/admin/agents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_name: agentName, enabled }),
    });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const statTiles = stats
    ? [
        { label: "Leads Captured", value: stats.totalLeads },
        { label: "Follow-Ups Sent", value: stats.followUpsSent },
        { label: "Blog Posts", value: stats.blogPosts, sub: `${stats.blogPostsThisWeek} this week` },
        { label: "Landing Pages", value: stats.landingPages, sub: `${stats.landingPagesThisWeek} this week` },
      ]
    : [];

  return (
    <div className="min-h-screen bg-navy-950 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Agent Dashboard</h1>
          <button
            onClick={logout}
            className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-neutral-300 transition-colors hover:bg-white/5"
          >
            Log Out
          </button>
        </div>

        {!loaded ? (
          <p className="mt-10 text-sm text-neutral-500">Loading…</p>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {statTiles.map((tile) => (
                <div key={tile.label} className="rounded-xl border border-white/10 bg-navy-900/60 p-4">
                  <p className="text-2xl font-bold text-white">{tile.value}</p>
                  <p className="mt-1 text-xs text-neutral-400">{tile.label}</p>
                  {tile.sub && <p className="mt-0.5 text-[11px] text-brand-light">{tile.sub}</p>}
                </div>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Agents</h2>
                <div className="mt-4 space-y-3">
                  {agents.map((agent) => (
                    <div
                      key={agent.agent_name}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-navy-900/60 p-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {AGENT_LABELS[agent.agent_name] ?? agent.agent_name}
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-500">
                          {agent.enabled ? "Running" : "Paused"}
                        </p>
                      </div>
                      <button
                        role="switch"
                        aria-checked={agent.enabled}
                        onClick={() => toggleAgent(agent.agent_name, !agent.enabled)}
                        className={`h-7 w-12 rounded-full transition-colors ${
                          agent.enabled ? "bg-brand" : "bg-white/10"
                        }`}
                      >
                        <span
                          className={`block h-5 w-5 translate-x-1 rounded-full bg-white transition-transform ${
                            agent.enabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Live Activity</h2>
                <div className="mt-4 max-h-[28rem] space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-navy-900/60 p-4">
                  {activity.length === 0 && (
                    <p className="text-sm text-neutral-500">No activity yet.</p>
                  )}
                  {activity.map((entry) => (
                    <div key={entry.id} className="border-b border-white/5 pb-2 text-sm last:border-0">
                      <span
                        className={`font-semibold ${
                          entry.level === "error"
                            ? "text-red-400"
                            : entry.level === "warn"
                              ? "text-amber-400"
                              : "text-brand-light"
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
          </>
        )}
      </div>
    </div>
  );
}
