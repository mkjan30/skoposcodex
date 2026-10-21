"use client";

import { useRef } from "react";

import { useScrollProgress } from "@/hooks/use-scroll-progress";

const ramp = (a: number, b: number) => `clamp(0, (var(--p) - ${a}) / ${b - a}, 1)`;

type Props = { lead: string; big: string; tail: string };

/**
 * Pinned light scene: the lead line brightens, the big line un-blurs and scales up,
 * then the tail line fades in. Final state is the stylesheet default (--p: 1).
 */
export function NoGuessworkScene({ lead, big, tail }: Props) {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref);

  return (
    <section ref={ref} className="bg-surface-light relative h-[240vh] [--p:1] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-4 text-center motion-reduce:relative motion-reduce:py-32">
        <p
          className="font-heading text-[clamp(1.25rem,2.6vw,1.9rem)] text-[#1f2937]"
          style={{ opacity: `calc(0.7 + 0.3 * ${ramp(0, 0.25)})` }} // ≥0.7 keeps 4.5:1 contrast
        >
          {lead}
        </p>
        {/* Logo deep blue → brand-strong: cyan would fail contrast on the light background. */}
        <p
          className="font-heading my-4 bg-gradient-to-r from-[#0a6cff] to-[#2b8cff] bg-clip-text pb-2 text-[clamp(3rem,10vw,7.5rem)] leading-[1.05] font-medium tracking-tight text-transparent"
          style={{
            opacity: ramp(0.25, 0.5),
            filter: `blur(calc(14px * (1 - ${ramp(0.25, 0.6)})))`,
            transform: `translateY(calc(50px * (1 - ${ramp(0.25, 0.6)}))) scale(calc(0.88 + 0.12 * ${ramp(0.25, 0.6)}))`,
          }}
        >
          {big}
        </p>
        <p
          className="text-[clamp(1.1rem,2.2vw,1.6rem)] text-[#52525b]"
          style={{ opacity: ramp(0.6, 0.8) }}
        >
          {tail}
        </p>
      </div>
    </section>
  );
}
