import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { PortfolioShowcase } from "@/components/sections/portfolio-showcase";
import { Reveal } from "@/components/sections/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { ServiceCard } from "@/components/sections/service-card";
import { StatCounter } from "@/components/sections/stat-counter";
import { StepCard } from "@/components/sections/step-card";
import { serviceContent } from "@/content/services";
import { services, site } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = serviceContent[slug];
  if (!content) return {};
  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: { canonical: `/services/${slug}` },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const c = serviceContent[slug];
  const service = services.find((s) => s.slug === slug);
  if (!c || !service) notFound();

  const url = `${site.url}/services/${slug}`;

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: c.meta.description,
            serviceType: service.title,
            url,
            provider: { "@type": "Organization", name: site.name, url: site.url },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: site.url },
              { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/#services` },
              { "@type": "ListItem", position: 3, name: service.title, item: url },
            ],
          },
        ]}
      />

      {/* Hero */}
      <PageHero
        eyebrow={c.hero.eyebrow}
        icon={<service.icon className="text-brand size-3.5" aria-hidden />}
        title={c.hero.title}
        highlight={c.hero.highlight}
        description={c.hero.description}
        actions={
          <>
            <Button asChild variant="brand" size="xl">
              <Link href={`/contact?service=${slug}`}>
                Book a free audit <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              variant="brand-outline"
              size="xl"
              className="bg-black/50 backdrop-blur-md"
            >
              <Link href="#included">See what&apos;s included</Link>
            </Button>
          </>
        }
      />

      {/* Outcomes */}
      <section className="container-page pb-24 md:pb-36">
        <div className="grid gap-4 md:grid-cols-3">
          {c.outcomes.map((o, i) => (
            <Reveal key={o.title} index={i}>
              <div className="bg-card h-full rounded-2xl border p-6 sm:p-8">
                <span className="bg-brand/10 text-brand grid size-12 place-items-center rounded-xl">
                  <o.icon className="size-6" aria-hidden />
                </span>
                <h2 className="mt-6 text-xl font-semibold">{o.title}</h2>
                <p className="text-muted-foreground mt-2">{o.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {c.portfolio && <PortfolioShowcase projects={c.portfolio} />}

      {/* Deliverables */}
      <section id="included" className="container-page scroll-mt-24 pb-24 md:pb-36">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <SectionHeader
              eyebrow="What's included"
              title="What we optimize"
              description={c.deliverables.intro}
            />
            <p className="text-brand mt-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold">
              <TrendingUp className="size-4" aria-hidden /> {c.deliverables.timeline}
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {c.deliverables.items.map((d, i) => (
              <li key={d.title}>
                <Reveal index={i % 2} className="bg-card h-full rounded-2xl border p-6">
                  <Check className="text-brand size-5" aria-hidden />
                  <h3 className="mt-4 font-semibold">{d.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm">{d.description}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Framework */}
      <section className="container-page pb-24 md:pb-36">
        <SectionHeader eyebrow="How it works" title={c.framework.title} />
        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {c.framework.steps.map((step, i) => (
            <li key={step.title}>
              <Reveal index={i % 3} className="h-full">
                <StepCard step={step} number={i + 1} />
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Stats + case study */}
      <section className="border-y py-24 md:py-32">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid gap-10 text-center sm:grid-cols-3 sm:text-left">
            {c.stats.map((s) => (
              <StatCounter key={s.label} {...s} />
            ))}
          </div>
          <Reveal index={1}>
            <figure className="bg-card rounded-2xl border p-6 sm:p-8">
              <p className="text-brand text-xs font-semibold tracking-[0.12em] uppercase">
                Case study · {c.caseStudy.industry}
              </p>
              <p className="font-heading mt-4 text-2xl font-bold">{c.caseStudy.result}</p>
              <figcaption className="text-muted-foreground mt-3">{c.caseStudy.summary}</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page grid gap-12 py-24 md:py-36 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeader eyebrow="FAQ" title={`${service.title} questions, answered`} />
        <FaqAccordion items={c.faqs} />
      </section>

      <CtaBand
        title={c.cta.title}
        description={c.cta.description}
        primary={{ label: "Schedule your strategy call", href: `/contact?service=${slug}` }}
        points={c.cta.points}
      />

      {/* Cross-sell */}
      <section className="container-page pb-24 md:pb-36">
        <SectionHeader eyebrow="More services" title="Combine channels for faster growth" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services
            .filter((s) => s.slug !== slug)
            .map((s, i) => (
              <Reveal key={s.slug} index={i}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
        </div>
      </section>
    </>
  );
}
