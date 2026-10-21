import { Check, X } from "lucide-react";

type Props = {
  themLabel: string;
  usLabel: string;
  rows: { them: string; us: string }[];
};

// Two lists rather than a <table>: rows are paired statements, and lists stack cleanly on mobile.
export function ComparisonTable({ themLabel, usLabel, rows }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="bg-card/50 rounded-2xl border p-6 sm:p-8">
        <h3 className="text-muted-foreground text-lg font-semibold">{themLabel}</h3>
        <ul className="mt-6 space-y-4">
          {rows.map((r) => (
            <li key={r.them} className="text-muted-foreground flex gap-3">
              <X className="mt-0.5 size-5 shrink-0 text-zinc-500" aria-label="No" />
              {r.them}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-brand/40 bg-card from-brand/10 rounded-2xl border bg-gradient-to-b to-transparent p-6 sm:p-8">
        <h3 className="text-lg font-semibold">{usLabel}</h3>
        <ul className="mt-6 space-y-4">
          {rows.map((r) => (
            <li key={r.us} className="flex gap-3">
              <Check className="text-brand mt-0.5 size-5 shrink-0" aria-label="Yes" />
              {r.us}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
