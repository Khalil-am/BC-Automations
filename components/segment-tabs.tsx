"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Pointer } from "@/components/magicui/pointer";
import { cn } from "@/lib/utils";

export type Segment = "BC" | "QA" | "Configuration";

/* ── Abstract pointer icons ── */
/* Each is a small colored circle with a minimal abstract shape inside */

function AllPointerIcon() {
  return (
    <div className="flex items-center gap-1">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/90 shadow-sm">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="1" width="5" height="5" rx="1" fill="white" opacity="0.9" />
          <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.6" />
          <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.6" />
          <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

function BCPointerIcon() {
  return (
    <div className="flex items-center gap-1">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 shadow-sm">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 5h10v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" fill="white" opacity="0.9" />
          <path d="M5 5V3a2 2 0 0 1 4 0v2" stroke="white" strokeWidth="1.2" fill="none" />
        </svg>
      </div>
    </div>
  );
}

function QAPointerIcon() {
  return (
    <div className="flex items-center gap-1">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1L12 4v4c0 3-5 5-5 5S2 11 2 8V4l5-3z" fill="white" opacity="0.3" />
          <path d="M5 7l2 2 3-3.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function ConfigPointerIcon() {
  return (
    <div className="flex items-center gap-1">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 shadow-sm">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="2" fill="white" opacity="0.9" />
          <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1" opacity="0.4" strokeDasharray="2 2" />
          <circle cx="7" cy="2" r="1" fill="white" opacity="0.7" />
          <circle cx="7" cy="12" r="1" fill="white" opacity="0.7" />
          <circle cx="2" cy="7" r="1" fill="white" opacity="0.7" />
          <circle cx="12" cy="7" r="1" fill="white" opacity="0.7" />
        </svg>
      </div>
    </div>
  );
}

/* ── Card icons (in the card body) ── */

function AllCardIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={active ? "text-foreground" : "text-muted-foreground"}>
      <rect x="1" y="1" width="7.5" height="7.5" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="11.5" y="1" width="7.5" height="7.5" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="1" y="11.5" width="7.5" height="7.5" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="11.5" y="11.5" width="7.5" height="7.5" rx="2" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function BCCardIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#3b82f6" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={active ? "" : "text-muted-foreground"}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function QACardIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#10b981" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={active ? "" : "text-muted-foreground"}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ConfigCardIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#f59e0b" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={active ? "" : "text-muted-foreground"}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

/* ── Segment definitions ── */

const segments = [
  {
    id: "All" as const,
    title: "All",
    description: "Browse all automation templates",
    cardIcon: AllCardIcon,
    pointerIcon: <AllPointerIcon />,
    color: "text-foreground",
    bgColor: "bg-foreground/5",
    borderColor: "border-foreground/20",
    accentBg: "bg-foreground/10",
    labelBg: "bg-foreground",
  },
  {
    id: "BC" as const,
    title: "BC",
    description: "Dashboards, migrations, reports & data",
    cardIcon: BCCardIcon,
    pointerIcon: <BCPointerIcon />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/5",
    borderColor: "border-blue-500/30",
    accentBg: "bg-blue-500/10",
    labelBg: "bg-blue-500",
  },
  {
    id: "QA" as const,
    title: "QA",
    description: "Test cases, user manuals & docs",
    cardIcon: QACardIcon,
    pointerIcon: <QAPointerIcon />,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/5",
    borderColor: "border-emerald-500/30",
    accentBg: "bg-emerald-500/10",
    labelBg: "bg-emerald-500",
  },
  {
    id: "Configuration" as const,
    title: "Config",
    description: "Setup guides, notifications & permissions",
    cardIcon: ConfigCardIcon,
    pointerIcon: <ConfigPointerIcon />,
    color: "text-amber-500",
    bgColor: "bg-amber-500/5",
    borderColor: "border-amber-500/30",
    accentBg: "bg-amber-500/10",
    labelBg: "bg-amber-500",
  },
];

interface SegmentTabsProps {
  selectedSegment: string;
  segmentCounts: Record<string, number>;
}

export function SegmentTabs({
  selectedSegment,
  segmentCounts,
}: SegmentTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSegmentClick = (segmentId: string) => {
    if (segmentId === "All" || segmentId === selectedSegment) {
      router.push(pathname);
    } else {
      const params = new URLSearchParams();
      params.set("segment", segmentId);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
      {segments.map((segment, index) => {
        const isActive =
          segment.id === "All"
            ? selectedSegment === "All"
            : selectedSegment === segment.id;
        const CardIcon = segment.cardIcon;

        return (
          <motion.button
            key={segment.id}
            onClick={() => handleSegmentClick(segment.id)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.35 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "relative rounded-xl border p-4 text-left transition-all cursor-pointer overflow-hidden",
              isActive
                ? `${segment.borderColor} ${segment.bgColor}`
                : "border-border hover:border-border/80 hover:bg-muted/20"
            )}
          >
            <Pointer>{segment.pointerIcon}</Pointer>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-lg p-1.5 transition-colors",
                    isActive ? segment.accentBg : "bg-muted"
                  )}
                >
                  <CardIcon active={isActive} />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium tabular-nums",
                    isActive ? segment.color : "text-muted-foreground"
                  )}
                >
                  {segmentCounts[segment.id] || 0}
                </span>
              </div>
              <div>
                <h3
                  className={cn(
                    "font-semibold text-sm",
                    isActive ? segment.color : "text-foreground"
                  )}
                >
                  {segment.title}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-1">
                  {segment.description}
                </p>
              </div>
            </div>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  className={cn("absolute bottom-0 left-0 right-0 h-[2px]", segment.labelBg)}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.25 }}
                />
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
