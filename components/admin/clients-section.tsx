"use client";

import { useEffect, useState } from "react";
import { ClientWorkspace } from "./client-workspace";

interface Client {
  id: string;
  name: string | null;
  business_name: string | null;
  phone: string | null;
  email: string | null;
  website_url: string | null;
  plan: string;
  monthly_amount: number;
  payment_status: "paid" | "pending" | "overdue";
  status: "active" | "paused" | "cancelled";
  start_date: string;
}

const paymentDot: Record<Client["payment_status"], string> = {
  paid: "bg-emerald-400",
  pending: "bg-amber-400",
  overdue: "bg-red-400",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function ClientsSection() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [openClient, setOpenClient] = useState<Client | null>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/admin/clients");
        if (cancelled || !res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setClients(data.clients ?? []);
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

  if (!loaded) return <p className="mt-4 text-sm text-neutral-500">Loading clients…</p>;

  if (clients.length === 0) {
    return <p className="mt-4 text-sm text-neutral-500">No active clients yet — convert a lead from the Leads tab.</p>;
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-navy-900/60">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-widest text-neutral-500">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Business</th>
            <th className="px-4 py-3">Plan</th>
            <th className="px-4 py-3">Monthly</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Start Date</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr
              key={client.id}
              onClick={() => setOpenClient(client)}
              className="cursor-pointer border-b border-white/5 transition-colors last:border-0 hover:bg-white/5"
            >
              <td className="px-4 py-3 font-medium text-white">{client.name || "—"}</td>
              <td className="px-4 py-3 text-neutral-300">{client.business_name || "—"}</td>
              <td className="px-4 py-3 text-neutral-300">{client.plan}</td>
              <td className="px-4 py-3 text-neutral-300">${client.monthly_amount}</td>
              <td className="px-4 py-3">
                <span className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${paymentDot[client.payment_status]}`} />
                  <span className="capitalize text-neutral-300">{client.payment_status}</span>
                </span>
              </td>
              <td className="px-4 py-3 text-neutral-400">{formatDate(client.start_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {openClient && (
        <ClientWorkspace
          client={openClient}
          onClose={() => setOpenClient(null)}
          onUpdated={() => setRefreshNonce((n) => n + 1)}
        />
      )}
    </div>
  );
}
