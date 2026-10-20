import type { ReactElement } from "react";

export type TierIconName = "chatbot" | "rocket" | "crown" | "phone";

function ChatbotIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <rect x="4" y="8" width="16" height="11" rx="3" />
      <path d="M12 8V4" />
      <circle cx="12" cy="3" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="13.5" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13.5" r="1.25" fill="currentColor" stroke="none" />
      <path d="M9 17h6" />
      <path d="M2 12.5v2" />
      <path d="M22 12.5v2" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M12 2.5c3 1.5 5 5.3 5 9 0 2-.6 4-1.6 5.5L12 20l-3.4-3c-1-1.5-1.6-3.5-1.6-5.5 0-3.7 2-7.5 5-9z" />
      <circle cx="12" cy="10.5" r="1.8" />
      <path d="M8.3 15.8 5.8 18.3l1-3.6" />
      <path d="M15.7 15.8 18.2 18.3l-1-3.6" />
      <path d="M9.7 20.3c.5.9 1.3 1.4 2.3 1.4s1.8-.5 2.3-1.4" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M4 17.5 3 8l4.8 3.6L12 5l4.2 6.6L21 8l-1 9.5z" />
      <path d="M4 17.5h16" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M4.5 13.5v-1.8a7.5 7.5 0 0 1 15 0v1.8" />
      <rect x="3" y="13" width="4" height="6.5" rx="1.6" />
      <rect x="17" y="13" width="4" height="6.5" rx="1.6" />
      <path d="M19 19.5v.8a3 3 0 0 1-3 3h-2.5" />
    </svg>
  );
}

function MagnifierIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.3 15.3 21 21" />
      <path d="M10.5 7.8v5.4" />
      <path d="M7.8 10.5h5.4" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M14.7 6.3a4 4 0 0 0-5.4 4.9L3 17.5V21h3.5l6.3-6.3a4 4 0 0 0 4.9-5.4l-3 3-2.4-2.4z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M22 20H2" />
    </svg>
  );
}

export type StepIconName = "audit" | "build" | "launch" | "support";

const TIER_ICONS: Record<TierIconName, () => ReactElement> = {
  chatbot: ChatbotIcon,
  rocket: RocketIcon,
  crown: CrownIcon,
  phone: HeadsetIcon,
};

const STEP_ICONS: Record<StepIconName, () => ReactElement> = {
  audit: MagnifierIcon,
  build: WrenchIcon,
  launch: RocketIcon,
  support: ChartIcon,
};

export function TierIcon({
  icon,
  featured = false,
}: {
  icon: TierIconName;
  featured?: boolean;
}) {
  const Icon = TIER_ICONS[icon];
  return (
    <span
      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${
        featured
          ? "border-brand/50 bg-brand/15 text-brand-light"
          : "border-white/10 bg-white/5 text-brand-light"
      }`}
    >
      <Icon />
    </span>
  );
}

export function StepIcon({ icon }: { icon: StepIconName }) {
  const Icon = STEP_ICONS[icon];
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-brand-light">
      <Icon />
    </span>
  );
}

export function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-brand/15 text-sm font-bold text-brand-light">
      {initials}
    </span>
  );
}
