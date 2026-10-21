"use client";

import { useMemo, useState } from "react";

interface Point {
  date: string;
  amount: number;
}

const WIDTH = 600;
const HEIGHT = 180;
const PAD_LEFT = 8;
const PAD_RIGHT = 8;
const PAD_TOP = 16;
const PAD_BOTTOM = 24;

function formatShortDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Single-series revenue line — brand hue only (no legend needed for one series; the heading names it). */
export function RevenueChart({ data }: { data: Point[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const { linePath, areaPath, points } = useMemo(() => {
    const max = Math.max(1, ...data.map((d) => d.amount));
    const innerW = WIDTH - PAD_LEFT - PAD_RIGHT;
    const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM;
    const step = data.length > 1 ? innerW / (data.length - 1) : 0;
    const pts = data.map((d, i) => ({
      x: PAD_LEFT + i * step,
      y: PAD_TOP + innerH - (d.amount / max) * innerH,
      ...d,
    }));
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const area =
      pts.length > 0
        ? `${line} L${pts[pts.length - 1].x.toFixed(1)},${PAD_TOP + innerH} L${pts[0].x.toFixed(1)},${PAD_TOP + innerH} Z`
        : "";
    return { linePath: line, areaPath: area, points: pts };
  }, [data]);

  if (data.length === 0) {
    return <p className="text-sm text-neutral-500">No revenue data yet.</p>;
  }

  const hovered = hoverIdx !== null ? points[hoverIdx] : null;
  const total = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      <p className="text-2xl font-bold text-white">
        ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        <span className="ml-2 text-xs font-normal text-neutral-500">last 30 days</span>
      </p>
      <div className="relative mt-2">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" preserveAspectRatio="none" role="img" aria-label="Revenue over the last 30 days">
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={PAD_LEFT}
              x2={WIDTH - PAD_RIGHT}
              y1={PAD_TOP + (HEIGHT - PAD_TOP - PAD_BOTTOM) * f}
              y2={PAD_TOP + (HEIGHT - PAD_TOP - PAD_BOTTOM) * f}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          ))}
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#revenueFill)" stroke="none" />
          <path d={linePath} fill="none" stroke="#818cf8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          {hovered && (
            <>
              <line x1={hovered.x} x2={hovered.x} y1={PAD_TOP} y2={HEIGHT - PAD_BOTTOM} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
              <circle cx={hovered.x} cy={hovered.y} r={4} fill="#818cf8" stroke="#0a0a0f" strokeWidth={2} />
            </>
          )}
          {points.map((p, i) => (
            <rect
              key={p.date}
              x={p.x - (WIDTH / Math.max(points.length, 1)) / 2}
              y={PAD_TOP}
              width={WIDTH / Math.max(points.length, 1)}
              height={HEIGHT - PAD_TOP - PAD_BOTTOM}
              fill="transparent"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx((cur) => (cur === i ? null : cur))}
            />
          ))}
        </svg>
        {hovered && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 rounded-md border border-white/10 bg-navy-950 px-2.5 py-1.5 text-xs shadow-lg"
            style={{ left: `${(hovered.x / WIDTH) * 100}%`, top: 0 }}
          >
            <p className="font-semibold text-white">${hovered.amount.toLocaleString()}</p>
            <p className="text-neutral-500">{formatShortDate(hovered.date)}</p>
          </div>
        )}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-neutral-500">
        <span>{formatShortDate(data[0].date)}</span>
        <span>{formatShortDate(data[data.length - 1].date)}</span>
      </div>
    </div>
  );
}
