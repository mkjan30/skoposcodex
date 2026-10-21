import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Service } from "@/content/site";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group react-card react-lift bg-card focus-visible:ring-ring/50 flex h-full flex-col rounded-[20px] border border-white/[0.06] p-7 shadow-[0_4px_20px_rgb(0_0_0/0.25)] outline-none focus-visible:ring-3"
    >
      <span className="mb-6 flex items-start justify-between gap-4">
        <span className="bg-brand/10 text-brand grid size-11 place-items-center rounded-xl">
          <Icon className="size-5" aria-hidden />
        </span>
        <span className="bg-brand/10 text-brand rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase">
          {service.tag}
        </span>
      </span>
      <h3 className="text-xl font-bold tracking-tight">{service.title}</h3>
      <p className="text-muted-foreground mt-3 flex-1 text-[15px] leading-relaxed">
        {service.summary}
      </p>
      <span className="text-muted-foreground group-hover:text-brand mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors">
        Learn more
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}
