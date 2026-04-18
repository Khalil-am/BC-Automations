"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { cn } from "@/lib/utils";

interface PointerProps {
  children?: React.ReactNode;
  className?: string;
  name?: string;
}

export function Pointer({ children, className, name }: PointerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInside, setIsInside] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;

    parent.style.position = "relative";

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    };

    const handleMouseEnter = () => setIsInside(true);
    const handleMouseLeave = () => setIsInside(false);

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [x, y]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-50">
      <AnimatePresence>
        {isInside && (
          <motion.div
            style={{
              x: springX,
              y: springY,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-0 left-0"
          >
            {children || (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="1"
                viewBox="0 0 16 16"
                className={cn(
                  "h-6 w-6 -translate-x-[12px] -translate-y-[10px] -rotate-[70deg] transform stroke-foreground text-foreground",
                  className
                )}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
              </svg>
            )}
            {name && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="ml-4 mt-1 whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground"
              >
                {name}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
