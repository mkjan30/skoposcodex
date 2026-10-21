import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { whatYouGet } from "@/content/why-us";

export function WhatYouGet({ children }: { children?: React.ReactNode }) {
  return (
    <div className="from-brand/10 bg-card rounded-3xl border bg-gradient-to-br to-transparent p-6 sm:p-10">
      <p className="text-brand text-xs font-semibold tracking-[0.12em] uppercase">What you get</p>
      <h3 className="mt-3 text-2xl font-bold sm:text-3xl">Everything you need in one place</h3>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {whatYouGet.map((item) => (
          <li key={item} className="flex gap-3">
            <Check className="text-brand mt-0.5 size-5 shrink-0" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
      {children}
      <Button asChild variant="brand" size="xl" className="mt-10">
        <Link href="/contact">
          Start growing today <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}
