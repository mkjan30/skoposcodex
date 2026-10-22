import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gauge, Hammer, Lightbulb, Rocket, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EngineScene } from "@/components/home/engine-scene";
import { NoGuessworkScene } from "@/components/home/no-guesswork-scene";
import { ProcessTimeline } from "@/components/home/process-timeline";
import { CtaBand } from "@/components/sections/cta-band";
import { DashboardCard } from "@/components/sections/dashboard-card";
import DotField from "@/components/home/dot-field";
import { IndustriesMarquee } from "@/components/sections/industries-marquee";
import { PillarGrid } from "@/components/sections/pillar-grid";
import { Reveal } from "@/components/sections/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { ServiceCard } from "@/components/sections/service-card";
import { StatCounter } from "@/components/sections/stat-counter";
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

const stepIcons = [
  <Search key="s" />,
  <Lightbulb key="l" />,
  <Hammer key="h" />,
  <Gauge key="g" />,
  <Rocket key="r" />,
];

export default function HomePage() {
  return (
    <>
      {/* Hero: centered, staggered page-load entrances (en-* classes, delays as in the reference). */}
      <section className="relative -mt-18 overflow-hidden pt-36 pb-20 md:pt-44">
        <div className="hero-glow" aria-hidden />
        {/* Interactive dot grid over the glow (WebGL2; listens on window, so it never blocks clicks). */}
        <DotField
          className="pointer-events-none absolute! inset-0"
          gradientFrom="#19e3ff"
          gradientTo="#2b8cff"
          dotRadius={1.5}
          dotSpacing={14}
          cursorRadius={240}
          bulgeStrength={0.6}
          glowRadius={160}
        />
        <div className="container-page relative z-10 text-center">
          <div className="en-settle" style={{ animationDelay: ".12s" }}>
            <Link href="/process" className="pill-badge">
              <Sparkles className="text-brand size-3.5" aria-hidden />
              {home.hero.badge}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          <h1 className="mt-8 text-[clamp(2.75rem,8vw,6rem)] leading-[1.02] font-semibold tracking-tight">
            <span className="text-heading en-wipe block pb-1" style={{ animationDelay: ".34s" }}>
              {home.hero.title}
            </span>
            <span className="en-wipe mt-4 block" style={{ animationDelay: ".44s" }}>
              <span className="glass-pill">
                <span className="text-gradient">{home.hero.highlight}</span>
              </span>
            </span>
          </h1>
          <p
            className="en-lift mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-zinc-200 md:text-[19px]"
            style={{ animationDelay: ".74s", animationDuration: ".7s" }}
          >
            {home.hero.description}
          </p>
          <div
            className="en-lift-line mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: ".94s" }}
          >
            <Button asChild variant="brand" size="xl">
              <Link href="/contact">
                Book a strategy call <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              variant="brand-outline"
              size="xl"
              className="bg-black/50 backdrop-blur-md"
            >
              <Link href="#services">Explore services</Link>
            </Button>
          </div>
          <div
            className="en-lift mx-auto mt-20 max-w-5xl text-left md:mt-24"
            style={{ animationDelay: "1.08s", animationDuration: ".8s" }}
          >
            <DashboardCard kpis={home.dashboard.kpis} keywords={home.dashboard.keywords} />
          </div>
        </div>
      </section>

      <EngineScene phrases={home.engine} />
      <NoGuessworkScene {...home.noGuesswork} />

      {/* Services */}
      <section id="services" className="container-page scroll-mt-24 py-24 md:py-36">
        <SectionHeader
          eyebrow="What we do"
          title={
            <>
              Services built to
              <br />
              <span className="text-gradient">scale your business</span>
            </>
          }
          description="End-to-end digital marketing, built as one system: every service plugs into the same strategy, tracking and reporting."
          className="mb-16"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} index={i}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <Reveal className="container-page mb-14 text-center">
          <p className="section-label">Industries</p>
          <h2 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] font-semibold tracking-tight text-white">
            {home.industriesTitle.line1}
            <br />
            <span className="text-gradient">{home.industriesTitle.line2}</span>
          </h2>
        </Reveal>
        <IndustriesMarquee items={home.industries} />
      </section>

      {/* Process: sticky intro on the left, timeline lights up on the right */}
      <section className="container-page grid gap-14 py-24 md:py-36 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            eyebrow="How we work"
            title={
              <>
                A proven
                <br />
                growth process
              </>
            }
            description="Every engagement follows a disciplined, repeatable method. No guesswork. Just results."
          />
          <Reveal className="bg-card mt-10 max-w-xs rounded-2xl border p-6" index={1}>
            <StatCounter {...retentionStat} tone="white" />
          </Reveal>
        </div>
        <ProcessTimeline
          steps={processSteps.map((s, i) => ({
            icon: stepIcons[i],
            title: s.title,
            description: s.description,
          }))}
        />
      </section>

      {/* Why us + results panel */}
      <section className="container-page pb-24 md:pb-36">
        <SectionHeader
          eyebrow="Why choose us"
          title={
            <>
              Built for businesses
              <br />
              that want to scale
            </>
          }
          className="mb-14"
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <PillarGrid pillars={pillars.slice(0, 4)} />
          <Reveal index={1}>
            <WhatYouGet />
          </Reveal>
        </div>
        <Reveal className="bg-card mt-6 rounded-3xl border p-8 sm:p-12">
          <p className="section-label text-center">Average client results</p>
          <div className="mt-10 grid gap-10 text-center sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-white/10">
            {resultStats.slice(0, 3).map((s) => (
              <StatCounter key={s.label} {...s} tone="white" />
            ))}
          </div>
        </Reveal>
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
