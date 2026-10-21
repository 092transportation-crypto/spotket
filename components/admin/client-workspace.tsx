"use client";

import { useEffect, useRef, useState } from "react";

const CLIENT_PLANS = ["Starter", "Standard", "Premium", "AI Receptionist"] as const;
type ClientPlan = (typeof CLIENT_PLANS)[number];
const PLAN_AMOUNTS: Record<ClientPlan, number> = { Starter: 300, Standard: 500, Premium: 1000, "AI Receptionist": 200 };
const PAYMENT_STATUSES = ["paid", "pending", "overdue"] as const;
const CLIENT_STATUSES = ["active", "paused", "cancelled"] as const;

interface Client {
  id: string;
  name: string | null;
  business_name: string | null;
  phone: string | null;
  email: string | null;
  website_url: string | null;
  plan: string;
  monthly_amount: number;
  payment_status: (typeof PAYMENT_STATUSES)[number];
  status: (typeof CLIENT_STATUSES)[number];
  start_date: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ClientWorkspace({ client, onClose, onUpdated }: { client: Client; onClose: () => void; onUpdated: () => void }) {
  const [current, setCurrent] = useState(client);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [linkStatus, setLinkStatus] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/admin/clients/${client.id}/chat`)
      .then((r) => r.json())
      .then((data) => setMessages(data.messages ?? []))
      .catch(() => {});
  }, [client.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function patch(updates: Record<string, unknown>) {
    setCurrent((prev) => ({ ...prev, ...updates }) as Client);
    await fetch(`/api/admin/clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    onUpdated();
  }

  async function sendPaymentLink() {
    setLinkStatus("Sending…");
    const res = await fetch("/api/admin/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: current.id, plan: current.plan }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLinkStatus(data.detail || "Failed to send payment link.");
      return;
    }
    setLinkStatus(data.emailed ? `Sent to ${current.email}.` : `Link created: ${data.link?.url ?? ""}`);
  }

  async function sendChatMessage() {
    const message = input.trim();
    if (!message || sending) return;
    setInput("");
    setMessages((prev) => [...prev, { id: `local-${Date.now()}`, role: "user", content: message }]);
    setSending(true);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json().catch(() => ({}));
      setMessages((prev) => [...prev, { id: `local-${Date.now()}-r`, role: "assistant", content: data.reply || data.detail || "No response." }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="grid max-h-[92vh] w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-navy-900 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-h-[92vh] overflow-y-auto border-b border-white/10 p-6 md:border-b-0 md:border-r">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">{current.business_name || current.name}</h2>
              <p className="text-sm text-neutral-400">{current.name}</p>
            </div>
            <button onClick={onClose} className="rounded-lg border border-white/15 px-2.5 py-1 text-xs text-neutral-300 hover:bg-white/5">
              Close
            </button>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-neutral-500">Phone</dt>
              <dd className="text-white">{current.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-neutral-500">Email</dt>
              <dd className="text-white">{current.email || "—"}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-neutral-500">Website</dt>
              <dd className="text-white">
                {current.website_url ? (
                  <a href={current.website_url} target="_blank" rel="noreferrer" className="text-brand-light hover:text-white">
                    {current.website_url} · Live
                  </a>
                ) : (
                  <span className="text-neutral-500">Not set</span>
                )}
              </dd>
            </div>
          </dl>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Plan</label>
              <select
                value={current.plan}
                onChange={(e) => patch({ plan: e.target.value, monthly_amount: PLAN_AMOUNTS[e.target.value as ClientPlan] })}
                className="mt-1.5 w-full rounded-lg border border-white/15 bg-navy-950 px-3 py-2 text-sm text-white outline-none focus:border-brand"
              >
                {CLIENT_PLANS.map((p) => (
                  <option key={p} value={p}>
                    {p} (${PLAN_AMOUNTS[p]}/mo)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Payment Status</label>
              <select
                value={current.payment_status}
                onChange={(e) => patch({ payment_status: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-white/15 bg-navy-950 px-3 py-2 text-sm text-white outline-none focus:border-brand"
              >
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Client Status</label>
              <select
                value={current.status}
                onChange={(e) => patch({ status: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-white/15 bg-navy-950 px-3 py-2 text-sm text-white outline-none focus:border-brand"
              >
                {CLIENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={sendPaymentLink}
            className="btn-shimmer mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
          >
            Send Stripe Payment Link
          </button>
          {linkStatus && <p className="mt-2 text-xs text-neutral-400">{linkStatus}</p>}

          <div className="mt-6 border-t border-white/10 pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Chatbot & Reviews</h3>
            <p className="mt-2 text-xs text-neutral-500">
              Not tracked yet in this dashboard — the AI chatbot/review automation runs on the client&apos;s own site, not
              inside Spotket&apos;s admin DB. Wiring this up would mean each client deployment reporting activity back here.
            </p>
          </div>
        </div>

        <div className="flex max-h-[92vh] flex-col p-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">AI Assistant</h3>
          <p className="mt-1 text-xs text-neutral-500">Powered by Claude. Try &quot;send monthly report&quot; or &quot;write a blog post for them&quot;.</p>
          <div ref={scrollRef} className="mt-3 flex-1 space-y-3 overflow-y-auto rounded-xl border border-white/10 bg-navy-950/60 p-3">
            {messages.length === 0 && <p className="text-sm text-neutral-500">No messages yet — say hello.</p>}
            {messages.map((m) => (
              <div key={m.id} className={`text-sm ${m.role === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 ${
                    m.role === "user" ? "bg-brand text-white" : "bg-navy-800 text-neutral-200"
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}
            {sending && <p className="text-xs text-neutral-500">Thinking…</p>}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendChatMessage();
              }}
              placeholder="Type a command…"
              className="flex-1 rounded-lg border border-white/15 bg-navy-950 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-brand"
            />
            <button
              onClick={sendChatMessage}
              disabled={sending}
              className="btn-shimmer rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
