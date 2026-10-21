"use client";

import { useRef } from "react";

import { useInViewOnce } from "@/hooks/use-in-view-once";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"div"> & {
  /** Stagger index; each step adds 80 ms. */
  index?: number;
};

// Scroll reveal: rise 30px and fade in with the reference site's "line" easing.
export function Reveal({ index = 0, className, style, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useInViewOnce(ref, 0.15);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,translate] duration-700 ease-[cubic-bezier(.16,1,.3,1)]",
        state === "waiting" && "translate-y-[30px] opacity-0",
        className,
      )}
      style={{ transitionDelay: state === "entered" ? `${index * 80}ms` : undefined, ...style }}
      {...props}
    />
  );
}
