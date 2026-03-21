"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  fileName: string;
  label: string;
  description?: string;
}

export function DownloadButton({
  fileName,
  label,
  description,
}: DownloadButtonProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 not-prose">
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground truncate">
            {description}
          </p>
        )}
      </div>
      <Button variant="outline" size="sm" asChild className="flex-shrink-0">
        <a href={`/downloads/${fileName}`} download>
          <Download className="w-4 h-4 mr-2" />
          Download
        </a>
      </Button>
    </div>
  );
}

interface DownloadSectionProps {
  children: React.ReactNode;
}

export function DownloadSection({ children }: DownloadSectionProps) {
  return (
    <div className="flex flex-col gap-3 my-6 not-prose">
      <h3 className="text-lg font-semibold tracking-tight">
        Downloadable Templates
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
