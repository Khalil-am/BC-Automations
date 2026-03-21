"use client";

import { IconCloud } from "@/components/ui/icon-cloud";

const images = [
  "https://cdn.simpleicons.org/microsoftword",
  "https://cdn.simpleicons.org/microsoftpowerpoint",
  "https://cdn.simpleicons.org/microsoftexcel",
  "https://cdn.simpleicons.org/microsoftproject",
  "https://cdn.simpleicons.org/n8n",
  "https://cdn.simpleicons.org/claude",
];

export function CornerCloud() {
  return (
    <div
      className="fixed bottom-2 right-2 z-10 w-[160px] h-[160px] md:w-[200px] md:h-[200px] opacity-70 hover:opacity-100 transition-opacity"
    >
      <div className="w-[400px] h-[400px] origin-top-left scale-[0.4] md:scale-[0.5]">
        <IconCloud images={images} />
      </div>
    </div>
  );
}
