"use client";

import { useRef } from "react";

import { useInViewOnce } from "@/hooks/use-in-view-once";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"div"> & {
  /** Stagger index; each step adds 60 ms (Design Brief §6). */
  index?: number;
};

export function Reveal({ index = 0, className, style, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useInViewOnce(ref, 0.15);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,translate] duration-400 ease-out",
        state === "waiting" && "translate-y-4 opacity-0",
        className,
      )}
      style={{ transitionDelay: state === "entered" ? `${index * 60}ms` : undefined, ...style }}
      {...props}
    />
  );
}
