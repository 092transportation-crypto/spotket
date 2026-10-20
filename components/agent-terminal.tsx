"use client";

import { useEffect, useRef, useState } from "react";

interface ActivityEntry {
  id: string;
  agent_name: string;
  message: string;
  level: string;
  created_at: string;
}

interface AgentTerminalProps {
  agent: string;
  label: string;
  enabled: boolean;
  nextRun: string | null;
  onToggle: (enabled: boolean) => void;
  onClose: () => void;
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

const LEVEL_COLOR: Record<string, string> = {
  error: "text-red-400",
  warn: "text-yellow-400",
  info: "text-emerald-400",
};

/**
 * Per-agent "terminal" view: polls this agent's real activity-log rows every
 * 4s and renders them as a scrolling, color-coded log. This is genuinely new
 * data arriving (not a simulated/fake live process) — these agents are short
 * serverless invocations (a cron tick, or one chat/form request), not
 * persistent daemons, so "status" here means "enabled + last run's outcome,"
 * not "currently executing" (that lasts milliseconds-to-seconds and isn't
 * something there's a continuous process to watch tick over).
 */
export function AgentTerminal({ agent, label, enabled, nextRun, onToggle, onClose }: AgentTerminalProps) {
  const [logs, setLogs] = useState<ActivityEntry[]>([]);
  const [actionsToday, setActionsToday] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/admin/agents/${agent}/activity`);
        if (cancelled || !res.ok) return;
        const data = await res.json();
        setLogs(data.logs ?? []);
        setActionsToday(data.actionsToday ?? 0);
      } catch {
        // transient — next poll will retry
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    load();
    const interval = setInterval(load, 4000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [agent]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [logs]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const lastEntry = logs[0];
  const status = !enabled ? "disabled" : lastEntry?.level === "error" ? "error" : "active";
  const statusConfig = {
    active: { label: "Active", dot: "bg-emerald-400", text: "text-emerald-400", pulse: true },
    disabled: { label: "Disabled", dot: "bg-neutral-500", text: "text-neutral-400", pulse: false },
    error: { label: "Error", dot: "bg-red-400", text: "text-red-400", pulse: false },
  }[status];

  const ordered = [...logs].reverse(); // oldest first, like a real terminal scrolling down

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex h-[92vh] w-full flex-col overflow-hidden border border-white/10 bg-[#050505] sm:h-[85vh] sm:max-w-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-navy-950 px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${statusConfig.dot} ${statusConfig.pulse ? "animate-pulse" : ""}`}
              />
              <h2 className="text-sm font-semibold text-white">{label}</h2>
              <span className={`text-xs font-medium ${statusConfig.text}`}>{statusConfig.label}</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              {lastEntry
                ? `Last action: ${lastEntry.message} · ${relativeTime(lastEntry.created_at)}`
                : "No activity logged yet"}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-neutral-500 hover:text-white">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-3 gap-px border-b border-white/10 bg-white/5">
          <div className="bg-[#050505] px-4 py-3">
            <p className="text-lg font-bold text-white">{actionsToday}</p>
            <p className="text-[11px] text-neutral-500">Actions (24h)</p>
          </div>
          <div className="bg-[#050505] px-4 py-3">
            <p className="text-xs font-semibold text-white">{nextRun ?? "Per request"}</p>
            <p className="text-[11px] text-neutral-500">Next run</p>
          </div>
          <div className="flex items-center justify-between bg-[#050505] px-4 py-3">
            <p className="text-[11px] text-neutral-500">{enabled ? "Stop" : "Start"}</p>
            <button
              role="switch"
              aria-checked={enabled}
              onClick={() => onToggle(!enabled)}
              className={`h-6 w-11 shrink-0 rounded-full transition-colors ${enabled ? "bg-brand" : "bg-white/10"}`}
            >
              <span
                className={`block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform ${
                  enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto bg-black px-4 py-3 font-mono text-[13px] leading-relaxed"
        >
          {!loaded ? (
            <p className="text-neutral-600">Connecting…</p>
          ) : ordered.length === 0 ? (
            <p className="text-neutral-600">No log entries yet for this agent.</p>
          ) : (
            ordered.map((entry) => (
              <div key={entry.id} className="flex gap-2">
                <span className="shrink-0 text-neutral-600">
                  [{new Date(entry.created_at).toLocaleTimeString()}]
                </span>
                <span className={LEVEL_COLOR[entry.level] ?? LEVEL_COLOR.info}>{entry.message}</span>
              </div>
            ))
          )}
          <div className="mt-1 flex items-center gap-1 text-neutral-600">
            <span>$</span>
            <span className="h-3.5 w-2 animate-pulse bg-neutral-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
