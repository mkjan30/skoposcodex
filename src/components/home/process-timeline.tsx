"use client";

import { useRef } from "react";

import { useInViewOnce } from "@/hooks/use-in-view-once";
import { cn } from "@/lib/utils";

export type TimelineStep = { icon: React.ReactNode; title: string; description: string };

function StepRow({ step, index, last }: { step: TimelineStep; index: number; last: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  // "static" (no JS, reduced motion, already on screen) and "entered" both show the lit state.
  const lit = useInViewOnce(ref, 0.6) !== "waiting";

  return (
    <li ref={ref} className="flex gap-6">
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-xl border transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] [&_svg]:size-5",
            lit
              ? "from-brand to-brand-strong text-primary-foreground scale-100 border-transparent bg-gradient-to-br"
              : "bg-card text-muted-foreground scale-90 border-white/10",
          )}
        >
          {step.icon}
        </span>
        {!last && (
          <span
            aria-hidden
            className={cn(
              "from-brand/40 mt-3 min-h-16 w-px flex-1 origin-top bg-gradient-to-b to-transparent transition-transform delay-200 duration-700",
              lit ? "scale-y-100" : "scale-y-0",
            )}
          />
        )}
      </div>
      <div className="pb-12">
        <p className="text-brand text-xs font-semibold tracking-[0.12em] uppercase">
          Step {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
        <p className="text-muted-foreground mt-2 max-w-md">{step.description}</p>
      </div>
    </li>
  );
}

/** Vertical process timeline; each step lights up as it scrolls into view. */
export function ProcessTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol>
      {steps.map((s, i) => (
        <StepRow key={s.title} step={s} index={i} last={i === steps.length - 1} />
      ))}
    </ol>
  );
}
