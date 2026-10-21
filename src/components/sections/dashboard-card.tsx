import { TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

type Kpi = { label: string; value: string; delta?: string };
type KeywordRow = { keyword: string; rank: number; change: number };

type Props = {
  title?: string;
  period?: string;
  kpis: Kpi[];
  keywords: KeywordRow[];
};

// Decorative "product shot" of a growth dashboard; values come from content, not live data.
export function DashboardCard({
  title = "Growth overview",
  period = "Last 12 months",
  kpis,
  keywords,
}: Props) {
  return (
    <div className="bg-card relative rounded-3xl border p-5 shadow-[0_0_80px_-20px_var(--brand)] sm:p-6">
      <div className="flex items-center justify-between">
        <p className="font-heading font-semibold">{title}</p>
        <p className="text-muted-foreground rounded-full border px-3 py-1 text-xs">{period}</p>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        {kpis.map((k, i) => (
          <div
            key={k.label}
            className={cn("bg-background/60 rounded-xl border p-4", i > 1 && "max-sm:hidden")}
          >
            <dt className="text-muted-foreground text-xs">{k.label}</dt>
            <dd className="font-heading mt-1 text-2xl font-bold tabular-nums">{k.value}</dd>
            {k.delta && (
              <dd className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-400">
                <TrendingUp className="size-3" aria-hidden /> {k.delta}
              </dd>
            )}
          </div>
        ))}
      </dl>

      <svg viewBox="0 0 300 60" className="mt-4 h-16 w-full" aria-hidden preserveAspectRatio="none">
        <defs>
          <linearGradient id="dash-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 52 L30 48 L60 50 L90 40 L120 42 L150 30 L180 32 L210 22 L240 18 L270 10 L300 4 L300 60 L0 60 Z"
          fill="url(#dash-fill)"
        />
        <path
          d="M0 52 L30 48 L60 50 L90 40 L120 42 L150 30 L180 32 L210 22 L240 18 L270 10 L300 4"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <table className="mt-4 w-full text-sm">
        <caption className="sr-only">Keyword rankings</caption>
        <thead>
          <tr className="text-muted-foreground text-left text-xs">
            <th className="pb-2 font-medium">Keyword</th>
            <th className="pb-2 text-right font-medium">Rank</th>
            <th className="pb-2 text-right font-medium">Change</th>
          </tr>
        </thead>
        <tbody>
          {keywords.map((k, i) => (
            <tr key={k.keyword} className={cn("border-t", i > 1 && "max-sm:hidden")}>
              <td className="py-2.5">{k.keyword}</td>
              <td className="py-2.5 text-right font-semibold tabular-nums">#{k.rank}</td>
              <td className="py-2.5 text-right text-emerald-400 tabular-nums">
                {k.change > 0 ? `+${k.change}` : k.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
