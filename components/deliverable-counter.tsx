"use client";

import { useEffect, useState, useRef } from "react";

function useAnimatedCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    if (target <= 0) return;

    const start = prevTarget.current;
    prevTarget.current = target;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}

export function DeliverableCounter() {
  const [target, setTarget] = useState(0);
  const [loading, setLoading] = useState(true);
  const animatedCount = useAnimatedCounter(target, 1800);

  useEffect(() => {
    fetch("/api/deliverables")
      .then((res) => res.json())
      .then((data) => {
        setTarget(data.count);
        setLoading(false);
      })
      .catch(() => {
        setTarget(37);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex items-center gap-4 md:gap-6">
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <span
            className={`text-5xl md:text-7xl font-bold tracking-tighter tabular-nums transition-opacity duration-500 ${
              loading ? "opacity-0" : "opacity-100"
            }`}
          >
            {animatedCount}
          </span>
          {loading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="h-6 w-6 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm md:text-base font-medium tracking-tight">
          Deliverables Automated
        </span>
        <span className="text-xs md:text-sm text-muted-foreground">
          Completed using our automations
        </span>
      </div>
    </div>
  );
}
