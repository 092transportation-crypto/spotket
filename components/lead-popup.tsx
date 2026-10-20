"use client";

import { useEffect, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";

function alreadyHandled(): boolean {
  try {
    return (
      sessionStorage.getItem("leadPopupShown") === "1" || sessionStorage.getItem("leadSubmitted") === "1"
    );
  } catch {
    return true; // private mode / blocked storage — don't risk showing repeatedly
  }
}

function markShown(key: string) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    // ignore
  }
}

export function LeadPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    if (alreadyHandled()) return;
    const timer = setTimeout(() => {
      if (!alreadyHandled()) {
        setVisible(true);
        markShown("leadPopupShown");
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [pathname]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await fetch("/api/lead-capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "lead_popup", name, phone, email }),
    }).catch(() => {});
    markShown("leadSubmitted");
    setStatus("sent");
    setTimeout(() => setVisible(false), 2000);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-2xl">
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          className="float-right -mt-1 -mr-1 text-neutral-500 hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold text-white">Get a free quote in 60 seconds</h2>
        {status === "sent" ? (
          <p className="mt-4 text-sm text-brand-light">
            Thanks! We&apos;ll be in touch shortly.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full rounded-lg border border-white/15 bg-navy-900/60 px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-brand"
            />
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="w-full rounded-lg border border-white/15 bg-navy-900/60 px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-brand"
            />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-lg border border-white/15 bg-navy-900/60 px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-brand"
            />
            <button
              type="submit"
              className="btn-shimmer w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
            >
              Get My Free Quote
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
