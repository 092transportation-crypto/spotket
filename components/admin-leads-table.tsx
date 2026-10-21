"use client";

import { useEffect, useMemo, useState } from "react";

const LEAD_STATUSES = ["New", "Called", "Interested", "Closed", "Lost"] as const;
type LeadStatus = (typeof LEAD_STATUSES)[number];

const CLIENT_PLANS = ["Starter", "Standard", "Premium", "AI Receptionist"] as const;
type ClientPlan = (typeof CLIENT_PLANS)[number];

const PLAN_AMOUNTS: Record<ClientPlan, number> = { Starter: 300, Standard: 500, Premium: 1000, "AI Receptionist": 200 };

interface Lead {
  id: string;
  name: string | null;
  business_name: string | null;
  business_type: string | null;
  phone: string | null;
  email: string | null;
  recommended_package: string | null;
  status: LeadStatus;
  notes: string | null;
  source: string | null;
  created_at: string;
}

function AutoFoundTag() {
  return (
    <span className="ml-2 rounded-full border border-brand/40 bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-light">
      Auto-Found
    </span>
  );
}

const statusDot: Record<LeadStatus, string> = {
  New: "bg-brand-light",
  Called: "bg-amber-400",
  Interested: "bg-emerald-400",
  Closed: "bg-neutral-500",
  Lost: "bg-red-400",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function toCsv(leads: Lead[]): string {
  const headers = ["Name", "Business", "Phone", "Email", "Service", "Date", "Status", "Notes"];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = leads.map((l) =>
    [l.name, l.business_name, l.phone, l.email, l.recommended_package || l.business_type, formatDate(l.created_at), l.status, l.notes]
      .map((v) => escape(v || ""))
      .join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

function downloadCsv(leads: Lead[]) {
  const blob = new Blob([toCsv(leads)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `spotket-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function LeadProfileModal({
  lead,
  onClose,
  onSave,
  onConverted,
}: {
  lead: Lead;
  onClose: () => void;
  onSave: (id: string, updates: { status?: LeadStatus; notes?: string }) => Promise<void>;
  onConverted: () => void;
}) {
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState<ClientPlan>("Standard");
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    await onSave(lead.id, { status, notes });
    setSaving(false);
  }

  async function convert() {
    setConverting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || "Could not convert lead.");
        return;
      }
      setConverted(true);
      onConverted();
    } finally {
      setConverting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-navy-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              {lead.name || "Unnamed lead"}
              {lead.source === "lead_finder_agent" && <AutoFoundTag />}
            </h2>
            <p className="text-sm text-neutral-400">{lead.business_name || "—"}</p>
          </div>
          <button onClick={onClose} className="rounded-lg border border-white/15 px-2.5 py-1 text-xs text-neutral-300 hover:bg-white/5">
            Close
          </button>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-neutral-500">Phone</dt>
            <dd className="text-white">{lead.phone || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">Email</dt>
            <dd className="text-white">{lead.email || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">Interested In</dt>
            <dd className="text-white">{lead.recommended_package || lead.business_type || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">Submitted</dt>
            <dd className="text-white">{formatDate(lead.created_at)}</dd>
          </div>
        </dl>

        <div className="mt-5">
          <label className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as LeadStatus)}
            className="mt-1.5 w-full rounded-lg border border-white/15 bg-navy-950 px-3 py-2 text-sm text-white outline-none focus:border-brand"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Call Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Add notes after each call…"
            className="mt-1.5 w-full resize-none rounded-lg border border-white/15 bg-navy-950 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-brand"
          />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="mt-3 rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-neutral-200 transition-colors hover:bg-white/5 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Status & Notes"}
        </button>

        <div className="mt-6 border-t border-white/10 pt-5">
          {converted ? (
            <p className="text-sm text-emerald-400">Converted to client — see the Clients tab.</p>
          ) : (
            <>
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Convert to Client</label>
              <div className="mt-1.5 flex gap-2">
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value as ClientPlan)}
                  className="flex-1 rounded-lg border border-white/15 bg-navy-950 px-3 py-2 text-sm text-white outline-none focus:border-brand"
                >
                  {CLIENT_PLANS.map((p) => (
                    <option key={p} value={p}>
                      {p} (${PLAN_AMOUNTS[p]}/mo)
                    </option>
                  ))}
                </select>
                <button
                  onClick={convert}
                  disabled={converting}
                  className="btn-shimmer shrink-0 rounded-lg px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  {converting ? "Converting…" : "Convert"}
                </button>
              </div>
              {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminLeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "All">("All");
  const [openLead, setOpenLead] = useState<Lead | null>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/admin/leads");
        if (cancelled || !res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setLeads(data.leads ?? []);
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
  }, [refreshNonce]);

  async function changeStatus(id: string, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function saveLeadProfile(id: string, updates: { status?: LeadStatus; notes?: string }) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== "All" && l.status !== statusFilter) return false;
      if (!q) return true;
      return [l.name, l.business_name, l.email, l.phone].some((v) => (v || "").toLowerCase().includes(q));
    });
  }, [leads, search, statusFilter]);

  if (!loaded) {
    return <p className="mt-4 text-sm text-neutral-500">Loading leads…</p>;
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, business, email, phone…"
          className="min-w-[220px] flex-1 rounded-lg border border-white/15 bg-navy-900/60 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-brand"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "All")}
          className="rounded-lg border border-white/15 bg-navy-900/60 px-3 py-2 text-sm text-white outline-none focus:border-brand"
        >
          <option value="All">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={() => downloadCsv(filtered)}
          className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-neutral-300 transition-colors hover:bg-white/5"
        >
          Export CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">No leads match.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-navy-900/60">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-white/5 align-top last:border-0">
                  <td className="px-4 py-3 font-medium text-white">
                    {lead.name || "—"}
                    {lead.source === "lead_finder_agent" && <AutoFoundTag />}
                  </td>
                  <td className="px-4 py-3 text-neutral-300">{lead.business_name || "—"}</td>
                  <td className="px-4 py-3">
                    {lead.phone ? (
                      <a href={`tel:${lead.phone}`} className="text-brand-light hover:text-white">
                        {lead.phone}
                      </a>
                    ) : (
                      <span className="text-neutral-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {lead.email ? (
                      <a href={`mailto:${lead.email}`} className="text-brand-light hover:text-white">
                        {lead.email}
                      </a>
                    ) : (
                      <span className="text-neutral-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-300">{lead.recommended_package || lead.business_type || "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-400">{formatDate(lead.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${statusDot[lead.status]}`} />
                      <select
                        value={lead.status}
                        onChange={(e) => changeStatus(lead.id, e.target.value as LeadStatus)}
                        className="rounded-md border border-white/15 bg-navy-950 px-2 py-1 text-xs text-white outline-none focus:border-brand"
                      >
                        {LEAD_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-neutral-400">{lead.notes || "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setOpenLead(lead)}
                      className="rounded-md border border-white/15 px-2.5 py-1 text-[11px] font-semibold text-neutral-300 transition-colors hover:bg-white/5"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openLead && (
        <LeadProfileModal
          lead={openLead}
          onClose={() => setOpenLead(null)}
          onSave={saveLeadProfile}
          onConverted={() => {
            setOpenLead(null);
            setRefreshNonce((n) => n + 1);
          }}
        />
      )}
    </div>
  );
}
