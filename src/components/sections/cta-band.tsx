import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

type Action = { label: string; href: string };

type Props = {
  title: React.ReactNode;
  description?: React.ReactNode;
  primary: Action;
  secondary?: Action;
  points?: string[];
};

export function CtaBand({ title, description, primary, secondary, points }: Props) {
  return (
    <section className="container-page py-20 sm:py-28">
      <div className="from-brand/60 to-brand-strong/10 rounded-3xl bg-gradient-to-br via-white/10 p-px">
        <div className="bg-card relative overflow-hidden rounded-[calc(1.5rem-1px)] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="bg-brand/20 pointer-events-none absolute -top-32 left-1/2 size-96 -translate-x-1/2 rounded-full blur-3xl"
          />
          <h2 className="relative mx-auto max-w-2xl text-3xl leading-tight font-bold sm:text-5xl">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground relative mx-auto mt-5 max-w-xl text-base sm:text-lg">
              {description}
            </p>
          )}
          <div className="relative mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild variant="brand" size="xl">
              <Link href={primary.href}>
                {primary.label} <ArrowRight />
              </Link>
            </Button>
            {secondary && (
              <Button asChild variant="brand-outline" size="xl">
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            )}
          </div>
          {points && (
            <ul className="text-muted-foreground relative mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Check className="text-brand size-4" aria-hidden /> {p}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
