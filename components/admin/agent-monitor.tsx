"use client";

import { useEffect, useState } from "react";
import { AgentTerminal } from "@/components/agent-terminal";

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

function untilText(target: Date): string {
  const diffMs = target.getTime() - Date.now();
  const hours = Math.round(diffMs / 3_600_000);
  if (hours < 1) return "within the hour";
  if (hours < 24) return `in ${hours}h`;
  return `in ${Math.round(hours / 24)}d`;
}

/**
 * These agents run on fixed Vercel Cron schedules (see vercel.json) — next-run
 * time is exactly computable, not an estimate. sales_agent has no schedule
 * (runs per chat/form request), so it returns null.
 */
function nextCronRun(agent: string): string | null {
  const now = new Date();
  function nextDailyUTC(hour: number): Date {
    const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour, 0, 0));
    if (next.getTime() <= now.getTime()) next.setUTCDate(next.getUTCDate() + 1);
    return next;
  }
  function nextWeeklyUTC(dayOfWeek: number, hour: number): Date {
    const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour, 0, 0));
    let diff = (dayOfWeek - next.getUTCDay() + 7) % 7;
    if (diff === 0 && next.getTime() <= now.getTime()) diff = 7;
    next.setUTCDate(next.getUTCDate() + diff);
    return next;
  }
  switch (agent) {
    case "lead_finder_agent":
      return untilText(nextDailyUTC(7));
    case "blog_agent":
      return untilText(nextDailyUTC(6));
    case "lead_follow_up_agent":
      return untilText(nextDailyUTC(12));
    case "email_campaign_agent":
      return untilText(nextDailyUTC(13));
    case "landing_page_agent":
      return untilText(nextWeeklyUTC(1, 6)); // Monday
    default:
      return null;
  }
}

export function AgentMonitor() {
  const [agents, setAgents] = useState<AgentSetting[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [openAgent, setOpenAgent] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [agentsRes, activityRes] = await Promise.all([fetch("/api/admin/agents"), fetch("/api/admin/activity")]);
        if (cancelled) return;
        const agentsData = await agentsRes.json();
        const activityData = await activityRes.json();
        if (cancelled) return;
        setAgents(agentsData.agents ?? []);
        setActivity(activityData.activity ?? []);
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
  }, []);

  async function toggleAgent(agentName: string, enabled: boolean) {
    setAgents((prev) => prev.map((a) => (a.agent_name === agentName ? { ...a, enabled } : a)));
    await fetch("/api/admin/agents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_name: agentName, enabled }),
    });
  }

  if (!loaded) return <p className="mt-4 text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Agents</h2>
        <div className="mt-4 space-y-3">
          {agents.map((agent) => {
            const lastForAgent = activity.find((e) => e.agent_name === agent.agent_name);
            const status = !agent.enabled ? "disabled" : lastForAgent?.level === "error" ? "error" : "active";
            const dot = status === "error" ? "bg-red-400" : status === "active" ? "bg-emerald-400" : "bg-neutral-500";
            return (
              <div
                key={agent.agent_name}
                role="button"
                tabIndex={0}
                onClick={() => setOpenAgent(agent.agent_name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenAgent(agent.agent_name);
                  }
                }}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-navy-900/60 p-4 text-left transition-colors hover:border-white/20 hover:bg-navy-900"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${dot} ${status === "active" ? "animate-pulse" : ""}`} />
                    <p className="text-sm font-semibold text-white">{AGENT_LABELS[agent.agent_name] ?? agent.agent_name}</p>
                  </div>
                  <p className="mt-0.5 ml-4 text-xs text-neutral-500">
                    {status === "disabled" ? "Disabled" : status === "error" ? "Last run errored" : "Active"}
                    {lastForAgent ? ` · ${relativeTime(lastForAgent.created_at)}` : ""}
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={agent.enabled}
                  aria-label={`${agent.enabled ? "Stop" : "Start"} ${AGENT_LABELS[agent.agent_name] ?? agent.agent_name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAgent(agent.agent_name, !agent.enabled);
                  }}
                  className={`h-7 w-12 shrink-0 rounded-full transition-colors ${agent.enabled ? "bg-brand" : "bg-white/10"}`}
                >
                  <span
                    className={`block h-5 w-5 translate-x-1 rounded-full bg-white transition-transform ${
                      agent.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Live Activity</h2>
        <div className="mt-4 max-h-[28rem] space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-navy-900/60 p-4">
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

      {openAgent &&
        (() => {
          const agent = agents.find((a) => a.agent_name === openAgent);
          if (!agent) return null;
          return (
            <AgentTerminal
              agent={agent.agent_name}
              label={AGENT_LABELS[agent.agent_name] ?? agent.agent_name}
              enabled={agent.enabled}
              nextRun={nextCronRun(agent.agent_name)}
              onToggle={(enabled) => toggleAgent(agent.agent_name, enabled)}
              onClose={() => setOpenAgent(null)}
            />
          );
        })()}
    </div>
  );
}
