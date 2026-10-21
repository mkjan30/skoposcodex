import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { companyLinks, legalLinks, services, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="bg-card border-t">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
        <div className="space-y-4">
          <Logo />
          <p className="text-muted-foreground max-w-xs text-sm">{site.description}</p>
          {site.socials.length > 0 && (
            <ul className="flex gap-3">
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <FooterColumn
          title="Services"
          links={services.map((s) => ({ label: s.title, href: `/services/${s.slug}` }))}
        />
        <FooterColumn title="Company" links={companyLinks} />

        <div className="space-y-4">
          <p className="font-heading text-lg font-semibold">Ready to scale your business?</p>
          <p className="text-muted-foreground text-sm">
            Book a free 30-minute strategy call. No pressure, no lock-in.
          </p>
          <Button asChild variant="brand" size="xl">
            <Link href="/contact">
              Book a Free Call <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>

      <div className="border-t">
        <div className="container-page text-muted-foreground flex flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-foreground inline-block py-1.5">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-brand mb-4 text-xs font-semibold tracking-[0.12em] uppercase">{title}</p>
      <ul className="space-y-1 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-muted-foreground hover:text-foreground inline-block py-1.5"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
