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

const segments: {
  id: Segment;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  pointerClass: string;
  labelBg: string;
}[] = [
  {
    id: "BC",
    title: "BC",
    subtitle: "Business Consulting",
    description: "Dashboards, migrations, reports & data workflows",
    icon: <Briefcase className="h-5 w-5" />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/40",
    pointerClass: "text-blue-500 stroke-blue-500",
    labelBg: "bg-blue-500",
  },
  {
    id: "QA",
    title: "QA",
    subtitle: "Quality Assurance",
    description: "Test cases, user manuals & documentation",
    icon: <ClipboardCheck className="h-5 w-5" />,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/40",
    pointerClass: "text-emerald-500 stroke-emerald-500",
    labelBg: "bg-emerald-500",
  },
  {
    id: "Configuration",
    title: "Config",
    subtitle: "Configuration",
    description: "Setup guides, notifications & permissions",
    icon: <Settings className="h-5 w-5" />,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/40",
    pointerClass: "text-amber-500 stroke-amber-500",
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
      // Toggle off — show all
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
              <Pointer className={segment.pointerClass} name={segment.subtitle} />

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
