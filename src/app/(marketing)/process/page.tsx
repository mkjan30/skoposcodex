import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/sections/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { StatCounter } from "@/components/sections/stat-counter";
import { StepCard } from "@/components/sections/step-card";
import { processFaqs, processSteps, retentionStat } from "@/content/process";

export const metadata: Metadata = {
  title: "Our Process: Five Steps to Predictable Growth",
  description:
    "Analyze, strategize, build, optimize, scale. See the five-step process Skopos Codex uses to turn marketing into a repeatable growth system.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="How we work"
        title="A proven growth process."
        highlight="Every time."
        description="Every engagement follows the same disciplined five-step method, designed to produce results that compound. No templates. No shortcuts."
        actions={
          <>
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
              <Link href="/why-us">Why choose us</Link>
            </Button>
          </>
        }
      >
        <div className="bg-card mx-auto max-w-xs rounded-2xl border p-6">
          <StatCounter {...retentionStat} tone="white" />
        </div>
      </PageHero>

      <section className="container-page py-24 md:py-36">
        <SectionHeader
          eyebrow="The method"
          title={
            <>
              Five steps.
              <br />
              <span className="text-gradient">One repeatable growth system.</span>
            </>
          }
          className="mb-16"
        />
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, i) => (
            <li key={step.title}>
              <Reveal index={i % 3} className="h-full">
                <StepCard step={step} number={i + 1} />
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page grid gap-12 pb-24 md:pb-36 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeader eyebrow="FAQ" title="Common questions about our process" />
        <FaqAccordion items={processFaqs} />
      </section>

      <CtaBand
        title="Ready to start the process?"
        description="Book a free strategy call and we'll map out the first 90 days for your business."
        primary={{ label: "Book a free strategy call", href: "/contact" }}
        secondary={{ label: "Why choose us", href: "/why-us" }}
      />
    </>
  );
}
