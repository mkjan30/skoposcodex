import { useId } from "react";
import Link from "next/link";
import { Montserrat } from "next/font/google";

import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "800"], display: "swap" });

/** The mark from the brand logo (docs/brand/skopos-codex-logo-animated.html), cropped to its shapes. */
export function LogoMark({ className }: { className?: string }) {
  const gradientId = useId(); // header and footer both render the mark; ids must not collide
  return (
    <svg viewBox="470 135 596 340" className={className} aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#19e3ff" />
          <stop offset="1" stopColor="#0a6cff" />
        </linearGradient>
      </defs>
      <g fill={`url(#${gradientId})`}>
        <polygon points="700,310 740,350 545,475 470,475" />
        <polygon points="745,352 791,352 870,475 666,475" />
        <polygon points="836,310 796,350 991,475 1066,475" />
        <polygon points="745,200 791,200 791,345 745,345" />
        <polygon points="768,135 905,290 845,290 768,213 691,290 631,290" />
      </g>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className={cn("flex items-center gap-2.5 text-white", className)}
    >
      <LogoMark className="h-7 w-auto" />
      <span className={cn(montserrat.className, "flex flex-col leading-none")} aria-hidden>
        <span className="text-[17px] font-extrabold tracking-[0.02em]">SKOPOS</span>
        <span className="mt-0.5 text-[11px] font-light tracking-[0.42em]">CODEX</span>
      </span>
    </Link>
  );
}
