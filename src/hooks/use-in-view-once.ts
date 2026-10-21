"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * "static"  – SSR / no JS / reduced motion / already on screen at mount: show final state.
 * "waiting" – below the fold at mount: hide until it scrolls in.
 * "entered" – scrolled into view: play the animation.
 * Content is never hidden before hydration, so it stays readable without JS.
 */
export type InViewState = "static" | "waiting" | "entered";

export function useInViewOnce(ref: RefObject<Element | null>, threshold = 0.2): InViewState {
  const [state, setState] = useState<InViewState>("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let first = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false;
          if (entry.isIntersecting) return observer.disconnect(); // above the fold: leave static
          setState("waiting");
          return;
        }
        if (entry.isIntersecting) {
          setState("entered");
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return state;
}
