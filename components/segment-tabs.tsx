"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Pointer } from "@/components/magicui/pointer";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  ClipboardCheck,
  Settings,
} from "lucide-react";

export type Segment = "BC" | "QA" | "Configuration";

function BCPointerIcon() {
  return (
    <motion.div
      animate={{ scale: [0.9, 1.05, 0.9] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="flex items-center gap-1.5"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 shadow-lg shadow-blue-500/30 ring-2 ring-white/80">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      </div>
      <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-md whitespace-nowrap">
        BC
      </span>
    </motion.div>
  );
}

function QAPointerIcon() {
  return (
    <motion.div
      animate={{ scale: [0.9, 1.05, 0.9] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      className="flex items-center gap-1.5"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 ring-2 ring-white/80">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </div>
      <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-md whitespace-nowrap">
        QA
      </span>
    </motion.div>
  );
}

function ConfigPointerIcon() {
  return (
    <motion.div
      animate={{ scale: [0.9, 1.05, 0.9] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      className="flex items-center gap-1.5"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 shadow-lg shadow-amber-500/30 ring-2 ring-white/80">
        <motion.svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: [0, 90] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </motion.svg>
      </div>
      <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-md whitespace-nowrap">
        Config
      </span>
    </motion.div>
  );
}

const segments: {
  id: Segment;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  pointerIcon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  labelBg: string;
}[] = [
  {
    id: "BC",
    title: "BC",
    subtitle: "Business Consulting",
    description: "Dashboards, migrations, reports & data workflows",
    icon: <Briefcase className="h-5 w-5" />,
    pointerIcon: <BCPointerIcon />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/40",
    labelBg: "bg-blue-500",
  },
  {
    id: "QA",
    title: "QA",
    subtitle: "Quality Assurance",
    description: "Test cases, user manuals & documentation",
    icon: <ClipboardCheck className="h-5 w-5" />,
    pointerIcon: <QAPointerIcon />,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/40",
    labelBg: "bg-emerald-500",
  },
  {
    id: "Configuration",
    title: "Config",
    subtitle: "Configuration",
    description: "Setup guides, notifications & permissions",
    icon: <Settings className="h-5 w-5" />,
    pointerIcon: <ConfigPointerIcon />,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/40",
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
    const params = new URLSearchParams();
    if (segmentId === selectedSegment) {
      router.push(pathname);
    } else {
      params.set("segment", segmentId);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const handleShowAll = () => {
    router.push(pathname);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={handleShowAll}
          className={cn(
            "h-7 px-3 rounded-md text-xs font-medium transition-colors cursor-pointer border",
            selectedSegment === "All"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:bg-muted text-muted-foreground"
          )}
        >
          All ({segmentCounts["All"] || 0})
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {segments.map((segment, index) => {
          const isActive = selectedSegment === segment.id;
          return (
            <motion.button
              key={segment.id}
              onClick={() => handleSegmentClick(segment.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative rounded-xl border p-5 text-left transition-all cursor-pointer overflow-hidden group",
                isActive
                  ? `${segment.borderColor} ${segment.bgColor}`
                  : "border-border hover:border-border/80 hover:bg-muted/30"
              )}
            >
              <Pointer>{segment.pointerIcon}</Pointer>

              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-lg p-2 transition-colors",
                    isActive ? segment.bgColor : "bg-muted",
                    segment.color
                  )}
                >
                  {segment.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base">{segment.title}</h3>
                    <span
                      className={cn(
                        "text-xs font-medium border rounded-md h-5 min-w-5 flex items-center justify-center px-1",
                        isActive
                          ? `${segment.borderColor} ${segment.color}`
                          : "border-border text-muted-foreground"
                      )}
                    >
                      {segmentCounts[segment.id] || 0}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {segment.description}
                  </p>
                </div>
              </div>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="segment-indicator"
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-0.5",
                      isActive ? segment.labelBg : ""
                    )}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
