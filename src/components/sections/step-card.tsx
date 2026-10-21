import { CheckCircle2, Clock } from "lucide-react";

export type Step = {
  title: string;
  tagline?: string;
  description: string;
  deliverables?: string[];
  timeline?: string;
};

export function StepCard({ step, number }: { step: Step; number: number }) {
  return (
    <article className="bg-card relative h-full rounded-2xl border p-6 sm:p-8">
      <span
        aria-hidden
        className="font-heading text-6xl leading-none font-bold text-transparent [-webkit-text-stroke:1px_var(--brand)]"
      >
        {String(number).padStart(2, "0")}
      </span>
      <h3 className="mt-6 text-2xl font-semibold">
        <span className="sr-only">Step {number}: </span>
        {step.title}
      </h3>
      {step.tagline && <p className="text-brand-soft mt-1 font-medium">{step.tagline}</p>}
      <p className="text-muted-foreground mt-4">{step.description}</p>
      {step.deliverables && (
        <ul className="mt-6 space-y-2 text-sm">
          {step.deliverables.map((d) => (
            <li key={d} className="flex gap-2">
              <CheckCircle2 className="text-brand mt-0.5 size-4 shrink-0" aria-hidden />
              {d}
            </li>
          ))}
        </ul>
      )}
      {step.timeline && (
        <p className="text-muted-foreground mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
          <Clock className="size-3.5" aria-hidden /> {step.timeline}
        </p>
      )}
    </article>
  );
}
