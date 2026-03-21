"use client";

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export function ClaudeCTA() {
  return (
    <div className="flex flex-col items-center gap-3 my-10 py-8 border-t border-border not-prose">
      <p className="text-sm text-muted-foreground text-center">
        Try this automation now with Claude AI
      </p>
      <a href="https://claude.ai/new" target="_blank" rel="noopener noreferrer">
        <InteractiveHoverButton className="text-sm">
          Open Claude Chat
        </InteractiveHoverButton>
      </a>
    </div>
  );
}
