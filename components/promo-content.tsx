/* eslint-disable @next/next/no-img-element */
import React from "react";
import { cn } from "@/lib/utils";

interface PromoContentProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

export function PromoContent({
  variant = "desktop",
  className,
}: PromoContentProps) {
  if (variant === "mobile") {
    return (
      <div className={cn("border-t border-border bg-muted/20 p-3", className)}>
        <a
          href="https://consultantos.click/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary">OS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground/90 truncate">
              Consultant OS
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Coming soon
            </p>
          </div>
          <span className="text-xs text-primary hover:text-primary/80 font-medium">
            Preview
          </span>
        </a>
      </div>
    );
  }

  return (
    <a
      href="https://consultantos.click/"
      target="_blank"
      rel="noopener noreferrer"
      className={cn("block border border-border rounded-lg p-4 bg-card hover:border-primary/40 transition-colors", className)}
    >
      <div className="flex flex-col gap-4">
        <div className="w-full rounded-md overflow-hidden border border-border">
          <img
            src="/consultant-os.png"
            alt="Consultant OS"
            className="w-full h-auto"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tighter">
              Consultant OS
            </h3>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            The Operating System for Modern Consultants. Automate documentation, tasks, reports, decisions, and insights.
          </p>
        </div>
      </div>
    </a>
  );
}
