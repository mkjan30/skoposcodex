import type { Metadata } from "next";

import { CtaBand } from "@/components/sections/cta-band";
import { FaqAccordion } from "@/components/sections/faq-accordion";
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
      <section className="container-page grid items-end gap-12 py-16 sm:py-24 lg:grid-cols-[1.5fr_1fr]">
        <SectionHeader
          as="h1"
          eyebrow="How we work"
          title={
            <>
              A proven growth process. <span className="text-gradient">Every time.</span>
            </>
          }
          description="Every engagement follows the same disciplined five-step method, designed to produce results that compound. No templates. No shortcuts."
        />
        <StatCounter {...retentionStat} className="lg:text-right" />
      </section>

      <section className="container-page pb-20 sm:pb-28">
        <SectionHeader title="Five steps. One repeatable growth system." />
        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, i) => (
            <li key={step.title}>
              <Reveal index={i % 3} className="h-full">
                <StepCard step={step} number={i + 1} />
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page grid gap-12 pb-8 lg:grid-cols-[1fr_1.4fr]">
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
