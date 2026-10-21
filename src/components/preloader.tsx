"use client";

import { useEffect, useRef, useState } from "react";

import { LogoMark } from "@/components/layout/logo";
import { PRELOADER_KEY } from "@/lib/preloader";

const DURATION_MS = 1100;

/**
 * First-visit intro modelled on rankesprit.com: logo in a ring, a percentage counter and a
 * progress line, then a fade out. CSS hides it under reduced motion, on repeat visits in the
 * session, and after 2.5 s even if JS never runs (see .preloader in globals.css).
 */
export function Preloader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || getComputedStyle(ref.current).display === "none") return setGone(true);
    try {
      sessionStorage.setItem(PRELOADER_KEY, "1");
    } catch {}
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION_MS, 1);
      setPct(Math.round(100 * (1 - (1 - t) ** 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
      else {
        setDone(true);
        document.documentElement.classList.remove("preloading"); // start the hero entrances
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (gone) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="preloader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050816] transition-[opacity,scale] duration-500 ease-[cubic-bezier(.16,1,.3,1)] data-[done=true]:pointer-events-none data-[done=true]:scale-[1.02] data-[done=true]:opacity-0"
      data-done={done}
      onTransitionEnd={() => done && setGone(true)}
    >
      <div className="grid size-32 place-items-center rounded-full border-2 border-white">
        <LogoMark className="h-8 w-auto" />
      </div>
      <div className="absolute inset-x-8 bottom-12 sm:inset-x-12">
        <p className="font-heading text-right text-6xl font-extralight text-white/80 tabular-nums sm:text-8xl">
          {pct}%
        </p>
        <div className="mt-4 h-px bg-white/15">
          <div className="h-full bg-white" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
