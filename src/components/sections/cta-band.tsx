import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/layout/logo";
import { Reveal } from "@/components/sections/reveal";

type Action = { label: string; href: string };

type Props = {
  title: React.ReactNode;
  description?: React.ReactNode;
  primary: Action;
  secondary?: Action;
  points?: string[];
};

// Full-width closing CTA over the breathing hero glow, logo tile on top.
export function CtaBand({ title, description, primary, secondary, points }: Props) {
  return (
    <section className="relative overflow-hidden py-32 md:py-44">
      <div className="hero-glow" aria-hidden />
      <Reveal className="container-page relative z-10 max-w-4xl text-center">
        <span className="mx-auto grid size-20 place-items-center rounded-[22px] bg-white shadow-[0_0_60px_rgb(25_227_255/0.25)]">
          <LogoMark className="h-7 w-auto" />
        </span>
        <h2 className="mt-8 text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.02] font-semibold tracking-tight text-white">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-base md:text-lg">
            {description}
          </p>
        )}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
          <ul className="text-muted-foreground mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Check className="text-brand size-4" aria-hidden /> {p}
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </section>
  );
}
