import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

// Placeholder hero; the full home page is built in Phase 3.
export default function HomePage() {
  return (
    <section className="container-page py-24 sm:py-32">
      <p className="text-brand text-xs font-semibold tracking-[0.12em] uppercase">
        Digital growth agency
      </p>
      <h1 className="mt-4 max-w-3xl text-5xl leading-[1.05] font-bold sm:text-7xl">
        Where strategy meets <span className="text-gradient">digital growth.</span>
      </h1>
      <p className="text-muted-foreground mt-6 max-w-xl text-lg">
        We build marketing systems that drive traffic, leads and revenue.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild variant="brand" size="xl">
          <Link href="/contact">
            Book a strategy call <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="brand-outline" size="xl">
          <Link href="/#services">Explore services</Link>
        </Button>
      </div>
    </section>
  );
}
