import { Reveal } from "@/components/sections/reveal";
import type { Pillar } from "@/content/why-us";
import { cn } from "@/lib/utils";

export function PillarGrid({ pillars, className }: { pillars: Pillar[]; className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {pillars.map((p, i) => (
        <Reveal key={p.title} index={i}>
          <div className="bg-card h-full rounded-2xl border p-6">
            <span className="bg-brand/10 text-brand grid size-11 place-items-center rounded-xl">
              <p.icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
            <p className="text-muted-foreground mt-2">{p.description}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
