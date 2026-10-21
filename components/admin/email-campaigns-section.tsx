"use client";

import { useEffect, useRef, useState } from "react";

interface Campaign {
  id: string;
  name: string;
  status: "draft" | "sending" | "done";
  total_recipients: number;
  sent_count: number;
  created_at: string;
}

interface Recipient {
  id: string;
  business_name: string | null;
  contact_name: string | null;
  email: string;
  status: "queued" | "sent" | "opened" | "replied" | "bounced" | "failed";
  sent_at: string | null;
  opened_at: string | null;
}

const statusColor: Record<Recipient["status"], string> = {
  queued: "text-neutral-400",
  sent: "text-brand-light",
  opened: "text-emerald-400",
  replied: "text-emerald-300",
  bounced: "text-red-400",
  failed: "text-red-400",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

/** Tolerant CSV parser: header row (business_name/business, contact_name/name, email, website_url/website, notes). No quoted-comma support. */
function parseCsv(text: string): Array<{ business_name?: string; contact_name?: string; email: string; website_url?: string; notes?: string }> {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const idx = (names: string[]) => headers.findIndex((h) => names.includes(h));
  const businessIdx = idx(["business_name", "business", "company"]);
  const contactIdx = idx(["contact_name", "name", "contact"]);
  const emailIdx = idx(["email"]);
  const websiteIdx = idx(["website_url", "website"]);
  const notesIdx = idx(["notes"]);
  if (emailIdx === -1) return [];

  return lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    return {
      business_name: businessIdx >= 0 ? cells[businessIdx] : undefined,
      contact_name: contactIdx >= 0 ? cells[contactIdx] : undefined,
      email: cells[emailIdx] || "",
      website_url: websiteIdx >= 0 ? cells[websiteIdx] : undefined,
      notes: notesIdx >= 0 ? cells[notesIdx] : undefined,
    };
  }).filter((r) => r.email.includes("@"));
}

function CampaignDetail({ campaignId, onClose }: { campaignId: string; onClose: () => void }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const res = await fetch(`/api/admin/email-campaigns/${campaignId}`);
      if (cancelled) return;
      const data = await res.json();
      if (cancelled) return;
      setCampaign(data.campaign);
      setRecipients(data.recipients ?? []);
    }

    load();
    const interval = setInterval(load, 6000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [campaignId, refreshNonce]);

  async function send() {
    setSending(true);
    setNote(null);
    try {
      const res = await fetch(`/api/admin/email-campaigns/${campaignId}/send`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setNote(data.detail || "Failed to send.");
        return;
      }
      setNote(
        data.capHit
          ? "Today's 100-email cap is already hit — the rest will go out tomorrow automatically."
          : `Sent ${data.sent}${data.failed ? `, ${data.failed} failed` : ""}.${data.stillQueued ? " Remaining recipients continue automatically via the daily cron." : ""}`,
      );
      setRefreshNonce((n) => n + 1);
    } finally {
      setSending(false);
    }
  }

  if (!campaign) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-navy-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">{campaign.name}</h2>
            <p className="text-sm text-neutral-400">
              {campaign.sent_count}/{campaign.total_recipients} sent · {campaign.status}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg border border-white/15 px-2.5 py-1 text-xs text-neutral-300 hover:bg-white/5">
            Close
          </button>
        </div>

        <button
          onClick={send}
          disabled={sending || campaign.status === "done"}
          className="btn-shimmer mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {sending ? "Sending…" : campaign.status === "done" ? "All sent" : "Send Now"}
        </button>
        {note && <p className="mt-2 text-xs text-neutral-400">{note}</p>}

        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-navy-950/60">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                <th className="px-3 py-2">Business</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Sent</th>
              </tr>
            </thead>
            <tbody>
              {recipients.map((r) => (
                <tr key={r.id} className="border-b border-white/5 last:border-0">
                  <td className="px-3 py-2 text-white">{r.business_name || r.contact_name || "—"}</td>
                  <td className="px-3 py-2 text-neutral-300">{r.email}</td>
                  <td className={`px-3 py-2 capitalize ${statusColor[r.status]}`}>{r.status}</td>
                  <td className="px-3 py-2 text-neutral-500">{r.sent_at ? formatDate(r.sent_at) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function EmailCampaignsSection() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [importing, setImporting] = useState(false);
  const [importNote, setImportNote] = useState<string | null>(null);
  const [openCampaignId, setOpenCampaignId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/admin/email-campaigns");
        if (cancelled) return;
        const data = await res.json();
        if (cancelled) return;
        setCampaigns(data.campaigns ?? []);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    load();
    const interval = setInterval(load, 8000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [refreshNonce]);

  async function handleFile(file: File) {
    const text = await file.text();
    const recipients = parseCsv(text);
    if (recipients.length === 0) {
      setImportNote("No valid rows found — the CSV needs an \"email\" column.");
      return;
    }
    if (!name.trim()) {
      setImportNote("Give the campaign a name first.");
      return;
    }
    setImporting(true);
    setImportNote(null);
    try {
      const res = await fetch("/api/admin/email-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), recipients }),
      });
      const data = await res.json();
      if (!res.ok) {
        setImportNote(data.detail || "Import failed.");
        return;
      }
      setImportNote(`Imported ${recipients.length} recipient(s).`);
      setName("");
      if (fileRef.current) fileRef.current.value = "";
      setRefreshNonce((n) => n + 1);
    } finally {
      setImporting(false);
    }
  }

  if (!loaded) return <p className="mt-4 text-sm text-neutral-500">Loading campaigns…</p>;

  return (
    <div className="mt-4">
      <div className="rounded-xl border border-white/10 bg-navy-900/60 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">New Campaign</h3>
        <p className="mt-1 text-xs text-neutral-500">CSV columns: business_name, contact_name, email, website_url, notes (header row required).</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Campaign name"
            className="min-w-[180px] flex-1 rounded-lg border border-white/15 bg-navy-950 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-brand"
          />
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            disabled={importing}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="text-xs text-neutral-400"
          />
        </div>
        {importNote && <p className="mt-2 text-xs text-neutral-400">{importNote}</p>}
      </div>

      {campaigns.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">No campaigns yet — import a CSV above.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-navy-900/60">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setOpenCampaignId(c.id)}
                  className="cursor-pointer border-b border-white/5 transition-colors last:border-0 hover:bg-white/5"
                >
                  <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                  <td className="px-4 py-3 capitalize text-neutral-300">{c.status}</td>
                  <td className="px-4 py-3 text-neutral-300">
                    {c.sent_count}/{c.total_recipients}
                  </td>
                  <td className="px-4 py-3 text-neutral-400">{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openCampaignId && <CampaignDetail campaignId={openCampaignId} onClose={() => setOpenCampaignId(null)} />}
    </div>
  );
}
