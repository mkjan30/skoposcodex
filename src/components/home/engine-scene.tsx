"use client";

import { useRef } from "react";

import { LogoMark } from "@/components/layout/logo";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

// 0→1 ramp of --p between a and b, as a CSS calc expression.
const ramp = (a: number, b: number) => `clamp(0, (var(--p) - ${a}) / ${b - a}, 1)`;

const DASHES = [0, 1, 2, 3, 4, 5];

/**
 * Pinned scroll scene: a ring grows, the logo tile scales and turns, a triangle swings in,
 * a trail of dashes runs into the tile, and three phrases take turns. All motion is CSS
 * calc() on --p, written by useScrollProgress.
 */
export function EngineScene({ phrases }: { phrases: string[] }) {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref);
  const slot = 0.6 / phrases.length; // phrases share p 0.35–0.95

  return (
    <section
      ref={ref}
      className="relative h-[320vh] bg-[#050816] [--p:1] motion-reduce:h-auto"
      aria-label="How we work"
    >
      <p className="sr-only">{phrases.join(" ")}</p>
      <div
        className="sticky top-0 h-screen overflow-hidden motion-reduce:relative motion-reduce:h-[100svh]"
        aria-hidden
      >
        {/* Ring */}
        <div
          className="absolute top-1/2 left-1/2 -mt-[45vmin] -ml-[45vmin] size-[90vmin] rounded-full border border-[#2b8cff]/40 bg-[radial-gradient(circle_at_50%_40%,#0b2a66_0%,#071331_55%,#050816_100%)] shadow-[0_0_80px_-10px_rgb(25_227_255/0.35)]"
          style={{
            opacity: `calc(0.2 + 0.8 * ${ramp(0, 0.35)})`,
            transform: `scale(calc(0.75 + 0.4 * ${ramp(0, 0.6)}))`,
          }}
        />

        {/* Dash trail running toward the tile (dimmed and smaller on phones so it doesn't cover the phrase) */}
        <div className="absolute inset-0 max-sm:scale-75 max-sm:opacity-40">
          {DASHES.map((i) => {
            const start = 0.12 + i * 0.05;
            return (
              <div
                key={i}
                className="from-brand to-brand-strong absolute top-1/2 left-1/2 h-5 rounded-sm bg-gradient-to-r"
                style={{
                  width: 70 - i * 6,
                  opacity: `calc(${ramp(start, start + 0.08)} * (1 - ${ramp(0.62, 0.75)}))`,
                  transform: `translate(calc(${-62 + i * 9}vw * (1 - 0.55 * ${ramp(0.2, 0.7)})), calc(${56 - i * 7}vh * (1 - 0.55 * ${ramp(0.2, 0.7)}))) rotate(-28deg) skewX(-35deg)`,
                }}
              />
            );
          })}
        </div>

        {/* Triangle */}
        <div
          className="absolute top-1/2 left-1/2 size-40 bg-gradient-to-br from-[#2b8cff] to-[#0a6cff] [clip-path:polygon(0_0,100%_50%,0_100%)]"
          style={{
            opacity: ramp(0.05, 0.2),
            transform: `translate(calc(30vw - 16vw * ${ramp(0.15, 0.85)}), calc(-42vh + 18vh * ${ramp(0.15, 0.85)})) rotate(calc(20deg + 140deg * ${ramp(0.1, 0.95)}))`,
          }}
        />

        {/* Logo tile */}
        <div
          className="bg-card absolute top-1/2 left-1/2 -mt-[72px] -ml-[72px] grid size-36 place-items-center rounded-[32px] border border-white/15 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)]"
          style={{
            transform: `translateY(calc(-8vh * ${ramp(0.4, 0.9)})) scale(calc(0.6 + 0.55 * ${ramp(0.1, 0.7)})) rotate(calc(-10deg + 14deg * ${ramp(0.1, 0.9)}))`,
          }}
        >
          <LogoMark className="h-12 w-auto" />
        </div>

        {/* Phrases, one at a time */}
        {phrases.map((text, i) => {
          const a = 0.35 + i * slot;
          const b = a + slot;
          const last = i === phrases.length - 1;
          // The last phrase stays (it is the final state for reduced motion / no JS).
          const visible = last
            ? ramp(a, a + 0.05)
            : `${ramp(a, a + 0.05)} * (1 - ${ramp(b - 0.05, b)})`;
          return (
            <p
              key={text}
              className="font-heading absolute inset-x-0 top-[68%] px-4 text-center text-[clamp(2rem,6vw,4.5rem)] font-semibold tracking-tight text-white"
              style={{
                opacity: `calc(${visible})`,
                transform: `translateY(calc(30px * (1 - ${ramp(a, a + 0.06)}) - ${last ? 0 : 30}px * ${ramp(b - 0.05, b)}))`,
              }}
            >
              {text}
            </p>
          );
        })}
      </div>
    </section>
  );
}
