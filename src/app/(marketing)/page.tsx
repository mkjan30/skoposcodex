import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/sections/cta-band";
import { DashboardCard } from "@/components/sections/dashboard-card";
import { PillarGrid } from "@/components/sections/pillar-grid";
import { Reveal } from "@/components/sections/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { ServiceCard } from "@/components/sections/service-card";
import { StatCounter } from "@/components/sections/stat-counter";
import { Ticker } from "@/components/sections/ticker";
import { WhatYouGet } from "@/components/sections/what-you-get";
import { home } from "@/content/home";
import { processSteps, retentionStat } from "@/content/process";
import { services } from "@/content/site";
import { pillars, resultStats } from "@/content/why-us";

export const metadata: Metadata = {
  title: { absolute: `${home.meta.title} | Skopos Codex` },
  description: home.meta.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] [background-size:56px_56px] opacity-60"
        />
        <div
          aria-hidden
          className="bg-brand-strong/25 pointer-events-none absolute -top-40 -right-40 size-[36rem] rounded-full blur-3xl"
        />
        <div className="container-page relative grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Link
              href="/process"
              className="bg-card/80 text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors"
            >
              <Sparkles className="text-brand size-4" aria-hidden />
              {home.hero.badge}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
            <h1 className="mt-6 text-5xl leading-[1.05] font-bold sm:text-7xl">
              {home.hero.title} <span className="text-gradient">{home.hero.highlight}</span>
            </h1>
            <p className="text-muted-foreground mt-6 max-w-xl text-lg">{home.hero.description}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild variant="brand" size="xl">
                <Link href="/contact">
                  Book a strategy call <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="brand-outline" size="xl">
                <Link href="#services">Explore services</Link>
              </Button>
            </div>
          </div>
          <DashboardCard kpis={home.dashboard.kpis} keywords={home.dashboard.keywords} />
        </div>
      </section>

      {/* Statement */}
      <section className="container-page py-20 text-center sm:py-28">
        {home.statement.lines.map((line) => (
          <p
            key={line}
            className="font-heading text-muted-foreground text-2xl font-semibold sm:text-4xl"
          >
            {line}
          </p>
        ))}
        <p className="font-heading text-gradient mt-3 text-3xl font-bold sm:text-5xl">
          {home.statement.highlight}
        </p>
      </section>

      {/* Services */}
      <section id="services" className="container-page scroll-mt-24 pb-20 sm:pb-28">
        <SectionHeader
          eyebrow="Services"
          title="Five services. One growth system."
          description="Pick one channel or combine them. Every service plugs into the same strategy, tracking and reporting."
          align="center"
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {services.map((s, i) => (
            <Reveal key={s.slug} index={i} className={i < 3 ? "lg:col-span-2" : "lg:col-span-3"}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </section>

      <Ticker label="Industries we serve" items={home.industries} />

      {/* Process teaser */}
      <section className="container-page py-20 sm:py-28">
        <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <SectionHeader
            eyebrow="How we work"
            title="A proven growth process. Every time."
            description="Five disciplined steps that turn guesswork into a system that compounds."
          />
          <StatCounter {...retentionStat} className="lg:text-right" />
        </div>
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, i) => (
            <li key={step.title}>
              <Reveal index={i} className="bg-card h-full rounded-2xl border p-6">
                <span className="text-brand font-heading text-sm font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{step.tagline}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <Button asChild variant="link" className="mt-8 px-0 text-base">
          <Link href="/process">
            See the full process <ArrowRight />
          </Link>
        </Button>
      </section>

      {/* Why us */}
      <section className="container-page pb-20 sm:pb-28">
        <SectionHeader
          eyebrow="Why choose us"
          title="Built for businesses that want to scale."
          description="Most agencies sell activity. We sell outcomes — and prove them."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <PillarGrid pillars={pillars.slice(0, 4)} />
          <WhatYouGet />
        </div>
      </section>

      {/* Results */}
      <section className="border-y py-20 sm:py-24">
        <div className="container-page">
          <SectionHeader eyebrow="Results" title="Average client results" align="center" />
          <div className="mt-14 grid gap-10 text-center sm:grid-cols-3">
            {resultStats.slice(0, 3).map((s) => (
              <StatCounter key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={home.cta.title}
        description={home.cta.description}
        primary={{ label: "Book a free strategy call", href: "/contact" }}
        secondary={{ label: "See our results", href: "/why-us" }}
      />
    </>
  );
}
