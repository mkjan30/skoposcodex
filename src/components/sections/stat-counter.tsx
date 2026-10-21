"use client";

import { useEffect, useRef, useState } from "react";

import { useInViewOnce } from "@/hooks/use-in-view-once";
import { formatStat, type Stat } from "@/lib/format-stat";
import { cn } from "@/lib/utils";

type Props = Stat & { label: string; className?: string };

const DURATION_MS = 1200;

// Server HTML always carries the final value (fixes the reference site's "0%" bug); counting is an enhancement.
export function StatCounter({ label, className, ...stat }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useInViewOnce(ref, 0.4);
  const [shown, setShown] = useState(stat.value);

  useEffect(() => {
    if (state === "waiting") setShown(0);
    if (state !== "entered") return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION_MS, 1);
      setShown(stat.value * (1 - (1 - t) ** 3)); // ease-out cubic
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [state, stat.value]);

  const final = formatStat(stat);

  return (
    <div ref={ref} className={cn("space-y-2", className)}>
      <p className="font-heading text-gradient text-5xl font-bold tabular-nums sm:text-6xl">
        <span aria-hidden>{formatStat({ ...stat, value: shown })}</span>
        <span className="sr-only">{final}</span>
      </p>
      <p className="text-muted-foreground text-sm font-medium">{label}</p>
    </div>
  );
}
