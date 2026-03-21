"use client";

import { IconCloud } from "@/components/ui/icon-cloud";

const images = [
  "https://img.icons8.com/color/96/microsoft-word-2019.png",
  "https://img.icons8.com/color/96/microsoft-powerpoint-2019.png",
  "https://img.icons8.com/color/96/microsoft-excel-2019.png",
  "https://img.icons8.com/color/96/ms-project.png",
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
