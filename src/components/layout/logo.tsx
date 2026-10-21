import Link from "next/link";
import { Crosshair } from "lucide-react";

import { site } from "@/content/site";

// shortcut: text wordmark until the real SVG logo is supplied, then swap in <Image>.
export function Logo() {
  return (
    <Link
      href="/"
      className="font-heading flex items-center gap-2 text-lg font-bold tracking-tight"
    >
      <span className="from-brand to-brand-strong text-primary-foreground grid size-8 place-items-center rounded-lg bg-gradient-to-br">
        <Crosshair className="size-4" aria-hidden />
      </span>
      {site.name}
    </Link>
  );
}
