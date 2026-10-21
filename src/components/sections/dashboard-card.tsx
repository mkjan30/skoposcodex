import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Kpi = { icon?: LucideIcon; label: string; value: string; delta?: string };
type KeywordRow = { keyword: string; rank: number; change: number };

type Props = {
  title?: string;
  period?: string;
  kpis: Kpi[];
  keywords: KeywordRow[];
  className?: string;
};

// Decorative "product shot": growth overview (KPIs + chart) beside keyword rankings.
export function DashboardCard({
  title = "Growth overview",
  period = "Last 12 months",
  kpis,
  keywords,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "bg-card/90 grid overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)] backdrop-blur-xl lg:grid-cols-[1.6fr_1fr]",
        className,
      )}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-muted-foreground rounded-md border px-2.5 py-1 text-xs">{period}</p>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="bg-background/60 flex flex-col rounded-xl border p-4">
              {k.icon && <k.icon className="text-brand size-4" aria-hidden />}
              {/* dt first for valid markup; order-* puts the value above the label visually. */}
              <dt className="text-muted-foreground order-2 mt-1 text-xs">{k.label}</dt>
              <dd className="font-heading order-1 mt-3 text-2xl font-bold tabular-nums">
                {k.value}
              </dd>
            </div>
          ))}
        </dl>

        <svg
          viewBox="0 0 300 70"
          className="mt-5 h-24 w-full"
          aria-hidden
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="dash-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 64 C40 60 60 58 90 52 S150 40 180 32 S240 18 300 8 L300 70 L0 70 Z"
            fill="url(#dash-fill)"
          />
          <path
            d="M0 64 C40 60 60 58 90 52 S150 40 180 32 S240 18 300 8"
            fill="none"
            stroke="var(--brand)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="border-t border-white/10 p-5 sm:p-6 lg:border-t-0 lg:border-l">
        <p className="text-sm font-semibold">Keyword rankings</p>
        <ul className="mt-5 space-y-3">
          {keywords.map((k) => (
            <li
              key={k.keyword}
              className="bg-background/60 flex items-center justify-between rounded-xl border px-4 py-3 text-sm"
            >
              <span>{k.keyword}</span>
              <span className="flex items-center gap-3 tabular-nums">
                <span className="text-xs text-emerald-400">
                  {k.change > 0 ? `+${k.change}` : k.change}
                </span>
                <span className="font-bold">#{k.rank}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
