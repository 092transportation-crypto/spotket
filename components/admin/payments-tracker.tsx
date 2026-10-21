"use client";

import { useEffect, useMemo, useState } from "react";

const CLIENT_PLANS = ["Starter", "Standard", "Premium", "AI Receptionist"] as const;
type ClientPlan = (typeof CLIENT_PLANS)[number];
const PLAN_AMOUNTS: Record<ClientPlan, number> = { Starter: 300, Standard: 500, Premium: 1000, "AI Receptionist": 200 };

interface Payment {
  id: string;
  client_id: string | null;
  lead_id: string | null;
  label: string;
  plan: string;
  amount: number;
  stripe_payment_link_url: string | null;
  status: "paid" | "pending" | "overdue";
  created_at: string;
  paid_at: string | null;
}

interface Target {
  id: string;
  label: string;
}

const statusDot: Record<Payment["status"], string> = {
  paid: "bg-emerald-400",
  pending: "bg-amber-400",
  overdue: "bg-red-400",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function PaymentsTracker() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [leads, setLeads] = useState<Target[]>([]);
  const [clients, setClients] = useState<Target[]>([]);
  const [targetType, setTargetType] = useState<"lead" | "client">("client");
  const [targetId, setTargetId] = useState("");
  const [plan, setPlan] = useState<ClientPlan>("Standard");
  const [status, setStatus] = useState<string | null>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [paymentsRes, leadsRes, clientsRes] = await Promise.all([
          fetch("/api/admin/payments"),
          fetch("/api/admin/leads"),
          fetch("/api/admin/clients"),
        ]);
        if (cancelled) return;
        const paymentsData = await paymentsRes.json();
        const leadsData = await leadsRes.json();
        const clientsData = await clientsRes.json();
        if (cancelled) return;
        setPayments(paymentsData.payments ?? []);
        setLeads((leadsData.leads ?? []).map((l: { id: string; name: string | null; business_name: string | null }) => ({ id: l.id, label: l.business_name || l.name || l.id })));
        setClients((clientsData.clients ?? []).map((c: { id: string; name: string | null; business_name: string | null }) => ({ id: c.id, label: c.business_name || c.name || c.id })));
      } catch {
        // transient — next poll will retry
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

  const mrr = useMemo(
    () => payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + Number(p.amount), 0),
    [payments],
  );

  const options = targetType === "lead" ? leads : clients;

  async function sendLink() {
    if (!targetId) {
      setStatus("Pick a lead or client first.");
      return;
    }
    setStatus("Sending…");
    const res = await fetch("/api/admin/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [targetType === "lead" ? "leadId" : "clientId"]: targetId, plan }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus(data.detail || "Failed to send payment link.");
      return;
    }
    setStatus(data.emailed ? "Sent." : `Link created: ${data.link?.url ?? ""}`);
    setRefreshNonce((n) => n + 1);
  }

  async function markStatus(id: string, newStatus: Payment["status"]) {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    await fetch(`/api/admin/payments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  if (!loaded) return <p className="mt-4 text-sm text-neutral-500">Loading payments…</p>;

  return (
    <div className="mt-4">
      <div className="rounded-xl border border-white/10 bg-navy-900/60 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Send Payment Link</h3>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            value={targetType}
            onChange={(e) => {
              setTargetType(e.target.value as "lead" | "client");
              setTargetId("");
            }}
            className="rounded-lg border border-white/15 bg-navy-950 px-3 py-2 text-sm text-white outline-none focus:border-brand"
          >
            <option value="client">Client</option>
            <option value="lead">Lead</option>
          </select>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="min-w-[200px] flex-1 rounded-lg border border-white/15 bg-navy-950 px-3 py-2 text-sm text-white outline-none focus:border-brand"
          >
            <option value="">Select {targetType}…</option>
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as ClientPlan)}
            className="rounded-lg border border-white/15 bg-navy-950 px-3 py-2 text-sm text-white outline-none focus:border-brand"
          >
            {CLIENT_PLANS.map((p) => (
              <option key={p} value={p}>
                {p} (${PLAN_AMOUNTS[p]}/mo)
              </option>
            ))}
          </select>
          <button onClick={sendLink} className="btn-shimmer rounded-lg px-4 py-2 text-xs font-semibold text-white">
            Send Link
          </button>
        </div>
        {status && <p className="mt-2 text-xs text-neutral-400">{status}</p>}
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-navy-900/60 p-4">
        <p className="text-xs text-neutral-500">MRR (paid)</p>
        <p className="text-2xl font-bold text-white">${mrr.toLocaleString()}</p>
      </div>

      {payments.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">No payments yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-navy-900/60">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Sent</th>
                <th className="px-4 py-3">Paid</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 text-white">{payment.label}</td>
                  <td className="px-4 py-3 text-neutral-300">{payment.plan}</td>
                  <td className="px-4 py-3 text-neutral-300">${payment.amount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${statusDot[payment.status]}`} />
                      <select
                        value={payment.status}
                        onChange={(e) => markStatus(payment.id, e.target.value as Payment["status"])}
                        className="rounded-md border border-white/15 bg-navy-950 px-2 py-1 text-xs capitalize text-white outline-none focus:border-brand"
                      >
                        <option value="pending">pending</option>
                        <option value="paid">paid</option>
                        <option value="overdue">overdue</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-400">{formatDate(payment.created_at)}</td>
                  <td className="px-4 py-3 text-neutral-400">{payment.paid_at ? formatDate(payment.paid_at) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
