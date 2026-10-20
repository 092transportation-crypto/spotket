"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";

function alreadyHandled(): boolean {
  try {
    return (
      sessionStorage.getItem("exitIntentShown") === "1" || sessionStorage.getItem("leadSubmitted") === "1"
    );
  } catch {
    return true;
  }
}

function markShown(key: string) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    // ignore
  }
}

export function ExitIntentPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const firedRef = useRef(false);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    firedRef.current = alreadyHandled();

    function handleMouseOut(e: MouseEvent) {
      if (firedRef.current) return;
      if (e.clientY > 0 || e.relatedTarget) return;
      firedRef.current = true;
      markShown("exitIntentShown");
      setVisible(true);
    }

    document.addEventListener("mouseout", handleMouseOut);
    return () => document.removeEventListener("mouseout", handleMouseOut);
  }, [pathname]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await fetch("/api/lead-capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "exit_intent", name, phone }),
    }).catch(() => {});
    markShown("leadSubmitted");
    setStatus("sent");
    setTimeout(() => setVisible(false), 2000);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-brand/40 bg-navy-900 p-6 shadow-2xl">
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          className="float-right -mt-1 -mr-1 text-neutral-500 hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold text-white">Before you go — get an instant quote</h2>
        {status === "sent" ? (
          <p className="mt-4 text-sm text-brand-light">Thanks! We&apos;ll be in touch shortly.</p>
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
            <button
              type="submit"
              className="btn-shimmer w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
            >
              Get My Quote
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
