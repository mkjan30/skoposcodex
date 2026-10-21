import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Service } from "@/content/site";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group bg-card hover:border-brand/50 focus-visible:ring-ring/50 relative flex h-full flex-col rounded-2xl border p-6 transition-colors outline-none focus-visible:ring-3 sm:p-8"
    >
      <span className="bg-brand/10 text-brand grid size-12 place-items-center rounded-xl">
        <Icon className="size-6" aria-hidden />
      </span>
      <h3 className="mt-6 text-xl font-semibold">{service.title}</h3>
      <p className="text-muted-foreground mt-2 flex-1">{service.summary}</p>
      <span className="text-brand mt-6 inline-flex items-center gap-1 text-sm font-semibold">
        Learn more
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}
