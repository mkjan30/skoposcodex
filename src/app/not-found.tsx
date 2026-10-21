import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

// Root-level so every unknown URL gets it; renders its own header/footer because it sits outside (marketing).
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="container-page py-24 text-center sm:py-32">
        <p className="font-heading text-gradient text-7xl font-bold sm:text-9xl">404</p>
        <h1 className="mt-6 text-3xl font-bold sm:text-5xl">This page went off the map.</h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild variant="brand" size="xl">
            <Link href="/">
              Back to home <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="brand-outline" size="xl">
            <Link href="/#services">Our services</Link>
          </Button>
          <Button asChild variant="brand-outline" size="xl">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
